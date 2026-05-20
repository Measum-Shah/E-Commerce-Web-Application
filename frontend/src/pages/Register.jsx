import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
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

    const result = await register(formData);

    if (result.success) {
      toast.success("Welcome to Premier");
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
                Start your premium shopping journey today.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-parchment-100/70">
                Create your account to explore premium laptops, computers, and
                accessories with a smoother checkout and order experience.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-parchment-50/10 bg-parchment-50/5 p-6">
            <p className="text-sm leading-6 text-parchment-100/70">
              Your account helps us save your cart, manage your orders, and
              make your shopping experience more personal and secure.
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
              New Member
            </div>

            <h1 className="font-display text-4xl italic leading-tight text-parchment-50 sm:text-5xl">
              Create Account
            </h1>

            <p className="mt-3 text-sm leading-6 text-parchment-100/70">
              Join Premier and build your personal collection of premium tech.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-parchment-100">
                Full Name
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-graphite-700 bg-graphite-900 px-4 transition focus-within:border-velvet">
                <User size={18} className="text-parchment-100/50" />

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full bg-transparent py-3 text-parchment-50 outline-none placeholder:text-parchment-100/30"
                />
              </div>
            </div>

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
                Phone Number
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-graphite-700 bg-graphite-900 px-4 transition focus-within:border-velvet">
                <Phone size={18} className="text-parchment-100/50" />

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="03XXXXXXXXX"
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
                  placeholder="Create a strong password"
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

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-velvet px-6 py-3.5 font-medium text-parchment-50 transition hover:bg-velvet-light active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating your account..." : "Create Account"}

              {!loading && (
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-parchment-100/70">
            Already part of Premier?{" "}
            <Link
              to="/login"
              className="font-medium text-velvet-light transition hover:text-parchment-50"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;