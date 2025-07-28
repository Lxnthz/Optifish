import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Blank from "../assets/photos/blank-profile.png";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile"); // Default tab
  const [user, setUser] = useState(null);
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

  const handleRoleUpgradeRequest = async (role) => {
    try {
      const response = await fetch("/api/role-upgrade-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, requestedRole: role }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Role upgrade request submitted successfully!");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error submitting role upgrade request:", error);
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
    <div className="flex flex-col lg:flex-row min-h-screen mx-5 lg:mx-13 mt-5 lg:mt-13 mb-5">
      {/* Sidebar for Desktop */}
      <div className="hidden lg:block w-1/4 bg-white shadow-lg rounded-lg p-5">
        {/* User Name */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">{user.full_name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        {/* Menu Items */}
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

      {/* Dropdown for Mobile */}
      <div className="lg:hidden mb-5">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
          <option value="profile">Account Information</option>
          <option value="store">Store Page</option>
          <option value="consultation">Consultant Dashboard</option>
          <option value="transactions">Transaction History</option>
        </select>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeTab === "profile" && <ProfileSection user={user} />}
        {activeTab === "store" && (
          <StoreSection
            user={user}
            handleRoleUpgradeRequest={handleRoleUpgradeRequest}
          />
        )}
        {activeTab === "consultation" && (
          <ConsultationSection
            user={user}
            handleRoleUpgradeRequest={handleRoleUpgradeRequest}
          />
        )}
        {activeTab === "transactions" && <TransactionHistorySection />}
      </div>

      {/* Role Upgrade Buttons for Customer Role */}
      {user.role === "customer" && (
        <div className="mt-4">
          <button
            onClick={() => handleRoleUpgradeRequest("seller")}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">
            Become a Seller
          </button>
          <button
            onClick={() => handleRoleUpgradeRequest("consultant")}
            className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 ml-4">
            Become a Consultant
          </button>
        </div>
      )}
    </div>
  );
}

function ProfileSection({ user }) {
  const [profilePicture, setProfilePicture] = useState(
    user.profile_picture || Blank // Placeholder image
  );
  const [name, setName] = useState(user.full_name || "");
  const [birthPlaceDate, setBirthPlaceDate] = useState(
    user.birth_place_date || ""
  );
  const [email, setEmail] = useState(user.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number || "");

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result); // Preview the uploaded image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    // Save changes logic (e.g., API call to update user data)
    alert("Profile updated successfully!");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Side: Profile Picture */}
      <div className="flex flex-col items-center">
        <img
          src={profilePicture}
          alt="Profile"
          className="w-40 h-40 rounded-full object-cover mb-4"
        />
        <label
          htmlFor="profilePicture"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600">
          Change Picture
        </label>
        <input
          id="profilePicture"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleProfilePictureChange}
        />
      </div>

      {/* Right Side: Profile Details */}
      <div className="flex-1 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lengkap
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white inset-shadow-sm shadow-sm px-3 py-2 rounded-lg font-[400] text-gray-700 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white inset-shadow-sm shadow-sm px-3 py-2 rounded-lg font-[400] text-gray-700 w-full"
          />
        </div>
        <button
          onClick={handleSaveChanges}
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function StoreSection({ user, handleRoleUpgradeRequest }) {
  if (user.role !== "seller") {
    return (
      <div className="relative flex items-center justify-center min-h-[300px] bg-gray-100 rounded-lg">
        <button
          onClick={() => handleRoleUpgradeRequest("seller")}
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">
          Become a Seller
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Store Page</h2>
      <p>Store Name: {user.store_name || "Not Set"}</p>
      <p>Store Slug: {user.store_slug || "Not Set"}</p>
      <p>Verified: {user.verified ? "Yes" : "No"}</p>
    </div>
  );
}

function ConsultationSection({ user, handleRoleUpgradeRequest }) {
  if (user.role !== "consultant") {
    return (
      <div className="relative flex items-center justify-center min-h-[300px] bg-gray-100 rounded-lg">
        <button
          onClick={() => handleRoleUpgradeRequest("consultant")}
          className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600">
          Become a Consultant
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Consultant Dashboard</h2>
      <p>Expertise Area: {user.expertise_area || "Not Set"}</p>
      <p>Hourly Rate: {user.hourly_rate || "Not Set"}</p>
      <p>Available: {user.available ? "Yes" : "No"}</p>
    </div>
  );
}

// New Transaction History Section
function TransactionHistorySection() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
      <p>Here you can view all your past transactions.</p>
      {/* Add transaction details or table here */}
    </div>
  );
}
