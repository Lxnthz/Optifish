import React, { useEffect, useState } from "react";
import DynamicPaymentModal from "../components/Products/ProductDetails/DynamicPaymentModal";
import ErrorBoundary from "../components/ErrorBoundary";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EXPEDITIONS = [
  { name: "Anter Aja", price: 15000 },
  { name: "GoSend", price: 20000 },
  { name: "Grab", price: 18000 },
  { name: "JNE", price: 25000 },
  { name: "JNT", price: 22000 },
  { name: "Lion Parcel", price: 17000 },
  { name: "PosInd", price: 20000 },
  { name: "SiCepat", price: 19000 },
  { name: "Tiki", price: 21000 },
];

const PAYMENT_METHODS = [
  "BCA",
  "BNI",
  "BRI",
  "BSI",
  "Dana",
  "GoPay",
  "LinkAja",
  "Mandiri",
  "OVO",
  "QRIS",
  "ShopeePay",
];

const PAYMENT_TAXES = {
  BCA: 2,
  BNI: 2,
  BRI: 2,
  BSI: 2,
  Mandiri: 2,
  Dana: 3,
  GoPay: 3,
  LinkAja: 3,
  OVO: 3,
  QRIS: 4,
  ShopeePay: 4,
};

export default function GroupBuyPage() {
  const [groupBuys, setGroupBuys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedGroupBuy, setSelectedGroupBuy] = useState(null);
  const [receiverName, setReceiverName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedExpedition, setSelectedExpedition] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("BCA");

  const user = JSON.parse(localStorage.getItem("user"));

  const discounts = {
    2: 5,
    5: 7,
    10: 10,
  };

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

  const handleJoinGroupBuy = (groupBuy) => {
    if (!user) {
      alert("You must be logged in to join a group buy.");
      return;
    }

    setSelectedGroupBuy(groupBuy); // Set the selected group buy
    setIsPaymentModalOpen(true); // Open the payment modal
  };

  const handleCompletePayment = async (totalAmount) => {
    if (!selectedGroupBuy) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/group-buy/transaction`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            groupBuyId: selectedGroupBuy.id,
            amount: totalAmount,
            paymentMethod: selectedPaymentMethod,
            receiverName,
            address,
            expedition: selectedExpedition.name,
          }),
        }
      );

      if (response.ok) {
        alert("Payment completed successfully!");
        setIsPaymentModalOpen(false);
      } else {
        alert("Failed to complete payment.");
      }
    } catch (error) {
      console.error("Error completing payment:", error);
      alert("An error occurred while completing the payment.");
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
                  onClick={() => handleJoinGroupBuy(groupBuy)}
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

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <ErrorBoundary>
          <DynamicPaymentModal
          isPaymentModalOpen={isPaymentModalOpen}
          setIsPaymentModalOpen={setIsPaymentModalOpen}
          groupBuyId={selectedGroupBuy?.id} // Log this value
          selectedParticipants={selectedGroupBuy?.current_users}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          receiverName={receiverName}
          setReceiverName={setReceiverName}
          address={address}
          setAddress={setAddress}
          selectedExpedition={selectedExpedition}
          setSelectedExpedition={setSelectedExpedition}
          handleCompletePayment={handleCompletePayment}
          EXPEDITIONS={EXPEDITIONS}
          PAYMENT_METHODS={PAYMENT_METHODS}
          PAYMENT_TAXES={PAYMENT_TAXES}
          discounts={discounts}
        />
        </ErrorBoundary>
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
