import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-1 p-6">
        <Outlet />
      </main>
      <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
          {/* Left Section */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-lg font-bold">Admin Panel</h2>
            <p className="text-sm opacity-80">
              © 2025 Optifish. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
