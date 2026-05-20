import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import contactRoutes from "./routes/contact.routes.js";



const corsOptions = {
  // Allow only your frontend origin
  // origin: 'http://localhost:5173',
  origin:'https://premiercomputers.netlify.app',
   
  // Good practice for professional APIs
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  
  // Enable this if you need to send cookies or authorization headers
  credentials: true, 
  
  // Responds with 200 for older browsers (like IE11)
  optionsSuccessStatus: 200 
};


const app = express();

app.use(helmet());
app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TechShop Backend API is running"
  });
});

app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy"
  });
});

app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;