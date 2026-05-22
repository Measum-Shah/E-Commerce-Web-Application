import { useEffect, useState } from "react";
import { useLoader } from "../context/LoaderContext";

import { getAllProducts } from "../api/productApi";
import { getAllCategories } from "../api/categoryApi";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");

  const { withLoader, loading } = useLoader();

  const fetchData = async () => {
    await withLoader(async () => {
      try {
        const productData = await getAllProducts();
        const categoryData = await getAllCategories();

        setProducts(productData.products || productData.data || []);
        setCategories(categoryData.categories || categoryData.data || []);
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(search.toLowerCase()) ||
      product.brand?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      product.category?._id === selectedCategory ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12">
        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-velvet-light">
          Collection
        </p>

        <h1 className="font-display text-6xl italic tracking-tight">
          Shop premium tech
        </h1>

        <p className="mt-4 max-w-2xl text-parchment-100/70">
          Browse laptops, computers, and accessories with a clean professional buying experience.
        </p>
      </div>

      <div className="mb-10 grid gap-4 rounded-2xl border border-graphite-700 bg-graphite-800 p-5 md:grid-cols-2">
        <input
          type="text"
          placeholder="Search by product or brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none transition focus:border-velvet"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none transition focus:border-velvet"
        >
          <option value="all">All Categories</option>

          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {!loading && filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-graphite-700 bg-graphite-800 p-10 text-center text-parchment-100/60">
          No products found.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Products;