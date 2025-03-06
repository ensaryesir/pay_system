import { Blog } from "@/services/blog";
import Link from "next/link";
import Image from "next/image";

const SingleBlog = ({ blog }: { blog: Blog }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // İçerik için güvenli kontrol
  const truncateContent = (content: string | undefined) => {
    if (!content) return '';
    return content.length > 150 ? `${content.substring(0, 150)}...` : content;
  };

  return (
    <div className="group relative overflow-hidden rounded-sm bg-white shadow-one duration-300 hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark">
      <Link
        href={`/blog/${blog._id}`}
        className="relative block aspect-[37/22] w-full"
      >
        <Image
          src={blog.image || '/images/blog-placeholder.jpg'}
          alt={blog.title || 'Blog Görseli'}
          fill
          className="object-cover object-center"
        />
      </Link>
      <div className="p-6 sm:p-8 md:py-8 md:px-6 lg:p-8 xl:py-8 xl:px-5 2xl:p-8">
        <h3>
          <Link
            href={`/blog/${blog._id}`}
            className="mb-4 block text-xl font-bold text-black hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl"
          >
            {blog.title || 'Başlıksız Haber'}
          </Link>
        </h3>
        <p className="mb-6 border-b border-body-color border-opacity-10 pb-6 text-base text-body-color dark:border-white dark:border-opacity-10 dark:text-body-color-dark">
          {truncateContent(blog.content)}
        </p>
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
              <span className="text-sm text-body-color dark:text-body-color-dark">Etiketler:</span>
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
    </div>
  );
};

export default SingleBlog;
