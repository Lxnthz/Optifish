export default function ProductImage({ product }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  return (
    <img
      src={`${API_BASE_URL}${product.photo}`}
      alt={product.name}
      className="w-full h-64 md:h-80 object-cover rounded-lg mb-4"
      crossOrigin="anonymous"
    />
  );
}
