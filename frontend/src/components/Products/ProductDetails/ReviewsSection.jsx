import { FaStar } from "react-icons/fa";

export default function ReviewsSection({ reviews }) {
  return (
    <div className="mt-6">
      <h4 className="text-lg font-bold mb-2">Review Terakhir</h4>
      {reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.slice(0, 3).map((review, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-3">
              <p className="text-sm font-bold text-gray-800">
                {review.reviewer_name}
              </p>
              <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`text-sm ${
                      star <= review.stars ? "text-yellow-500" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">{review.message}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          Belum ada review untuk produk ini.
        </p>
      )}
    </div>
  );
}
