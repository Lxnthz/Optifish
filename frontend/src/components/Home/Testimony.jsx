import { FaQuoteLeft } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";

export default function Testimony() {
  const [testimonies, setTestimonies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    job: "",
    message: "",
  });
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchTestimonies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/testimonies`);
        if (response.ok) {
          const data = await response.json();
          setTestimonies(data);
        } else {
          console.error("Failed to fetch testimonies:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching testimonies:", error);
      }
    };

    fetchTestimonies();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm({ ...reviewForm, [name]: value });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/testimonies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      });

      if (response.ok) {
        alert("Terima kasih atas ulasan Anda!");
        setReviewForm({ name: "", job: "", message: "" });
        setIsModalOpen(false);
        // Refresh testimonies
        const updatedResponse = await fetch(`${API_BASE_URL}/api/testimonies`);
        const updatedData = await updatedResponse.json();
        setTestimonies(updatedData);
      } else {
        alert("Gagal mengirim ulasan. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Terjadi kesalahan saat mengirim ulasan.");
    }
  };

  return (
    <div className="mx-5 md:mx-13">
      <div className="flex gap-x-5 items-center mb-4">
        <h1 className="text-lg md:text-2xl font-bold text-left">
          Testimoni & Cerita Pembudidaya
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm">
          Ulas
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {testimonies.map((testimony, index) => (
          <div
            key={index}
            className="p-4 flex flex-col rounded-lg inset-shadow-sm shadow-sm bg-white hover:shadow-xl transition-shadow duration-300 gap-y-10 justify-between min-h-[30rem]">
            <div className="flex flex-col items-start mb-5 gap-y-5 xl:gap-y-10">
              <FaQuoteLeft className="text-black text-3xl mb-2" />
              <p className="text-black font-[400] text-lg xl:text-xl mb-3">
                {testimony.message}
              </p>
            </div>
            <div className="flex items-center">
              <CgProfile className="text-black text-4xl" />
              <div className="flex flex-col ml-3">
                <h3 className="text-lg font-bold">{testimony.name}</h3>
                <p className="text-sm text-gray-500">{testimony.job}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Tulis Ulasan
            </h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">Nama</label>
                <input
                  type="text"
                  name="name"
                  value={reviewForm.name}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 text-gray-800"
                  placeholder="Masukkan nama Anda"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">
                  Pekerjaan
                </label>
                <input
                  type="text"
                  name="job"
                  value={reviewForm.job}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 text-gray-800"
                  placeholder="Masukkan pekerjaan Anda"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">
                  Pesan
                </label>
                <textarea
                  name="message"
                  value={reviewForm.message}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 text-gray-800"
                  placeholder="Tulis pesan Anda"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400">
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                  Kirim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
