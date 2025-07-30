import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilter } from "react-icons/fa";

export default function MobileFilter({ filters, setFilters, applyFilters }) {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    "Desinfektan & pengendalian air",
    "Mineral balance products",
    "Antiparasit",
    "Imunostimulan & Vaksin",
    "Pakan",
    "Premiks dan feed additive",
    "Probiotik & herbal",
    "Antibiotik",
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handlePriceRangeChange = (e, index) => {
    const newRange = [...filters.priceRange];
    newRange[index] = Number(e.target.value);
    setFilters({ ...filters, priceRange: newRange });
  };

  const resetFilters = () => {
    setFilters({
      name: "",
      category: "",
      priceRange: [0, 10000000],
      rating: 0,
    });
    applyFilters(); // Call applyFilters to reset the filtered products list
  };

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 bg-blue-500 text-white py-2 px-4 rounded-full shadow-lg z-50 hover:bg-blue-600">
        <FaFilter className="w-5 h-5" />
      </button>

      {/* Sliding Filter Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <motion.div
              className="bg-white w-full rounded-t-lg p-4 shadow-lg"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3 }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Filter Produk</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700">
                  Tutup
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-y-1">
                  <label className="block text-sm font-medium">Nama</label>
                  <input
                    type="text"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    className="w-full border px-3 py-1 text-sm rounded-lg font-[400] focus:bg-white focus:text-black"
                  />
                </div>
                <div className="flex flex-col gap-y-1">
                  <label className="block text-sm font-medium">Kategori</label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full border px-3 py-1 text-sm rounded-lg font-[400] focus:bg-white focus:text-black">
                    <option value="">Semua Kategori</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-y-1">
                  <label className="block text-sm font-medium">
                    Rentang Harga
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(e, 0)}
                      placeholder="Harga Min"
                      className="w-1/2 border px-3 py-1 text-sm rounded-lg font-[400] focus:bg-white focus:text-black"
                    />
                    <input
                      type="number"
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(e, 1)}
                      placeholder="Harga Max"
                      className="w-1/2 border px-3 py-1 text-sm rounded-lg font-[400] focus:bg-white focus:text-black"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-y-1">
                  <label className="block text-sm font-medium">Rating</label>
                  <input
                    type="number"
                    name="rating"
                    value={filters.rating}
                    onChange={handleFilterChange}
                    placeholder="Rating Min"
                    className="w-full border px-3 py-1 text-sm rounded-lg font-[400] focus:bg-white focus:text-black"
                    min="0"
                    max="5"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={resetFilters}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400">
                  Reset
                </button>
                <button
                  onClick={() => {
                    applyFilters();
                    setIsOpen(false);
                  }}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                  Terapkan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
