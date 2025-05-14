"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { useAccount } from "wagmi";
import { useWriteContract } from "wagmi";
import ContentManagerABI from "../../../lib/ContentManagerABI";
import { CONTENT_MANAGER_ADDRESS } from "../../../utils/constants";

interface BlogPost {
  id: number;
  title: string;
  date: string;
  author: string;
  content: string;
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [content, setContent] = useState<MDXRemoteSerializeResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contractAddress = CONTENT_MANAGER_ADDRESS as `0x${string}`;

  // Use wagmi hooks for reading and writing to the contract
  const { writeContractAsync, isPending: paymentLoading } = useWriteContract();

  // Check if user has paid for this content
  useEffect(() => {
    async function checkPaymentStatus() {
      if (!post || !address || !contractAddress) return;

      setCheckingPayment(true);
      try {
        const result = await fetch(
          `/api/contract/hasAccess?address=${address}&contentId=${post.id}`,
        ).then((res) => res.json());

        setHasPaid(result.hasAccess);
      } catch (err) {
        console.error("Error checking payment status:", err);
        setError("Failed to check payment status");
      } finally {
        setCheckingPayment(false);
      }
    }

    if (post && address) {
      checkPaymentStatus();
    }
  }, [post, address, contractAddress]);

  // Pay for content
  const handlePayment = async () => {
    if (!post || !isConnected || !contractAddress) return;

    setError(null);

    try {
      // First, get the content price
      const priceResponse = await fetch("/api/contract/contentPrice").then(
        (res) => res.json(),
      );

      const contentPrice = priceResponse.price;

      // Submit the transaction
      await writeContractAsync({
        address: contractAddress,
        abi: ContentManagerABI,
        functionName: "payForContent",
        args: [BigInt(post.id)],
        value: BigInt(contentPrice),
      });

      setHasPaid(true);
    } catch (err: unknown) {
      console.error("Payment error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Payment failed";
      setError(errorMessage);
    }
  };

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
        <main className="flex-1">
          <article className="prose lg:prose-xl max-w-none">
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <div className="flex items-center text-gray-500 mb-8">
              <p className="mr-4">{post.date}</p>
              <p>By {post.author}</p>
            </div>

            {!isConnected ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-8">
                <p className="text-yellow-700">
                  Please connect your wallet to view this content.
                </p>
              </div>
            ) : checkingPayment ? (
              <div className="text-center py-8">
                <p>Checking payment status...</p>
              </div>
            ) : !hasPaid ? (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-6 mb-8">
                <h3 className="text-xl font-semibold mb-2">Premium Content</h3>
                <p className="mb-4">
                  This content requires a one-time payment of $1 (0.0005 ETH).
                </p>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded p-2 mb-4 text-red-700">
                    {error}
                  </div>
                )}
                <button
                  onClick={handlePayment}
                  disabled={paymentLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
                >
                  {paymentLoading ? "Processing..." : "Pay to Unlock Content"}
                </button>
              </div>
            ) : (
              <div className="blog-content">
                {content && <MDXRemote {...content} />}
              </div>
            )}
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
