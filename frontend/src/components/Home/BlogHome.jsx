import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function BlogHome() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchRecentBlogs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/blogs/accepted`);
      if (!response.ok) {
        throw new Error(`Failed to fetch blogs: ${response.status}`);
      }
      const data = await response.json();
      setBlogs(data.slice(0, 4)); // Limit to 4 recent blogs
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError(error.message || "An error occurred while fetching blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentBlogs();
  }, []);

  return (
    <div className="mx-5 md:mx-13 my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg md:text-2xl font-bold">Blog & Tips Budidaya</h1>
        <button
          onClick={() => navigate("/blog")}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm md:text-base">
          Lihat Semua
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading blogs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {blogs.slice(0, 4).map((blog) => (
          <div
            key={blog.id}
            className="bg-white shadow-md rounded-md md:h-full p-3 flex flex-col sm:flex-row lg:flex-col sm:items-center sm:gap-3">
            {/* Blog Image */}
            <img
              src={`${API_BASE_URL}${blog.image_url}`}
              alt={blog.title}
              className="w-full sm:w-24 sm:h-24 lg:w-full lg:h-32 object-cover rounded-md mb-3 sm:mb-0 lg:mb-3"
              crossOrigin="anonymous"
            />

            {/* Blog Content */}
            <div className="flex flex-col justify-between sm:ml-3 lg:ml-0">
              {/* Blog Title */}
              <h2 className="text-sm font-bold mb-1">{blog.title}</h2>

              {/* Blog Date */}
              <p className="text-xs text-gray-600 mb-2">
                {new Date(blog.created_at).toLocaleDateString()}
              </p>

              {/* Read More Button */}
              <a
                href={`/blog/${blog.id}`}
                className="text-blue-500 hover:underline text-xs">
                Baca Selengkapnya
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
