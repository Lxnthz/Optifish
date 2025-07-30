import React, { useState, useEffect } from "react";

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

export default function Keranjang({ userId }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedExpedition, setSelectedExpedition] = useState(EXPEDITIONS[0]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    PAYMENT_METHODS[0]
  );
  const [receiverName, setReceiverName] = useState("");
  const [address, setAddress] = useState("");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (!userId) {
      console.error("User ID is undefined. Cannot fetch cart items.");
      setLoading(false);
      return;
    }

    const fetchCartItems = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/cart/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
          calculateTotalPrice(data);
        } else {
          console.error("Failed to fetch cart items:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId]);

  const calculateTotalPrice = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/${itemId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const updatedCart = cartItems.filter((item) => item.item_id !== itemId);
        setCartItems(updatedCart);
        calculateTotalPrice(updatedCart);
        alert("Item removed from cart.");
      } else {
        console.error("Failed to remove item:", response.statusText);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      alert("Quantity must be at least 1.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        const updatedCart = cartItems.map((item) =>
          item.item_id === itemId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCart);
        calculateTotalPrice(updatedCart);
      } else {
        console.error("Failed to update quantity:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleApplyCoupon = () => {
    if (coupon === "DISCOUNT10") {
      setDiscount(totalPrice * 0.1); // 10% discount
      alert("Coupon applied successfully!");
    } else {
      setDiscount(0);
      alert("Invalid coupon code.");
    }
  };

  const handleCompleteTransaction = async () => {
    if (!receiverName || !address) {
      alert("Please fill in the receiver's name and address.");
      return;
    }

    const transactionData = {
      userId,
      receiverName,
      address,
      expedition: selectedExpedition.name,
      expeditionCost: selectedExpedition.price,
      paymentMethod: selectedPaymentMethod,
      paymentTax:
        (totalPrice * (PAYMENT_TAXES[selectedPaymentMethod] || 0)) / 100,
      platformTax: (totalPrice * 1.5) / 100,
      discount,
      totalAmount: grandTotal,
      loyaltyPoints,
      tag: "Personal",
      productIds: cartItems.map((item) => item.product_id), // Ensure product IDs are included
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        alert("Transaction completed successfully!");
        setCartItems([]); // Clear the cart
        setReceiverName("");
        setAddress("");
        setCoupon("");
        setDiscount(0);
      } else {
        const errorData = await response.json();
        alert(`Failed to complete transaction: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error completing transaction:", error);
      alert("An error occurred while completing the transaction.");
    }
  };

  const expeditionCost = selectedExpedition.price;
  const platformTax = (totalPrice * 1.5) / 100;
  const paymentTax =
    (totalPrice * (PAYMENT_TAXES[selectedPaymentMethod] || 0)) / 100;
  const grandTotal =
    totalPrice + expeditionCost + platformTax + paymentTax - discount;

  const loyaltyPoints = Math.floor(grandTotal / 100000) * 10; // 10 points per 100k spent

  if (loading) {
    return <p>Loading cart...</p>;
  }

  return (
    <div className="p-5 mt-20 flex flex-col lg:flex-row gap-8 min-h-screen">
      {/* Cart Items Section */}
      <div className="flex-1 bg-white p-5 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Keranjang Anda</h1>
        {cartItems.length > 0 ? (
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item.item_id}
                className="flex flex-col sm:flex-row items-center justify-between border p-4 rounded-lg shadow-sm gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={`${API_BASE_URL}${item.photo}`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    crossOrigin="anonymous"
                  />
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p>Rp. {item.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Quantity Changer */}
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.item_id, item.quantity - 1)
                      }
                      className="bg-gray-200 text-gray-700 px-3 py-1 hover:bg-gray-300">
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(
                          item.item_id,
                          Number(e.target.value)
                        )
                      }
                      className="w-12 text-center border-l border-r"
                    />
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.item_id, item.quantity + 1)
                      }
                      className="bg-gray-200 text-gray-700 px-3 py-1 hover:bg-gray-300">
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.item_id)}
                    className="text-red-500 hover:underline">
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Keranjang kosong.</p>
        )}
      </div>

      {/* Purchase Summary Section */}
      <div className="w-full h-fit lg:w-1/3 bg-white p-5 rounded-lg shadow-sm inset-shadow-sm">
        <h2 className="text-xl font-bold mb-4">Ringkasan Pembelian</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Penerima
            </label>
            <input
              type="text"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
              placeholder="Masukkan nama penerima"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Lengkap
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
              placeholder="Masukkan alamat lengkap"></textarea>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Subtotal</p>
            <p className="font-bold">Rp. {totalPrice.toLocaleString()}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">
              Ongkos Kirim ({selectedExpedition.name})
            </p>
            <p className="font-bold">Rp. {expeditionCost.toLocaleString()}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Platform Tax (1.5%)</p>
            <p className="font-bold">Rp. {platformTax.toLocaleString()}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">
              Payment Tax ({PAYMENT_TAXES[selectedPaymentMethod] || 0}% via{" "}
              {selectedPaymentMethod})
            </p>
            <p className="font-bold">Rp. {paymentTax.toLocaleString()}</p>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <p className="text-gray-600">Diskon</p>
              <p className="font-bold text-green-600">
                -Rp. {discount.toLocaleString()}
              </p>
            </div>
          )}
          <div className="border-t pt-4 flex justify-between">
            <p className="text-lg font-bold">Total</p>
            <p className="text-lg font-bold text-blue-600">
              Rp. {grandTotal.toLocaleString()}
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pilih Ekspedisi
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pilih Metode Pembayaran
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kode Kupon
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                  placeholder="Masukkan kode kupon"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Terapkan
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-600">Loyalty Points Earned</p>
            <p className="font-bold text-green-600">{loyaltyPoints} Points</p>
          </div>
          <button
            onClick={handleCompleteTransaction}
            className="transition-all duration-300 bg-gradient-to-r from-[#0071FF] to-[#004499] text-white hover:scale-101 py-2 px-4 cursor-pointer rounded-xl w-full ring-1 ring-[#0071FF]">
            Lanjutkan ke Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
}
