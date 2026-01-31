---
title: Terraform với Azure – Ghi chép & Config End-to-End
description: "Note Terraform khi làm việc với Azure: authentication, backend state, best practices, lưu ý và config từ đầu đến cuối."
category: study
---

# Terraform với Azure – Ghi chép & Config End-to-End

Tài liệu tổng hợp từ [HashiCorp](https://developer.hashicorp.com/terraform/tutorials/azure-get-started), [Microsoft Learn](https://learn.microsoft.com/en-us/azure/developer/terraform/) và [Terraform Registry azurerm](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs). Dùng khi triển khai hạ tầng Azure bằng Terraform.

---

## 1. Prerequisites

| Yêu cầu | Ghi chú |
|--------|--------|
| **Azure subscription** | Free account đủ dùng cho học/thử. Paid subscription sẽ bị charge nếu tạo resource. |
| **Terraform** | Phiên bản **1.2.0+** (khuyến nghị dùng constraint trong `required_version`). |
| **Azure CLI** | Dùng để login local và tạo Service Principal. |

**Cài Azure CLI (macOS):**

```bash
brew update && brew install azure-cli
```

---

## 2. Authentication (Xác thực với Azure)

Terraform cần quyền tạo/sửa/xóa resource trên Azure. Có 3 hướng chính:

### 2.1 Azure CLI (phát triển local)

- Chạy `az login` → mở browser đăng nhập.
- Terraform provider **azurerm** tự đọc credential từ Azure CLI.
- **Không cần** set biến môi trường khi dùng cách này.

```bash
az login
az account list
az account set --subscription "<SUBSCRIPTION_ID>"
```

### 2.2 Service Principal + Client Secret (CI/CD, automation)

Dùng cho pipeline, không có tương tác người dùng.

**Tạo Service Principal:**

```bash
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/<SUBSCRIPTION_ID>"
```

Output có: `appId`, `password`, `tenant`. **Không commit** các giá trị này vào code.

**Biến môi trường (Terraform đọc tự động):**

| Biến | Ý nghĩa |
|------|--------|
| `ARM_CLIENT_ID` | Application (client) ID = `appId` |
| `ARM_CLIENT_SECRET` | Client secret = **giá trị** `password` (không phải ID của secret) |
| `ARM_SUBSCRIPTION_ID` | Subscription ID |
| `ARM_TENANT_ID` | Directory (tenant) ID |

**Ví dụ (macOS/Linux):**

```bash
export ARM_CLIENT_ID="<APPID_VALUE>"
export ARM_CLIENT_SECRET="<PASSWORD_VALUE>"
export ARM_SUBSCRIPTION_ID="<SUBSCRIPTION_ID>"
export ARM_TENANT_ID="<TENANT_VALUE>"
```

**Lưu ý:** Trong Azure Cloud Shell, script có thể ghi đè `ARM_SUBSCRIPTION_ID` và `ARM_TENANT_ID`. Nếu dùng Service Principal không thuộc subscription hiện tại → sẽ lỗi 403. Cần đảm bảo SP có quyền trên subscription đang dùng.

### 2.3 Managed Identity / OpenID Connect (OIDC)

- **Managed Identity**: Terraform chạy trên Azure (VM, Azure DevOps agent, GitHub Actions với OIDC) thì dùng Managed Identity, không cần client secret.
- **OIDC**: GitHub Actions / GitLab CI có thể dùng federated credential, tránh lưu secret lâu dài.

Chi tiết: [Azure Provider – Service Principal OIDC](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/service_principal_oidc).

---

## 3. Provider azurerm – Cấu hình cơ bản

### 3.1 Block `terraform` và `required_providers`

```hcl
terraform {
  required_version = ">= 1.2.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"   # hoặc ">= 3.0.0, < 4.0.0"
    }
  }
}
```

- **version**: Nên ghim để tránh breaking change khi upgrade provider.

### 3.2 Block `provider "azurerm"`

```hcl
provider "azurerm" {
  features {}
}
```

- **`features {}`** là **bắt buộc** với azurerm (có thể để rỗng hoặc cấu hình resource behavior bên trong).

### 3.3 Skip đăng ký Resource Provider (khi không có quyền)

Nếu Service Principal **không** có quyền `Microsoft.Resources/subscriptions/providers/read` (ví dụ subscription dùng RBAC chặt), sẽ gặp:

```text
Error: Unable to list provider registration status... Status=403
```

Cấu hình:

```hcl
provider "azurerm" {
  skip_provider_registration = true
  features {}
}
```

- Chỉ bật khi bạn chắc các Resource Provider cần dùng (VD: Microsoft.Compute, Microsoft.Storage) **đã được đăng ký sẵn** ở subscription.

---

## 4. Backend – Lưu State trên Azure Storage

State mặc định lưu **local** (`terraform.tfstate`) → không phù hợp làm việc nhóm và dễ mất. Nên dùng **remote backend**.

### 4.1 Tạo Storage Account + Container (một lần)

Có thể tạo bằng Azure CLI hoặc bằng chính Terraform.

**Ví dụ Azure CLI:**

```bash
RESOURCE_GROUP_NAME=tfstate
STORAGE_ACCOUNT_NAME=tfstate$RANDOM
CONTAINER_NAME=tfstate

az group create --name $RESOURCE_GROUP_NAME --location eastus
az storage account create \
  --resource-group $RESOURCE_GROUP_NAME \
  --name $STORAGE_ACCOUNT_NAME \
  --sku Standard_LRS \
  --encryption-services blob
az storage container create --name $CONTAINER_NAME --account-name $STORAGE_ACCOUNT_NAME
```

- **Storage account name**: phải unique toàn cầu → dùng `$RANDOM` hoặc prefix theo project.

### 4.2 Backend block trong Terraform

```hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "tfstate"
    storage_account_name = "myterraformstateaccount"
    container_name       = "tfstate"
    key                  = "my-app.tfstate"
  }
}
```

| Tham số | Ý nghĩa |
|--------|--------|
| `resource_group_name` | RG chứa storage account |
| `storage_account_name` | Tên storage account |
| `container_name` | Tên container (blob) |
| `key` | Tên file state trong container |

### 4.3 Xác thực backend

- **Access Key**: Set `ARM_ACCESS_KEY` (hoặc `ACCESS_KEY` tùy phiên bản) = primary key của storage account. Không nên hardcode trong `.tf`.
- **Production**: Nên dùng [Azure AD auth cho backend](https://developer.hashicorp.com/terraform/language/settings/backends/azurerm) (Managed Identity / Service Principal) thay vì access key.

Lấy key (để set env):

```bash
ACCOUNT_KEY=$(az storage account keys list \
  --resource-group $RESOURCE_GROUP_NAME \
  --account-name $STORAGE_ACCOUNT_NAME \
  --query '[0].value' -o tsv)
export ARM_ACCESS_KEY=$ACCOUNT_KEY
```

Sau khi thêm/sửa backend: chạy lại **`terraform init`** (có thể cần `-reconfigure` nếu đổi backend).

### 4.4 State locking

- Backend **azurerm** dùng **blob lease** để khóa state khi `apply`/`plan` ghi state → tránh hai process cùng ghi.
- **Lỗi thường gặp**: `Error acquiring the state lock; state blob is already locked`
  - **Nguyên nhân**: Process Terraform khác đang chạy, hoặc process trước bị ngắt (mất mạng, kill) nên không release lock.
  - **Cách xử lý**:
    1. Kiểm tra không còn `terraform apply/plan` nào đang chạy (local hoặc pipeline).
    2. Với state trên Azure: vào Portal → Storage Account → Container → blob state → **Break lease**.
    3. Hoặc dùng `terraform force-unlock <LOCK_ID>` (chỉ khi chắc lock đang “treo”, và biết LOCK_ID).

**Không** tắt lock bằng `-lock=false` trừ khi debug tạm thời; dễ gây state corrupt.

---

## 5. Cấu trúc project & Best practices

- **Mỗi thành phần logic** (VD: networking, compute, storage) nên nằm trong **module** riêng (folder + `main.tf`, `variables.tf`, `outputs.tf`), dễ tái sử dụng và test.
- **Root**: `main.tf`, `variables.tf`, `outputs.tf`, `versions.tf` (hoặc gộp terraform + provider vào `main.tf`).
- **State**: Một state file cho một môi trường (dev/staging/prod) hoặc một app; dùng `key` khác nhau (VD: `dev.tfstate`, `prod.tfstate`) trong cùng container.
- **Secret**: Không đưa `ARM_CLIENT_SECRET`, `ARM_ACCESS_KEY` vào code; dùng env hoặc secret manager (Azure Key Vault, GitHub Secrets, etc.).
- **Validation**: Chạy `terraform fmt`, `terraform validate` trước khi commit. CI nên chạy `terraform plan` để phát hiện drift/breaking change.

---

## 6. Config End-to-End (minimal)

Ví dụ một luồng đầy đủ: provider + backend + resource group.

**`versions.tf` (hoặc `main.tf`):**

```hcl
terraform {
  required_version = ">= 1.2.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "tfstate"
    storage_account_name = "myterraformstateaccount"
    container_name       = "tfstate"
    key                  = "my-app.tfstate"
  }
}

provider "azurerm" {
  features {}
}
```

**`main.tf`:**

```hcl
resource "azurerm_resource_group" "rg" {
  name     = "myTFResourceGroup"
  location = "westus2"
}
```

**`outputs.tf` (tuỳ chọn):**

```hcl
output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

output "resource_group_id" {
  value = azurerm_resource_group.rg.id
}
```

**Thứ tự thao tác:**

1. Cài Terraform + Azure CLI, login `az login`, set subscription.
2. (Nếu dùng SP) Set `ARM_CLIENT_ID`, `ARM_CLIENT_SECRET`, `ARM_SUBSCRIPTION_ID`, `ARM_TENANT_ID`.
3. Tạo storage account + container cho backend (một lần), set `ARM_ACCESS_KEY` nếu dùng key.
4. `terraform init`
5. `terraform plan`
6. `terraform apply`

---

## 7. Lưu ý & Troubleshooting

| Vấn đề | Gợi ý xử lý |
|--------|-------------|
| **403 – Unable to list provider registration status** | Dùng Service Principal có quyền đọc subscription providers, hoặc bật `skip_provider_registration = true` và đảm bảo Resource Providers đã được đăng ký. |
| **State lock – blob already locked** | Kiểm tra không còn process Terraform đang chạy; Break lease trên blob state trong Portal; hoặc `terraform force-unlock <LOCK_ID>`. |
| **ARM_CLIENT_SECRET không nhận** | Dùng đúng **giá trị** (value) của secret, không phải ID của secret trong Azure. |
| **Cloud Shell + env ARM_* conflict** | Cloud Shell có thể ghi đè subscription/tenant; đảm bảo SP có quyền trên subscription mà Cloud Shell đang dùng. |
| **State chứa secret** | State lưu plaintext; backend Azure nên bật encryption, hạn chế truy cập (RBAC/firewall). Không commit state lên git. |

Tài liệu troubleshoot đầy đủ: [Troubleshoot Terraform on Azure](https://learn.microsoft.com/en-us/azure/developer/terraform/troubleshoot).

---

## 8. Lệnh hay dùng

```bash
terraform init          # Khởi tạo backend, tải provider
terraform init -reconfigure   # Đổi backend
terraform fmt           # Format .tf
terraform validate      # Kiểm tra cú pháp
terraform plan          # Xem thay đổi
terraform apply         # Áp dụng (có confirm)
terraform apply -auto-approve  # Không hỏi (dùng cẩn thận)
terraform state list    # Liệt kê resource trong state
terraform state show <resource>  # Chi tiết một resource
terraform destroy       # Huỷ toàn bộ resource trong state
terraform force-unlock <LOCK_ID>  # Chỉ khi lock treo
```

---

## 9. Tài liệu tham khảo

- [Terraform – Get Started Azure](https://developer.hashicorp.com/terraform/tutorials/azure-get-started)
- [Azure Provider (azurerm) – Registry](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [Authenticate Terraform to Azure (Microsoft)](https://learn.microsoft.com/en-us/azure/developer/terraform/authenticate-to-azure)
- [Store Terraform state in Azure Storage](https://learn.microsoft.com/en-us/azure/developer/terraform/store-state-in-azure-storage)
- [Troubleshoot Terraform on Azure](https://learn.microsoft.com/en-us/azure/developer/terraform/troubleshoot)
- [Backend Type: azurerm](https://developer.hashicorp.com/terraform/language/settings/backends/azurerm)
- [Terraform Azure – Best practices (structure, testing)](https://devblogs.microsoft.com/ise/terraform-structure-guidelines/)
