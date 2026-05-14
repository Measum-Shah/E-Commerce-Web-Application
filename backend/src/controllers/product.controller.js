import {
  createProduct,
  getAllProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct
} from "../services/product.service.js";

const createProductController = async (req, res, next) => {
  try {
    const product = await createProduct(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const getAllProductsController = async (req, res, next) => {
  try {
    const products = await getAllProducts();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

const getProductBySlugController = async (req, res, next) => {
  try {
    const product = await getProductBySlug(req.params.slug);

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const updateProductController = async (req, res, next) => {
  try {
    const product = await updateProduct(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const deleteProductController = async (req, res, next) => {
  try {
    await deleteProduct(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

export {
  createProductController,
  getAllProductsController,
  getProductBySlugController,
  updateProductController,
  deleteProductController
};