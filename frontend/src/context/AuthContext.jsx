import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getMe,
  loginUser,
  registerUser,
} from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const [loading, setLoading] =
    useState(true);

  const login = async (userData) => {
    try {
      const response = await loginUser(
        userData
      );

      const tokenValue =
        response.data.token;

      const userValue =
        response.data.user;

      localStorage.setItem(
        "token",
        tokenValue
      );

      setToken(tokenValue);
      setUser(userValue);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed",
      };
    }
  };

  const register = async (
    userData
  ) => {
    try {
      const response =
        await registerUser(userData);

      const tokenValue =
        response.data.token;

      const userValue =
        response.data.user;

      localStorage.setItem(
        "token",
        tokenValue
      );

      setToken(tokenValue);
      setUser(userValue);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    setUser(null);
    setToken(null);
  };

  const fetchMe = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await getMe(token);

      setUser(response.data);
    } catch (error) {
      localStorage.removeItem("token");

      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,

        login,
        register,
        logout,

        isAuthenticated: !!token,
        isAdmin:
          user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);