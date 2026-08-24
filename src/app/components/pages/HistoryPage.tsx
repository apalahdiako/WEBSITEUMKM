import { dishes } from "../../types";
import type { Page } from "../../types";
import { RefreshCw, Receipt } from "lucide-react";

const orders = [
  {
    id: "ORD-20241024-001",
    name: "Truffle Beef Burger Combo",
    restaurant: "The Burger Joint",
    status: "Processing" as const,
    price: 24.5,
    date: "Oct 24, 2024 • 12:30 PM",
    items: 2,
    image: dishes[0].image,
  },
  {
    id: "ORD-20241022-002",
    name: "Salmon Poke Bowl Set",
    restaurant: "Okinawa Sushi & Poke",
    status: "Completed" as const,
    price: 18.9,
    date: "Oct 22, 2024 • 07:15 PM",
    items: 1,
    image: dishes[2].image,
  },
  {
    id: "ORD-20241020-003",
    name: "Pepperoni Feast Pizza Large",
    restaurant: "Bella Napoli Pizza",
    status: "Cancelled" as const,
    price: 32.0,
    date: "Oct 20, 2024 • 08:00 PM",
    items: 3,
    image: dishes[1].image,
  },
  {
    id: "ORD-20241018-004",
    name: "Spicy Tonkotsu Ramen",
    restaurant: "Thai Spice Kitchen",
    status: "Completed" as const,
    price: 14.5,
    date: "Oct 18, 2024 • 01:45 PM",
    items: 1,
    image: dishes[3].image,
  },
];

const statusStyle = {
  Processing: "bg-[#fff3cd] text-[#8a6300]",
  Completed: "bg-[#e7f5ec] text-[#1a6c35]",
  Cancelled: "bg-[#fde8e8] text-[#b91c1c]",
};

interface HistoryPageProps {
  filter: string;
  setFilter: (f: string) => void;
  go: (p: Page) => void;
}

export function HistoryPage({ filter, setFilter, go }: HistoryPageProps) {
  const tabs = ["All Orders", "Completed", "Processing", "Cancelled"];
  const visible = orders.filter((o) => filter === "All Orders" || o.status === filter);

  return (
    <div className="px-5 pb-28 pt-5 lg:px-8 lg:pb-10">
      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
              filter === tab
                ? "bg-[#1c075c] text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-600 hover:border-[#1c075c]/20"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Order cards */}
      <div className="space-y-4">
        {visible.map((order) => (
          <article
            key={order.id}
            className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
          >
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              {/* Food image */}
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                <img src={order.image} alt={order.name} className="h-full w-full object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start gap-2">
                  <h2 className="font-['Space_Grotesk'] text-base font-bold text-[#1c075c] leading-snug line-clamp-1">
                    {order.name}
                  </h2>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyle[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {order.restaurant} · {order.date}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">#{order.id}</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-[#1c075c]">${order.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-400">({order.items} item{order.items !== 1 ? "s" : ""})</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-row gap-2 sm:flex-col sm:items-end">
                <button
                  onClick={() => go("tracking")}
                  className="flex items-center gap-2 rounded-xl bg-[#f0ebff] px-4 py-2.5 text-xs font-semibold text-[#1c075c] transition hover:bg-[#e0d5ff]"
                >
                  <Receipt size={13} />
                  View Receipt
                </button>
                {order.status === "Completed" && (
                  <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 transition hover:border-[#1c075c]/20 hover:bg-gray-50">
                    <RefreshCw size={13} />
                    Reorder
                  </button>
                )}
              </div>
            </div>

            {/* Processing progress bar */}
            {order.status === "Processing" && (
              <div className="border-t border-gray-50 px-5 py-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>Order being prepared…</span>
                  <button onClick={() => go("tracking")} className="font-medium text-[#7c5cbf]">
                    Track →
                  </button>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full w-2/5 rounded-full bg-[#ffe51c]" />
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
