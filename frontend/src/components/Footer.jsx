import { Link } from "react-router-dom";
import {
  ShoppingBag,
  LayoutDashboard,
  Mail,
  MapPin,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Footer = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-graphite-700 bg-graphite-900">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link
              to="/"
              className="font-display text-3xl italic tracking-tight text-parchment-50"
            >
              Premier
            </Link>

            <p className="mt-4 max-w-md text-sm leading-7 text-parchment-100/60">
              Premier is a modern online marketplace for premium laptops,
              computers, and accessories. We focus on quality products,
              smooth shopping, and a clean user experience.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-parchment-50">
              Quick Links
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm">
              <Link
                to="/"
                className="text-parchment-100/60 transition hover:text-parchment-50"
              >
                Home
              </Link>

              <Link
                to="/products"
                className="text-parchment-100/60 transition hover:text-parchment-50"
              >
                Products
              </Link>

              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="text-parchment-100/60 transition hover:text-parchment-50"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="text-parchment-100/60 transition hover:text-parchment-50"
                  >
                    Register
                  </Link>
                </>
              )}

              {isAuthenticated && !isAdmin && (
                <>
                  <Link
                    to="/cart"
                    className="flex items-center gap-2 text-parchment-100/60 transition hover:text-parchment-50"
                  >
                    <ShoppingBag size={16} />
                    Cart
                  </Link>

                  <Link
                    to="/orders"
                    className="text-parchment-100/60 transition hover:text-parchment-50"
                  >
                    Orders
                  </Link>
                </>
              )}

              {isAuthenticated && isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-parchment-100/60 transition hover:text-parchment-50"
                >
                  <LayoutDashboard size={16} />
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-parchment-50">
              Contact
            </h3>

            <div className="mt-5 flex flex-col gap-4 text-sm text-parchment-100/60">
              <p className="flex items-center gap-3">
                <Mail size={16} className="text-velvet-light" />
                support@premier.com
              </p>

              <p className="flex items-center gap-3">
                <MapPin size={16} className="text-velvet-light" />
                Pakistan
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-graphite-700 pt-6 text-sm text-parchment-100/50 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} Premier. All rights reserved.</p>

          <div className="flex gap-5">
            <Link
              to="/products"
              className="transition hover:text-parchment-50"
            >
              Shop Now
            </Link>

            <Link
              to="/"
              className="transition hover:text-parchment-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;