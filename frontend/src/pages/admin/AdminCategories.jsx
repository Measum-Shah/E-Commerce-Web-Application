import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Pencil,
  Trash2,
  X,
  Plus,
} from "lucide-react";

import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../../api/categoryApi";

import { useAuth } from "../../context/AuthContext";

const initialForm = {
  name: "",
  description: "",
  image: "",
};

const AdminCategories = () => {
  const { token } = useAuth();

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [formData, setFormData] =
    useState(initialForm);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();

      setCategories(
        data.categories || data.data || []
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
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      if (editingCategory) {
        const data = await updateCategory(
          editingCategory._id,
          formData,
          token
        );

        toast.success(
          data.message ||
            "Category updated successfully"
        );
      } else {
        const data = await createCategory(
          formData,
          token
        );

        toast.success(
          data.message ||
            "Category created successfully"
        );
      }

      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name || "",
      description:
        category.description || "",
      image: category.image || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this category?"
    );

    if (!confirmed) return;

    try {
      const data = await deleteCategory(
        id,
        token
      );

      toast.success(
        data.message ||
          "Category deleted successfully"
      );

      fetchCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete category"
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
          Categories
        </h1>
      </div>

      <div className="mb-10 rounded-3xl border border-graphite-700 bg-graphite-800 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-3xl italic">
            {editingCategory
              ? "Edit Category"
              : "Create Category"}
          </h2>

          {editingCategory && (
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
            placeholder="Category name"
            value={formData.name}
            onChange={handleChange}
            required
            className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none transition focus:border-velvet"
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            required
            className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none transition focus:border-velvet"
          />

          <textarea
            name="description"
            placeholder="Category description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            required
            className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none transition focus:border-velvet md:col-span-2"
          />

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-xl bg-velvet px-6 py-4 font-medium text-parchment-50 transition hover:bg-velvet-light active:scale-[0.98] md:w-fit"
          >
            <Plus size={18} />

            {submitting
              ? "Please wait..."
              : editingCategory
              ? "Update Category"
              : "Create Category"}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          Loading...
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-10 text-center text-parchment-100/60">
          No categories found.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category._id}
              className="overflow-hidden rounded-3xl border border-graphite-700 bg-graphite-800"
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-56 w-full object-cover"
              />

              <div className="p-6">
                <h2 className="font-display text-3xl italic">
                  {category.name}
                </h2>

                <p className="mt-3 line-clamp-3 text-sm leading-7 text-parchment-100/60">
                  {category.description}
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() =>
                      handleEdit(category)
                    }
                    className="flex items-center gap-2 rounded-xl border border-graphite-700 px-4 py-3 text-sm transition hover:border-velvet"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(category._id)
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

export default AdminCategories;