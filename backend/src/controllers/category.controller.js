import {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory
} from "../services/category.service.js";

const createCategoryController = async (req, res, next) => {
  try {
    const category = await createCategory(req.body);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });
  } catch (error) {
    next(error);
  }
};

const getAllCategoriesController = async (req, res, next) => {
  try {
    const categories = await getAllCategories();

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryBySlugController = async (req, res, next) => {
  try {
    const category = await getCategoryBySlug(req.params.slug);

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

const updateCategoryController = async (req, res, next) => {
  try {
    const category = await updateCategory(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategoryController = async (req, res, next) => {
  try {
    await deleteCategory(req.params.id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

export {
  createCategoryController,
  getAllCategoriesController,
  getCategoryBySlugController,
  updateCategoryController,
  deleteCategoryController
};