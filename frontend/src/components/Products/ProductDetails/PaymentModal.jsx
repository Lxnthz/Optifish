export default function PaymentModal({
  isPaymentModalOpen,
  setIsPaymentModalOpen,
  product,
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
  if (!isPaymentModalOpen) return null;

  const discountedPrice =
    product.price - (product.price * discounts[selectedParticipants]) / 100;

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
            onClick={() => handleCompletePayment(totalAmount)}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
            Bayar
          </button>
        </div>
      </div>
    </div>
  );
}
