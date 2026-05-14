import {
  addToCart,
  getMyCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from "../services/cart.service.js";

const addToCartController = async (req, res, next) => {
  try {
    const cart = await addToCart(
      req.user._id,
      req.body.productId,
      Number(req.body.quantity)
    );

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

const getMyCartController = async (req, res, next) => {
  try {
    const cart = await getMyCart(req.user._id);

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

const updateCartItemController = async (req, res, next) => {
  try {
    const cart = await updateCartItem(
      req.user._id,
      req.body.productId,
      Number(req.body.quantity)
    );

    res.status(200).json({
      success: true,
      message: "Cart item updated",
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

const removeCartItemController = async (req, res, next) => {
  try {
    const cart = await removeCartItem(
      req.user._id,
      req.params.productId
    );

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

const clearCartController = async (req, res, next) => {
  try {
    const cart = await clearCart(req.user._id);

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

export {
  addToCartController,
  getMyCartController,
  updateCartItemController,
  removeCartItemController,
  clearCartController
};