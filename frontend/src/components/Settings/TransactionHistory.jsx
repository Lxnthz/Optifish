import React, { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function TransactionHistory({ userId }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState({}); // Store reviews for each product

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/transactions/${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setTransactions(data);
          } else {
            console.error("Unexpected response format:", data);
            setTransactions([]);
          }
        } else {
          console.error("Failed to fetch transactions:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  const handleReviewSubmit = async (productId, review) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, ...review }),
      });

      if (response.ok) {
        alert("Review submitted successfully!");
      } else {
        console.error("Failed to submit review:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (loading) {
    return <p>Loading transaction history...</p>;
  }

  if (transactions.length === 0) {
    return <p>No transactions found.</p>;
  }

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Transaction History
      </h2>
      <div className="space-y-6">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Transaction #{transaction.id}
              </h3>
              <p className="text-sm text-gray-500">
                {new Date(transaction.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Receiver Name
                </p>
                <p className="text-base text-gray-800">
                  {transaction.receiver_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Address</p>
                <p className="text-base text-gray-800">{transaction.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Expedition</p>
                <p className="text-base text-gray-800">
                  {transaction.expedition} (Rp.{" "}
                  {transaction.expedition_cost.toLocaleString()})
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Payment Method
                </p>
                <p className="text-base text-gray-800">
                  {transaction.payment_method}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Amount
                </p>
                <p className="text-base text-blue-600 font-bold">
                  Rp. {transaction.total_amount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Loyalty Points Earned
                </p>
                <p className="text-base text-green-600 font-bold">
                  {transaction.loyalty_points} Points
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Tag</p>
                <p className="text-base text-gray-800">{transaction.tag}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Products</p>
                <div className="space-y-4">
                  {Array.isArray(transaction.products) &&
                  transaction.products.length > 0 ? (
                    transaction.products.map((product) => (
                      <div
                        key={product.id}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center">
                          <p className="text-base font-bold text-gray-800">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Rp. {product.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-600">
                            Leave a Review
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <select
                              className="border rounded-lg px-3 py-2"
                              value={reviews[product.id]?.rating || ""}
                              onChange={(e) =>
                                setReviews((prev) => ({
                                  ...prev,
                                  [product.id]: {
                                    ...prev[product.id],
                                    rating: e.target.value,
                                  },
                                }))
                              }>
                              <option value="" disabled>
                                Select Rating
                              </option>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <option key={star} value={star}>
                                  {star} Star{star > 1 ? "s" : ""}
                                </option>
                              ))}
                            </select>
                            <input
                              type="text"
                              placeholder="Write a review"
                              className="border rounded-lg px-3 py-2 flex-1"
                              value={reviews[product.id]?.text || ""}
                              onChange={(e) =>
                                setReviews((prev) => ({
                                  ...prev,
                                  [product.id]: {
                                    ...prev[product.id],
                                    text: e.target.value,
                                  },
                                }))
                              }
                            />
                            <button
                              onClick={() =>
                                handleReviewSubmit(
                                  product.id,
                                  reviews[product.id]
                                )
                              }
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No products found for this transaction.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
