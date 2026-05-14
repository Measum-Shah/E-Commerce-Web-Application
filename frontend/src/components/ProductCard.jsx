import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-2xl border border-graphite-700 bg-graphite-800"
    >
      <Link to={`/products/${product.slug}`}>
        <div className="relative h-72 overflow-hidden bg-graphite-900">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          {product.isFeatured && (
            <span className="absolute left-4 top-4 rounded-full bg-velvet px-3 py-1 text-xs font-medium text-parchment-50">
              Featured
            </span>
          )}
        </div>

        <div className="space-y-4 p-5">
          <div>
            <p className="text-sm text-parchment-100/60">
              {product.brand}
            </p>

            <h2 className="mt-1 font-display text-2xl italic tracking-tight text-parchment-50">
              {product.name}
            </h2>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xl font-medium text-parchment-100">
              Rs. {product.price?.toLocaleString()}
            </p>

            <span
              className={`rounded-full px-3 py-1 text-xs ${
                product.stock > 0
                  ? "bg-success/20 text-green-300"
                  : "bg-error/20 text-red-300"
              }`}
            >
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;