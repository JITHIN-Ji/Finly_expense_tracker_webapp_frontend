import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  BarChart2,
  Plus,
  Clock,
  Settings as SettingsIcon,
  Wallet,
  LogOut,
  User,
  Lock,
  HelpCircle,
  FileText,
  Info,
  ChevronRight,
  X,
} from "lucide-react";
import { getCurrentUser, logoutUser } from "../services/authService";
import { logExpenseDirect } from "../services/chatService";
import QuickAddExpenseModal from "../components/QuickAddExpenseModal";

/* ---------------------------------- THEME ----------------------------------
   Same palette as DashboardPage.jsx / InsightsPage.jsx / HistoryPage.jsx. */
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

const APP_VERSION = "v1.0.4";

/* --------------------------------- SIDEBAR --------------------------------- */

const NAV_ITEMS = [
  { key: "Home", label: "Home", Icon: Home, path: "/dashboard" },
  { key: "Insights", label: "Insights", Icon: BarChart2, path: "/insights" },
  { key: "History", label: "History", Icon: Clock, path: "/history" },
  { key: "Settings", label: "Settings", Icon: SettingsIcon, path: "/settings" },
];

function Sidebar({ activeTab, userName, onAddExpense, onLogout, onNavigate }) {
  return (
    <aside className="set-sidebar">
      <div className="set-sidebar-brand">
        <button className="set-sidebar-logo" onClick={() => onNavigate("/")}>
          <Wallet size={20} color={colors.mint} />
        </button>
        <span className="set-sidebar-brand-text">Finly</span>
      </div>

      <button className="set-sidebar-add" onClick={onAddExpense}>
        <Plus size={16} />
        Add expense
      </button>

      <nav className="set-sidebar-nav">
        {NAV_ITEMS.map(({ key, label, Icon, path }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              className={`set-sidebar-item${active ? " set-sidebar-item-active" : ""}`}
              onClick={() => onNavigate(path)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="set-sidebar-footer">
        <div className="set-sidebar-avatar">{(userName || "U").charAt(0).toUpperCase()}</div>
        <div className="set-sidebar-user">
          <p className="set-sidebar-user-name">{userName || "..."}</p>
          <p className="set-sidebar-user-sub">Personal account</p>
        </div>
        <button className="set-sidebar-logout" title="Log out" onClick={onLogout}>
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}



/* -------------------------------- SETTING ROW ------------------------------- */

function SettingRow({ Icon, label, value, onClick }) {
  return (
    <button className="set-row" onClick={onClick}>
      <div className="set-row-left">
        <Icon size={19} color={colors.textMuted} />
        <span className="set-row-label">{label}</span>
      </div>
      <div className="set-row-right">
        {value ? <span className="set-row-value">{value}</span> : null}
        <ChevronRight size={17} color={colors.border} />
      </div>
    </button>
  );
}

/* --------------------------------- MAIN PAGE -------------------------------- */

export default function SettingsPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  useEffect(() => {
    let isActive = true;
    (async () => {
      try {
        const user = await getCurrentUser();
        if (isActive) {
          setName(user.name || "");
          setEmail(user.email || "");
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    })();
    return () => {
      isActive = false;
    };
  }, []);

  const firstName = useMemo(() => name?.split(" ")[0] || "", [name]);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <div className="set-shell">
      <style>{css}</style>

      <Sidebar
        activeTab="Settings"
        userName={firstName}
        onAddExpense={() => setShowQuickAdd(true)}
        onLogout={handleLogout}
        onNavigate={navigate}
      />

      <div className="set-main">
        {/* Top App Bar */}
        <div className="set-topbar">
          <h1 className="set-title">Settings</h1>
        </div>

        <div className="set-scroll">
          <div className="set-content">
            {/* Profile card */}
            <div className="set-profile-card set-fade-in" style={{ animationDelay: "0ms" }}>
              <div className="set-avatar-wrap">
                <div className="set-avatar-circle">
                  <User size={26} color={colors.mintDark} />
                </div>
              </div>
              <div className="set-profile-info">
                <p className="set-profile-name">{name || "Loading..."}</p>
                <p className="set-profile-email">{email}</p>
              </div>
            </div>

            <div className="set-section set-fade-in" style={{ animationDelay: "80ms" }}>
              <p className="set-section-label">Account</p>
              <div className="set-card">
                <SettingRow Icon={User} label="Personal Information" onClick={() => navigate("/settings/personal-information")} />
                <div className="set-divider" />
                <SettingRow Icon={Lock} label="Change Password" onClick={() => navigate("/settings/change-password")} />
              </div>
            </div>

            <div className="set-section set-fade-in" style={{ animationDelay: "160ms" }}>
              <p className="set-section-label">Support &amp; About</p>
              <div className="set-card">
                <SettingRow Icon={HelpCircle} label="Help Center / FAQ" onClick={() => navigate("/help")} />
                <div className="set-divider" />
                <SettingRow Icon={FileText} label="Terms & Privacy Policy" onClick={() => navigate("/terms")} />
                <div className="set-divider" />
                <SettingRow Icon={Info} label="App Version" value={APP_VERSION} />
              </div>
            </div>

            <button className="set-logout-btn set-fade-in" style={{ animationDelay: "240ms" }} onClick={handleLogout}>
              <LogOut size={19} color={colors.coral} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile-only bottom tab bar */}
      <div className="set-mobile-tabbar">
        <button className="set-tab-btn" onClick={() => navigate("/dashboard")}>
          <Home size={22} />
          <span>Home</span>
        </button>
        <button className="set-tab-btn" onClick={() => navigate("/insights")}>
          <BarChart2 size={22} />
          <span>Insights</span>
        </button>
        <div className="set-fab-wrapper">
          <button className="set-fab" onClick={() => setShowQuickAdd(true)}>
            <Plus size={28} color="#1A2438" />
          </button>
        </div>
        <button className="set-tab-btn" onClick={() => navigate("/history")}>
          <Clock size={22} />
          <span>History</span>
        </button>
        <button className="set-tab-btn set-tab-btn-active">
          <SettingsIcon size={22} />
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
  .set-shell {
    display: flex;
    height: 100vh;
    width: 100%;
    background: ${colors.background};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    overflow: hidden;
  }

  /* ---------- Sidebar ---------- */
  .set-sidebar {
    width: 240px;
    flex-shrink: 0;
    background: ${colors.sidebarBg};
    display: flex;
    flex-direction: column;
    padding: 24px 16px;
    height: 100vh;
  }
  .set-sidebar-brand { display: flex; align-items: center; gap: 10px; padding: 0 8px; margin-bottom: 28px; }
  .set-sidebar-logo { width: 34px; height: 34px; border-radius: 10px; background: rgba(127,217,156,0.15); border: none; display:flex; align-items:center; justify-content:center; cursor: pointer; }
  .set-sidebar-brand-text { color: #fff; font-weight: 700; font-size: 16px; }
  .set-sidebar-add {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    background: ${colors.mint}; color: ${colors.textDark}; border: none; border-radius: 12px;
    padding: 12px 0; font-size: 14px; font-weight: 700; cursor: pointer; margin-bottom: 24px;
  }
  .set-sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
  .set-sidebar-item {
    display: flex; align-items: center; gap: 12px; background: none; border: none; cursor: pointer;
    color: ${colors.sidebarMuted}; padding: 11px 12px; border-radius: 10px; font-size: 14px; text-align: left;
  }
  .set-sidebar-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
  .set-sidebar-item-active { background: rgba(127,217,156,0.14); color: ${colors.mint}; font-weight: 700; }
  .set-sidebar-footer { display: flex; align-items: center; gap: 10px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); }
  .set-sidebar-avatar {
    width: 34px; height: 34px; border-radius: 17px; background: ${colors.mint}; color: ${colors.textDark};
    display:flex; align-items:center; justify-content:center; font-weight:700; font-size: 14px; flex-shrink:0;
  }
  .set-sidebar-user { flex: 1; min-width: 0; }
  .set-sidebar-user-name { color: #fff; font-size: 13px; font-weight: 600; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .set-sidebar-user-sub { color: ${colors.sidebarMuted}; font-size: 11px; margin: 0; }
  .set-sidebar-logout { background: none; border: none; color: ${colors.sidebarMuted}; cursor: pointer; display:flex; }

  /* ---------- Main column ---------- */
  .set-main {
    flex: 1; min-width: 0; display: flex; flex-direction: column; height: 100vh;
    background: linear-gradient(180deg, rgba(127,217,156,0.18) 0%, rgba(127,217,156,0.05) 30%, ${colors.background} 60%);
  }
  .set-topbar { padding: 28px 40px 8px; flex-shrink: 0; }
  .set-title { font-size: 22px; font-weight: 700; color: ${colors.textDark}; margin: 0; }

  .set-scroll {
  flex: 1; overflow-y: auto;
  scrollbar-width: none;        /* Firefox */
  -ms-overflow-style: none;     /* old Edge/IE */
}
.set-scroll::-webkit-scrollbar { display: none; }  /* Chrome/Safari/mobile */
  .set-content { padding: 12px 40px 40px; max-width: 900px; display: flex; flex-direction: column; gap: 24px; }

  .set-fade-in { animation: set-fade-up 0.38s cubic-bezier(0.16, 1, 0.3, 1) both; }
  @keyframes set-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

  /* ---------- Profile card ---------- */
  .set-profile-card {
    display: flex; align-items: center; gap: 16px; background: ${colors.cardBg}; border-radius: 20px;
    padding: 20px; border: 1px solid ${colors.border}; box-shadow: 0 8px 16px rgba(15,23,42,0.05);
  }
  .set-avatar-wrap { padding: 3px; border-radius: 36px; border: 2px solid ${colors.mint}; flex-shrink: 0; }
  .set-avatar-circle {
    width: 60px; height: 60px; border-radius: 30px; background: #fff;
    display: flex; align-items: center; justify-content: center;
  }
  .set-profile-info { min-width: 0; }
  .set-profile-name { font-size: 17px; font-weight: 700; color: ${colors.textDark}; margin: 0; }
  .set-profile-email { font-size: 13.5px; color: ${colors.textMuted}; margin: 3px 0 0; }

  /* ---------- Two-column layout on desktop ---------- */
  .set-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
  .set-section { display: flex; flex-direction: column; gap: 10px; }
  .set-section-label {
    font-size: 11px; font-weight: 700; color: ${colors.textMuted}; letter-spacing: 0.6px;
    text-transform: uppercase; margin: 0 0 0 4px;
  }
  .set-card {
    background: #fff; border-radius: 16px; border: 1px solid ${colors.border}; overflow: hidden;
  }
  .set-row {
    width: 100%; display: flex; justify-content: space-between; align-items: center;
    padding: 15px 16px; background: none; border: none; cursor: pointer; text-align: left;
  }
  .set-row:hover { background: ${colors.background}; }
  .set-row-left { display: flex; align-items: center; gap: 12px; }
  .set-row-label { font-size: 14px; font-weight: 600; color: ${colors.textDark}; }
  .set-row-right { display: flex; align-items: center; gap: 6px; }
  .set-row-value { font-size: 13px; color: ${colors.textMuted}; }
  .set-divider { height: 1px; background: ${colors.border}; margin-left: 48px; }

  /* ---------- Logout ---------- */
  .set-logout-btn {
  display: flex; justify-content: center; align-items: center; gap: 10px; background: #fff;
  border: 1px solid ${colors.border}; border-radius: 16px; padding: 15px 0; cursor: pointer;
  font-size: 14px; font-weight: 700; color: ${colors.coral}; width: 100%;
  }
  .set-logout-btn:hover { background: rgba(255,107,107,0.06); border-color: rgba(255,107,107,0.3); }

  /* ---------- Modals ---------- */
  .set-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 50; }
  .set-modal-title { font-size: 16px; font-weight: 700; color: ${colors.textDark}; margin: 0 0 12px; }
  .set-quickadd-sheet { background: #fff; border-radius: 20px; padding: 24px; width: 90%; max-width: 340px; }
  .set-quickadd-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .set-close-btn { background: none; border: none; cursor: pointer; color: ${colors.textMuted}; display: flex; }
  .set-quickadd-input { width: 100%; border: 1.5px solid ${colors.border}; border-radius: 12px; padding: 12px 14px; font-size: 14px; color: ${colors.textDark}; margin-bottom: 12px; outline: none; }
  .set-quickadd-btn { width: 100%; background: ${colors.mint}; border-radius: 999px; padding: 14px 0; border: none; font-size: 15px; font-weight: 700; color: ${colors.textDark}; cursor: pointer; }
  .set-quickadd-error { font-size: 12.5px; color: ${colors.coral}; margin-bottom: 8px; }

  /* ---------- Mobile bottom tab bar ---------- */
  .set-mobile-tabbar { display: none; }

  @media (max-width: 900px) {
    .set-sidebar { display: none; }
    .set-topbar { padding: 20px 18px 8px; }
    .set-content { padding: 8px 18px 100px; }
    .set-columns { grid-template-columns: 1fr; }

    .set-mobile-tabbar {
      display: flex;
      position: fixed;
      bottom: 0; left: 0; right: 0;
      background: #fff;
      border-top: 0.5px solid ${colors.border};
      padding: 6px 0 10px;
      height: 60px;
      z-index: 20;
    }
    .set-tab-btn {
      flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 2px; background: none; border: none; cursor: pointer; color: ${colors.textMuted}; font-size: 11px;
    }
    .set-tab-btn-active { color: ${colors.mintDark}; }
    .set-fab-wrapper { flex: 1; display: flex; justify-content: center; align-items: center; position: relative; top: -20px; }
    .set-fab {
      width: 56px; height: 56px; border-radius: 28px; background: ${colors.mint}; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.15);
    }
  }

  @media (max-width: 560px) {
    .set-content { padding: 8px 14px 100px; }
    .set-topbar { padding: 20px 14px 8px; }
    .set-profile-card { padding: 16px; border-radius: 16px; }
  }
`;