import { useState, useEffect } from "react";
import AccountInformation from "../components/Settings/AccountInformation";
import StorePage from "../components/Settings/StorePage";
import ConsultantDashboard from "../components/Settings/ConsultantDashboard";
import TransactionHistory from "../components/Settings/TransactionHistory";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      console.error("No user found in localStorage");
    }
  }, []);

  console.log("Stored user:", user);

  const handleRoleUpgradeRequest = async (role) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/role-upgrade-request",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, requestedRole: role }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("Role upgrade request submitted successfully!");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error submitting role upgrade request:", error);
      alert("An error occurred while submitting the request.");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen mx-1 lg:mx-13 mt-5 lg:mt-13 mb-5">
      {/* Sidebar */}
      <div className="hidden lg:block w-1/4 bg-white shadow-sm rounded-lg p-5 mt-13 inset-shadow-sm sticky top-26 h-[calc(100vh-40px)]">
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left py-2 px-4 rounded-lg font-medium ${
                activeTab === "profile"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}>
              Account Information
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("store")}
              className={`w-full text-left py-2 px-4 rounded-lg font-medium ${
                activeTab === "store"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}>
              Store Page
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("consultation")}
              className={`w-full text-left py-2 px-4 rounded-lg font-medium ${
                activeTab === "consultation"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}>
              Consultant Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`w-full text-left py-2 px-4 rounded-lg font-medium ${
                activeTab === "transactions"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}>
              Transaction History
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 mt-7 rounded-xl overflow-y-auto">
        {activeTab === "profile" && (
          <AccountInformation userId={user.id} user={user} />
        )}
        {activeTab === "store" && (
          <StorePage
            user={user}
            userId={user.id}
            handleRoleUpgradeRequest={handleRoleUpgradeRequest}
          />
        )}
        {activeTab === "consultation" && (
          <ConsultantDashboard
            user={user}
            handleRoleUpgradeRequest={handleRoleUpgradeRequest}
          />
        )}
        {activeTab === "transactions" && <TransactionHistory userId={user.id} />}
      </div>
    </div>
  );
}
