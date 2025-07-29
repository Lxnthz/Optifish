import { useState } from "react";
import Blank from "../../assets/photos/blank-profile.png";
import Bronze from "../../assets/elements/Progress/CrownBronze.svg";

export default function AccountInformation({ user }) {
  const [profilePicture, setProfilePicture] = useState(
    user.profile_picture || Blank
  );
  const [name, setName] = useState(user.full_name || "");
  const [email, setEmail] = useState(user.email || "");

  const handleSaveChanges = () => {
    alert("Profile updated successfully!");
  };

  return (
    <div className="flex flex-col gap-y-7">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col items-center">
          <img
            src={profilePicture}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover mb-4"
          />
        </div>
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

      <div className="flex gap-x-5 bg-gradient-to-tr from-[#0071FF] to-[#004499] p-3 rounded-lg">
        <div className="bg-white/50 rounded-sm min-w-full p-2 flex flex-col text-white gap-y-1 justify-start items-start">
          <div className="flex items-center gap-x-1 min-w-full">
            <img src={Bronze} className="w-4" />
            <p className="text-sm font-[500]">Bronze</p>
          </div>
          <p className="text-lg">Tingkatkan Poin Membership Anda!</p>
          <p className="text-sm font-[400]">Untuk Membuka Bonus dan Banyak Promo Lainnya</p>
        </div>
        <div>
          {/* Pogress Detail */}
        </div>
      </div>
    </div>
  );
}
