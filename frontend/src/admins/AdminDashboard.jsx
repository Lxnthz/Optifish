import React, { useEffect, useState } from "react";
import UsersTab from "./components/UsersTab";
import RequestsTab from "./components/RequestsTab";
import PendingBlogsTab from "./components/PendingBlogsTab";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Define API_BASE_URL

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "store-requests") {
      fetchRequests();
    } else if (activeTab === "pending-blogs") {
      fetchPendingBlogs();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`); // Use API_BASE_URL
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message || "An error occurred while fetching users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/role-upgrade-requests`); // Use API_BASE_URL
      if (!response.ok) {
        throw new Error(`Failed to fetch requests: ${response.status}`);
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError(error.message || "An error occurred while fetching requests.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingBlogs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/blogs/pending`); // Use API_BASE_URL
      if (!response.ok) {
        throw new Error(`Failed to fetch pending blogs: ${response.status}`);
      }
      const data = await response.json();
      console.log("Pending Blogs:", data); // Debugging log
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

  const handleRequestAction = async (requestId, action) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/role-upgrade-requests/${requestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: action }),
        }
      ); // Use API_BASE_URL

      if (!response.ok) {
        throw new Error(`Failed to update request status: ${response.status}`);
      }

      const data = await response.json();
      alert(data.message); // Show success message
      fetchRequests(); // Refresh the requests list
    } catch (error) {
      console.error("Error updating request status:", error);
      setError(
        error.message || "An error occurred while updating the request status."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBlogAction = async (blogId, action) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/blogs/${blogId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: action }),
      }); // Use API_BASE_URL

      if (!response.ok) {
        throw new Error(`Failed to update blog status: ${response.status}`);
      }

      const data = await response.json();
      alert(data.message); // Show success message
      fetchPendingBlogs(); // Refresh the pending blogs list
    } catch (error) {
      console.error("Error updating blog status:", error);
      setError(
        error.message || "An error occurred while updating the blog status."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row mx-5 lg:mx-13 mt-5 mb-5">
      {/* Sidebar */}
      <div className="hidden lg:block w-1/4 bg-white shadow-lg rounded-lg p-5 min-h-[50vh]">
        <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full text-left py-2 px-4 rounded-lg font-medium ${
                activeTab === "users"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}>
              Registered Users
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("store-requests")}
              className={`w-full text-left py-2 px-4 rounded-lg font-medium ${
                activeTab === "store-requests"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}>
              Users Requests
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("pending-blogs")}
              className={`w-full text-left py-2 px-4 rounded-lg font-medium ${
                activeTab === "pending-blogs"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}>
              Pending Blogs
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeTab === "users" && <UsersTab users={users} />}
        {activeTab === "store-requests" && (
          <RequestsTab
            requests={requests}
            handleRequestAction={handleRequestAction}
          />
        )}
        {activeTab === "pending-blogs" && (
          <PendingBlogsTab
            pendingBlogs={pendingBlogs}
            handleBlogAction={handleBlogAction}
          />
        )}
      </div>
    </div>
  );
}
