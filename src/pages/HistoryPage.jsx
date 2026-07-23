import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  BarChart2,
  Plus,
  Clock,
  Settings,
  Search,
  Wallet,
  LogOut,
  X,
  Utensils,
  Car,
  ShoppingBag,
  Film,
  Banknote,
  CircleEllipsis,
  Receipt,
  Loader2,
} from "lucide-react";
import { getFinanceTransactions } from "../services/financeService";
import { getCurrentUser, logoutUser } from "../services/authService";
import { logExpenseDirect } from "../services/chatService";
import QuickAddExpenseModal from "../components/QuickAddExpenseModal";

/* ---------------------------------- THEME ----------------------------------
   Same palette as DashboardPage.jsx / InsightsPage.jsx. */
const colors = {
  mint: "#7FD99C",
  mintDark: "#3F9E63",
  coral: "#FF6B6B",
  textDark: "#1F2A24",
  textMuted: "#8A9791",
  border: "#E3ECE6",
  background: "#F6F9F7",
  cardBg: "#FFFFFF",
  sidebarBg: "#132A1F",
  sidebarMuted: "#8FB3A0",
};

const PERIOD_FILTERS = [
  { label: "Today", value: "day" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
  { label: "All Time", value: "all" },
];

const CATEGORY_FILTERS = [
  { label: "All Categories", value: "all" },
  { label: "Food", value: "food" },
  { label: "Transport", value: "transport" },
  { label: "Shopping", value: "shopping" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Salary", value: "salary" },
];

const CATEGORY_ICONS = {
  food: { Icon: Utensils, bg: "#FEF9C3", color: "#854D0E" },
  transport: { Icon: Car, bg: "#E0F2FE", color: "#075985" },
  shopping: { Icon: ShoppingBag, bg: "#F3E8FF", color: "#6B21A8" },
  entertainment: { Icon: Film, bg: "#FCE7F3", color: "#9D174D" },
  salary: { Icon: Banknote, bg: "#DCFCE7", color: "#166534" },
  uncategorized: { Icon: CircleEllipsis, bg: "#F1F1F1", color: "#6B7280" },
};

function getDateLabel(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function getTimeLabel(dateStr) {
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function normalizeCategory(category) {
  const value = (category || "uncategorized").toLowerCase().trim();
  if (value === "transportation") return "transport";
  return value;
}

/* --------------------------------- SIDEBAR --------------------------------- */

const NAV_ITEMS = [
  { key: "Home", label: "Home", Icon: Home, path: "/dashboard" },
  { key: "Insights", label: "Insights", Icon: BarChart2, path: "/insights" },
  { key: "History", label: "History", Icon: Clock, path: "/history" },
  { key: "Settings", label: "Settings", Icon: Settings, path: "/settings" },
];

function Sidebar({ activeTab, userName, onAddExpense, onLogout, onNavigate }) {
  return (
    <aside className="hist-sidebar">
      <div className="hist-sidebar-brand">
        <button className="hist-sidebar-logo" onClick={() => onNavigate("/dashboard")}>
          <Wallet size={20} color={colors.mint} />
        </button>
        <span className="hist-sidebar-brand-text">Finly</span>
      </div>

      <button className="hist-sidebar-add" onClick={onAddExpense}>
        <Plus size={16} />
        Add expense
      </button>

      <nav className="hist-sidebar-nav">
        {NAV_ITEMS.map(({ key, label, Icon, path }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              className={`hist-sidebar-item${active ? " hist-sidebar-item-active" : ""}`}
              onClick={() => onNavigate(path)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="hist-sidebar-footer">
        <div className="hist-sidebar-avatar">{(userName || "U").charAt(0).toUpperCase()}</div>
        <div className="hist-sidebar-user">
          <p className="hist-sidebar-user-name">{userName || "..."}</p>
          <p className="hist-sidebar-user-sub">Personal account</p>
        </div>
        <button className="hist-sidebar-logout" title="Log out" onClick={onLogout}>
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}


/* -------------------------------- EXPENSE ROW ------------------------------- */

function ExpenseRow({ item }) {
  const normalizedCategory = normalizeCategory(item.category);
  const catInfo = CATEGORY_ICONS[normalizedCategory] || CATEGORY_ICONS.uncategorized;
  const { Icon } = catInfo;
  const isIncome = normalizedCategory === "salary" || normalizedCategory === "income";

  return (
    <div className="hist-expense-row">
      <div className="hist-icon-tile" style={{ backgroundColor: catInfo.bg }}>
        <Icon size={20} color={catInfo.color} />
      </div>
      <div className="hist-expense-mid">
        <p className="hist-expense-name">{item.item}</p>
        <p className="hist-expense-subtitle">{getTimeLabel(item.timestamp)}</p>
      </div>
      <span className="hist-expense-amount" style={{ color: isIncome ? colors.mintDark : "#BA1A1A" }}>
        {isIncome ? "+" : "-"}
        {item.formattedAmount}
      </span>
    </div>
  );
}

/* --------------------------------- MAIN PAGE -------------------------------- */

export default function HistoryPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [activePeriod, setActivePeriod] = useState("month");
  const [activeCategory, setActiveCategory] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userCurrency, setUserCurrency] = useState("USD");
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [user, data] = await Promise.all([getCurrentUser(), getFinanceTransactions(activePeriod)]);
      setUserName(user.name?.split(" ")[0] || "");
      setUserCurrency(user?.preferences?.currency || "USD");
      setTransactions(data);
    } catch (err) {
      setError(err?.message || "Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePeriod]);

  const filteredTransactions = useMemo(() => {
    if (activeCategory === "all") return transactions;
    return transactions.filter((t) => normalizeCategory(t.category) === activeCategory);
  }, [transactions, activeCategory]);

  const grouped = useMemo(() => {
    const groups = {};
    filteredTransactions.forEach((t) => {
      const label = getDateLabel(t.timestamp);
      if (!groups[label]) groups[label] = [];
      groups[label].push(t);
    });
    return groups;
  }, [filteredTransactions]);

  const totalSpent = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.category?.toLowerCase() !== "salary" && t.category?.toLowerCase() !== "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }, [filteredTransactions]);

  const formattedTotalSpent = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: userCurrency,
  }).format(totalSpent);

  return (
    <div className="hist-shell">
      <style>{css}</style>

      <Sidebar
        activeTab="History"
        userName={userName}
        onAddExpense={() => setShowQuickAdd(true)}
        onLogout={async () => {
          await logoutUser();
          navigate("/");
        }}
        onNavigate={navigate}
      />

      <div className="hist-main">
        {/* Top App Bar */}
        <div className="hist-topbar">
          <h1 className="hist-title">History</h1>
          <button className="hist-search-btn">
            <Search size={19} color={colors.textMuted} />
          </button>
        </div>

        <div className="hist-scroll">
          {/* Period Filter Row */}
          <div className="hist-filter-scroll">
            {PERIOD_FILTERS.map((filter) => {
              const active = activePeriod === filter.value;
              return (
                <button
                  key={filter.value}
                  className={`hist-filter-pill${active ? " hist-filter-pill-active" : ""}`}
                  onClick={() => setActivePeriod(filter.value)}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* Category Filter Row */}
          <div className="hist-category-scroll">
            {CATEGORY_FILTERS.map((cat) => {
              const active = activeCategory === cat.value;
              const catInfo = CATEGORY_ICONS[cat.value] || CATEGORY_ICONS.uncategorized;
              const { Icon } = catInfo;
              return (
                <button
                  key={cat.value}
                  className="hist-category-pill"
                  style={
                    active
                      ? { backgroundColor: catInfo.bg, borderColor: catInfo.color, color: catInfo.color, fontWeight: 700 }
                      : undefined
                  }
                  onClick={() => setActiveCategory(cat.value)}
                >
                  {cat.value !== "all" && <Icon size={13} color={active ? catInfo.color : colors.textMuted} />}
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="hist-body">
            {loading ? (
              <div className="hist-loading">
                <Loader2 size={30} color={colors.mintDark} className="hist-spin" />
              </div>
            ) : error ? (
              <p className="hist-error-text">{error}</p>
            ) : filteredTransactions.length === 0 ? (
              <div className="hist-empty-state">
                <Receipt size={40} color={colors.textMuted} />
                <p className="hist-empty-text">
                  {transactions.length === 0 ? "No expenses yet. Add one via AI Chat!" : "No transactions match this filter."}
                </p>
              </div>
            ) : (
              <>
                <div className="hist-summary-strip">
                  <div className="hist-summary-left">
                    <div className="hist-summary-bar" />
                    <div>
                      <p className="hist-summary-label">TOTAL SPENT</p>
                      <p className="hist-summary-amount">{formattedTotalSpent}</p>
                    </div>
                  </div>
                  <Banknote size={36} color={colors.textDark} style={{ opacity: 0.1 }} />
                </div>

                {Object.entries(grouped).map(([dateLabel, items]) => (
                  <div key={dateLabel} className="hist-date-group">
                    <p className="hist-date-label">{dateLabel}</p>
                    <div className="hist-date-items">
                      {items.map((item) => (
                        <ExpenseRow key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile-only bottom tab bar */}
      <div className="hist-mobile-tabbar">
        <button className="hist-tab-btn" onClick={() => navigate("/dashboard")}>
          <Home size={22} />
          <span>Home</span>
        </button>
        <button className="hist-tab-btn" onClick={() => navigate("/insights")}>
          <BarChart2 size={22} />
          <span>Insights</span>
        </button>
        <div className="hist-fab-wrapper">
          <button className="hist-fab" onClick={() => setShowQuickAdd(true)}>
            <Plus size={28} color="#1A2438" />
          </button>
        </div>
        <button className="hist-tab-btn hist-tab-btn-active">
          <Clock size={22} />
          <span>History</span>
        </button>
        <button className="hist-tab-btn" onClick={() => navigate("/settings")}>
          <Settings size={22} />
          <span>Settings</span>
        </button>
      </div>

      <QuickAddExpenseModal visible={showQuickAdd} onClose={() => setShowQuickAdd(false)} />
    </div>
  );
}

/* ----------------------------------- CSS ------------------------------------ */
const css = `
  * { box-sizing: border-box; }
  .hist-shell {
    display: flex;
    height: 100vh;
    width: 100%;
    background: ${colors.background};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    overflow: hidden;
  }

  /* ---------- Sidebar ---------- */
  .hist-sidebar {
    width: 240px;
    flex-shrink: 0;
    background: ${colors.sidebarBg};
    display: flex;
    flex-direction: column;
    padding: 24px 16px;
    height: 100vh;
  }
  .hist-sidebar-brand { display: flex; align-items: center; gap: 10px; padding: 0 8px; margin-bottom: 28px; }
  .hist-sidebar-logo { width: 34px; height: 34px; border-radius: 10px; background: rgba(127,217,156,0.15); border: none; display:flex; align-items:center; justify-content:center; cursor: pointer; }
  .hist-sidebar-brand-text { color: #fff; font-weight: 700; font-size: 16px; }
  .hist-sidebar-add {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    background: ${colors.mint}; color: ${colors.textDark}; border: none; border-radius: 12px;
    padding: 12px 0; font-size: 14px; font-weight: 700; cursor: pointer; margin-bottom: 24px;
  }
  .hist-sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
  .hist-sidebar-item {
    display: flex; align-items: center; gap: 12px; background: none; border: none; cursor: pointer;
    color: ${colors.sidebarMuted}; padding: 11px 12px; border-radius: 10px; font-size: 14px; text-align: left;
  }
  .hist-sidebar-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
  .hist-sidebar-item-active { background: rgba(127,217,156,0.14); color: ${colors.mint}; font-weight: 700; }
  .hist-sidebar-footer { display: flex; align-items: center; gap: 10px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); }
  .hist-sidebar-avatar {
    width: 34px; height: 34px; border-radius: 17px; background: ${colors.mint}; color: ${colors.textDark};
    display:flex; align-items:center; justify-content:center; font-weight:700; font-size: 14px; flex-shrink:0;
  }
  .hist-sidebar-user { flex: 1; min-width: 0; }
  .hist-sidebar-user-name { color: #fff; font-size: 13px; font-weight: 600; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .hist-sidebar-user-sub { color: ${colors.sidebarMuted}; font-size: 11px; margin: 0; }
  .hist-sidebar-logout { background: none; border: none; color: ${colors.sidebarMuted}; cursor: pointer; display:flex; }

  /* ---------- Main column ---------- */
  .hist-main { flex: 1; min-width: 0; display: flex; flex-direction: column; height: 100vh; background: #fff; }
  .hist-topbar { display: flex; justify-content: space-between; align-items: center; padding: 28px 40px 16px; flex-shrink: 0; }
  .hist-title { font-size: 22px; font-weight: 700; color: ${colors.mintDark}; margin: 0; }
  .hist-search-btn {
    width: 40px; height: 40px; border-radius: 20px; border: none; background: ${colors.background};
    display: flex; align-items: center; justify-content: center; cursor: pointer;
  }

  .hist-scroll { flex: 1; overflow-y: auto; }

  /* ---------- Filters ---------- */
  .hist-filter-scroll,
  .hist-category-scroll {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    width: 100%;
    padding: 0 40px;
  }
  .hist-filter-scroll { padding-bottom: 10px; }
  .hist-category-scroll { padding-bottom: 16px; }
  .hist-filter-pill {
    flex-shrink: 0; padding: 10px 16px; border-radius: 999px; border: 1px solid ${colors.border}; background: #fff;
    font-size: 13px; font-weight: 600; color: ${colors.textMuted}; cursor: pointer; white-space: nowrap;
  }
  .hist-filter-pill-active { background: ${colors.mint}; border-color: ${colors.mint}; color: ${colors.textDark}; }

  .hist-category-pill {
    flex-shrink: 0; display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 999px;
    border: 1px solid ${colors.border}; background: #fff; font-size: 12px; font-weight: 600; color: ${colors.textMuted};
    cursor: pointer; white-space: nowrap;
  }

  /* ---------- Body ---------- */
  .hist-body { padding: 0 40px 32px; display: flex; flex-direction: column; gap: 24px; width: 100%; max-width: none; }

  .hist-loading { display: flex; justify-content: center; padding-top: 60px; }
  .hist-spin { animation: hist-spin 0.9s linear infinite; }
  @keyframes hist-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  .hist-error-text { text-align: center; color: ${colors.coral}; margin-top: 40px; font-size: 14px; }

  .hist-empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; margin-top: 60px; }
  .hist-empty-text { font-size: 14px; color: ${colors.textMuted}; text-align: center; margin: 0; }

  .hist-summary-strip {
    width: 100%;
    background: ${colors.cardBg}; border-radius: 20px; padding: 16px; display: flex; justify-content: space-between;
    align-items: center; border: 1px solid ${colors.border}; box-shadow: 0 8px 16px rgba(15,23,42,0.05);
  }
  .hist-summary-left { display: flex; align-items: center; gap: 12px; }
  .hist-summary-bar { width: 4px; height: 40px; border-radius: 2px; background: ${colors.mint}; }
  .hist-summary-label { font-size: 11px; color: ${colors.textMuted}; letter-spacing: 0.5px; margin: 0 0 2px; }
  .hist-summary-amount { font-size: 22px; font-weight: 700; color: ${colors.textDark}; margin: 0; }

  .hist-date-group { display: flex; flex-direction: column; gap: 12px; }
  .hist-date-label { font-size: 12px; font-weight: 600; color: ${colors.textMuted}; padding: 0 2px; margin: 0; }
  .hist-date-items { display: flex; flex-direction: column; gap: 10px; }

  .hist-expense-row {
    width: 100%;
    display: flex; align-items: center; gap: 14px; background: #fff; border: 1px solid ${colors.border};
    border-radius: 18px; padding: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.03);
  }
  .hist-icon-tile { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .hist-expense-mid { flex: 1; min-width: 0; }
  .hist-expense-name { font-size: 14px; font-weight: 600; color: ${colors.textDark}; text-transform: capitalize; margin: 0; }
  .hist-expense-subtitle { font-size: 12px; color: ${colors.textMuted}; margin: 2px 0 0; }
  .hist-expense-amount { font-size: 14px; font-weight: 700; flex-shrink: 0; }

  /* ---------- Modals ---------- */
  .hist-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 50; }
  .hist-modal-title { font-size: 16px; font-weight: 700; color: ${colors.textDark}; margin: 0 0 12px; }
  .hist-quickadd-sheet { background: #fff; border-radius: 20px; padding: 24px; width: 90%; max-width: 340px; }
  .hist-quickadd-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .hist-close-btn { background: none; border: none; cursor: pointer; color: ${colors.textMuted}; display: flex; }
  .hist-quickadd-input { width: 100%; border: 1.5px solid ${colors.border}; border-radius: 12px; padding: 12px 14px; font-size: 14px; color: ${colors.textDark}; margin-bottom: 12px; outline: none; }
  .hist-quickadd-btn { width: 100%; background: ${colors.mint}; border-radius: 999px; padding: 14px 0; border: none; font-size: 15px; font-weight: 700; color: ${colors.textDark}; cursor: pointer; }
  .hist-quickadd-error { font-size: 12.5px; color: ${colors.coral}; margin-bottom: 8px; }

  /* ---------- Mobile bottom tab bar ---------- */
  .hist-mobile-tabbar { display: none; }

  @media (max-width: 900px) {
    .hist-sidebar { display: none; }
    .hist-topbar { padding: 20px 18px 12px; }
    .hist-filter-scroll { padding: 0 18px 10px; }
    .hist-category-scroll { padding: 0 18px 16px; }
    .hist-body { padding: 0 18px 100px; }

    .hist-mobile-tabbar {
      display: flex;
      position: fixed;
      bottom: 0; left: 0; right: 0;
      background: #fff;
      border-top: 0.5px solid ${colors.border};
      padding: 6px 0 10px;
      height: 60px;
      z-index: 20;
    }
    .hist-tab-btn {
      flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 2px; background: none; border: none; cursor: pointer; color: ${colors.textMuted}; font-size: 11px;
    }
    .hist-tab-btn-active { color: ${colors.mintDark}; }
    .hist-fab-wrapper { flex: 1; display: flex; justify-content: center; align-items: center; position: relative; top: -20px; }
    .hist-fab {
      width: 56px; height: 56px; border-radius: 28px; background: ${colors.mint}; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.15);
    }
  }

  @media (max-width: 560px) {
    .hist-body { padding: 0 14px 100px; }
    .hist-filter-scroll, .hist-category-scroll { padding-left: 14px; padding-right: 14px; }
    .hist-topbar { padding: 20px 14px 12px; }
  }
`;