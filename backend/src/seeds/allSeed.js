import mongoose from "mongoose";

import connectDB from "../config/db.js";

import User from "../models/User.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

import roles from "../constants/roles.js";
import orderStatus from "../constants/orderStatus.js";
import paymentMethods from "../constants/paymentMethods.js";

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();

    const admin = await User.create({
      fullName: "TechShop Admin",
      email: "admin@techshop.com",
      phone: "03000000000",
      password: "admin123",
      role: roles.ADMIN
    });

    const customer = await User.create({
      fullName: "Measum Shah",
      email: "measum@example.com",
      phone: "03001234567",
      password: "123456",
      role: roles.CUSTOMER
    });

    const categories = await Category.insertMany([
      {
        name: "Laptops",
        slug: "laptops",
        description: "Used and new branded laptops",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853"
      },
      {
        name: "Desktops",
        slug: "desktops",
        description: "Desktop computers and workstations",
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5"
      },
      {
        name: "Accessories",
        slug: "accessories",
        description: "Computer accessories and peripherals",
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db"
      }
    ]);

    const laptopCategory = categories[0]._id;
    const desktopCategory = categories[1]._id;
    const accessoriesCategory = categories[2]._id;

    const products = await Product.insertMany([
      {
        name: "Dell Latitude 7490",
        slug: "dell-latitude-7490",
        description: "Used Dell business laptop with Core i5 8th Gen processor.",
        category: laptopCategory,
        brand: "Dell",
        sku: "DELL-7490-I5-8GB",
        condition: "used",
        price: 65000,
        stock: 10,
        lowStockThreshold: 2,
        images: [
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853"
        ],
        specifications: {
          processor: "Core i5 8th Gen",
          ram: "8GB",
          storage: "256GB SSD",
          display: "14 inch"
        },
        tags: ["laptop", "dell", "used"],
        warranty: "3 months shop warranty",
        isFeatured: true
      },
      {
        name: "HP EliteBook 840 G5",
        slug: "hp-elitebook-840-g5",
        description: "Professional HP laptop for office and student use.",
        category: laptopCategory,
        brand: "HP",
        sku: "HP-840-G5-I5",
        condition: "used",
        price: 70000,
        stock: 8,
        images: [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
        ],
        specifications: {
          processor: "Core i5 8th Gen",
          ram: "8GB",
          storage: "256GB SSD",
          display: "14 inch"
        },
        tags: ["laptop", "hp", "elitebook"],
        warranty: "3 months shop warranty",
        isFeatured: true
      },
      {
        name: "Lenovo ThinkCentre Desktop",
        slug: "lenovo-thinkcentre-desktop",
        description: "Reliable desktop PC for office and home use.",
        category: desktopCategory,
        brand: "Lenovo",
        sku: "LENOVO-THINKCENTRE-I5",
        condition: "used",
        price: 45000,
        stock: 6,
        images: [
          "https://images.unsplash.com/photo-1593640408182-31c70c8268f5"
        ],
        specifications: {
          processor: "Core i5 6th Gen",
          ram: "8GB",
          storage: "500GB HDD"
        },
        tags: ["desktop", "lenovo", "office"],
        warranty: "1 month shop warranty"
      },
      {
        name: "Logitech Wireless Mouse",
        slug: "logitech-wireless-mouse",
        description: "Comfortable wireless mouse for daily use.",
        category: accessoriesCategory,
        brand: "Logitech",
        sku: "LOGI-WIRELESS-MOUSE",
        condition: "new",
        price: 2500,
        stock: 25,
        images: [
          "https://images.unsplash.com/photo-1527814050087-3793815479db"
        ],
        specifications: {
          connectivity: "Wireless",
          battery: "AA Battery"
        },
        tags: ["mouse", "accessory", "logitech"],
        warranty: "7 days checking warranty"
      }
    ]);

    await Cart.create({
      user: customer._id,
      items: [
        {
          product: products[0]._id,
          name: products[0].name,
          price: products[0].price,
          image: products[0].images[0],
          quantity: 1,
          subtotal: products[0].price
        }
      ],
      totalItems: 1,
      totalAmount: products[0].price
    });

    await Order.create({
      user: customer._id,
      items: [
        {
          product: products[1]._id,
          name: products[1].name,
          price: products[1].price,
          quantity: 1,
          image: products[1].images[0],
          subtotal: products[1].price
        }
      ],
      shippingAddress: {
        fullName: "Measum Shah",
        phone: "03001234567",
        address: "Street 1, Multan",
        city: "Multan",
        area: "Cantt",
        postalCode: "60000"
      },
      paymentMethod: paymentMethods.COD,
      paymentStatus: "pending",
      orderStatus: orderStatus.PENDING,
      totalItems: 1,
      subtotal: products[1].price,
      deliveryFee: 300,
      discount: 0,
      totalAmount: products[1].price + 300,
      notes: "Call before delivery"
    });

    console.log("Seed data inserted successfully");
    console.log("Admin: admin@techshop.com / admin123");
    console.log("Customer: measum@example.com / 123456");

    process.exit();
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedData();