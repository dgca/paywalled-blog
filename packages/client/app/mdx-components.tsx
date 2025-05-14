import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

interface ChildProps {
  children: ReactNode;
}

interface LinkProps extends ChildProps {
  href?: string;
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Use custom components
    h1: ({ children }: ChildProps) => (
      <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }: ChildProps) => (
      <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
    ),
    h3: ({ children }: ChildProps) => (
      <h3 className="text-xl font-semibold mt-4 mb-2">{children}</h3>
    ),
    p: ({ children }: ChildProps) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
    a: ({ href, children }: LinkProps) => (
      <Link
        href={href || "#"}
        className="text-blue-600 hover:text-blue-800 hover:underline"
      >
        {children}
      </Link>
    ),
    img: (props: any) => (
      <Image
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        {...(props as ImageProps)}
        alt={props.alt || "Blog image"}
      />
    ),
    pre: ({ children }: ChildProps) => (
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-4 text-sm">
        {children}
      </pre>
    ),
    code: ({ children }: ChildProps) => (
      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    ul: ({ children }: ChildProps) => (
      <ul className="list-disc pl-5 mb-4 space-y-2">{children}</ul>
    ),
    ol: ({ children }: ChildProps) => (
      <ol className="list-decimal pl-5 mb-4 space-y-2">{children}</ol>
    ),
    li: ({ children }: ChildProps) => <li className="mt-1">{children}</li>,
    blockquote: ({ children }: ChildProps) => (
      <blockquote className="border-l-4 border-gray-200 pl-4 italic my-4">
        {children}
      </blockquote>
    ),
    // Merge with any components provided by the user
    ...components,
  };
}
