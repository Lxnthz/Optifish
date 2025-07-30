export default function ProductHeader({ product, onClose }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-bold">{product.name}</h3>
      <button
        onClick={onClose}
        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 text-xs">
        Tutup
      </button>
    </div>
  );
}
