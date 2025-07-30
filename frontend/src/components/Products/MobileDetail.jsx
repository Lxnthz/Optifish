import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaCartPlus } from "react-icons/fa";
import ProductHeader from "./ProductDetails/ProductHeader";
import ProductImage from "./ProductDetails/ProductImage";
import ProductDetails from "./ProductDetails/ProductDetails";
import ActionButtons from "./ProductDetails/ActionButtons";
import ReviewsSection from "./ProductDetails/ReviewsSection";
import ParticipantsModal from "./ProductDetails/ParticipantsModal";
import PaymentModal from "./ProductDetails/PaymentModal";

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

export default function MobileDetail({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState(2);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("BCA");
  const [receiverName, setReceiverName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedExpedition, setSelectedExpedition] = useState(EXPEDITIONS[0]);
  const [groupBuyId, setGroupBuyId] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const user = JSON.parse(localStorage.getItem("user"));

  const discounts = {
    2: 5,
    5: 7,
    10: 10,
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/reviews/${product.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setReviews(data);

          // Calculate average rating
          const totalStars = data.reduce(
            (sum, review) => sum + review.stars,
            0
          );
          const avgRating = data.length > 0 ? totalStars / data.length : 0;
          setAverageRating(avgRating);
        } else {
          console.error("Failed to fetch reviews.");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (product) {
      fetchReviews();
    }
  }, [product]);

  const handleStartGroupBuy = async () => {
    if (!user) {
      alert("You must be logged in to start a group buy.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/group-buys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          creatorId: user.id,
          maxUsers: selectedParticipants,
          discountPercentage: discounts[selectedParticipants],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGroupBuyId(data.groupBuyId); // Save the group buy ID
        alert("Group buy started successfully!");
        setIsModalOpen(false);
        setIsPaymentModalOpen(true); // Open payment modal
      } else {
        alert("Failed to start group buy.");
      }
    } catch (error) {
      console.error("Error starting group buy:", error);
      alert("An error occurred while starting the group buy.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePayment = async (totalAmount) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/group-buy/transaction`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            groupBuyId: groupBuyId,
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

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <motion.div
            className="bg-white w-full rounded-t-lg p-4 shadow-lg max-h-screen overflow-y-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3 }}>
            <ProductHeader product={product} onClose={onClose} />
            <ProductImage product={product} />
            <ProductDetails
              product={product}
              averageRating={averageRating}
              reviews={reviews}
            />
            <ActionButtons
              product={product}
              onAddToCart={onAddToCart}
              setIsModalOpen={setIsModalOpen}
              loading={loading}
            />
            <ReviewsSection reviews={reviews} />
            <ParticipantsModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              selectedParticipants={selectedParticipants}
              setSelectedParticipants={setSelectedParticipants}
              handleStartGroupBuy={handleStartGroupBuy}
              loading={loading}
              discounts={discounts}
            />
            <PaymentModal
              isPaymentModalOpen={isPaymentModalOpen}
              setIsPaymentModalOpen={setIsPaymentModalOpen}
              product={product}
              selectedParticipants={selectedParticipants}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
