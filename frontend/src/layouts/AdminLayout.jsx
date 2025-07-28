import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        Admin Panel © 2025
      </footer>
    </div>
  );
}
