import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FilterSidebar from "../components/Products/FilterSidebar";
import ProductGrid from "../components/Products/ProductGrid";
import ProductDetail from "../components/Products/ProductDetail";
import MobileFilter from "../components/Products/MobileFilter";
import MobileDetail from "../components/Products/MobileDetail"; // Import MobileDetail

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    priceRange: [0, 10000000],
    rating: 0,
  });
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false); // Track if MobileDetail is open
  const [isMobile, setIsMobile] = useState(false); // Track if the device is mobile

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/all`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          setFilteredProducts(data); // Initialize filtered products
        } else {
          console.error("Failed to fetch products:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Detect if the device is mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024); // Mobile if width <= 1024px
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const applyFilters = () => {
    const filtered = products.filter((product) => {
      const matchesName = product.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());
      const matchesCategory =
        !filters.category || product.category === filters.category;
      const matchesPrice =
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1];
      const matchesRating = product.rating >= filters.rating;

      return matchesName && matchesCategory && matchesPrice && matchesRating;
    });

    setFilteredProducts(filtered);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    if (isMobile) {
      setIsMobileDetailOpen(true); // Open MobileDetail for mobile
    }
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
    setIsMobileDetailOpen(false); // Close MobileDetail
  };

  const handleAddToCart = (product) => {
    alert(`Produk "${product.name}" telah ditambahkan ke keranjang.`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 lg:mt-20 flex flex-col lg:flex-row gap-6 w-full">
      {/* Sidebar for Filters */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-1/5">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          applyFilters={applyFilters}
        />
      </motion.div>

      {/* Product Grid */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 w-full">
        <ProductGrid
          products={filteredProducts}
          handleProductClick={handleProductClick}
        />

        {/* Product Detail Viewport for Desktop */}
        {!isMobile && (
          <div className="hidden lg:block lg:w-1/2 inset-shadow-sm shadow-md rounded-md p-4">
            {selectedProduct ? (
              <ProductDetail
                product={selectedProduct}
                onClose={handleCloseDetail}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <h2 className="text-lg font-bold">
                  Pilih Produk untuk melihat detail
                </h2>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Filter */}
      <div className="block lg:hidden w-full">
        <MobileFilter
          filters={filters}
          setFilters={setFilters}
          applyFilters={applyFilters}
        />
      </div>

      {/* Mobile Detail */}
      {isMobile && (
        <MobileDetail
          product={selectedProduct}
          isOpen={isMobileDetailOpen}
          onClose={handleCloseDetail}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
