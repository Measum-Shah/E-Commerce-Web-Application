import { useState } from "react";
import { toast } from "react-hot-toast";
import { submitContactForm } from "../api/contactApi";
import {
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Store,
  Navigation,
  Sparkles,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const whatsappNumber = "923217387179";
  const emailAddress = "premiercomputers007@gmail.com";

  const googleMapsLink =
    "https://www.google.com/maps/place/premier+Computers/@30.0378125,72.3446875,17z/data=!3m1!4b1!4m6!3m5!1s0x393ceabb210bced3:0xdbed7f11db638eda!8m2!3d30.0378125!4d72.3446875!16s%2Fg%2F11clymx3kp?entry=ttu";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 5) {
      newErrors.message = "Message must be at least 5 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Hi Premier Computers, I have a query about your products."
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const response = await submitContactForm(formData);

      if (response.success) {
        toast.success(response.message);
        setFormData({ fullName: "", email: "", phone: "", subject: "", message: "" });
        setErrors({});
      } else {
        toast.error(response.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Contact form error:", error);

      // express-validator returns: { errors: [{ msg: "...", path: "fieldName" }] }
      if (error.response?.data?.errors) {
        const backendErrors = {};
        error.response.data.errors.forEach((err) => {
          // err is an object with { msg, path } from express-validator
          const field = err.path || err.param;
          const message = err.msg || err.message || String(err);
          if (field) {
            backendErrors[field] = message;
          }
        });
        setErrors(backendErrors);
        toast.error("Please check your form inputs");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to submit query. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-graphite-900 px-4 py-10 text-parchment-50 sm:px-6 lg:py-16">
      <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-velvet/30 blur-[120px]" />
      <div className="absolute bottom-[-120px] right-[-120px] h-72 w-72 rounded-full bg-velvet-light/20 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-graphite-700 bg-graphite-800 px-4 py-2 text-xs uppercase tracking-[0.2em] text-velvet-light">
            <Sparkles size={14} />
            Contact Premier Computers
          </div>
          <h1 className="mt-4 font-display text-5xl italic leading-tight tracking-tight text-parchment-50 sm:text-6xl">
            Get in Touch With Us
          </h1>
          <p className="mt-5 text-sm leading-7 text-parchment-100/70 sm:text-base">
            Have questions about products, repairs, or services? We are here to help.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-graphite-700 bg-graphite-800/80 p-6 backdrop-blur-xl sm:p-8">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-velvet/20 text-velvet-light">
                <Store size={28} />
              </div>
              <h2 className="font-display text-2xl italic text-parchment-50">
                We Have a Physical Outlet
              </h2>
              <p className="mt-3 text-sm leading-7 text-parchment-100/70">
                Premier Computers has a physical shop in Vehari City. Customers can visit
                us for product guidance, laptop purchases, accessories, and repair services.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-graphite-700 bg-graphite-800/80 p-5 backdrop-blur-xl">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-velvet/20 text-velvet-light">
                <Mail size={20} />
              </div>
              <h3 className="font-medium text-parchment-50">Email Us</h3>
              <a
                href={`mailto:${emailAddress}`}
                className="mt-2 block break-all text-sm text-parchment-100/70 transition hover:text-velvet-light"
              >
                {emailAddress}
              </a>
            </div>

            <div className="rounded-[1.5rem] border border-graphite-700 bg-graphite-800/80 p-5 backdrop-blur-xl">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-velvet/20 text-velvet-light">
                <MapPin size={20} />
              </div>
              <h3 className="font-medium text-parchment-50">Our Location</h3>
              <p className="mt-2 text-sm leading-6 text-parchment-100/70">
                Premier Computers, Vehari City, Punjab, Pakistan
              </p>
              <button
                onClick={() => window.open(googleMapsLink, "_blank")}
                className="mt-4 flex items-center gap-2 rounded-xl bg-velvet px-5 py-3 text-sm font-medium text-parchment-50 transition hover:bg-velvet-light active:scale-95"
              >
                <Navigation size={18} />
                Get Directions
              </button>
            </div>
          </div>

          {/* Right Column — Form */}
          <div className="rounded-[1.5rem] border border-graphite-700 bg-graphite-800/80 p-6 backdrop-blur-xl sm:p-8">
            <h2 className="font-display text-3xl italic text-parchment-50">
              Send Us a Message
            </h2>
            <p className="mt-3 text-sm leading-7 text-parchment-100/70">
              Fill out the form below and we will get back to you as soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-parchment-100">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className={`flex items-center rounded-xl border ${errors.fullName ? "border-red-500" : "border-graphite-700"} bg-graphite-900 px-4 transition focus-within:border-velvet`}>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full bg-transparent py-3 text-parchment-50 outline-none placeholder:text-parchment-100/30"
                    />
                  </div>
                  {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-parchment-100">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <div className={`flex items-center rounded-xl border ${errors.email ? "border-red-500" : "border-graphite-700"} bg-graphite-900 px-4 transition focus-within:border-velvet`}>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full bg-transparent py-3 text-parchment-50 outline-none placeholder:text-parchment-100/30"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-parchment-100">
                    Phone <span className="text-red-400">*</span>
                  </label>
                  <div className={`flex items-center rounded-xl border ${errors.phone ? "border-red-500" : "border-graphite-700"} bg-graphite-900 px-4 transition focus-within:border-velvet`}>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="03XXXXXXXXX"
                      className="w-full bg-transparent py-3 text-parchment-50 outline-none placeholder:text-parchment-100/30"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-parchment-100">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <div className={`flex items-center rounded-xl border ${errors.subject ? "border-red-500" : "border-graphite-700"} bg-graphite-900 px-4 transition focus-within:border-velvet`}>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Product query"
                      className="w-full bg-transparent py-3 text-parchment-50 outline-none placeholder:text-parchment-100/30"
                    />
                  </div>
                  {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject}</p>}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-parchment-100">
                  Message <span className="text-red-400">*</span>
                </label>
                <div className={`rounded-xl border ${errors.message ? "border-red-500" : "border-graphite-700"} bg-graphite-900 px-4 transition focus-within:border-velvet`}>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Write your question here..."
                    className="w-full resize-none bg-transparent py-3 text-parchment-50 outline-none placeholder:text-parchment-100/30"
                  />
                </div>
                {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-velvet px-6 py-3.5 font-medium text-parchment-50 transition hover:bg-velvet-light active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-graphite-700 pt-6">
              <p className="mb-3 text-center text-sm text-parchment-100/70">
                Or contact us directly on WhatsApp
              </p>
              <button
                onClick={handleWhatsAppClick}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-green-700 px-6 py-3.5 font-medium text-parchment-50 transition hover:bg-green-600 active:scale-[0.98]"
              >
                <MessageCircle size={20} />
                Chat on WhatsApp
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-graphite-700 bg-graphite-900/50 p-3">
              <p className="text-center text-xs text-parchment-100/50">
                We typically respond within 24 hours. Your information will not be shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;