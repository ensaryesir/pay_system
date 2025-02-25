import { Metadata } from "next";
import BlogContent from "./BlogContent";
import Breadcrumb from "@/components/Common/Breadcrumb";

export const metadata: Metadata = {
  title: "Haberler | Dernek Faaliyetleri ve Duyurular",
  description: "Derneğimizin faaliyetleri, etkinlikleri ve duyurularını bu sayfada bulabilirsiniz."
};

const Blog = () => {
  return (
    <>
      <Breadcrumb
        pageName="Haberler"
        description="Derneğimizin faaliyetleri, etkinlikleri ve duyurularını bu sayfada bulabilirsiniz."
      />
      <BlogContent />
    </>
  );
};

export default Blog;
