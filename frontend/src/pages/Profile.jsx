import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("default"); // Tabs: default, seller, consultant
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login"); // Redirect to login if no user is found
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    navigate("/login"); // Redirect to login page
  };

  const handleRoleUpgrade = (role) => {
    alert(`Request to become a ${role} submitted!`);
    // Backend API call to request role upgrade can be added here
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab("default")}
            className={`py-2 px-4 rounded-lg ${
              activeTab === "default"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}>
            Account Info
          </button>
          {user.role === "seller" && (
            <button
              onClick={() => setActiveTab("seller")}
              className={`py-2 px-4 rounded-lg ${
                activeTab === "seller"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}>
              Seller Info
            </button>
          )}
          {user.role === "consultant" && (
            <button
              onClick={() => setActiveTab("consultant")}
              className={`py-2 px-4 rounded-lg ${
                activeTab === "consultant"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}>
              Consultant Info
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === "default" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Account Information</h2>
            <div className="flex flex-col gap-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <p className="mt-1 text-gray-800">{user.full_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-gray-800">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <p className="mt-1 text-gray-800">{user.role}</p>
              </div>
            </div>

            {/* Role Upgrade Options */}
            {user.role !== "seller" && (
              <button
                onClick={() => handleRoleUpgrade("seller")}
                className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">
                Become a Seller
              </button>
            )}
            {user.role !== "consultant" && (
              <button
                onClick={() => handleRoleUpgrade("consultant")}
                className="mt-4 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600">
                Become a Consultant
              </button>
            )}
          </div>
        )}

        {activeTab === "seller" && <SellerInfo user={user} />}

        {activeTab === "consultant" && <ConsultantInfo user={user} />}

        {/* Log Out Button */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 w-full">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

function SellerInfo({ user }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Seller Information</h2>
      <p>Store Name: {user.store_name || "Not Set"}</p>
      <p>Store Slug: {user.store_slug || "Not Set"}</p>
      <p>Verified: {user.verified ? "Yes" : "No"}</p>
    </div>
  );
}

function ConsultantInfo({ user }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Consultant Information</h2>
      <p>Expertise Area: {user.expertise_area || "Not Set"}</p>
      <p>Hourly Rate: {user.hourly_rate || "Not Set"}</p>
      <p>Available: {user.available ? "Yes" : "No"}</p>
    </div>
  );
}
