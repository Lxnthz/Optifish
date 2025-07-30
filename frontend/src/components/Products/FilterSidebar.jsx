import React from "react";

export default function FilterSidebar({ filters, setFilters, applyFilters }) {
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
    <div className="hidden lg:block lg:w-full xl:w-full bg-gradient-to-tr from-[#004499] to-[#0071FF] text-white shadow-md rounded-lg p-4 sticky top-5 h-[calc(100vh-40px)]">
      <div>
        <h3 className="text-lg font-bold mb-4">Filter Produk</h3>
        <div className="space-y-4">
          <div className="flex flex-col gap-y-1">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              className="w-full border px-3 py-1 text-sm rounded-lg font-[400] focus:bg-white focus:text-black"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <label className="block text-sm font-medium">Category</label>
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
            <label className="block text-sm font-medium">Price Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceRangeChange(e, 0)}
                placeholder="Min Price"
                className="w-1/2 border px-3 py-1 text-sm rounded-lg font-[400] focus:bg-white focus:text-black"
              />
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange(e, 1)}
                placeholder="Max Price"
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
              placeholder="Min Rating"
              className="w-full border px-3 py-1 text-sm rounded-lg font-[400] focus:bg-white focus:text-black"
              min="0"
              max="5"
            />
          </div>
        </div>
        <button
          onClick={applyFilters}
          className="mt-4 bg-[#CAA300] text-white py-2 px-4 rounded-lg hover:bg-white hover:text-[#CAA300] hover:ring-2 cursor-pointer ring-[#CAA300] w-full text-sm">
          Apply Filters
        </button>
        <button
          onClick={resetFilters}
          className="mt-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 cursor-pointer w-full text-sm">
          Reset Filters
        </button>
      </div>
    </div>
  );
}
