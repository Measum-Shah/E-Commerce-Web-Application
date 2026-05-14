import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} from "../services/order.service.js";

const createOrderController = async (req, res, next) => {
  try {
    const order = await createOrder(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrdersController = async (req, res, next) => {
  try {
    const orders = await getMyOrders(req.user._id);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

const getOrderByIdController = async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id, req.user);

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

const cancelOrderController = async (req, res, next) => {
  try {
    const order = await cancelOrder(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrdersController = async (req, res, next) => {
  try {
    const orders = await getAllOrders();

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatusController = async (req, res, next) => {
  try {
    const order = await updateOrderStatus(
      req.params.id,
      req.body.orderStatus
    );

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export {
  createOrderController,
  getMyOrdersController,
  getOrderByIdController,
  cancelOrderController,
  getAllOrdersController,
  updateOrderStatusController
};