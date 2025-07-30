import React, { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function GroupBuyPage() {
  const [groupBuys, setGroupBuys] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGroupBuys = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/group-buys/active`);
        if (response.ok) {
          const data = await response.json();
          setGroupBuys(
            data.map((groupBuy) => ({
              ...groupBuy,
              expiresAt: new Date(groupBuy.expires_at), // Parse expires_at as a Date object
            }))
          );
        } else {
          console.error("Failed to fetch group buys.");
        }
      } catch (error) {
        console.error("Error fetching group buys:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupBuys();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGroupBuys((prevGroupBuys) =>
        prevGroupBuys.map((groupBuy) => ({
          ...groupBuy,
          timeLeft: calculateTimeLeft(groupBuy.expiresAt),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [groupBuys]);

  const handleJoinGroupBuy = async (groupBuyId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("You must be logged in to join a group buy.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/group-buys/${groupBuyId}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      if (response.ok) {
        alert("Successfully joined the group buy!");
        setGroupBuys((prev) =>
          prev.map((groupBuy) =>
            groupBuy.id === groupBuyId
              ? { ...groupBuy, current_users: groupBuy.current_users + 1 }
              : groupBuy
          )
        );
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to join group buy.");
      }
    } catch (error) {
      console.error("Error joining group buy:", error);
      alert("An error occurred while joining the group buy.");
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Active Group Buys</h1>
      {loading ? (
        <p>Loading...</p>
      ) : groupBuys.length > 0 ? (
        <ul className="space-y-4">
          {groupBuys.map((groupBuy) => {
            const user = JSON.parse(localStorage.getItem("user"));
            const hasJoined = groupBuy.participants?.some(
              (participant) => participant.userId === user?.id
            );

            return (
              <li key={groupBuy.id} className="border p-4 rounded-lg">
                <p>Product ID: {groupBuy.product_id}</p>
                <p>Current Users: {groupBuy.current_users}</p>
                <p>Max Users: {groupBuy.max_users}</p>
                <p>Discount: {groupBuy.discount_percentage}%</p>
                <p>Expires At: {groupBuy.timeLeft || "Expired"}</p>
                <button
                  onClick={() => handleJoinGroupBuy(groupBuy.id)}
                  className={`py-2 px-4 rounded-lg ${
                    hasJoined
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  disabled={hasJoined}>
                  {hasJoined ? "Already Joined" : "Join Group Buy"}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No active group buys.</p>
      )}
    </div>
  );
}

function calculateTimeLeft(expiresAt) {
  const now = new Date();
  const timeDiff = expiresAt - now;

  if (timeDiff <= 0) {
    return "Expired";
  }

  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return `${hours}h ${minutes}m ${seconds}s`;
}
