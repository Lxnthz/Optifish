import { useEffect, useState } from "react";

export default function ConsultantPage() {
  const [consultantData, setConsultantData] = useState(null);

  useEffect(() => {
    // Fetch consultant data (replace with actual API call)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "consultant") {
        setConsultantData({
          expertiseArea: user.expertise_area || "Not Set",
          hourlyRate: user.hourly_rate || "Not Set",
          available: user.available || false,
        });
      }
    }
  }, []);

  if (!consultantData) {
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
          Consultant Dashboard
        </h1>
        <div className="flex flex-col gap-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Expertise Area
            </label>
            <p className="mt-1 text-gray-800">{consultantData.expertiseArea}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hourly Rate
            </label>
            <p className="mt-1 text-gray-800">{consultantData.hourlyRate}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Available
            </label>
            <p className="mt-1 text-gray-800">
              {consultantData.available ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
