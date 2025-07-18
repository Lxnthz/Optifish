import { useEffect, useState } from "react";

export default function SellerPage() {
  const [sellerData, setSellerData] = useState(null);

  useEffect(() => {
    // Fetch seller data (replace with actual API call)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "seller") {
        setSellerData({
          storeName: user.store_name || "Your Store",
          storeSlug: user.store_slug || "your-store",
          verified: user.verified || false,
        });
      }
    }
  }, []);

  if (!sellerData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Seller Dashboard
        </h1>
        <div className="flex flex-col gap-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Store Name
            </label>
            <p className="mt-1 text-gray-800">{sellerData.storeName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Store Slug
            </label>
            <p className="mt-1 text-gray-800">{sellerData.storeSlug}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Verified
            </label>
            <p className="mt-1 text-gray-800">
              {sellerData.verified ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
