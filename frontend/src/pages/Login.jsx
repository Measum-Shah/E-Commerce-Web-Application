import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
      toast.success("Login successful");
      navigate("/");
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <section className="flex min-h-[90vh] items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-graphite-700 bg-graphite-800 p-8">
        <h1 className="font-display text-4xl italic text-parchment-50">
          Welcome Back
        </h1>

        <p className="mt-2 text-sm text-parchment-100/70">
          Login to continue your collection journey.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none transition focus:border-velvet"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none transition focus:border-velvet"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-velvet px-6 py-3 font-medium text-parchment-50 transition hover:bg-velvet-light active:scale-[0.98]"
          >
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-parchment-100/70">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-velvet-light"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;