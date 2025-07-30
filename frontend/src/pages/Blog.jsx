import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/blogs/accepted`);
      if (!response.ok) {
        throw new Error(`Failed to fetch blogs: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched Blogs:", data); // Debugging log
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError(error.message || "An error occurred while fetching blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    console.log("Blogs State:", blogs); // Debugging log
  }, [blogs]);

  return (
    <div className="mx-4 md:mx-8 lg:mx-13 lg:mt-25">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-lg md:text-2xl font-bold mb-4 md:mb-0">
          Blog dan Tips Budidaya
        </h1>
        <button
          onClick={() => navigate("/blog/write")}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm md:text-base">
          Tulis Cerita Anda
        </button>
      </div>

      {/* Loading and Error States */}
      {loading && <p className="text-gray-500">Loading blogs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white shadow-md rounded-md p-3 flex flex-col sm:flex-row sm:items-center sm:gap-3">
            {/* Blog Image */}
            <img
              src={`${API_BASE_URL}${blog.image_url}`}
              alt={blog.title}
              className="w-full sm:w-24 h-24 object-cover rounded-md mb-3 sm:mb-0"
              crossOrigin="anonymous"
            />

            {/* Blog Content */}
            <div className="flex flex-col justify-between">
              {/* Blog Title */}
              <h2 className="text-sm font-bold mb-1">{blog.title}</h2>

              {/* Blog Date */}
              <p className="text-xs text-gray-600">
                {new Date(blog.created_at).toLocaleDateString()}
              </p>

              {/* Read More Button */}
              <a
                href={`/blog/${blog.id}`}
                className="text-blue-500 hover:underline mt-2 text-xs">
                Read More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
