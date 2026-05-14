import Category from "../models/Category.js";
import generateSlug from "../utils/slugify.js";

const createCategory = async (data) => {
  const existingCategory = await Category.findOne({
    name: data.name
  });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  const category = await Category.create({
    name: data.name,
    slug: generateSlug(data.name),
    description: data.description,
    image: data.image
  });

  return category;
};

const getAllCategories = async () => {
  return await Category.find().sort({ createdAt: -1 });
};

const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({ slug });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

const updateCategory = async (id, data) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new Error("Category not found");
  }

  if (data.name) {
    category.name = data.name;
    category.slug = generateSlug(data.name);
  }

  if (data.description !== undefined) {
    category.description = data.description;
  }

  if (data.image !== undefined) {
    category.image = data.image;
  }

  if (data.isActive !== undefined) {
    category.isActive = data.isActive;
  }

  await category.save();

  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new Error("Category not found");
  }

  await category.deleteOne();

  return true;
};

export {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory
};