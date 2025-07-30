import React, { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function GroupBuyStatus({ userId }) {
  const [groupBuys, setGroupBuys] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGroupBuys = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/group-buys/user/${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setGroupBuys(
            data.map((groupBuy) => ({
              ...groupBuy,
              expiresAt: new Date(groupBuy.expiresAt),
            }))
          );
        } else {
          console.error("Failed to fetch group buy status.");
        }
      } catch (error) {
        console.error("Error fetching group buy status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupBuys();
  }, [userId]);

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

  const calculateTimeLeft = (expiresAt) => {
    const now = new Date();
    const difference = expiresAt - now;

    if (difference <= 0) {
      return "Expired";
    }

    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Group Buy Status
      </h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : groupBuys.length > 0 ? (
        <div className="space-y-6">
          {groupBuys.map((groupBuy) => (
            <div
              key={groupBuy.groupBuyId}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-4">
              {/* Product Image */}
              <img
                src={`${API_BASE_URL}${groupBuy.productImage}`}
                alt={groupBuy.productName}
                className="w-32 h-32 object-cover rounded-lg"
                crossOrigin="anonymous"
              />

              {/* Group Buy Details */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {groupBuy.productName}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Dimulai pada:</span>{" "}
                  {new Date(groupBuy.joinedAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Berakhir dalam:</span>{" "}
                  {groupBuy.timeLeft === "Expired"
                    ? "Expired"
                    : groupBuy.timeLeft}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`font-bold ${
                      groupBuy.timeLeft === "Expired"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}>
                    {groupBuy.timeLeft === "Expired" ? "Expired" : "Active"}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Participants:</span>{" "}
                  {groupBuy.currentUsers}/{groupBuy.maxUsers}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Discount:</span>{" "}
                  {groupBuy.discountPercentage}%
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Transaction ID:</span>{" "}
                  {groupBuy.transactionId}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Amount Paid:</span> Rp.{" "}
                  {groupBuy.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Payment Method:</span>{" "}
                  {groupBuy.paymentMethod}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          You have not joined any group buys.
        </p>
      )}
    </div>
  );
}
