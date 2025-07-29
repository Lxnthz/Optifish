export default function StorePage({ user, handleRoleUpgradeRequest }) {
  if (!user.is_seller) {
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
