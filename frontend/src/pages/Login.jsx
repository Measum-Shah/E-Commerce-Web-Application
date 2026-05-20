import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const result = await login(formData);

    if (result.success) {
      toast.success("Welcome back to Premier");
      navigate("/");
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-graphite-900 px-4 py-10 sm:px-6">
      <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-velvet/30 blur-[120px]" />
      <div className="absolute bottom-[-120px] right-[-120px] h-72 w-72 rounded-full bg-velvet-light/20 blur-[120px]" />

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-graphite-700 bg-graphite-800/80 shadow-2xl backdrop-blur-xl lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-graphite-800 via-graphite-900 to-velvet/40 p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <Link
              to="/"
              className="font-display text-4xl italic tracking-tight text-parchment-50"
            >
              Premier
            </Link>

            <div className="mt-16">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-velvet/20 text-velvet-light">
                <Sparkles size={28} />
              </div>

              <h2 className="max-w-md font-display text-5xl italic leading-tight text-parchment-50">
                Welcome back to your premium collection.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-parchment-100/70">
                Continue exploring premium laptops, computers, and accessories
                crafted for performance, style, and everyday productivity.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-parchment-50/10 bg-parchment-50/5 p-6">
            <p className="text-sm leading-6 text-parchment-100/70">
              Secure login helps us keep your orders, cart, and profile safe
              while giving you a smoother shopping experience.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-12">
          <div className="mb-8 lg:hidden">
            <Link
              to="/"
              className="font-display text-4xl italic tracking-tight text-parchment-50"
            >
              Premier
            </Link>
          </div>

          <div>
            <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-graphite-700 bg-graphite-900 px-4 py-2 text-xs uppercase tracking-[0.2em] text-velvet-light">
              <Sparkles size={14} />
              Member Login
            </div>

            <h1 className="font-display text-4xl italic leading-tight text-parchment-50 sm:text-5xl">
              Welcome Back
            </h1>

            <p className="mt-3 text-sm leading-6 text-parchment-100/70">
              Login to continue your shopping journey and manage your premium
              collection.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-parchment-100">
                Email Address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-graphite-700 bg-graphite-900 px-4 transition focus-within:border-velvet">
                <Mail size={18} className="text-parchment-100/50" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-transparent py-3 text-parchment-50 outline-none placeholder:text-parchment-100/30"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-parchment-100">
                Password
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-graphite-700 bg-graphite-900 px-4 transition focus-within:border-velvet">
                <LockKeyhole size={18} className="text-parchment-100/50" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-transparent py-3 text-parchment-50 outline-none placeholder:text-parchment-100/30"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-parchment-100/50 transition hover:text-parchment-50"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-parchment-100/60">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-graphite-700 bg-graphite-900 accent-velvet"
                />
                Remember me
              </label>

              <button
                type="button"
                className="text-velvet-light transition hover:text-parchment-50"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-velvet px-6 py-3.5 font-medium text-parchment-50 transition hover:bg-velvet-light active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing you in..." : "Login"}

              {!loading && (
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-parchment-100/70">
            New to Premier?{" "}
            <Link
              to="/register"
              className="font-medium text-velvet-light transition hover:text-parchment-50"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;