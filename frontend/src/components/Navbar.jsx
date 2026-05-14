import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, LayoutDashboard } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, logout, isAuthenticated, isAdmin } =
    useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkStyles = ({ isActive }) =>
    `transition ${
      isActive
        ? "text-parchment-50"
        : "text-parchment-100/70 hover:text-parchment-50"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-graphite-700 bg-graphite-900/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link
          to="/"
          className="font-display text-3xl italic tracking-tight text-parchment-50"
        >
          Premier
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkStyles}>
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={navLinkStyles}
          >
            Products
          </NavLink>

          {!isAuthenticated && (
            <>
              <NavLink
                to="/login"
                className={navLinkStyles}
              >
                Login
              </NavLink>

              <Link
                to="/register"
                className="rounded-lg bg-velvet px-5 py-2.5 font-medium text-parchment-50 transition hover:bg-velvet-light active:scale-95"
              >
                Register
              </Link>
            </>
          )}

          {isAuthenticated && !isAdmin && (
            <>
              <NavLink
                to="/cart"
                className="flex items-center gap-2 text-parchment-100/70 transition hover:text-parchment-50"
              >
                <ShoppingBag size={18} />
                Cart
              </NavLink>

              <NavLink
                to="/orders"
                className={navLinkStyles}
              >
                Orders
              </NavLink>
            </>
          )}

          {isAuthenticated && isAdmin && (
            <NavLink
              to="/admin"
              className="flex items-center gap-2 text-parchment-100/70 transition hover:text-parchment-50"
            >
              <LayoutDashboard size={18} />
              Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <>
              <div className="hidden text-right md:block">
                <p className="text-sm text-parchment-50">
                  {user?.fullName}
                </p>

                <p className="text-xs capitalize text-parchment-100/60">
                  {user?.role}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-lg border border-graphite-700 px-4 py-2 text-sm text-parchment-100 transition hover:border-velvet hover:text-parchment-50"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;