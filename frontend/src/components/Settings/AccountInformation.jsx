import { useState, useEffect } from "react";
import Blank from "../../assets/photos/blank-profile.png";
import Bronze from "../../assets/elements/Progress/Bronze.png";
import Silver from "../../assets/elements/Progress/Silver.png";
import Gold from "../../assets/elements/Progress/Gold.png";
import Basic from "../../assets/elements/Progress/Basic.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AccountInformation({ user }) {
  const [profilePicture, setProfilePicture] = useState(
    user.profile_picture || Blank
  );
  const [name, setName] = useState(user.full_name || "Unknown User");
  const [email, setEmail] = useState(user.email || "No Email Provided");
  const [currentPoints, setCurrentPoints] = useState(0); // Default to 0

  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/users/${user.id}/loyalty-points`
        );
        if (response.ok) {
          const data = await response.json();
          setCurrentPoints(data.loyalty_points);
        } else {
          console.error("Failed to fetch loyalty points:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching loyalty points:", error);
      }
    };

    fetchLoyaltyPoints();
  }, [user.id]);

  // Determine next level points
  const nextLevelPoints =
    currentPoints < 500
      ? 500
      : currentPoints < 1000
      ? 1000
      : currentPoints < 2000
      ? 2000
      : null; // Points needed for the next level (null for Gold)

  const progressPercentage = nextLevelPoints
    ? (currentPoints / nextLevelPoints) * 100
    : 100; // Full progress for Gold

  // Determine membership level
  const membershipLevel =
    currentPoints < 500
      ? "Basic"
      : currentPoints < 1000
      ? "Bronze"
      : currentPoints < 2000
      ? "Silver"
      : "Gold";

  // Determine membership badge
  const membershipBadge =
    membershipLevel === "Bronze"
      ? Bronze
      : membershipLevel === "Silver"
      ? Silver
      : membershipLevel === "Gold"
      ? Gold
      : Basic;

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
              disabled
              value={name}
              className="bg-white inset-shadow-sm shadow-sm px-3 py-2 rounded-lg font-[400] text-gray-700 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              disabled
              value={email}
              className="bg-white inset-shadow-sm shadow-sm px-3 py-2 rounded-lg font-[400] text-gray-700 w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-x-5 bg-gradient-to-tr from-[#0071FF] to-[#004499] p-3 rounded-xl flex-col gap-y-3 lg:flex-row">
        <div className="bg-white/20 rounded-xl w-full p-2 flex flex-col flex-1/4 text-white gap-y-1 justify-start items-start">
          <div className="flex items-center gap-x-1 w-full">
            {membershipBadge && <img src={membershipBadge} className="w-6" />}
            <p className="text-sm font-[500]">{membershipLevel}</p>
          </div>
          <p className="text-lg">Tingkatkan Poin Membership Anda!</p>
          <p className="text-sm font-[400]">
            Untuk Membuka Bonus dan Banyak Promo Lainnya
          </p>
        </div>
        <div className="flex flex-col items-start gap-y-2 bg-white rounded-xl text-black p-2 lg:p-7 flex-2/4 justify-between xl:flex-3/4">
          <p className="text-sm font-[500] lg:text-lg">
            {currentPoints} {nextLevelPoints ? `/ ${nextLevelPoints}` : ""} Poin
          </p>
          <div className="w-full bg-white/30 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-[#FFD700] to-[#FF8C00] h-3 rounded-full"
              style={{ width: `${progressPercentage}%` }}></div>
          </div>
          {nextLevelPoints ? (
            <p className="text-xs lg:text-md">
              {nextLevelPoints - currentPoints} Poin lagi untuk naik ke level
              berikutnya!
            </p>
          ) : (
            <p className="text-xs lg:text-md">
              Anda telah mencapai level tertinggi!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
