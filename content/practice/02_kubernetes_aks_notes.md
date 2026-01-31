---
title: "Kubernetes (K8s) & AKS – Concepts & Production Reference"
description: "Tổng hợp khái niệm Kubernetes, AKS, workload, scheduling, autoscaling, security và lưu ý production."
category: study
---

# Kubernetes (K8s) & AKS – Concepts & Production Reference

Tài liệu tổng hợp các khái niệm Kubernetes, Azure Kubernetes Service (AKS), và các pattern thường dùng trong production. Tham chiếu từ [Kubernetes Docs](https://kubernetes.io/docs/concepts/) và [Microsoft Learn AKS](https://learn.microsoft.com/en-us/azure/aks/).

---

## 1. Tổng quan Kubernetes & AKS

### Kubernetes (K8s) là gì?

- **Nền tảng** quản lý workload chạy trong container (declarative config + automation).
- **K8s** = viết tắt (8 chữ cái giữa K và s).
- Cung cấp: service discovery, load balancing, rollout/rollback tự động, self-healing, horizontal scaling, storage orchestration, secret/config management, batch execution.

### Azure Kubernetes Service (AKS)

- **Managed Kubernetes** trên Azure: Microsoft quản lý control plane (API server, etcd, scheduler…); bạn quản lý node pool và workload.
- Tích hợp Azure: VNet, Load Balancer, Managed Identity, Monitor, Policy.

---

## 2. Kiến trúc & Core Concepts

### Cluster

- **Control plane**: API server, etcd, scheduler, controller-manager, cloud-controller-manager.
- **Nodes (workers)**: Chạy kubelet, container runtime (containerd/CRI-O), kube-proxy.
- **Pods** được schedule lên nodes; mỗi pod có IP trong cluster.

### Namespace

- Chia cluster thành các “không gian” logic (dev, staging, prod, team A/B).
- Resource (Pod, Service, ConfigMap…) thuộc một namespace (trừ cluster-scoped: PV, Node, Namespace).
- Dùng cho multi-tenancy, RBAC, ResourceQuota.

### Pod

- **Đơn vị nhỏ nhất** có thể deploy trong K8s.
- Một hoặc nhiều container chia sẻ network (cùng IP) và storage (volumes).
- Ephemeral: thường do controller (Deployment, StatefulSet…) tạo và quản lý; không tạo Pod đơn lẻ cho app production.

### Node

- Máy (VM hoặc physical) chạy workload.
- Có labels (ví dụ `node-type=worker`, `zone=zone-a`); scheduler dùng labels + taints/tolerations/affinity để chọn node cho Pod.

---

## 3. Workload Controllers (Thường dùng production)

### Deployment

- **Quản lý Pod stateless**: ReplicaSet → Pods.
- **Rolling update / rollback**: Cập nhật dần, có thể rollback.
- **Use case**: Web app, API, microservice stateless.
- Cấu hình: `replicas`, `strategy` (RollingUpdate / Recreate), `template` (Pod spec).

### ReplicaSet

- Giữ số lượng Pod theo selector; thường **không tạo trực tiếp** mà dùng Deployment.
- Deployment tạo ReplicaSet mới mỗi lần update template.

### StatefulSet

- **Workload có state**: Pod có identity ổn định (tên theo thứ tự: `pod-0`, `pod-1`), volume gắn với từng Pod.
- **Use case**: Database, Kafka, Elasticsearch (khi chạy trên K8s).
- Có **headless Service** (clusterIP: None) để DNS per-pod.

### DaemonSet

- **Một Pod trên mỗi Node** (hoặc mỗi node match selector).
- **Use case**: Node monitor, log collector, CNI, CSI, security agent.
- Khi thêm node mới, DaemonSet tự schedule Pod lên node đó.

### Job

- **Chạy đến khi hoàn thành**: tạo Pod(s), chạy đến success (theo `completions`/`parallelism`), rồi dừng.
- **Use case**: Batch, migration one-off, backup script.
- Có `backoffLimit`, `activeDeadlineSeconds`.

### CronJob

- **Job theo lịch** (cron syntax: phút giờ ngày tháng thứ).
- **Use case**: Backup định kỳ, report, cleanup.
- Một CronJob object = một dòng crontab; mỗi lần chạy tạo Job.

| Controller   | Use case chính        | Số Pod / Node     |
|-------------|------------------------|-------------------|
| Deployment  | Stateless app          | N replicas        |
| StatefulSet | Stateful, identity     | N replicas, stable name |
| DaemonSet   | Node-level service     | 1 per node        |
| Job         | One-off task           | Chạy xong rồi dừng |
| CronJob     | Task theo lịch         | Mỗi lần = 1 Job   |

---

## 4. Service & Networking

### Service – Expose Pod ra mạng

- **ClusterIP** (mặc định): IP ảo trong cluster; chỉ truy cập trong cluster. Dùng cho giao tiếp nội bộ (frontend → backend).
- **NodePort**: Mở port cố định (30000–32767) trên mỗi node; truy cập từ ngoài qua `NodeIP:NodePort`. Thường dùng dev/test hoặc khi không có LoadBalancer.
- **LoadBalancer**: Cloud provider tạo load balancer ngoài, gán IP/domain; **superset** của NodePort (tự tạo NodePort + ClusterIP). Dùng production khi cần 1 service = 1 LB.

#### Ví dụ cụ thể

**1. Deployment (backend Pods):**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
        - name: nginx
          image: nginx:alpine
          ports:
            - containerPort: 80
```

**2. ClusterIP (chỉ trong cluster):**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-app-internal
spec:
  type: ClusterIP
  selector:
    app: web-app
  ports:
    - port: 80
      targetPort: 80
      protocol: TCP
```

- Pod khác trong cluster gọi: `http://web-app-internal` hoặc `http://web-app-internal.default.svc.cluster.local:80`.

**3. NodePort (truy cập từ ngoài qua node):**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-app-nodeport
spec:
  type: NodePort
  selector:
    app: web-app
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080
```

- Truy cập từ máy ngoài: `http://<IP-bất-kỳ-node>:30080`. Port 30080 nằm trong khoảng 30000–32767.

**4. LoadBalancer (AKS/Azure tạo Azure Load Balancer):**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-app-lb
spec:
  type: LoadBalancer
  selector:
    app: web-app
  ports:
    - port: 80
      targetPort: 80
```

- Sau khi apply, AKS cấp **External IP** (Azure LB). Truy cập: `http://<EXTERNAL-IP>:80`.
- Trên AKS có thể dùng annotation (ví dụ `service.beta.kubernetes.io/azure-load-balancer-health-probe-request-path`) để tùy chỉnh health probe.

**Tóm tắt:**

| Type       | Truy cập từ đâu              | Ví dụ URL |
|------------|------------------------------|-----------|
| ClusterIP  | Chỉ trong cluster            | `http://web-app-internal` |
| NodePort   | Ngoài cluster qua node       | `http://<node-ip>:30080` |
| LoadBalancer | Ngoài cluster qua LB (IP/DNS) | `http://<external-ip>:80` |

### Ingress

- **HTTP/HTTPS routing** vào cluster: host/path → Service.
- Cần **Ingress controller** (NGINX, Traefik, Azure Application Gateway Ingress Controller…) để enforce rules.
- **Use case**: Một entrypoint, nhiều service; SSL termination, canary.

### DNS

- Service: `\<service-name>.\<namespace>.svc.cluster.local`.
- Pod (StatefulSet + headless): `\<pod-name>.\<headless-service>.\<namespace>.svc.cluster.local`.

**Lưu ý production:** Dùng Ingress + 1 LoadBalancer cho Ingress controller thay vì mỗi app một LoadBalancer (tiết kiệm cost, dễ quản lý).

---

## 5. Storage

### PersistentVolume (PV) & PersistentVolumeClaim (PVC)

- **PV**: Tài nguyên storage trong cluster (disk, NFS…); admin tạo hoặc **dynamic provisioning** qua StorageClass.
- **PVC**: “Request” storage từ user/workload; spec size, access mode; bind với PV phù hợp.
- **Access modes**: ReadWriteOnce (RWO), ReadOnlyMany (ROX), ReadWriteMany (RWX), ReadWriteOncePod (RWOP – 1 pod tại 1 thời điểm).

### StorageClass

- **Dynamic provisioning**: Khi tạo PVC không chỉ PV, controller dùng StorageClass để tạo PV (ví dụ Azure Disk, Azure File).
- Tham số: `provisioner`, `parameters`, `reclaimPolicy` (Retain / Delete).
- AKS: `managed-csi`, `managed-csi-premium`, `azurefile`…

**Lưu ý production:** Tránh `hostPath` cho data app; dùng PV/PVC + StorageClass. StatefulSet thường dùng `volumeClaimTemplates` để mỗi pod 1 PVC.

---

## 6. Configuration

### ConfigMap

- **Key-value** không nhạy cảm (URL, feature flags, config file nội dung).
- Pod dùng qua: env, envFrom, volume mount (file).
- Giới hạn 1 MiB; không mã hóa.

### Secret

- **Dữ liệu nhạy cảm**: password, token, TLS cert.
- Có thể mount as file hoặc env; base64 (không phải encryption). **Production:** bật encryption at rest cho etcd, RBAC, hoặc dùng external store (e.g. Azure Key Vault + CSI driver).

**Lưu ý:** Tách config theo môi trường (ConfigMap/Secret per namespace hoặc per env); không hardcode trong image.

---

## 7. Scheduling – Taints, Tolerations, Affinity

### Taints & Tolerations

- **Taint** (trên Node): “Đẩy” Pod không phù hợp; chỉ Pod có **toleration** khớp mới được schedule (và có thể bị evict nếu dùng NoExecute).
- **Effects:**
  - **NoSchedule**: Không schedule Pod không có toleration.
  - **PreferNoSchedule**: Ưu tiên không schedule, nhưng vẫn có thể.
  - **NoExecute**: Không schedule + evict Pod đang chạy mà không có toleration (có thể kèm `tolerationSeconds`).

Ví dụ taint node GPU:
```bash
kubectl taint nodes node1 gpu=true:NoSchedule
```
Pod cần chạy trên node đó phải có toleration tương ứng.

- **Production:** Dùng taints cho node pool đặc biệt (GPU, spot, system-only); tolerations trên Pod cần chạy trên đó. Kết hợp **node affinity** để vừa “cho phép” (tolerations) vừa “ưu tiên/ép” (affinity) node cụ thể.

### Node Affinity

- **requiredDuringSchedulingIgnoredDuringExecution**: Bắt buộc match (ví dụ zone, node-type).
- **preferredDuringSchedulingIgnoredDuringExecution**: Ưu tiên, không bắt buộc.
- Dựa trên **node labels** (ví dụ `topology.kubernetes.io/zone=eus2-1`).

### Pod Affinity / Anti-Affinity

- **Affinity**: Pod “hút” Pod khác (cùng node / cùng zone để giảm latency).
- **Anti-affinity**: Pod “tránh” Pod khác (spread across nodes/zones để HA).
- **Production:** Thường dùng `podAntiAffinity` (preferred hoặc required) để spread replicas của Deployment trên nhiều node/zone.

**Lưu ý:** Tolerations chỉ “cho phép” schedule lên node có taint; không ngăn Pod chạy trên node không taint. Muốn “chỉ chạy trên node A” thì cần thêm node affinity (required).

---

## 8. Autoscaling (HPA, VPA, Cluster Autoscaler)

### Horizontal Pod Autoscaler (HPA)

- **Scale số replica** theo metric (CPU, memory, custom/external).
- Target: Deployment, StatefulSet, ReplicaSet; chỉ định target utilization (ví dụ CPU 70%).
- **Production:** Dùng cho stateless app; set `minReplicas`/`maxReplicas` và resource requests để HPA tính đúng.

### Vertical Pod Autoscaler (VPA)

- **Điều chỉnh requests/limits** (CPU, memory) của Pod theo usage thực tế (rightsizing).
- **Update mode:** Off, Initial, Recreate, Auto. Recreate/Auto có thể evict Pod để áp dụng resource mới (trừ khi dùng in-place resize nếu K8s hỗ trợ).
- **Production:** Bật VPA với min/max boundary; tránh thay đổi quá mạnh gây restart liên tục. AKS có tích hợp VPA (Vertical Pod Autoscaler).

### Cluster Autoscaler

- **Scale node pool**: Thêm node khi có Pod pending (do resource); xóa node khi underutilized.
- AKS: Dùng **cluster autoscaler** (hoặc AKS autoscaler) cho node pool; cấu hình min/max nodes per pool.

**Lưu ý:** HPA + Cluster Autoscaler thường dùng cùng lúc; VPA dùng cẩn thận với HPA (cả hai cùng scale resource có thể conflict – thường HPA scale replica, VPA scale request/limit).

---

## 9. Health & Disruption

### Probes (Liveness, Readiness, Startup)

- **Liveness**: Container còn “sống” không; fail → kubelet restart container.
- **Readiness**: Pod sẵn sàng nhận traffic chưa; fail → bỏ khỏi Service endpoints (không restart).
- **Startup**: Cho container khởi động chậm; khi startup xong mới bật liveness/readiness.
- **Production:** Luôn set readiness (và liveness nếu có endpoint nhẹ); startup khi app khởi động > vài giây. Tránh endpoint probe quá nặng (DB, external API) làm probe fail không đáng.

### Pod Disruption Budget (PDB)

- Giới hạn **số Pod bị disruption cùng lúc** (voluntary: drain, scale down; không áp dụng eviction do node fail).
- **minAvailable**: Ví dụ 90% hoặc số tuyệt đối (ví dụ 1).
- **maxUnavailable**: Ví dụ 1 hoặc 25%.
- **Production:** Stateless: `minAvailable` % hoặc `maxUnavailable` 1; stateful: thường `maxUnavailable: 1` hoặc `minAvailable` theo quorum.

---

## 10. Resources & Limits

### requests & limits (CPU, memory)

- **requests**: Dùng cho **scheduling** (node phải đủ “request” mới schedule được); có thể dùng cho QoS.
- **limits**: Giới hạn tối đa; vượt limit memory → OOMKill; CPU bị throttle.
- **Production:** Luôn set requests (để HPA/scheduler hoạt động đúng); set limits để tránh 1 Pod “ăn” hết node. QoS: Guaranteed (request = limit), Burstable, BestEffort.

### ResourceQuota (namespace)

- Giới hạn tổng resource (CPU, memory, số Pod, PVC…) trong một namespace.
- Dùng cho multi-tenant, tránh team dùng quá tài nguyên cluster.

### LimitRange (namespace)

- Giới hạn mặc định / min / max **per Pod hoặc per Container** trong namespace (requests, limits).
- Áp dụng khi Pod không chỉ rõ requests/limits.

---

## 11. Security

### RBAC (Role-Based Access Control)

- **Role / ClusterRole**: Tập quyền (verbs: get, list, create… trên resources: pods, services…).
- **RoleBinding / ClusterRoleBinding**: Gắn Role/ClusterRole cho user, group, ServiceAccount.
- **Production:** Least privilege; dùng Role + RoleBinding (namespace) thay vì ClusterRole/ClusterRoleBinding khi đủ; hạn chế wildcard (`*`).

### NetworkPolicy

- **Firewall ở tầng Pod**: Cho phép/chặn ingress/egress theo pod selector, namespace, CIDR, port.
- Cần **network plugin** hỗ trợ (Calico, Cilium, AKS Azure CNI + policy).
- **Production:** Mặc định deny-all, sau đó mở từng luồng cần thiết (frontend → backend, backend → DB).

### Pod Security Admission (PSA)

- Áp **Pod Security Standards** (privileged, baseline, restricted) ở namespace.
- **Enforce / Audit / Warn**: Enforce = từ chối Pod vi phạm; Audit = ghi log; Warn = cảnh báo.
- **Production:** Dùng baseline hoặc restricted cho namespace production; tránh privileged.

---

## 12. AKS – Node Pools & Production

### Node pool

- **System node pool**: Chạy system Pod (CoreDNS, metrics-server…). **Bắt buộc** có ít nhất 1; AKS mặc định mode=System. Không dùng Spot cho system pool.
- **User node pool**: Chạy workload app; có thể nhiều pool (GPU, Spot, Windows…).
- **Spot node pool**: Dùng Azure Spot VM; rẻ hơn nhiều nhưng có thể bị evict khi Azure thu hồi capacity. Chỉ dùng cho workload chịu được gián đoạn (batch, dev/test).

### Taints trên AKS

- Có thể đặt taint khi tạo node pool (ví dụ `sku=spot:NoSchedule`) và toleration trên Pod cần chạy Spot.
- System pool thường không taint; user pool có thể taint để dành riêng cho workload đặc biệt.

### Production checklist (tóm tắt)

- **Availability:** Multi-replica, PDB, spread nhiều node/zone; readiness/liveness/startup probes.
- **Resources:** requests/limits cho mọi container; HPA; VPA (nếu dùng) có min/max.
- **Security:** RBAC least privilege; NetworkPolicy; PSA baseline/restricted; Secret encryption; không chạy root khi không cần.
- **Networking:** Ingress + 1 LB; DNS; hạn chế NodePort trên prod.
- **Storage:** PVC + StorageClass; tránh hostPath cho data.
- **Monitoring:** Metrics (Prometheus/Container Insights), log (e.g. Azure Monitor), alerting.
- **Upgrade:** AKS version upgrade theo kế hoạch; node pool drain; test staging trước prod.
- **Cost:** Right-size (VPA/HPA); Spot cho batch/non-critical; cluster autoscaler; tắt resource không dùng.

---

## 13. Bảng tra nhanh – Concept thường gặp

| Concept | Mô tả ngắn |
|--------|------------|
| **Deployment** | Stateless app; rolling update; replicas. |
| **StatefulSet** | Stateful; identity ổn định; volume per pod. |
| **DaemonSet** | 1 pod per node (agent, CNI…). |
| **Job / CronJob** | One-off / theo lịch. |
| **Service ClusterIP** | Nội bộ cluster. |
| **Service LoadBalancer** | Ra internet/VM; 1 LB per service. |
| **Ingress** | HTTP routing; 1 entrypoint nhiều service. |
| **ConfigMap / Secret** | Config không nhạy cảm / nhạy cảm. |
| **PV / PVC / StorageClass** | Persistent storage; dynamic provisioning. |
| **Taints / Tolerations** | Node “đẩy” pod; pod “chấp nhận” taint. |
| **Node/Pod Affinity** | Pod ưu tiên/bắt buộc node hoặc pod khác. |
| **HPA** | Scale replica theo CPU/memory/custom. |
| **VPA** | Điều chỉnh CPU/memory request/limit. |
| **PDB** | Giới hạn số pod bị disruption cùng lúc. |
| **Liveness / Readiness / Startup** | Health check; restart / bỏ khỏi LB / chờ khởi động. |
| **RBAC** | Role, RoleBinding; quyền truy cập API. |
| **NetworkPolicy** | Firewall tầng pod. |
| **AKS System / User / Spot pool** | System = system pods; User = app; Spot = rẻ, có thể evict. |

---

## 14. Tài liệu tham khảo

- [Kubernetes Concepts](https://kubernetes.io/docs/concepts/)
- [Kubernetes Workloads](https://kubernetes.io/docs/concepts/workloads/)
- [Services & Networking](https://kubernetes.io/docs/concepts/services-networking/)
- [Storage](https://kubernetes.io/docs/concepts/storage/)
- [Scheduling (Taints, Affinity)](https://kubernetes.io/docs/concepts/scheduling-eviction/)
- [AKS Best practices](https://learn.microsoft.com/en-us/azure/aks/best-practices)
- [AKS Cluster reliability](https://learn.microsoft.com/en-us/azure/aks/best-practices-app-cluster-reliability)
- [AKS Node pools (system, spot)](https://learn.microsoft.com/en-us/azure/aks/use-system-pools)
- [Vertical Pod Autoscaler (K8s)](https://kubernetes.io/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/)
- [VPA on AKS](https://learn.microsoft.com/en-us/azure/aks/vertical-pod-autoscaler)
