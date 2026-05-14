
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const calculateCartTotals = (items) => {
  const totalItems = items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const totalAmount = items.reduce(
    (acc, item) => acc + item.subtotal,
    0
  );

  return {
    totalItems,
    totalAmount
  };
};

const addToCart = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (!product.isActive) {
    throw new Error("Product is inactive");
  }

  if (product.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: []
    });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.subtotal =
      existingItem.quantity * existingItem.price;
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      quantity,
      subtotal: quantity * product.price
    });
  }

  const totals = calculateCartTotals(cart.items);

  cart.totalItems = totals.totalItems;
  cart.totalAmount = totals.totalAmount;

  await cart.save();

  return cart;
};

const getMyCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "name slug images stock"
  );

  if (!cart) {
    return {
      items: [],
      totalItems: 0,
      totalAmount: 0
    };
  }

  return cart;
};

const updateCartItem = async (
  userId,
  productId,
  quantity
) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!item) {
    throw new Error("Item not found in cart");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  item.quantity = quantity;
  item.subtotal = quantity * item.price;

  const totals = calculateCartTotals(cart.items);

  cart.totalItems = totals.totalItems;
  cart.totalAmount = totals.totalAmount;

  await cart.save();

  return cart;
};

const removeCartItem = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  const totals = calculateCartTotals(cart.items);

  cart.totalItems = totals.totalItems;
  cart.totalAmount = totals.totalAmount;

  await cart.save();

  return cart;
};

const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = [];
  cart.totalItems = 0;
  cart.totalAmount = 0;

  await cart.save();

  return cart;
};

export {
  addToCart,
  getMyCart,
  updateCartItem,
  removeCartItem,
  clearCart
};