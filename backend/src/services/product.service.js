import Product from "../models/Product.js";
import Category from "../models/Category.js";
import generateSlug from "../utils/slugify.js";

const createProduct = async (data) => {
  const categoryExists = await Category.findById(data.category);

  if (!categoryExists) {
    throw new Error("Category not found");
  }

  const existingProduct = await Product.findOne({ name: data.name });

  if (existingProduct) {
    throw new Error("Product already exists");
  }

  const product = await Product.create({
    name: data.name,
    slug: generateSlug(data.name),
    description: data.description,
    category: data.category,
    brand: data.brand,
    sku: data.sku,
    condition: data.condition,
    price: data.price,
    stock: data.stock,
    lowStockThreshold: data.lowStockThreshold,
    images: data.images,
    specifications: data.specifications,
    tags: data.tags,
    warranty: data.warranty,
    isFeatured: data.isFeatured
  });

  return product;
};

const getAllProducts = async () => {
  return await Product.find()
    .populate("category", "name slug")
    .sort({ createdAt: -1 });
};

// ✅ NEW: Returns only active + featured products for the home page
const getFeaturedProducts = async () => {
  return await Product.find({ isFeatured: true, isActive: true })
    .populate("category", "name slug")
    .sort({ createdAt: -1 });
};

const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug }).populate(
    "category",
    "name slug"
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

const updateProduct = async (id, data) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  if (data.category) {
    const categoryExists = await Category.findById(data.category);
    if (!categoryExists) {
      throw new Error("Category not found");
    }
    product.category = data.category;
  }

  if (data.name) {
    product.name = data.name;
    product.slug = generateSlug(data.name);
  }

  if (data.description !== undefined) product.description = data.description;
  if (data.brand !== undefined) product.brand = data.brand;
  if (data.sku !== undefined) product.sku = data.sku;
  if (data.condition !== undefined) product.condition = data.condition;
  if (data.price !== undefined) product.price = data.price;
  if (data.stock !== undefined) product.stock = data.stock;
  if (data.lowStockThreshold !== undefined) product.lowStockThreshold = data.lowStockThreshold;
  if (data.images !== undefined) product.images = data.images;
  if (data.specifications !== undefined) product.specifications = data.specifications;
  if (data.tags !== undefined) product.tags = data.tags;
  if (data.warranty !== undefined) product.warranty = data.warranty;
  if (data.isFeatured !== undefined) product.isFeatured = data.isFeatured;
  if (data.isActive !== undefined) product.isActive = data.isActive;

  await product.save();

  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  await product.deleteOne();

  return true;
};

export {
  createProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct
};