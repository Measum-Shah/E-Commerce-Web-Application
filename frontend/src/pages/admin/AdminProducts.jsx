import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Pencil,
  Trash2,
  Plus,
  X,
} from "lucide-react";

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../../api/productApi";

import { getAllCategories } from "../../api/categoryApi";

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
  image: "",
  processor: "",
  ram: "",
  storage: "",
  display: "",
  warranty: "",
  isFeatured: false,
};

const AdminProducts = () => {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [formData, setFormData] =
    useState(initialForm);

  const fetchData = async () => {
    try {
      const productData = await getAllProducts();
      const categoryData =
        await getAllCategories();

      setProducts(
        productData.products ||
          productData.data ||
          []
      );

      setCategories(
        categoryData.categories ||
          categoryData.data ||
          []
      );
    } catch (error) {
      console.log(
        error.response?.data?.message ||
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        brand: formData.brand,
        sku: formData.sku,
        condition: formData.condition,
        price: Number(formData.price),
        stock: Number(formData.stock),
        lowStockThreshold: Number(
          formData.lowStockThreshold
        ),
        images: [formData.image],
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
        const data = await updateProduct(
          editingProduct._id,
          payload,
          token
        );

        toast.success(
          data.message ||
            "Product updated successfully"
        );
      } else {
        const data = await createProduct(
          payload,
          token
        );

        toast.success(
          data.message ||
            "Product created successfully"
        );
      }

      resetForm();
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      description:
        product.description || "",
      category:
        product.category?._id || "",
      brand: product.brand || "",
      sku: product.sku || "",
      condition:
        product.condition || "used",
      price: product.price || "",
      stock: product.stock || "",
      lowStockThreshold:
        product.lowStockThreshold || 2,
      image: product.images?.[0] || "",
      processor:
        product.specifications?.processor ||
        "",
      ram:
        product.specifications?.ram || "",
      storage:
        product.specifications?.storage ||
        "",
      display:
        product.specifications?.display ||
        "",
      warranty: product.warranty || "",
      isFeatured:
        product.isFeatured || false,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this product?"
    );

    if (!confirmed) return;

    try {
      const data = await deleteProduct(
        id,
        token
      );

      toast.success(
        data.message ||
          "Product deleted successfully"
      );

      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12">
        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-velvet-light">
          Admin
        </p>

        <h1 className="font-display text-6xl italic tracking-tight">
          Products
        </h1>
      </div>

      <div className="mb-12 rounded-3xl border border-graphite-700 bg-graphite-800 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-3xl italic">
            {editingProduct
              ? "Edit Product"
              : "Create Product"}
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

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 md:grid-cols-2"
        >
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
            <option value="">
              Select Category
            </option>

            {categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.name}
              </option>
            ))}
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
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none focus:border-velvet"
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            required
            className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none focus:border-velvet"
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            required
            className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none focus:border-velvet md:col-span-2"
          />

          <textarea
            name="description"
            placeholder="Product description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            required
            className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none focus:border-velvet md:col-span-2"
          />

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

          <input
            type="text"
            name="warranty"
            placeholder="Warranty"
            value={formData.warranty}
            onChange={handleChange}
            className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none focus:border-velvet"
          />

          <label className="flex items-center gap-3 rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />

            Featured Product
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-xl bg-velvet px-6 py-4 font-medium text-parchment-50 transition hover:bg-velvet-light active:scale-[0.98] md:w-fit"
          >
            <Plus size={18} />

            {submitting
              ? "Please wait..."
              : editingProduct
              ? "Update Product"
              : "Create Product"}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          Loading...
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-10 text-center text-parchment-100/60">
          No products found.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="overflow-hidden rounded-3xl border border-graphite-700 bg-graphite-800"
            >
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="h-64 w-full object-cover"
              />

              <div className="p-6">
                <p className="text-sm text-parchment-100/60">
                  {product.brand}
                </p>

                <h2 className="mt-1 font-display text-3xl italic tracking-tight">
                  {product.name}
                </h2>

                <p className="mt-4 text-xl font-medium">
                  Rs.{" "}
                  {product.price?.toLocaleString()}
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() =>
                      handleEdit(product)
                    }
                    className="flex items-center gap-2 rounded-xl border border-graphite-700 px-4 py-3 text-sm transition hover:border-velvet"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(product._id)
                    }
                    className="flex items-center gap-2 rounded-xl border border-error px-4 py-3 text-sm text-red-300 transition hover:bg-error/20"
                  >
                    <Trash2 size={16} />
                    Delete
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