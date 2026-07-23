import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  BarChart2,
  Plus,
  Clock,
  Settings,
  ChevronDown,
  Bell,
  Check,
  Coffee,
  Car,
  Tag,
  Film,
  Briefcase,
  CircleEllipsis,
  X,
  Wallet,
  TrendingDown,
  TrendingUp,
  Receipt,
  LogOut,
} from "lucide-react";
import {
  getFinanceSummary,
  getIncome,
  getYearlyIncome,
  getFinanceTransactions,
} from "../services/financeService";
import { getCurrentUser, updateUserCurrency, logoutUser } from "../services/authService";
import { logExpenseDirect } from "../services/chatService";
import QuickAddExpenseModal from "../components/QuickAddExpenseModal";

/* ---------------------------------- THEME --------------------------------- */
const colors = {
  mint: "#7FD99C",
  mintDark: "#3F9E63",
  coral: "#FF6B6B",
  textDark: "#1F2A24",
  textMuted: "#8A9791",
  border: "#E3ECE6",
  background: "#F6F9F7",
  cardBg: "#FFFFFF",
  powderBlue: "#A7D8F0",
  lavender: "#C9B8F0",
  sidebarBg: "#132A1F",
  sidebarMuted: "#8FB3A0",
};

const FILTERS = ["All", "Daily", "Weekly", "Monthly", "Yearly"];
const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "INR", "CAD", "AUD", "CHF", "CNY", "BRL"];

// Filter labels map to the backend API period parameter.
// "All" fetches cumulative data, while the other values request the narrower window.
const periodMap = {
  Daily: "day",
  Weekly: "week",
  Monthly: "month",
  Yearly: "year",
  All: "all",
};

const CATEGORY_ICONS = {
  food: { Icon: Coffee, bg: "#FFF9C4", color: "#FBC02D" },
  transport: { Icon: Car, bg: "#E0F2FE", color: "#075985" },
  shopping: { Icon: Tag, bg: "#E1BEE7", color: "#7B1FA2" },
  entertainment: { Icon: Film, bg: "#FCE7F3", color: "#9D174D" },
  salary: { Icon: Briefcase, bg: "#C8E6C9", color: "#388E3C" },
  uncategorized: { Icon: CircleEllipsis, bg: "#F1F1F1", color: "#6B7280" },
};

const LEGEND_COLORS = [colors.powderBlue, colors.mint, colors.coral, colors.lavender];

const fmt = (amount, currency) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount || 0);

function getDateLabel(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* -------------------------------- DONUT CHART ------------------------------- */
function DonutChart({ size = 80, strokeWidth = 14, segments }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  let cumulative = 0;
  const circles = segments.map((seg, i) => {
    const segLen = (seg.value / total) * circumference;
    const dashArray = `${segLen} ${circumference - segLen}`;
    const dashOffset = -cumulative;
    cumulative += segLen;
    return (
      <circle
        key={i}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={seg.color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset}
        fill="transparent"
        strokeLinecap="butt"
      />
    );
  });
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      {circles}
    </svg>
  );
}

/* ------------------------------ WEEKLY TREND BARS ---------------------------
   NOTE: your current /finance/summary endpoint doesn't return a daily
   time series, so this distributes the real total across 7 days for a
   visual trend. Swap in a real day-by-day endpoint when you have one. */
function WeeklyTrendChart({ totalExpenses, currency }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weights = [0.9, 0.6, 1, 0.5, 1.3, 1.6, 1.1];
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const values = weights.map((w) => (totalExpenses * w) / weightSum);
  const max = Math.max(...values, 1);

  return (
    <div className="db-trend">
      <div className="db-trend-bars">
        {values.map((v, i) => (
          <div key={i} className="db-trend-col">
            <div className="db-trend-bar-track">
              <div
                className="db-trend-bar"
                style={{ height: `${Math.max((v / max) * 100, 4)}%` }}
                title={fmt(v, currency)}
              />
            </div>
            <span className="db-trend-label">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- SUBVIEWS --------------------------------- */

function PlaceholderScreen({ title, text }) {
  return (
    <div className="db-placeholder">
      <p className="db-placeholder-title">{title}</p>
      <p className="db-placeholder-text">{text}</p>
    </div>
  );
}

function CurrencyModal({ visible, current, onSelect, onClose }) {
  if (!visible) return null;
  return (
    <div className="db-modal-overlay" onClick={onClose}>
      <div className="db-modal-content" onClick={(e) => e.stopPropagation()}>
        <p className="db-modal-title">Select Currency</p>
        {CURRENCIES.map((cur) => (
          <div key={cur} className="db-currency-row" onClick={() => onSelect(cur)}>
            <span className="db-currency-row-text">{cur}</span>
            {current === cur && <Check size={18} color={colors.mintDark} />}
          </div>
        ))}
      </div>
    </div>
  );
}


function StatCard({ label, value, Icon, tint, bg }) {
  return (
    <div className="db-stat-card">
      <div className="db-stat-icon" style={{ backgroundColor: bg }}>
        <Icon size={18} color={tint} />
      </div>
      <div>
        <p className="db-stat-label">{label}</p>
        <p className="db-stat-value">{value}</p>
      </div>
    </div>
  );
}

/* --------------------------------- SIDEBAR ---------------------------------- */

const NAV_ITEMS = [
  { key: "Home", label: "Home", Icon: Home, path: "/dashboard" },
  { key: "Insights", label: "Insights", Icon: BarChart2, path: "/insights" },
  { key: "History", label: "History", Icon: Clock, path: "/history" },
  { key: "Settings", label: "Settings", Icon: Settings, path: "/settings" },
];

function Sidebar({ activeTab, setActiveTab, userName, onAddExpense, onLogout, onHomeClick }) {
  return (
    <aside className="db-sidebar">
      <div className="db-sidebar-brand">
        <button className="db-sidebar-logo" onClick={onHomeClick}>
          <Wallet size={20} color={colors.mint} />
        </button>
        <span className="db-sidebar-brand-text">Finly</span>
      </div>

      <button className="db-sidebar-add" onClick={onAddExpense}>
        <Plus size={16} />
        Add expense
      </button>

      <nav className="db-sidebar-nav">
        {NAV_ITEMS.map(({ key, label, Icon, path }) => {
          const active = activeTab === key;
          if (path) {
            return (
              <Link
                key={key}
                to={path}
                className={`db-sidebar-item${active ? " db-sidebar-item-active" : ""}`}
                onClick={() => setActiveTab(key)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            );
          }
          return (
            <button
              key={key}
              className={`db-sidebar-item${active ? " db-sidebar-item-active" : ""}`}
              onClick={() => setActiveTab(key)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="db-sidebar-footer">
        <div className="db-sidebar-avatar">{(userName || "U").charAt(0).toUpperCase()}</div>
        <div className="db-sidebar-user">
          <p className="db-sidebar-user-name">{userName || "..."}</p>
          <p className="db-sidebar-user-sub">Personal account</p>
        </div>
        <button className="db-sidebar-logout" title="Log out" onClick={onLogout}>
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}

/* --------------------------------- DASHBOARD -------------------------------- */

function DashboardHome({ activeFilter, setActiveFilter, summary, displayedIncome, recentExpenses, userCurrency }) {
  const totalExpenses = summary?.totalExpenses || 0;
  const savingsRate = displayedIncome > 0 ? Math.round(((displayedIncome - totalExpenses) / displayedIncome) * 100) : 0;

  return (
    <>
      {/* Filter Tabs */}
      <div className="db-filter-row">
        {FILTERS.map((filter) => {
          const active = activeFilter === filter;
          return (
            <button
              key={filter}
              className={`db-filter-pill${active ? " db-filter-pill-active" : ""}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Stat cards row */}
      <div className="db-stat-grid">
        <StatCard label="INCOME" value={fmt(displayedIncome, userCurrency)} Icon={TrendingUp} tint={colors.mintDark} bg="#E3F6E9" />
        <StatCard
          label="SPENT"
          value={summary ? summary.formattedTotalExpenses : fmt(0, userCurrency)}
          Icon={TrendingDown}
          tint={colors.coral}
          bg="#FDECEC"
        />
        <StatCard label="SAVINGS RATE" value={`${savingsRate}%`} Icon={Wallet} tint="#4472C4" bg="#EAF1FC" />
        <StatCard
          label="TRANSACTIONS"
          value={summary?.totalCount ?? recentExpenses.length}
          Icon={Receipt} tint="#7B1FA2" bg="#F4E9F8"
        />
      </div>

      <div className="db-two-col">
        {/* Left column */}
        <div className="db-col-main">
          <div className="db-panel">
            <div className="db-panel-header">
              <p className="db-panel-title">Weekly trend</p>
            </div>
            <WeeklyTrendChart totalExpenses={totalExpenses} currency={userCurrency} />
          </div>

          <div className="db-panel">
            <div className="db-panel-header">
              <p className="db-panel-title">Recent Expenses</p>
              <button className="db-see-all">See all</button>
            </div>
            <div className="db-expense-list">
              {recentExpenses.length === 0 ? (
                <p className="db-empty-text">No expenses yet. Add one via AI Chat!</p>
              ) : (
                recentExpenses.map((expItem) => {
                  const catKey = expItem.category?.toLowerCase();
                  const catInfo = CATEGORY_ICONS[catKey] || CATEGORY_ICONS.uncategorized;
                  const { Icon } = catInfo;
                  const isIncome = catKey === "salary" || catKey === "income";
                  return (
                    <div key={expItem.id} className="db-expense-row">
                      <div className="db-expense-left">
                        <div className="db-expense-icon" style={{ backgroundColor: catInfo.bg }}>
                          <Icon size={20} color={catInfo.color} />
                        </div>
                        <div>
                          <p className="db-expense-name">{expItem.item}</p>
                          <p className="db-expense-date">{getDateLabel(expItem.timestamp)}</p>
                        </div>
                      </div>
                      <span
                        className="db-expense-amount"
                        style={{ color: isIncome ? colors.mintDark : "#BA1A1A" }}
                      >
                        {isIncome ? "+" : "-"}
                        {expItem.formattedAmount}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="db-col-side">
          <div className="db-panel db-panel-center">
            <p className="db-panel-title" style={{ marginBottom: 12 }}>
              Income vs Spent
            </p>
            <DonutChart
              size={120}
              strokeWidth={18}
              segments={
                displayedIncome === 0 && totalExpenses === 0
                  ? [{ value: 1, color: "#E5E5E5" }]
                  : [
                      { value: displayedIncome, color: colors.mint },
                      { value: totalExpenses, color: colors.coral },
                    ]
              }
            />
            <div className="db-legend-inline">
              <span>
                <i style={{ backgroundColor: colors.mint }} /> Income
              </span>
              <span>
                <i style={{ backgroundColor: colors.coral }} /> Spent
              </span>
            </div>
          </div>

          <div className="db-panel">
            <p className="db-panel-title" style={{ marginBottom: 16 }}>
              Spending Breakdown
            </p>
            <div className="db-breakdown-wrap">
              <DonutChart
                size={100}
                strokeWidth={16}
                segments={
                  summary?.byCategory?.length
                    ? summary.byCategory.map((c, i) => ({ value: Number(c.total), color: LEGEND_COLORS[i % 4] }))
                    : [{ value: 1, color: "#E5E5E5" }]
                }
              />
              <div className="db-breakdown-center">
                <p className="db-breakdown-center-label">Total</p>
                <p className="db-breakdown-center-amount">
                  {summary ? summary.formattedTotalExpenses : "..."}
                </p>
              </div>
            </div>
            <div className="db-breakdown-legend">
              {summary?.byCategory?.map((c, i) => (
                <div key={c._id} className="db-breakdown-legend-row">
                  <div className="db-breakdown-legend-left">
                    <div className="db-legend-dot" style={{ backgroundColor: LEGEND_COLORS[i % 4] }} />
                    <span className="db-legend-label">{c._id}</span>
                  </div>
                  <span className="db-legend-amount">{c.formattedValue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------- APP SHELL -------------------------------- */

const MOBILE_TABS = [
  { key: "Home", label: "Home", Icon: Home },
  { key: "Insights", label: "Insights", Icon: BarChart2 },
  { key: "Add", label: "", Icon: Plus },
  { key: "History", label: "History", Icon: Clock },
  { key: "Settings", label: "Settings", Icon: Settings },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Home");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const [userName, setUserName] = useState("");
  const [userCurrency, setUserCurrency] = useState("USD");
  const [summary, setSummary] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [displayedIncome, setDisplayedIncome] = useState(0);
  const [loadError, setLoadError] = useState("");

  const fetchAll = async () => {
    setLoadError("");
    try {
      const user = await getCurrentUser();
      setUserName(user.name?.split(" ")[0] || "there");
      setUserCurrency(user.preferences?.currency || "USD");

      const period = periodMap[activeFilter] || "month";
      const summaryData = await getFinanceSummary(period);
      setSummary(summaryData);

      const now = new Date();
      const currentMonth = now.toISOString().slice(0, 7);
      const currentYear = now.getFullYear().toString();

      if (activeFilter === "Yearly") {
        const incomeRes = await getYearlyIncome(currentYear);
        setDisplayedIncome(incomeRes.totalIncome);
      } else {
        const incomeRes = await getIncome(currentMonth);
        const monthlyIncome = incomeRes.income || 0;
        let derived = monthlyIncome;
        if (activeFilter === "Weekly") derived = monthlyIncome / 4.33;
        if (activeFilter === "Daily") {
          const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
          derived = monthlyIncome / Math.max(daysInMonth, 1);
        }
        setDisplayedIncome(derived);
      }

      const transactions = await getFinanceTransactions(period);
      setRecentExpenses(transactions.slice(0, 6));
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setLoadError(err?.message || "Could not load your data.");
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  const handleMobileTabPress = (key) => {
    if (key === "Add") {
      setShowQuickAdd(true);
      return;
    }
    setActiveTab(key);
  };

  const handleSelectCurrency = async (cur) => {
    setUserCurrency(cur);
    setShowCurrencyPicker(false);
    try {
      await updateUserCurrency(cur);
    } catch (err) {
      console.error("Failed to update currency:", err);
    }
  };

  return (
    <div className="db-shell">
      <style>{css}</style>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userName={userName}
        onAddExpense={() => setShowQuickAdd(true)}
        onLogout={async () => {
          await logoutUser();
          navigate("/");
        }}
        onHomeClick={() => navigate("/")}
      />

      <div className="db-main">
        {/* Top App Bar */}
        <div className="db-topbar">
          <div>
            <p className="db-greeting">Hello,</p>
            <p className="db-name">{userName || "..."}</p>
          </div>
          <div className="db-topbar-right">
            <button className="db-currency-btn" onClick={() => setShowCurrencyPicker(true)}>
              <span>{userCurrency}</span>
              <ChevronDown size={14} color={colors.textMuted} />
            </button>
            <button className="db-bell-btn">
              <Bell size={20} color={colors.textMuted} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="db-content">
          {loadError && <p className="db-load-error">{loadError}</p>}
          {activeTab === "Home" && (
            <DashboardHome
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              summary={summary}
              displayedIncome={displayedIncome}
              recentExpenses={recentExpenses}
              userCurrency={userCurrency}
            />
          )}
          {activeTab === "Insights" && (
            <PlaceholderScreen title="Insights" text="Your spending trends and charts will show up here." />
          )}
          {activeTab === "History" && (
            <PlaceholderScreen title="History" text="Every past transaction will be listed here." />
          )}
          {activeTab === "Settings" && (
            <PlaceholderScreen title="Settings" text="Manage your profile, currency, and preferences." />
          )}
        </div>
      </div>

      {/* Mobile-only bottom tab bar */}
      <div className="db-mobile-tabbar">
        {MOBILE_TABS.map(({ key, label, Icon }) => {
          if (key === "Add") {
            return (
              <div key={key} className="db-fab-wrapper">
                <button className="db-fab" onClick={() => handleMobileTabPress(key)}>
                  <Icon size={28} color="#1A2438" />
                </button>
              </div>
            );
          }
          const active = activeTab === key;
          return (
            <button
              key={key}
              className={`db-tab-btn${active ? " db-tab-btn-active" : ""}`}
              onClick={() => handleMobileTabPress(key)}
            >
              <Icon size={22} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      <CurrencyModal
        visible={showCurrencyPicker}
        current={userCurrency}
        onSelect={handleSelectCurrency}
        onClose={() => setShowCurrencyPicker(false)}
      />
      <QuickAddExpenseModal visible={showQuickAdd} onClose={() => setShowQuickAdd(false)} onSaved={fetchAll} />
    </div>
  );
}

/* ----------------------------------- CSS ------------------------------------ */
const css = `
  * { box-sizing: border-box; }
  .db-shell {
    display: flex;
    min-height: 100vh;
    width: 100%;
    background: ${colors.background};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }

  /* ---------- Sidebar (desktop root navigator) ---------- */
  .db-sidebar {
    width: 240px;
    flex-shrink: 0;
    background: ${colors.sidebarBg};
    display: flex;
    flex-direction: column;
    padding: 24px 16px;
    position: sticky;
    top: 0;
    height: 100vh;
  }
  .db-sidebar-brand { display: flex; align-items: center; gap: 10px; padding: 0 8px; margin-bottom: 28px; }
  .db-sidebar-logo { width: 34px; height: 34px; border-radius: 10px; background: rgba(127,217,156,0.15); display:flex; align-items:center; justify-content:center; }
  .db-sidebar-brand-text { color: #fff; font-weight: 700; font-size: 16px; }
  .db-sidebar-add {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    background: ${colors.mint}; color: ${colors.textDark}; border: none; border-radius: 12px;
    padding: 12px 0; font-size: 14px; font-weight: 700; cursor: pointer; margin-bottom: 24px;
  }
  .db-sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
  .db-sidebar-item {
    display: flex; align-items: center; gap: 12px; background: none; border: none; cursor: pointer;
    color: ${colors.sidebarMuted}; padding: 11px 12px; border-radius: 10px; font-size: 14px; text-align: left;
  }
  .db-sidebar-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
  .db-sidebar-item-active { background: rgba(127,217,156,0.14); color: ${colors.mint}; font-weight: 700; }
  .db-sidebar-footer { display: flex; align-items: center; gap: 10px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); }
  .db-sidebar-avatar {
    width: 34px; height: 34px; border-radius: 17px; background: ${colors.mint}; color: ${colors.textDark};
    display:flex; align-items:center; justify-content:center; font-weight:700; font-size: 14px; flex-shrink:0;
  }
  .db-sidebar-user { flex: 1; min-width: 0; }
  .db-sidebar-user-name { color: #fff; font-size: 13px; font-weight: 600; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .db-sidebar-user-sub { color: ${colors.sidebarMuted}; font-size: 11px; margin: 0; }
  .db-sidebar-logout { background: none; border: none; color: ${colors.sidebarMuted}; cursor: pointer; display:flex; }

  /* ---------- Main column ---------- */
  .db-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  .db-topbar { display: flex; justify-content: space-between; align-items: flex-start; padding: 32px 40px 20px; }
  .db-greeting { font-size: 15px; color: ${colors.textMuted}; margin: 0; }
  .db-name { font-size: 30px; font-weight: 700; color: ${colors.textDark}; margin: -2px 0 0; }
  .db-topbar-right { display: flex; gap: 10px; }
  .db-currency-btn {
    display: flex; align-items: center; gap: 4px; border: 1px solid ${colors.border}; border-radius: 999px;
    padding: 10px 12px; background: #fff; cursor: pointer; font-size: 13px; font-weight: 600; color: ${colors.textDark};
  }
  .db-bell-btn {
    width: 44px; height: 44px; border-radius: 22px; border: 1px solid ${colors.border}; background: #fff;
    display: flex; align-items: center; justify-content: center; cursor: pointer;
  }
  .db-content { flex: 1; padding: 0 40px 48px; }
  .db-load-error { color: ${colors.coral}; font-size: 13px; margin-bottom: 12px; }

  /* ---------- Filters ---------- */
  .db-filter-row { display: flex; gap: 10px; overflow-x: auto; margin-bottom: 24px; }
  .db-filter-pill {
    padding: 10px 22px; border-radius: 999px; border: 1px solid ${colors.border}; background: #fff;
    white-space: nowrap; cursor: pointer; font-size: 13px; color: ${colors.textMuted}; flex-shrink: 0;
  }
  .db-filter-pill-active { border-color: ${colors.mintDark}; color: ${colors.mintDark}; font-weight: 700; }

  /* ---------- Stat cards ---------- */
  .db-stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .db-stat-card { background: #fff; border-radius: 16px; padding: 18px; display: flex; align-items: center; gap: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
  .db-stat-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .db-stat-label { font-size: 10.5px; color: ${colors.textMuted}; letter-spacing: 0.5px; margin: 0 0 3px; }
  .db-stat-value { font-size: 18px; font-weight: 700; color: ${colors.textDark}; margin: 0; }

  /* ---------- Two column layout ---------- */
  .db-two-col { display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; align-items: start; }
  .db-col-main, .db-col-side { display: flex; flex-direction: column; gap: 20px; min-width: 0; }

  .db-panel { background: #fff; border-radius: 20px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
  .db-panel-center { display: flex; flex-direction: column; align-items: center; }
  .db-panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .db-panel-title { font-size: 16px; font-weight: 700; color: ${colors.textDark}; margin: 0; }
  .db-see-all { font-size: 13px; font-weight: 700; color: ${colors.mintDark}; background: none; border: none; cursor: pointer; }

  /* ---------- Weekly trend bars ---------- */
  .db-trend-bars { display: flex; align-items: flex-end; gap: 12px; height: 140px; }
  .db-trend-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; height: 100%; }
  .db-trend-bar-track { flex: 1; width: 100%; display: flex; align-items: flex-end; }
  .db-trend-bar { width: 100%; border-radius: 6px 6px 0 0; background: linear-gradient(180deg, ${colors.mint}, ${colors.mintDark}); transition: height 0.3s ease; }
  .db-trend-label { font-size: 11px; color: ${colors.textMuted}; }

  /* ---------- Recent expenses ---------- */
  .db-expense-list { display: flex; flex-direction: column; gap: 10px; }
  .db-empty-text { color: ${colors.textMuted}; font-size: 13px; }
  .db-expense-row { display: flex; justify-content: space-between; align-items: center; background: ${colors.background}; border-radius: 14px; padding: 12px 14px; }
  .db-expense-left { display: flex; align-items: center; gap: 12px; }
  .db-expense-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .db-expense-name { font-size: 14px; font-weight: 600; color: ${colors.textDark}; margin: 0; }
  .db-expense-date { font-size: 12px; color: ${colors.textMuted}; margin: 2px 0 0; }
  .db-expense-amount { font-size: 14px; font-weight: 700; }

  /* ---------- Donut / breakdown ---------- */
  .db-legend-inline { display: flex; gap: 16px; margin-top: 14px; }
  .db-legend-inline span { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: ${colors.textMuted}; }
  .db-legend-inline i { width: 8px; height: 8px; border-radius: 4px; display: inline-block; }
  .db-breakdown-wrap { position: relative; display: flex; justify-content: center; margin-bottom: 16px; }
  .db-breakdown-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
  .db-breakdown-center-label { font-size: 9px; color: ${colors.textMuted}; text-transform: uppercase; margin: 0; }
  .db-breakdown-center-amount { font-size: 13px; font-weight: 700; color: ${colors.textDark}; margin: 0; }
  .db-breakdown-legend { display: flex; flex-direction: column; gap: 10px; }
  .db-breakdown-legend-row { display: flex; justify-content: space-between; align-items: center; }
  .db-breakdown-legend-left { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .db-legend-dot { width: 8px; height: 8px; border-radius: 4px; flex-shrink: 0; }
  .db-legend-label { font-size: 13px; color: ${colors.textDark}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .db-legend-amount { font-size: 13px; font-weight: 700; color: ${colors.textDark}; margin-left: 8px; flex-shrink: 0; }

  /* ---------- Placeholder tabs ---------- */
  .db-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 8px; padding: 80px 20px; }
  .db-placeholder-title { font-size: 20px; font-weight: 700; color: ${colors.textDark}; margin: 0; }
  .db-placeholder-text { font-size: 14px; color: ${colors.textMuted}; margin: 0; }

  /* ---------- Modals ---------- */
  .db-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 50; }
  .db-modal-content { background: #fff; border-radius: 20px; padding: 20px; width: 90%; max-width: 320px; max-height: 60vh; overflow-y: auto; }
  .db-modal-title { font-size: 16px; font-weight: 700; color: ${colors.textDark}; margin: 0 0 12px; }
  .db-currency-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid ${colors.border}; cursor: pointer; }
  .db-currency-row-text { font-size: 14px; color: ${colors.textDark}; }
  .db-quickadd-sheet { background: #fff; border-radius: 20px; padding: 24px; width: 90%; max-width: 340px; }
  .db-quickadd-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .db-close-btn { background: none; border: none; cursor: pointer; color: ${colors.textMuted}; display: flex; }
  .db-quickadd-input { width: 100%; border: 1.5px solid ${colors.border}; border-radius: 12px; padding: 12px 14px; font-size: 14px; color: ${colors.textDark}; margin-bottom: 12px; outline: none; }
  .db-quickadd-btn { width: 100%; background: ${colors.mint}; border-radius: 999px; padding: 14px 0; border: none; font-size: 15px; font-weight: 700; color: ${colors.textDark}; cursor: pointer; }
  .db-quickadd-error { font-size: 12.5px; color: ${colors.coral}; margin-bottom: 8px; }

  /* ---------- Mobile bottom tab bar (hidden on desktop) ---------- */
  .db-mobile-tabbar { display: none; }

  /* ============ RESPONSIVE: below 900px ============ */
  @media (max-width: 900px) {
    .db-sidebar { display: none; }
    .db-topbar { padding: 24px 18px 12px; }
    .db-name { font-size: 26px; }
    .db-content { padding: 0 18px 100px; }
    .db-stat-grid { grid-template-columns: 1fr 1fr; }
    .db-two-col { grid-template-columns: 1fr; }

    .db-mobile-tabbar {
      display: flex;
      position: fixed;
      bottom: 0; left: 0; right: 0;
      background: #fff;
      border-top: 0.5px solid ${colors.border};
      padding: 6px 0 10px;
      height: 60px;
      z-index: 20;
    }
    .db-tab-btn {
      flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 2px; background: none; border: none; cursor: pointer; color: ${colors.textMuted}; font-size: 11px;
    }
    .db-tab-btn-active { color: ${colors.mintDark}; }
    .db-fab-wrapper { flex: 1; display: flex; justify-content: center; align-items: center; position: relative; top: -20px; }
    .db-fab {
      width: 56px; height: 56px; border-radius: 28px; background: ${colors.mint}; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.15);
    }
  }

  @media (max-width: 560px) {
    .db-stat-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    .db-stat-card { padding: 14px; }
    .db-panel { padding: 16px; border-radius: 16px; }
    .db-topbar { padding: 20px 14px 10px; }
    .db-content { padding: 0 14px 100px; }
  }
`;