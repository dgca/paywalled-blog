# Personal Blog with Next.js

This is a simple blog application built with Next.js for a hackathon MVP. The application showcases a personal blog with sample blog posts about Web3 development.

## Features

- Home page with a list of blog posts
- Individual blog post pages with formatted content
- Responsive design for mobile and desktop
- Web3 wallet connection using OnchainKit

## Pages

- `/` - Home page showing a list of blog posts
- `/blog/[slug]` - Individual blog post page

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the blog.

## Technologies Used

- Next.js - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- OnchainKit - Web3 wallet integration

## Structure

- `app/page.tsx` - Homepage with blog list
- `app/blog/[slug]/page.tsx` - Dynamic blog post pages
- `app/globals.css` - Global styles including blog content styling

## Expanding the Blog

To add more blog posts, simply add new entries to the `blogPosts` object in `app/page.tsx` and `app/blog/[slug]/page.tsx`.
