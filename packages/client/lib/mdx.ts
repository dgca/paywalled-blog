import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Define the type for Blog metadata
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  content: string;
}

const contentDirectory = path.join(process.cwd(), "content");

// Get all blog posts metadata
export function getAllPosts(): BlogPost[] {
  // Get all files in the content directory
  const files = fs.readdirSync(contentDirectory);

  // Get only MDX files
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

  // Get the metadata from each file
  const posts = mdxFiles.map((file) => {
    // Remove the .mdx extension to get the slug
    const slug = file.replace(/\.mdx$/, "");

    // Read the file content
    const filePath = path.join(contentDirectory, file);
    const fileContents = fs.readFileSync(filePath, "utf8");

    // Extract the front matter
    const { data, content } = matter(fileContents);

    // Return the post metadata
    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      author: data.author,
      content,
    };
  });

  // Sort posts by date (newest first)
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// Get a single blog post by slug
export function getPostBySlug(slug: string): BlogPost | null {
  try {
    // Construct the file path
    const filePath = path.join(contentDirectory, `${slug}.mdx`);

    // Read the file content
    const fileContents = fs.readFileSync(filePath, "utf8");

    // Extract the front matter
    const { data, content } = matter(fileContents);

    // Return the post metadata
    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      author: data.author,
      content,
    };
  } catch (error) {
    console.error(`Error fetching post with slug: ${slug}`, error);
    return null;
  }
}
