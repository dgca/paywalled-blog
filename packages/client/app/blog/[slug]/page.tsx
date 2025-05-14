"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";

export default function BlogPost({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        // Fetch the post data
        const response = await fetch(`/api/blog/${params.slug}`);

        if (!response.ok) {
          // If the post doesn't exist, redirect to 404
          router.push("/404");
          return;
        }

        const postData = await response.json();
        setPost(postData);

        // Serialize the MDX content
        const mdxSource = await serialize(postData.content);
        setContent(mdxSource);
      } catch (error) {
        console.error("Error loading post:", error);
        router.push("/404");
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [params.slug, router]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
        <div className="w-full mx-auto px-4 py-3 md:px-8 lg:px-12 max-w-4xl">
          <header className="flex justify-between items-center mb-6 h-11">
            <Link href="/" className="text-xl font-bold">
              My Personal Blog
            </Link>
          </header>
          <main className="flex-1 text-center py-20">
            <p>Loading...</p>
          </main>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full mx-auto px-4 py-3 md:px-8 lg:px-12 max-w-4xl">
        <header className="flex justify-between items-center mb-6 h-11">
          <Link href="/" className="text-xl font-bold">
            My Personal Blog
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <Wallet className="z-10">
                <ConnectWallet>
                  <Name className="text-inherit" />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <article className="prose lg:prose-xl max-w-none">
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <div className="flex items-center text-gray-500 mb-8">
              <p className="mr-4">{post.date}</p>
              <p>By {post.author}</p>
            </div>

            <div className="blog-content">
              {content && <MDXRemote {...content} />}
            </div>
          </article>

          <div className="mt-12 pt-6 border-t border-gray-200">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to all posts
            </Link>
          </div>
        </main>

        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>© 2023 My Personal Blog. Built with Next.js.</p>
        </footer>
      </div>
    </div>
  );
}
