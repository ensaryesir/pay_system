'use client';

import { useState, useEffect } from "react";
import SectionTitle from "../Common/SectionTitle";
import SingleBlog from "./SingleBlog";
import type { Blog } from "@/services/blog";
import { getAllBlogs } from "@/services/blog";
import toast from "react-hot-toast";

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getAllBlogs();
        if (response.success && response.blogs) {
          setBlogs(response.blogs);
        } else {
          toast.error(response.message || 'Haberler yüklenirken bir hata oluştu');
        }
      } catch (error) {
        toast.error('Haberler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = blogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(blogs.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <section
        id="blog"
        className="bg-gray-light dark:bg-bg-color-dark py-16 md:py-20 lg:py-28"
      >
        <div className="container">
          <SectionTitle
            title="Güncel Haberler"
            paragraph="Derneğimizin en güncel haberlerini ve duyurularını burada bulabilirsiniz."
            center
          />
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="blog"
      className="bg-gray-light dark:bg-bg-color-dark py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <SectionTitle
          title="Güncel Haberler"
          paragraph="Derneğimizin en güncel haberlerini ve duyurularını burada bulabilirsiniz."
          center
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {currentItems.map((blog) => (
            <div key={blog._id} className="w-full">
              <SingleBlog blog={blog} />
            </div>
          ))}
        </div>

        {blogs.length > 0 ? (
          <div className="w-full">
            <ul className="flex items-center justify-center pt-8">
              <li className="mx-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex h-9 min-w-[36px] items-center justify-center rounded-md px-4 text-sm transition ${currentPage === 1 ? 'cursor-not-allowed bg-gray-200 text-gray-400' : 'bg-body-color bg-opacity-[15%] text-body-color hover:bg-primary hover:bg-opacity-100 hover:text-white'}`}
                >
                  Önceki
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <li key={number} className="mx-1">
                  <button
                    onClick={() => handlePageChange(number)}
                    className={`flex h-9 min-w-[36px] items-center justify-center rounded-md px-4 text-sm transition ${currentPage === number ? 'bg-primary text-white' : 'bg-body-color bg-opacity-[15%] text-body-color hover:bg-primary hover:bg-opacity-100 hover:text-white'}`}
                  >
                    {number}
                  </button>
                </li>
              ))}
              <li className="mx-1">
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex h-9 min-w-[36px] items-center justify-center rounded-md px-4 text-sm transition ${currentPage === totalPages ? 'cursor-not-allowed bg-gray-200 text-gray-400' : 'bg-body-color bg-opacity-[15%] text-body-color hover:bg-primary hover:bg-opacity-100 hover:text-white'}`}
                >
                  Sonraki
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            Henüz haber bulunmamaktadır.
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
