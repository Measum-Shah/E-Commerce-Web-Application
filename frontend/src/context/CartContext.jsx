import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  clearCart,
  getMyCart,
  removeCartItem,
  updateCartItem,
} from "../api/cartApi";

import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();

  const [cart, setCart] = useState(null);

  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated || !token) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);

      const data = await getMyCart(token);

      setCart(data.cart || data.data);
    } catch (error) {
      console.log(
        error.response?.data?.message ||
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (
    productId,
    quantity
  ) => {
    try {
      const payload = {
        productId,
        quantity,
      };

      const data = await updateCartItem(
        payload,
        token
      );

      setCart(data.cart || data.data);
    } catch (error) {
      console.log(
        error.response?.data?.message ||
          error.message
      );
    }
  };

  const removeItem = async (productId) => {
    try {
      const data = await removeCartItem(
        productId,
        token
      );

      setCart(data.cart || data.data);
    } catch (error) {
      console.log(
        error.response?.data?.message ||
          error.message
      );
    }
  };

  const clearEntireCart = async () => {
    try {
      const data = await clearCart(token);

      setCart(data.cart || null);
    } catch (error) {
      console.log(
        error.response?.data?.message ||
          error.message
      );
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,

        fetchCart,
        updateItemQuantity,
        removeItem,
        clearEntireCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);