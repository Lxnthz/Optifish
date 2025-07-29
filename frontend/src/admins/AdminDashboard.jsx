import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users"); // Default tab
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "store-requests") {
      fetchRequests();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:3000/api/users");
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
      const response = await fetch(
        "http://localhost:3000/api/role-upgrade-requests"
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch requests: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched requests from API:", data); // Debug log
      setRequests(data); // Update the requests state
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError(error.message || "An error occurred while fetching requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `http://localhost:3000/api/role-upgrade-requests/${requestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: action }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update request: ${response.status}`);
      }

      const data = await response.json();
      alert(data.message); // Show success message
      fetchRequests(); // Refresh the requests list
    } catch (error) {
      console.error("Error updating request:", error);
      setError(
        error.message || "An error occurred while updating the request."
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
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeTab === "users" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Registered Users</h1>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">ID</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Full Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">Role</th>
                  <th className="border border-gray-300 px-4 py-2">Is Seller</th>
                  <th className="border border-gray-300 px-4 py-2">Is Consultant</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.full_name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.email}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.role}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.is_seller ? "Yes" : "No"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.is_consultant ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "store-requests" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Users Requests</h1>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">
                    Request ID
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    User Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Requested Role
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <tr key={request.id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {request.id}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {request.full_name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {request.email}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {request.requested_role}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(request.created_at).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          onClick={() =>
                            handleRequestAction(request.id, "approved")
                          }
                          className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 mr-2">
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleRequestAction(request.id, "rejected")
                          }
                          className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600">
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                      No requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
