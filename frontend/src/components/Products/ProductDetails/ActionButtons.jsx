import { FaCartPlus } from "react-icons/fa";

export default function ActionButtons({
  product,
  onAddToCart,
  setIsModalOpen,
  loading,
}) {
  return (
    <div className="flex justify-between mt-4 items-center">
      <div className="text-white py-2 px-4 text-xs flex w-full justify-center gap-x-2">
        <button
          onClick={() => onAddToCart(product)}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 text-xs flex gap-x-1">
          <FaCartPlus className="text-sm" />
          Keranjang
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          disabled={loading}>
          {loading ? "Starting Group Buy..." : "Ajukan Group Buy"}
        </button>
      </div>
    </div>
  );
}
