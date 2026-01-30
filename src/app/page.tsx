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
      <section id="certs" className="py-24 px-6 relative z-10 bg-white border-t-3 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="bg-black text-white px-3 py-1 font-mono text-sm font-bold">01.</span>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-black">CERTIFICATION GUIDES</h2>
          </div>
          <p className="text-gray-700 text-lg mb-12 max-w-3xl ml-12">
            Những ghi chép "xương máu" khi học Azure cert. Từ AI-102 đến AZ-900, 
            mỗi cert đều có những concept khiến mình phải note lại kỹ để không quên. 
            Đọc xong nhớ like để mình có động lực viết tiếp nhé! 🚀
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* Practice Architecture Section */}
      <section id="practice" className="py-24 px-6 relative z-10 bg-gray-50 border-t-3 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="bg-primary text-white border-2 border-black px-3 py-1 font-mono text-sm font-bold">02.</span>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-black">PRACTICE ARCHITECTURE</h2>
          </div>
          <p className="text-gray-700 text-lg mb-12 max-w-3xl ml-12">
            Học lý thuyết xong thì phải làm thực tế chứ! Đây là những kiến trúc mình 
            thiết kế và implement để áp dụng kiến thức Azure vào thực tế. 
            Có cả diagram đẹp lung linh để dễ hiểu nữa đấy! 📐
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {practice.map((post, index) => (
              <ProjectCard
                key={post.slug}
                index={index}
                title={post.title}
                description={post.summary || "Kiến trúc thực tế với diagram chi tiết - học từ làm sai rồi sửa lại!"}
                href={`/practice/${post.slug}`}
                type="practice"
                tags={["Architecture", "Implementation"]}
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
