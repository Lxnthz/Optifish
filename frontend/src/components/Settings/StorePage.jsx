import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function StorePage({ user, handleRoleUpgradeRequest }) {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    quantity: "",
    photo: null, // Add photo field
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

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

  // Fetch products created by the logged-in user
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/products?user_id=${user.id}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched products:", data);
          setProducts(data);
        } else {
          console.error("Failed to fetch products:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (user?.id) {
      fetchProducts();
    }
  }, [user]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Handle photo upload
  const handlePhotoChange = (e) => {
    setNewProduct({ ...newProduct, photo: e.target.files[0] });
  };

  // Handle adding a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("category", newProduct.category);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("quantity", newProduct.quantity);
    if (newProduct.photo) {
      formData.append("photo", newProduct.photo);
    }
    formData.append("user_id", user.id);

    try {
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const addedProduct = await response.json();
        setProducts([...products, addedProduct]);
        setNewProduct({
          name: "",
          category: "",
          price: "",
          description: "",
          quantity: "",
          photo: null,
        });
        setIsModalOpen(false); // Close the modal
        alert("Product added successfully!");
      } else {
        alert("Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while adding the product.");
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setProducts(products.filter((product) => product.id !== productId));
        alert("Product deleted successfully!");
      } else {
        alert("Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product.");
    }
  };

  if (!user.is_seller) {
    return (
      <div className="relative flex items-center justify-center min-h-[300px] bg-gray-100 rounded-lg">
        <button
          onClick={() => handleRoleUpgradeRequest("seller")}
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">
          Become a Seller
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex w-full gap-x-2">
        <h2 className="md:text-xl text-white w-full font-bold mb-4 py-2 px-3 rounded-xl bg-blue-500">
          Dashboard Toko Anda
        </h2>
        <div className="">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 flex items-center justify-center text-white py-2 px-4 rounded-xl text-center align-middle cursor-pointer hover:bg-blue-600 md:text-xl">
            +
          </button>
        </div>
      </div>
      {/* Product List */}
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-4 text-center border-b-1 py-2">
          Produk Anda
        </h3>
        {products.length > 0 ? (
          <ul className="space-y-2">
            {products.map((product) => (
              <li
                key={product.id}
                className="p-4 rounded-lg flex flex-col lg:flex-row lg:items-center lg:justify-between inset-shadow-sm shadow-sm bg-gray-100">
                {/* Product Image and Info */}
                <div className="flex flex-col md:flex-row items-center gap-y-2 md:gap-x-4 w-full">
                  <img
                    src={`${API_BASE_URL}${product.photo}`} // Construct full URL
                    alt={product.name}
                    className="w-40 h-30 object-cover rounded-lg items-start shadow-md"
                    crossOrigin="anonymous" // Ensure CORS is handled if needed
                  />
                  <div className="flex flex-col gap-y-1 font-normal w-full">
                    <h4 className="text-md border-b-1 font-bold w-full text-center text-black py-2 lg:w-auto lg:text-left lg:px-4 flex-1">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-700 bg-cyan-200 rounded-lg py-2 text-center min-w-full">
                      {product.category}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-bold">Harga:</span> Rp.{" "}
                      {product.price}
                    </p>
                    <p className="text-sm text-gray-700" style={{ whiteSpace: "pre-wrap"  }}>
                      <span className="font-bold">Deskripsi:</span>{" "}
                      {product.description}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-bold">Kuantitas:</span>{" "}
                      {product.quantity}
                    </p>
                  </div>
                  <div className="flex text-sm gap-x-2 mt-4 lg:mt-0 lg:ml-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-[400] text-gray-700 text-sm text-center">
            Anda Tidak Memiliki Produk!
          </p>
        )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-2"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}>
              <h3 className="text-xl font-bold mb-4">Add New Product</h3>
              <form
                onSubmit={handleAddProduct}
                className="space-y-4 font-light">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded-lg"
                    required>
                    <option value="" disabled>
                      Pilih satu kategori
                    </option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Harga
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Deskripsi Produk
                  </label>
                  <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded-lg"
                    required></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Kuantitas
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Foto Produk
                  </label>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="w-full border px-3 py-2 rounded-lg"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                    Add Product
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-2"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}>
              <h3 className="text-xl font-bold mb-4">Edit Product</h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData();
                  formData.append("name", editProduct.name);
                  formData.append("category", editProduct.category);
                  formData.append("price", editProduct.price);
                  formData.append("description", editProduct.description);
                  formData.append("quantity", editProduct.quantity);
                  if (editProduct.photo instanceof File) {
                    formData.append("photo", editProduct.photo);
                  }

                  try {
                    const response = await fetch(
                      `${API_BASE_URL}/api/products/${editProduct.id}`,
                      {
                        method: "PUT",
                        body: formData,
                      }
                    );

                    if (response.ok) {
                      const updatedProduct = await response.json();
                      setProducts(
                        products.map((product) =>
                          product.id === updatedProduct.id
                            ? updatedProduct
                            : product
                        )
                      );
                      setIsEditModalOpen(false);
                      alert("Product updated successfully!");
                    } else {
                      alert("Failed to update product.");
                    }
                  } catch (error) {
                    console.error("Error updating product:", error);
                    alert("An error occurred while updating the product.");
                  }
                }}
                className="space-y-4 font-light">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editProduct.name}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, name: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={editProduct.category}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        category: e.target.value,
                      })
                    }
                    className="w-full border px-3 py-2 rounded-lg"
                    required>
                    <option value="" disabled>
                      Pilih satu kategori
                    </option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Harga
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editProduct.price}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, price: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Deskripsi Produk
                  </label>
                  <textarea
                    name="description"
                    value={editProduct.description}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        description: e.target.value,
                      })
                    }
                    className="w-full border px-3 py-2 rounded-lg"
                    required></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Kuantitas
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={editProduct.quantity}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        quantity: e.target.value,
                      })
                    }
                    className="w-full border px-3 py-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Foto Produk
                  </label>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        photo: e.target.files[0],
                      })
                    }
                    className="w-full border px-3 py-2 rounded-lg"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
