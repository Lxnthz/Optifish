export default function ConsultantDashboard({
  user,
  handleRoleUpgradeRequest,
}) {
  if (!user.is_consultant) {
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
