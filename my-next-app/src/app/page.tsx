import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getArticles, getArticleBySlug, Article } from "../api/articles";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
  const slug = "nextjs-strapi-blog";
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "No metaTitle",
      description:
        "No metaDescription",
      keywords:
        "No metaKeywords",
      openGraph: {
        title: "No metaTitle in graph",
        description:
          "No metaDescription in graph",
        url: "http://localhost:3000",
        type: "website",
        images: [
          {
            url: "./banner.jpg",
            width: 1200,
            height: 630,
            alt: "Next.js & Strapi Blog",
          },
        ],
      },
    };
  }

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    keywords: article.metaKeywords,
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: `http://localhost:3000/article/${article.slug}`,
      type: "article",
      images: [
        {
          url: article.ogImage || "/default-og.jpg",
          width: 1200,
          height: 630,
          alt: article.metaTitle,
        },
      ],
    },
  };
}


export default async function HomePage() {
  const articles: Article[] = await getArticles();
  console.log("Danh sách bài viết:", articles);

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <div className="relative w-full h-72">
        <Image
          src="/banner.jpg"
          alt="Blog Header - Study Tools"
          layout="fill"
          objectFit="cover"
          className="opacity-80"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-cyan-600 text-center px-6">
          <h1 className="text-6xl font-bold drop-shadow-lg">Our Blog</h1>
          <p className="text-xl mt-2 text-cyan-600/30">Next.js and Strapi Integration</p>
          {/* Search */}
          <div className="relative w-120 mx-auto mt-6">
            <input
              type="text"
              placeholder="Search Articles..."
              className="w-full pl-10 pr-4 py-2 rounded-lg shadow-lg focus:outline-none bg-white/50"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>
        </div>
      </div>

      {/* List articles */}
      <div className="container mx-auto p-6 mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.length > 0 ? (
            articles.map((article) => (
              <article
                key={article.documentId}
                className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              >
                <Image
                  src={article.cover?.url ? `http://localhost:1337${article.cover.url}` : "/default-thumbnail.jpg"}
                  alt={article.title || "Article Image"}
                  width={500}
                  height={300}
                  className="w-full h-48 object-cover rounded-md"
                />
                <h2 className="text-xl font-semibold mt-2">{article.title}</h2>
                <p className="text-gray-600">{article.description}</p>
                <Link
                  href={`/articles/${article.slug}`}
                  className="text-cyan-600 font-medium mt-2 mb-0 inline-block hover:underline"
                >
                  Read →
                </Link>
              </article>
            ))
          ) : (
            <p className="text-center text-gray-500">No articles available.</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}