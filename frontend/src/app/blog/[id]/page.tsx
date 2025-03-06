'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogById, Blog } from '@/services/blog';
import toast from 'react-hot-toast';
import SharePost from '@/components/Blog/SharePost';
import TagButton from '@/components/Blog/TagButton';

const BlogDetailsPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (typeof id !== 'string') {
          toast.error('Geçersiz blog ID');
          setLoading(false);
          return;
        }

        const response = await getBlogById(id);
        if (response.success && response.blog) {
          setBlog(response.blog);
        } else {
          toast.error(response.message || 'Haber yüklenirken bir hata oluştu');
        }
      } catch (error) {
        toast.error('Haber yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="pb-[120px] pt-[150px]">
        <div className="container">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="pb-[120px] pt-[150px]">
        <div className="container">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <h2 className="text-2xl font-bold text-center mb-4">Haber bulunamadı</h2>
            <p className="text-body-color mb-6">Aradığınız haber bulunamadı veya kaldırılmış olabilir.</p>
            <Link
              href="/blog"
              className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition"
            >
              Tüm Haberlere Dön
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-[120px] pt-[150px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4 lg:w-8/12">
            <div>
              <h2 className="mb-8 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                {blog.title}
              </h2>
              <div className="mb-10 flex flex-wrap items-center justify-between border-b border-body-color border-opacity-10 pb-4 dark:border-white dark:border-opacity-10">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center text-sm text-body-color dark:text-body-color-dark">
                    <span className="font-medium text-dark dark:text-white">
                      {blog.author?.name || 'Anonim'}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{blog.createdAt ? formatDate(blog.createdAt) : '-'}</span>
                  </div>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block rounded bg-primary/[.08] px-2 py-1 text-xs text-primary dark:bg-primary/[.06]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="mb-10 w-full overflow-hidden rounded">
                  <div className="relative aspect-[97/60] w-full sm:aspect-[97/44]">
                    <Image
                      src={blog.image || '/images/blog-placeholder.jpg'}
                      alt={blog.title}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                </div>
                <div className="blog-content mb-10">
                  {blog.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-5 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="items-center justify-between sm:flex">
                  <div className="mb-5">
                    <h5 className="mb-3 text-sm font-medium text-body-color">
                      Bu haberi paylaş:
                    </h5>
                    <div className="flex items-center">
                      <SharePost />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailsPage; 