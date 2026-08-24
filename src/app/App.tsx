import { useMemo, useState } from "react";
import { Bell, Menu, Search, ShoppingCart } from "lucide-react";

import { CartItem, Food, Page, dishes } from "./types";
import { Sidebar } from "./components/Sidebar";
import { BottomNav } from "./components/BottomNav";
import { Dashboard } from "./components/pages/Dashboard";
import { OrderPage } from "./components/pages/OrderPage";
import { DetailPage } from "./components/pages/DetailPage";
import { FavoritesPage } from "./components/pages/FavoritesPage";
import { HistoryPage } from "./components/pages/HistoryPage";
import { CheckoutPage } from "./components/pages/CheckoutPage";
import { TrackingPage } from "./components/pages/TrackingPage";
import { WalletPage } from "./components/pages/WalletPage";
import { SettingsPage } from "./components/pages/SettingsPage";

const pageTitles: Partial<Record<Page, string>> = {
  order: "Food Order",
  favorites: "Favorites",
  history: "Order History",
  wallet: "Bills & Wallet",
  settings: "Settings",
};

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selected, setSelected] = useState<Food>(dishes[0]);
  const [favorites, setFavorites] = useState<number[]>([1]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [query, setQuery] = useState("");
  const [historyFilter, setHistoryFilter] = useState("All Orders");
  const [balance, setBalance] = useState(1250000);
  const [topup, setTopup] = useState(100000);
  const [ordered, setOrdered] = useState(false);
  const [notice, setNotice] = useState("");

  const go = (p: Page) => {
    setPage(p);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2500);
  };

  const addToCart = (food: Food) => {
    setCart((c) => {
      const row = c.find((x) => x.food.id === food.id);
      if (row) return c.map((x) => x.food.id === food.id ? { ...x, qty: x.qty + 1 } : x);
      return [...c, { food, qty: 1, size: "Regular", extras: [] }];
    });
    showNotice(`${food.name} added to cart`);
  };

  const toggleFav = (id: number) =>
    setFavorites((f) => f.includes(id) ? f.filter((v) => v !== id) : [...f, id]);

  const cartTotal = cart.reduce((a, x) => a + x.food.price * x.qty, 0);
  const cartCount = cart.reduce((a, x) => a + x.qty, 0);

  const visibleDishes = useMemo(
    () => dishes.filter((x) =>
      x.name.toLowerCase().includes(query.toLowerCase()) ||
      x.restaurant.toLowerCase().includes(query.toLowerCase())
    ),
    [query]
  );

  const title = pageTitles[page];

  return (
    <div className="min-h-screen bg-[#f5f6fa] text-[#1c075c]">
      {/* Toast notification */}
      {notice && (
        <div className="fixed right-4 top-4 z-[100] flex items-center gap-3 rounded-2xl bg-[#1c075c] px-5 py-3.5 text-sm text-white shadow-2xl animate-in slide-in-from-top-2 duration-300">
          <span className="size-2 rounded-full bg-[#ffe51c]" />
          {notice}
        </div>
      )}

      {/* Sidebar */}
      <Sidebar active={page} go={go} open={sidebarOpen} close={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main className="min-h-screen lg:pl-72">
        {/* Desktop top header (for non-dashboard pages) */}
        {page !== "dashboard" && (
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-100 bg-white/95 px-5 backdrop-blur lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="grid size-10 place-items-center rounded-2xl bg-gray-100 transition hover:bg-gray-200 lg:hidden"
              >
                <Menu size={20} />
              </button>
              {title && (
                <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-[#1c075c]">{title}</h1>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Search (hidden on mobile for dashboard, shown on order page) */}
              {page === "order" && (
                <label className="hidden items-center gap-2 rounded-2xl bg-gray-50 px-4 py-2.5 md:flex ring-1 ring-gray-100">
                  <Search size={16} className="text-gray-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-52 bg-transparent text-sm outline-none placeholder:text-gray-400"
                    placeholder="Search here…"
                  />
                </label>
              )}

              <button className="grid size-10 place-items-center rounded-2xl bg-gray-50 ring-1 ring-gray-100 transition hover:bg-gray-100">
                <Bell size={18} className="text-gray-600" />
              </button>

              <button
                onClick={() => go("checkout")}
                className="relative grid size-10 place-items-center rounded-2xl bg-gray-50 ring-1 ring-gray-100 transition hover:bg-gray-100"
              >
                <ShoppingCart size={18} className="text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[#ffe51c] text-[10px] font-bold text-[#1c075c]">
                    {cartCount}
                  </span>
                )}
              </button>

              <div className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-amber-100 to-rose-300 text-lg">
                👩
              </div>
            </div>
          </header>
        )}

        {/* Mobile header for dashboard */}
        {page === "dashboard" && (
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-transparent px-5 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="grid size-10 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"
            >
              <Menu size={18} className="text-gray-600" />
            </button>
          </header>
        )}

        {/* Pages */}
        {page === "dashboard" && (
          <Dashboard
            dishes={dishes}
            favorites={favorites}
            cart={cart}
            toggle={toggleFav}
            add={addToCart}
            detail={(f) => { setSelected(f); go("detail"); }}
            go={go}
          />
        )}

        {page === "order" && (
          <OrderPage
            dishes={visibleDishes}
            favorites={favorites}
            toggle={toggleFav}
            add={addToCart}
            detail={(f) => { setSelected(f); go("detail"); }}
            query={query}
            setQuery={setQuery}
            go={go}
          />
        )}

        {page === "detail" && (
          <DetailPage
            food={selected}
            cartQty={cart.find((x) => x.food.id === selected.id)?.qty ?? 0}
            isFav={favorites.includes(selected.id)}
            onFav={() => toggleFav(selected.id)}
            onAdd={() => addToCart(selected)}
            go={go}
          />
        )}

        {page === "favorites" && (
          <FavoritesPage
            list={dishes.filter((x) => favorites.includes(x.id))}
            favorites={favorites}
            toggle={toggleFav}
            add={addToCart}
            detail={(f) => { setSelected(f); go("detail"); }}
            go={go}
          />
        )}

        {page === "history" && (
          <HistoryPage filter={historyFilter} setFilter={setHistoryFilter} go={go} />
        )}

        {page === "checkout" && (
          <CheckoutPage
            cart={cart}
            total={cartTotal}
            go={go}
            onOrder={() => { setOrdered(true); go("tracking"); }}
          />
        )}

        {page === "tracking" && <TrackingPage ordered={ordered} />}

        {page === "wallet" && (
          <WalletPage
            balance={balance}
            topup={topup}
            setTopup={setTopup}
            topupNow={() => {
              setBalance((b) => b + topup);
              showNotice(`Top up of Rp ${topup.toLocaleString("id-ID")} successful!`);
            }}
          />
        )}

        {page === "settings" && <SettingsPage onNotice={showNotice} />}
      </main>

      {/* Bottom navigation (mobile) */}
      <BottomNav active={page} go={go} />
    </div>
  );
}
