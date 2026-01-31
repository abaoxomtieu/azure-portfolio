import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import Footer from "@/components/Footer";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import { getAllPosts } from "@/lib/markdown";

export default async function Home() {
  const certs = await getAllPosts("certs");
  const practice = await getAllPosts("practice");

  return (
    <div className="bg-white min-h-screen">
      <Hero />

      {/* Certifications Section */}
      <section id="certs" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 relative z-10 bg-white border-t-3 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-baseline gap-3 sm:gap-4 mb-6 sm:mb-8">
            <span className="bg-black text-white px-3 py-1 font-mono text-sm font-bold">01.</span>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-heading font-black text-black">CERTIFICATION GUIDES</h2>
          </div>
          <p className="text-gray-700 text-base sm:text-lg mb-8 sm:mb-12 max-w-3xl ml-0 sm:ml-12">
            Những ghi chép "xương máu" khi học Azure cert. Từ AI-102 đến AZ-900, 
            mỗi cert đều có những concept khiến mình phải note lại kỹ để không quên. 
            Đọc xong nhớ like để mình có động lực viết tiếp nhé! 🚀
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {certs.map((post, index) => (
              <ProjectCard
                key={post.slug}
                index={index}
                title={post.title}
                description={post.summary || "Những ghi chép chi tiết về cert này - học từ sai lầm và kinh nghiệm thực tế."}
                href={`/certs/${post.slug}`}
                type="cert"
                tags={["Study Guide", "Azure"]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Practice: Học & ví dụ (Terraform, K8s) */}
      <section id="practice" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 relative z-10 bg-gray-50 border-t-3 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-baseline gap-3 sm:gap-4 mb-6 sm:mb-8">
            <span className="bg-primary text-white border-2 border-black px-3 py-1 font-mono text-sm font-bold">02.</span>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-heading font-black text-black">PRACTICE</h2>
          </div>

          {/* Mục 1: Học & ví dụ (Terraform, K8s) */}
          <h3 className="text-xl sm:text-2xl font-heading font-bold text-black mb-4 mt-8">Học & ví dụ – Terraform, K8s</h3>
          <p className="text-gray-700 text-base sm:text-lg mb-6 max-w-3xl">
            Ghi chép và ví dụ khi học Terraform với Azure, Kubernetes (K8s) & AKS, và system design backend AI.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12">
            {practice
              .filter((post) => (post.category ?? "") === "study")
              .filter((post, i, arr) => arr.findIndex((p) => p.slug === post.slug) === i)
              .map((post, index) => (
                <ProjectCard
                  key={post.slug}
                  index={index}
                  title={post.title}
                  description={post.description || post.summary || "Note và ví dụ thực tế."}
                  href={`/practice/${post.slug}`}
                  type="practice"
                  tags={["Study", "Azure"]}
                />
              ))}
          </div>

          {/* Mục 2: Xây dựng Architecture (chỉ AI Application & AI ML/DL) */}
          <h3 className="text-xl sm:text-2xl font-heading font-bold text-black mb-4 mt-4">Xây dựng Architecture</h3>
          <p className="text-gray-700 text-base sm:text-lg mb-6 max-w-3xl">
            Thiết kế hệ thống AI Application (LLM, RAG, agent) và AI Machine Learning / Deep Learning trên Azure, từ nghìn đến triệu request, kèm use case cụ thể.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {practice
              .filter((post) => (post.category ?? "") === "architecture")
              .filter((post, i, arr) => arr.findIndex((p) => p.slug === post.slug) === i)
              .map((post, index) => (
                <ProjectCard
                  key={post.slug}
                  index={index}
                  title={post.title}
                  description={post.description || post.summary || "Kiến trúc thực tế với diagram và setup chi tiết."}
                  href={`/practice/${post.slug}`}
                  type="practice"
                  tags={["Architecture", "Azure"]}
                />
              ))}
          </div>
        </div>
      </section>

      <Team />
      <Contact />
      <Footer />
    </div>
  );
}
