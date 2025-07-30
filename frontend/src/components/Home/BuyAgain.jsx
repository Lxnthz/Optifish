import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function BuyAgain({ userId }) {
  const [recentlyBoughtItems, setRecentlyBoughtItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolvedUserId =
      userId || JSON.parse(localStorage.getItem("user"))?.id;

    if (!resolvedUserId) {
      console.error("No userId provided or found in localStorage.");
      setLoading(false);
      return;
    }

    const fetchRecentlyBoughtItems = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/users/${resolvedUserId}/recent-purchases`
        );
        if (response.ok) {
          const data = await response.json();
          setRecentlyBoughtItems(data);
        } else {
          console.error(
            "Failed to fetch recently bought items:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching recently bought items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyBoughtItems();
  }, [userId]);

  if (loading) {
    return (
      <p className="text-center text-gray-500">
        Loading recently bought items...
      </p>
    );
  }

  if (recentlyBoughtItems.length === 0) {
    return (
      null
    );
  }

  return (
    <div className="px-5 md:px-13 py-5 bg-gradient-to-tr from-[#0071FF] to-[#004499]">
      <h1 className="w-full text-lg md:text-2xl font-bold mb-4 text-white">Beli Lagi</h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {recentlyBoughtItems.map((item) => (
          <motion.div
            key={item.id}
            className="bg-white shadow-md rounded-md p-2 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-lg relative">
            <p className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded-md shadow-md">
              Rp. {item.price.toLocaleString()}
            </p>
            <img
              src={`${API_BASE_URL}${item.photo}`}
              alt={item.name}
              className="w-full h-20 md:h-40 object-cover rounded-md mb-2"
              crossOrigin="anonymous"
            />
            <h2 className="text-sm font-semibold text-gray-800 text-left w-full mb-1 truncate">
              {item.name}
            </h2>
            <p className="text-[9px] text-yellow-500 flex items-start mb-2 w-full">
              {item.rating} / 5
            </p>
            <button
              className="mt-auto bg-blue-500 text-white py-1 px-3 rounded-md text-xs hover:bg-blue-600 transition-colors"
              onClick={() => alert(`Added "${item.name}" to cart!`)}>
              Beli Lagi
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
