import { Link } from "react-router-dom";

import {
  Boxes,
  LayoutGrid,
  ShoppingCart,
} from "lucide-react";

const AdminDashboard = () => {
  const cards = [
    {
      title: "Manage Products",
      description:
        "Create, update, and manage inventory items.",
      icon: Boxes,
      link: "/admin/products",
    },
    {
      title: "Manage Categories",
      description:
        "Organize product collections and categories.",
      icon: LayoutGrid,
      link: "/admin/categories",
    },
    {
      title: "Manage Orders",
      description:
        "Track, confirm, and process customer orders.",
      icon: ShoppingCart,
      link: "/admin/orders",
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12">
        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-velvet-light">
          Admin Panel
        </p>

        <h1 className="font-display text-6xl italic tracking-tight">
          Store Management
        </h1>

        <p className="mt-4 max-w-2xl text-parchment-100/70">
          Manage products, categories, and customer
          orders from one professional dashboard.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.title}
              to={card.link}
              className="group rounded-3xl border border-graphite-700 bg-graphite-800 p-7 transition hover:border-velvet"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-graphite-900">
                <Icon size={26} />
              </div>

              <h2 className="mt-8 font-display text-3xl italic tracking-tight">
                {card.title}
              </h2>

              <p className="mt-3 leading-7 text-parchment-100/60">
                {card.description}
              </p>

              <div className="mt-8 text-sm text-velvet-light">
                Open Section →
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
};

export default AdminDashboard;