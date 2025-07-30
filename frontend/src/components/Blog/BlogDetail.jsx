import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [markdownContent, setMarkdownContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBlog = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch blog: ${response.status}`);
      }
      const data = await response.json();
      setBlog(data);

      if (data.markdown_path) {
        const markdownResponse = await fetch(`${API_BASE_URL}${data.markdown_path}`);
        if (!markdownResponse.ok) {
          throw new Error("Failed to fetch markdown file.");
        }
        const markdownText = await markdownResponse.text();

        // Optional: Fix newline not rendering by replacing double newlines
        setMarkdownContent(markdownText);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      setError(error.message || "An error occurred while fetching the blog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  if (loading) return <p className="text-gray-500">Loading blog...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!blog) return <p className="text-gray-500">Blog not found.</p>;

  return (
    <div className="mx-5 md:mx-13 my-8 mt-25 lg:px-30 items-center justify-center">
      <h1 className="text-lg md:text-4xl font-bold mb-4 text-center">{blog.title}</h1>
      <p className="text-sm text-gray-600 mb-4 text-center">
        Dipublikasi pada {new Date(blog.created_at).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-600 mb-4 text-center">Oleh: {blog.writer_name}</p>
      <img
        src={`${API_BASE_URL}${blog.image_url}`}
        alt={blog.title}
        className="w-full h-64 md:h-70 lg:h-100 object-cover rounded-md mb-4 mx-auto"
        crossOrigin="anonymous"
      />
      <div className="prose max-w-none prose-headings:font-bold prose-headings:text-xl">
        <ReactMarkdown
          children={markdownContent}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        />
      </div>
    </div>
  );
}
