import React, { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PendingBlogsTab() {
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPendingBlogs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/blogs/pending`);
      if (!response.ok) {
        throw new Error(`Failed to fetch pending blogs: ${response.status}`);
      }
      const data = await response.json();
      console.log("Pending Blogs API Response:", data); // Debugging log
      setPendingBlogs(data);
    } catch (error) {
      console.error("Error fetching pending blogs:", error);
      setError(
        error.message || "An error occurred while fetching pending blogs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBlogs();
  }, []);

  const handleBlogAction = async (blogId, action) => {
    if (action !== "accept" && action !== "reject") return;

    const confirmMessage =
      action === "accept"
        ? "Are you sure you want to approve this blog?"
        : "Are you sure you want to reject this blog?";

    if (window.confirm(confirmMessage)) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/blogs/${action}/${blogId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to ${action} the blog: ${response.status}`);
        }

        alert(`Blog ${action}ed successfully.`);
        fetchPendingBlogs(); // Refresh the pending blogs list
      } catch (error) {
        console.error(`Error ${action}ing the blog:`, error);
        alert(`Error ${action}ing the blog: ${error.message}`);
      }
    }
  };

  console.log("Pending Blogs State:", pendingBlogs);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pending Blogs</h1>
      {loading && <p className="text-gray-500">Loading pending blogs...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Writer</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingBlogs.length > 0 ? (
            pendingBlogs.map((blog) => (
              <tr key={blog.id}>
                <td className="border border-gray-300 px-4 py-2">{blog.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {blog.title}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {blog.writer_name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(blog.created_at).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleBlogAction(blog.id, "accept")}
                    className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 mr-2">
                    Approve
                  </button>
                  <button
                    onClick={() => handleBlogAction(blog.id, "reject")}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600">
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                No pending blogs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
