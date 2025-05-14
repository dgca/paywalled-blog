"use client";

import Link from "next/link";
import { getAllPosts } from "../lib/mdx";
import { useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

export default function HomePage() {
  const { setFrameReady, isFrameReady } = useMiniKit();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Get all blog posts for the homepage
  const blogPosts = getAllPosts();

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full mx-auto px-4 py-3 md:px-8 lg:px-12 max-w-4xl">
        <main className="flex-1">
          <section className="mb-10">
            <h1 className="text-3xl font-bold mb-4">Welcome to My Blog</h1>
            <p className="text-lg mb-6">
              This is my personal blog where I share thoughts and insights about
              web3, blockchain, and decentralized applications. Join me as I
              explore the exciting world of crypto and its potential to reshape
              our digital future.
            </p>
            <div className="w-full h-px bg-gray-200 my-8"></div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
            <div className="space-y-8">
              {blogPosts.map((post) => (
                <article
                  key={post.slug}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-500 text-sm mb-1">{post.date}</p>
                  <p className="text-gray-500 text-sm mb-3">By {post.author}</p>
                  <p className="mb-4">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Read more
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </main>

        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>© 2023 My Personal Blog. Built with MiniKit.</p>
        </footer>
      </div>
    </div>
  );
}
