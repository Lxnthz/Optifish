import { FaStar } from "react-icons/fa";

export default function ProductDetails({ product, averageRating, reviews }) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-700 bg-cyan-100 w-fit px-2 py-1 rounded-lg">
        {product.category}
      </p>
      <p className="text-md text-gray-700 w-full border-b-1 border-gray-300 pb-2">
        Rp. {product.price.toLocaleString()}
      </p>
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`text-md ${
                star <= Math.round(averageRating)
                  ? "text-yellow-500"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600">
          {averageRating.toFixed(1)} / 5 ({reviews.length} reviews)
        </p>
      </div>
      <p className="text-sm text-black flex flex-col gap-y-1">
        <span className="font-bold">Deskripsi Produk</span>
        <span className="font-medium">{product.description}</span>
      </p>
    </div>
  );
}
