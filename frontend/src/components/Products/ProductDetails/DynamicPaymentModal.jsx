import React, { useEffect, useState } from "react";

export default function DynamicPaymentModal({
  isPaymentModalOpen,
  setIsPaymentModalOpen,
  groupBuyId,
  selectedParticipants,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  receiverName,
  setReceiverName,
  address,
  setAddress,
  selectedExpedition,
  setSelectedExpedition,
  handleCompletePayment,
  EXPEDITIONS,
  PAYMENT_METHODS,
  PAYMENT_TAXES,
  discounts,
}) {
  const [productPrice, setProductPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        console.log("Fetching product details for Group Buy ID:", groupBuyId); // Log the groupBuyId
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/group-buys/${groupBuyId}/product`
        );
        console.log("API Response Status:", response.status); // Log the response status
        if (response.ok) {
          const data = await response.json();
          console.log("API Response Data:", data); // Log the response data
          setProductPrice(data.Price); // Set the product price
        } else {
          console.error("Failed to fetch product details.");
          setProductPrice(null);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setProductPrice(null);
      } finally {
        setLoading(false);
      }
    };

    if (groupBuyId) {
      fetchProductDetails();
    }
  }, [groupBuyId]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.error("Fetching product price timed out.");
        setLoading(false);
        setProductPrice(null);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeout);
  }, [loading]);

  const handlePayment = async () => {
    // Validate input fields
    if (
      !receiverName ||
      !address ||
      !selectedExpedition ||
      !selectedPaymentMethod
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const discountedPrice =
      productPrice - (productPrice * discounts[selectedParticipants]) / 100;

    const platformTax = (discountedPrice * 1.5) / 100;
    const paymentTax =
      (discountedPrice * (PAYMENT_TAXES[selectedPaymentMethod] || 0)) / 100;

    const totalAmount =
      discountedPrice + selectedExpedition.price + platformTax + paymentTax;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/group-buy/transaction`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            groupBuyId,
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
        const errorData = await response.json();
        alert(`Failed to complete payment: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error completing payment:", error);
      alert("An error occurred while completing the payment.");
    }
  };

  if (!isPaymentModalOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!productPrice) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <p>Failed to load product details. Please try again later.</p>
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 mt-4">
            Close
          </button>
        </div>
      </div>
    );
  }

  const discountedPrice =
    productPrice - (productPrice * discounts[selectedParticipants]) / 100;

  const platformTax = (discountedPrice * 1.5) / 100;
  const paymentTax =
    (discountedPrice * (PAYMENT_TAXES[selectedPaymentMethod] || 0)) / 100;

  const totalAmount =
    discountedPrice + selectedExpedition.price + platformTax + paymentTax;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Selesaikan Pembayaran</h2>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-semibold">Platform Tax (1.5%):</span> Rp.{" "}
          {platformTax.toLocaleString()}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-semibold">
            Payment Tax ({PAYMENT_TAXES[selectedPaymentMethod] || 0}% via{" "}
            {selectedPaymentMethod}):
          </span>{" "}
          Rp. {paymentTax.toLocaleString()}
        </p>
        <p className="text-sm text-gray-600 font-bold">
          <span className="font-semibold">Total Amount:</span> Rp.{" "}
          {totalAmount.toLocaleString()}
        </p>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Nama Penerima
          </label>
          <input
            type="text"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            placeholder="Enter receiver name"
          />

          <label className="block text-sm font-medium text-gray-700">
            Alamat Pengiriman
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            placeholder="Enter address"></textarea>

          <label className="block text-sm font-medium text-gray-700">
            Pilih Pengiriman
          </label>
          <select
            value={selectedExpedition.name}
            onChange={(e) =>
              setSelectedExpedition(
                EXPEDITIONS.find((exp) => exp.name === e.target.value)
              )
            }
            className="w-full border px-3 py-2 rounded-lg">
            {EXPEDITIONS.map((expedition) => (
              <option key={expedition.name} value={expedition.name}>
                {expedition.name} - Rp. {expedition.price.toLocaleString()}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium text-gray-700">
            Pilih Pembayaran
          </label>
          <select
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg">
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400">
            Batal
          </button>
          <button
            onClick={handlePayment}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
            Bayar
          </button>
        </div>
      </div>
    </div>
  );
}
