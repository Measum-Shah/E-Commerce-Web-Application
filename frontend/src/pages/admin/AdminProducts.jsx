import { useEffect, useRef, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { Pencil, Trash2, Plus, X, UploadCloud, ImageIcon, Star, Search } from "lucide-react";

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../../api/productApi";

import { getAllCategories } from "../../api/categoryApi";
import { uploadImage } from "../../api/uploadApi";
import { useAuth } from "../../context/AuthContext";

const initialForm = {
  name: "",
  description: "",
  category: "",
  brand: "",
  sku: "",
  condition: "used",
  price: "",
  stock: "",
  lowStockThreshold: 2,
  processor: "",
  ram: "",
  storage: "",
  display: "",
  warranty: "",
  isFeatured: false,
};

const AdminProducts = () => {
  const { token } = useAuth();
  const fileInputRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const [images, setImages] = useState([]);
  const [coverIndex, setCoverIndex] = useState(0);

  const [togglingFeatured, setTogglingFeatured] = useState(new Set());

  // ── filters
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  /* ── fetch ──────────────────────────────────────────── */
  const fetchData = async () => {
    try {
      const [productData, categoryData] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
      ]);
      setProducts(productData.products || productData.data || []);
      setCategories(categoryData.categories || categoryData.data || []);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ── filtered products ──────────────────────────────── */
  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (q && !p.name?.toLowerCase().includes(q)) return false;
      if (filterCategory && p.category?._id !== filterCategory) return false;
      return true;
    });
  }, [products, search, filterCategory]);

  const hasActiveFilters = search || filterCategory;

  const clearFilters = () => {
    setSearch("");
    setFilterCategory("");
  };

  /* ── form helpers ───────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData(initialForm);
    setImages([]);
    setCoverIndex(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── image handlers ─────────────────────────────────── */
  const handleImagePick = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      url: null,
    }));
    setImages((prev) => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (coverIndex >= updated.length) setCoverIndex(0);
      else if (coverIndex === index) setCoverIndex(0);
      return updated;
    });
  };

  const setCover = (index) => setCoverIndex(index);

  /* ── upload all new images to cloudinary ────────────── */
  const uploadAllImages = async () => {
    return await Promise.all(
      images.map(async (img) => {
        if (!img.file) return { ...img };
        const data = await uploadImage(img.file, token);
        return { ...img, url: data.data.url };
      })
    );
  };

  /* ── submit ─────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    try {
      setSubmitting(true);
      setUploading(true);
      toast.loading("Uploading images...", { id: "img-upload" });

      const uploadedImages = await uploadAllImages();
      setImages(uploadedImages);
      setUploading(false);
      toast.dismiss("img-upload");

      const finalImages = [
        uploadedImages[coverIndex]?.url || uploadedImages[coverIndex]?.preview,
        ...uploadedImages
          .filter((_, i) => i !== coverIndex)
          .map((img) => img.url || img.preview),
      ].filter(Boolean);

      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        brand: formData.brand,
        sku: formData.sku,
        condition: formData.condition,
        price: Number(formData.price),
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold),
        images: finalImages,
        specifications: {
          processor: formData.processor,
          ram: formData.ram,
          storage: formData.storage,
          display: formData.display,
        },
        warranty: formData.warranty,
        isFeatured: formData.isFeatured,
      };

      if (editingProduct) {
        const data = await updateProduct(editingProduct._id, payload, token);
        toast.success(data.message || "Product updated successfully");
      } else {
        const data = await createProduct(payload, token);
        toast.success(data.message || "Product created successfully");
      }

      resetForm();
      fetchData();
    } catch (error) {
      setUploading(false);
      toast.dismiss("img-upload");
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── edit ───────────────────────────────────────────── */
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      category: product.category?._id || "",
      brand: product.brand || "",
      sku: product.sku || "",
      condition: product.condition || "used",
      price: product.price || "",
      stock: product.stock || "",
      lowStockThreshold: product.lowStockThreshold || 2,
      processor: product.specifications?.processor || "",
      ram: product.specifications?.ram || "",
      storage: product.specifications?.storage || "",
      display: product.specifications?.display || "",
      warranty: product.warranty || "",
      isFeatured: product.isFeatured || false,
    });

    const existingImages = (product.images || []).map((url) => ({
      file: null,
      preview: url,
      url,
    }));
    setImages(existingImages);
    setCoverIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── delete ─────────────────────────────────────────── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const data = await deleteProduct(id, token);
      toast.success(data.message || "Product deleted successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  /* ── quick-toggle featured ──────────────────────────── */
  const handleToggleFeatured = async (product) => {
    setTogglingFeatured((prev) => new Set(prev).add(product._id));
    try {
      await updateProduct(product._id, { isFeatured: !product.isFeatured }, token);
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, isFeatured: !p.isFeatured } : p
        )
      );
      toast.success(
        !product.isFeatured
          ? `"${product.name}" added to featured`
          : `"${product.name}" removed from featured`
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update featured status");
    } finally {
      setTogglingFeatured((prev) => {
        const next = new Set(prev);
        next.delete(product._id);
        return next;
      });
    }
  };

  /* ── render ─────────────────────────────────────────── */
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="mb-10">
        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-velvet-light">
          Admin
        </p>
        <h1 className="font-display text-5xl sm:text-6xl italic tracking-tight">
          Products
        </h1>
      </div>

      {/* ── FORM ── */}
      <div className="mb-12 rounded-2xl sm:rounded-3xl border border-graphite-700 bg-graphite-800 p-5 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-3xl italic">
            {editingProduct ? "Edit Product" : "Create Product"}
          </h2>
          {editingProduct && (
            <button
              onClick={resetForm}
              className="rounded-xl border border-graphite-700 p-3 transition hover:border-error hover:text-red-300"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">

          {/* ── IMAGE UPLOAD SECTION ── */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-parchment-100/60">
                Product Images
                <span className="ml-2 text-xs text-parchment-100/40">
                  — first image or the one marked with ★ will be the cover
                </span>
              </p>
              <label
                htmlFor="product-images-input"
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-graphite-700 px-4 py-2 text-sm text-parchment-100/70 transition hover:border-velvet hover:text-parchment-50"
              >
                <UploadCloud size={16} />
                Add Images
              </label>
              <input
                ref={fileInputRef}
                id="product-images-input"
                type="file"
                accept="image/jpg,image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImagePick}
                className="hidden"
              />
            </div>

            {images.length === 0 ? (
              <label
                htmlFor="product-images-input"
                className="flex h-44 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-graphite-600 bg-graphite-900 transition hover:border-velvet"
              >
                <UploadCloud size={32} className="text-parchment-100/30" />
                <p className="text-sm text-parchment-100/50">
                  Click to upload product images
                </p>
                <p className="text-xs text-parchment-100/30">
                  JPG, PNG or WEBP — max 5 MB each — multiple allowed
                </p>
              </label>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`group relative overflow-hidden rounded-2xl border-2 transition ${
                      coverIndex === index ? "border-velvet" : "border-graphite-700"
                    }`}
                  >
                    <img
                      src={img.preview}
                      alt={`Product image ${index + 1}`}
                      className="h-36 w-full object-cover"
                    />
                    {coverIndex === index && (
                      <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-velvet px-2 py-1 text-xs font-medium text-parchment-50">
                        <Star size={10} fill="currentColor" />
                        Cover
                      </div>
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-graphite-900/75 opacity-0 transition group-hover:opacity-100">
                      {coverIndex !== index && (
                        <button
                          type="button"
                          onClick={() => setCover(index)}
                          className="flex items-center gap-1.5 rounded-lg bg-velvet px-3 py-1.5 text-xs font-medium text-parchment-50 transition hover:bg-velvet-light"
                        >
                          <Star size={12} />
                          Set as Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="flex items-center gap-1.5 rounded-lg border border-error px-3 py-1.5 text-xs text-red-300 transition hover:bg-error/20"
                      >
                        <X size={12} />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <label
                  htmlFor="product-images-input"
                  className="flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-graphite-600 bg-graphite-900 transition hover:border-velvet"
                >
                  <Plus size={22} className="text-parchment-100/30" />
                  <p className="text-xs text-parchment-100/40">Add more</p>
                </label>
              </div>
            )}
          </div>

          {/* ── TEXT FIELDS ── */}
          <input
            type="text"
            name="name"
            placeholder="Product name"
            value={formData.name}
            onChange={handleChange}
            required
            className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none focus:border-velvet"
          />

          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none focus:border-velvet"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none focus:border-velvet"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none focus:border-velvet"
          >
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="refurbished">Refurbished</option>
          </select>

          <input
            type="text"
            name="sku"
            placeholder="SKU"
            value={formData.sku}
            onChange={handleChange}
            required
            className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none focus:border-velvet"
          />

          <input
            type="text"
            name="warranty"
            placeholder="Warranty (e.g. 6 months)"
            value={formData.warranty}
            onChange={handleChange}
            className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none focus:border-velvet"
          />

          <input
            type="number"
            name="price"
            placeholder="Price (Rs.)"
            value={formData.price}
            onChange={handleChange}
            required
            className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none focus:border-velvet"
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock quantity"
            value={formData.stock}
            onChange={handleChange}
            required
            className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none focus:border-velvet"
          />

          <textarea
            name="description"
            placeholder="Product description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
            className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none focus:border-velvet md:col-span-2"
          />

          <p className="text-xs uppercase tracking-widest text-parchment-100/30 md:col-span-2">
            Specifications
          </p>

          <input
            type="text"
            name="processor"
            placeholder="Processor"
            value={formData.processor}
            onChange={handleChange}
            className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none focus:border-velvet"
          />

          <input
            type="text"
            name="ram"
            placeholder="RAM"
            value={formData.ram}
            onChange={handleChange}
            className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none focus:border-velvet"
          />

          <input
            type="text"
            name="storage"
            placeholder="Storage"
            value={formData.storage}
            onChange={handleChange}
            className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none focus:border-velvet"
          />

          <input
            type="text"
            name="display"
            placeholder="Display"
            value={formData.display}
            onChange={handleChange}
            className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none focus:border-velvet"
          />

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 transition hover:border-velvet">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="accent-velvet"
            />
            Mark as Featured
          </label>

          <button
            type="submit"
            disabled={submitting || uploading}
            className="flex items-center justify-center gap-2 rounded-xl bg-velvet px-6 py-4 font-medium text-parchment-50 transition hover:bg-velvet-light active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 md:w-fit"
          >
            <Plus size={18} />
            {uploading
              ? "Uploading images..."
              : submitting
              ? "Saving..."
              : editingProduct
              ? "Update Product"
              : "Create Product"}
          </button>
        </form>
      </div>

      {/* ── SEARCH + FILTER BAR ── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-parchment-100/40 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name…"
            className="w-full rounded-xl border border-graphite-700 bg-graphite-800 py-3 pl-10 pr-10 text-sm text-parchment-50 placeholder:text-parchment-100/30 outline-none transition focus:border-velvet"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-parchment-100/40 hover:text-parchment-50 transition"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* category filter */}
        <div className="relative sm:w-56">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={`w-full appearance-none rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-velvet ${
              filterCategory
                ? "border-velvet bg-velvet/10 text-parchment-50"
                : "border-graphite-700 bg-graphite-800 text-parchment-100/60"
            }`}
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {/* custom caret */}
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-parchment-100/40"
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {/* clear all */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 rounded-xl border border-graphite-700 px-4 py-3 text-sm text-parchment-100/60 transition hover:border-velvet hover:text-parchment-50 active:scale-95"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      {/* results count */}
      <p className="mb-6 text-sm text-parchment-100/40">
        {filteredProducts.length === products.length
          ? `${products.length} product${products.length !== 1 ? "s" : ""}`
          : `${filteredProducts.length} of ${products.length} products`}
      </p>

      {/* ── PRODUCT LIST ── */}
      {loading ? (
        <div className="flex justify-center py-20 text-parchment-100/50">
          Loading products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-10 text-center text-parchment-100/60">
          {hasActiveFilters ? "No products match your filters." : "No products found."}
        </div>
      ) : (
        <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="overflow-hidden rounded-2xl sm:rounded-3xl border border-graphite-700 bg-graphite-800"
            >
              <div className="relative">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center bg-graphite-900 text-parchment-100/20">
                    <ImageIcon size={40} />
                  </div>
                )}

                {product.images?.length > 1 && (
                  <span className="absolute bottom-3 right-3 rounded-full bg-graphite-900/80 px-2.5 py-1 text-xs text-parchment-100/70 backdrop-blur">
                    +{product.images.length - 1} more
                  </span>
                )}

                {product.isFeatured && (
                  <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-velvet px-2.5 py-1 text-xs font-medium text-parchment-50">
                    <Star size={10} fill="currentColor" />
                    Featured
                  </div>
                )}
              </div>

              <div className="p-5 sm:p-6">
                <p className="text-sm text-parchment-100/50">{product.brand}</p>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl italic tracking-tight">
                  {product.name}
                </h2>
                <p className="mt-0.5 text-xs text-parchment-100/40">
                  {product.category?.name}
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xl font-medium">
                    Rs. {product.price?.toLocaleString()}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      product.stock > 0
                        ? "bg-success/20 text-green-300"
                        : "bg-error/20 text-red-300"
                    }`}
                  >
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex items-center gap-2 rounded-xl border border-graphite-700 px-4 py-2.5 text-sm transition hover:border-velvet active:scale-95"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex items-center gap-2 rounded-xl border border-error px-4 py-2.5 text-sm text-red-300 transition hover:bg-error/20 active:scale-95"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>

                  <button
                    onClick={() => handleToggleFeatured(product)}
                    disabled={togglingFeatured.has(product._id)}
                    className={`ml-auto flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm transition disabled:opacity-50 active:scale-95 ${
                      product.isFeatured
                        ? "border-velvet bg-velvet/10 text-velvet-light hover:bg-error/10 hover:border-error hover:text-red-300"
                        : "border-graphite-700 text-parchment-100/50 hover:border-velvet hover:text-velvet-light"
                    }`}
                    title={product.isFeatured ? "Remove from featured" : "Add to featured"}
                  >
                    <Star size={14} fill={product.isFeatured ? "currentColor" : "none"} />
                    {togglingFeatured.has(product._id)
                      ? "..."
                      : product.isFeatured
                      ? "Featured"
                      : "Feature"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default AdminProducts;