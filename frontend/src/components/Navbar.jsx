import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cart } = useCart();

  const cartCount = cart?.totalItems ?? 0;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinkStyles = ({ isActive }) =>
    `transition ${
      isActive
        ? "text-parchment-50"
        : "text-parchment-100/70 hover:text-parchment-50"
    }`;

  const mobileNavLinkStyles = ({ isActive }) =>
    `block rounded-lg px-4 py-3 transition ${
      isActive
        ? "bg-graphite-800 text-parchment-50"
        : "text-parchment-100/70 hover:bg-graphite-800 hover:text-parchment-50"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-graphite-700 bg-graphite-900/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3"
        >
          <img
            src="/logo.png"
            alt="Premier Computers Logo"
            className="h-11 w-11 rounded-xl object-cover"
          />

          <div className="flex flex-col leading-none">
            <span className="font-display text-2xl italic tracking-tight text-parchment-50">
              Premier
            </span>

            <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.28em] text-parchment-100/55">
              Computers
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkStyles}>
            Home
          </NavLink>

          <NavLink to="/products" className={navLinkStyles}>
            Products
          </NavLink>

          <NavLink to="/contact" className={navLinkStyles}>
            Contact Us
          </NavLink>

          {!isAuthenticated && (
            <>
              <NavLink to="/login" className={navLinkStyles}>
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
                className="relative flex items-center gap-2 text-parchment-100/70 transition hover:text-parchment-50"
              >
                <span className="relative">
                  <ShoppingCart size={21} strokeWidth={2.4} />

                  {cartCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-velvet text-[10px] font-bold leading-none text-parchment-50">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </span>

                <span>Cart</span>
              </NavLink>

              <NavLink to="/orders" className={navLinkStyles}>
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

        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated && (
            <>
              <div className="text-right">
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

        {/* Mobile right side */}
        <div className="flex items-center gap-3 md:hidden">
          {isAuthenticated && !isAdmin && (
            <Link
              to="/cart"
              onClick={closeMenu}
              className="relative rounded-lg border border-graphite-700 p-2 text-parchment-100 transition hover:border-velvet hover:text-parchment-50"
              aria-label="Cart"
            >
              <ShoppingCart size={22} strokeWidth={2.4} />

              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-velvet text-[10px] font-bold leading-none text-parchment-50">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          )}

          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="rounded-lg border border-graphite-700 p-2 text-parchment-100 transition hover:border-velvet hover:text-parchment-50"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-graphite-700 bg-graphite-900 px-6 py-5 md:hidden">
          <nav className="flex flex-col gap-2">
            <NavLink
              to="/"
              onClick={closeMenu}
              className={mobileNavLinkStyles}
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              onClick={closeMenu}
              className={mobileNavLinkStyles}
            >
              Products
            </NavLink>

            <NavLink
              to="/contact"
              onClick={closeMenu}
              className={mobileNavLinkStyles}
            >
              Contact Us
            </NavLink>

            {!isAuthenticated && (
              <>
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className={mobileNavLinkStyles}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={closeMenu}
                  className={mobileNavLinkStyles}
                >
                  Register
                </NavLink>
              </>
            )}

            {isAuthenticated && !isAdmin && (
              <>
                <NavLink
                  to="/cart"
                  onClick={closeMenu}
                  className={mobileNavLinkStyles}
                >
                  <span className="flex items-center gap-2">
                    <ShoppingCart size={20} strokeWidth={2.4} />
                    Cart
                    {cartCount > 0 && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-velvet text-[10px] font-bold text-parchment-50">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </span>
                </NavLink>

                <NavLink
                  to="/orders"
                  onClick={closeMenu}
                  className={mobileNavLinkStyles}
                >
                  Orders
                </NavLink>
              </>
            )}

            {isAuthenticated && isAdmin && (
              <NavLink
                to="/admin"
                onClick={closeMenu}
                className={mobileNavLinkStyles}
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard size={18} />
                  Admin Dashboard
                </span>
              </NavLink>
            )}

            {isAuthenticated && (
              <div className="mt-4 border-t border-graphite-700 pt-4">
                <div className="mb-4 rounded-lg bg-graphite-800 px-4 py-3">
                  <p className="text-sm text-parchment-50">
                    {user?.fullName}
                  </p>

                  <p className="text-xs capitalize text-parchment-100/60">
                    {user?.role}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg border border-graphite-700 px-4 py-3 text-left text-sm text-parchment-100 transition hover:border-velvet hover:text-parchment-50"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;