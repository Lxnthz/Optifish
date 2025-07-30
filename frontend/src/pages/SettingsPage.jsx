import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AccountInformation from "../components/Settings/AccountInformation";
import StorePage from "../components/Settings/StorePage";
import ConsultantDashboard from "../components/Settings/ConsultantDashboard";
import TransactionHistory from "../components/Settings/TransactionHistory";
import GroupBuyStatus from "../components/Settings/GroupBuyStatus";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      console.error("No user found in localStorage");
    }
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMenuOpen(false); // Close the menu after selecting a tab
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
      {/* Mobile Sliding-Up Menu */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 text-center font-medium rounded-t-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300">
          {isMenuOpen ? "Close Menu" : "Open Menu"}
        </button>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="bg-white shadow-lg rounded-t-lg p-4"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}>
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => handleTabChange("profile")}
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
                    onClick={() => handleTabChange("store")}
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
                    onClick={() => handleTabChange("consultation")}
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
                    onClick={() => handleTabChange("transactions")}
                    className={`w-full text-left py-2 px-4 rounded-lg font-medium ${
                      activeTab === "transactions"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}>
                    Transaction History
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange("group-buys")}
                    className={`w-full text-left py-2 px-4 rounded-lg font-medium ${
                      activeTab === "group-buys"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}>
                    Group Buys
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-1/4 bg-white shadow-sm rounded-lg p-5 mt-13 sticky top-26 h-[calc(100vh-40px)]">
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
          <li>
            <button
              onClick={() => setActiveTab("group-buys")}
              className={`w-full text-left py-2 px-4 rounded-lg font-medium ${
                activeTab === "group-buys"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}>
              Group Buys
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
          <StorePage user={user} handleRoleUpgradeRequest={() => {}} />
        )}
        {activeTab === "consultation" && (
          <ConsultantDashboard
            user={user}
            handleRoleUpgradeRequest={() => {}}
          />
        )}
        {activeTab === "transactions" && (
          <TransactionHistory userId={user.id} />
        )}
        {activeTab === "group-buys" && <GroupBuyStatus userId={user.id} />}
      </div>
    </div>
  );
}
