import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  BarChart2,
  Plus,
  Clock,
  Settings as SettingsIcon,
  Wallet,
  LogOut,
  ArrowLeft,
  User,
  Mail,
} from "lucide-react";
import { getCurrentUser, updateProfile, logoutUser } from "../services/authService";
import QuickAddExpenseModal from "../components/QuickAddExpenseModal";

/* ---------------------------------- THEME ----------------------------------
   Same palette as SettingsPage.jsx / DashboardPage.jsx. */
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

/* --------------------------------- SIDEBAR --------------------------------- */

const NAV_ITEMS = [
  { key: "Home", label: "Home", Icon: Home, path: "/dashboard" },
  { key: "Insights", label: "Insights", Icon: BarChart2, path: "/insights" },
  { key: "History", label: "History", Icon: Clock, path: "/history" },
  { key: "Settings", label: "Settings", Icon: SettingsIcon, path: "/settings" },
];

function Sidebar({ activeTab, userName, onAddExpense, onLogout, onNavigate }) {
  return (
    <aside className="pi-sidebar">
      <div className="pi-sidebar-brand">
        <button className="pi-sidebar-logo" onClick={() => onNavigate("/")}>
          <Wallet size={20} color={colors.mint} />
        </button>
        <span className="pi-sidebar-brand-text">Finly</span>
      </div>

      <button className="pi-sidebar-add" onClick={onAddExpense}>
        <Plus size={16} />
        Add expense
      </button>

      <nav className="pi-sidebar-nav">
        {NAV_ITEMS.map(({ key, label, Icon, path }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              className={`pi-sidebar-item${active ? " pi-sidebar-item-active" : ""}`}
              onClick={() => onNavigate(path)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="pi-sidebar-footer">
        <div className="pi-sidebar-avatar">{(userName || "U").charAt(0).toUpperCase()}</div>
        <div className="pi-sidebar-user">
          <p className="pi-sidebar-user-name">{userName || "..."}</p>
          <p className="pi-sidebar-user-sub">Personal account</p>
        </div>
        <button className="pi-sidebar-logout" title="Log out" onClick={onLogout}>
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}

/* --------------------------------- MAIN PAGE -------------------------------- */

export default function PersonalInformationPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  useEffect(() => {
    let isActive = true;
    (async () => {
      setLoading(true);
      try {
        const user = await getCurrentUser();
        if (isActive) {
          setName(user.name || "");
          setEmail(user.email || "");
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      } finally {
        if (isActive) setLoading(false);
      }
    })();
    return () => {
      isActive = false;
    };
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      setMessage("Name cannot be empty.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await updateProfile(name.trim());
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage(err?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pi-shell">
      <style>{css}</style>

      <Sidebar
        activeTab="Settings"
        userName={name?.split(" ")[0] || ""}
        onAddExpense={() => setShowQuickAdd(true)}
        onLogout={async () => {
          await logoutUser();
          navigate("/");
        }}
        onNavigate={navigate}
      />

      <div className="pi-main">
        <div className="pi-topbar">
          <button className="pi-back-btn" onClick={() => navigate("/settings")}>
            <ArrowLeft size={18} color={colors.mintDark} />
          </button>
          <h1 className="pi-title">Personal Information</h1>
        </div>

        <div className="pi-scroll">
          <div className="pi-content">
            <div className="pi-field">
              <label className="pi-label">Full Name</label>
              <div className="pi-input-wrap">
                <User size={18} color={colors.textMuted} />
                <input
                  className="pi-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="pi-field">
              <label className="pi-label">Email Address</label>
              <div className="pi-input-wrap pi-input-wrap-disabled">
                <Mail size={18} color={colors.textMuted} />
                <input className="pi-input" style={{ color: colors.textMuted }} value={email} disabled readOnly />
              </div>
              <p className="pi-helper-text">Email cannot be changed.</p>
            </div>

            {message && (
              <p className="pi-message" style={{ color: message.includes("success") ? colors.mintDark : colors.coral }}>
                {message}
              </p>
            )}

            <button className="pi-save-btn" onClick={handleSave} disabled={saving || loading}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile-only bottom tab bar */}
      <div className="pi-mobile-tabbar">
        <button className="pi-tab-btn" onClick={() => navigate("/")}>
          <Home size={22} />
          <span>Home</span>
        </button>
        <button className="pi-tab-btn" onClick={() => navigate("/insights")}>
          <BarChart2 size={22} />
          <span>Insights</span>
        </button>
        <div className="pi-fab-wrapper">
          <button className="pi-fab" onClick={() => setShowQuickAdd(true)}>
            <Plus size={28} color="#1A2438" />
          </button>
        </div>
        <button className="pi-tab-btn" onClick={() => navigate("/history")}>
          <Clock size={22} />
          <span>History</span>
        </button>
        <button className="pi-tab-btn pi-tab-btn-active" onClick={() => navigate("/settings")}>
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
  .pi-shell {
    display: flex;
    height: 100vh;
    width: 100%;
    background: ${colors.background};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    overflow: hidden;
  }

  /* ---------- Sidebar ---------- */
  .pi-sidebar {
    width: 240px; flex-shrink: 0; background: ${colors.sidebarBg}; display: flex;
    flex-direction: column; padding: 24px 16px; height: 100vh;
  }
  .pi-sidebar-brand { display: flex; align-items: center; gap: 10px; padding: 0 8px; margin-bottom: 28px; }
  .pi-sidebar-logo { width: 34px; height: 34px; border-radius: 10px; background: rgba(127,217,156,0.15); border: none; display:flex; align-items:center; justify-content:center; cursor: pointer; }
  .pi-sidebar-brand-text { color: #fff; font-weight: 700; font-size: 16px; }
  .pi-sidebar-add {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    background: ${colors.mint}; color: ${colors.textDark}; border: none; border-radius: 12px;
    padding: 12px 0; font-size: 14px; font-weight: 700; cursor: pointer; margin-bottom: 24px;
  }
  .pi-sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
  .pi-sidebar-item {
    display: flex; align-items: center; gap: 12px; background: none; border: none; cursor: pointer;
    color: ${colors.sidebarMuted}; padding: 11px 12px; border-radius: 10px; font-size: 14px; text-align: left;
  }
  .pi-sidebar-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
  .pi-sidebar-item-active { background: rgba(127,217,156,0.14); color: ${colors.mint}; font-weight: 700; }
  .pi-sidebar-footer { display: flex; align-items: center; gap: 10px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); }
  .pi-sidebar-avatar {
    width: 34px; height: 34px; border-radius: 17px; background: ${colors.mint}; color: ${colors.textDark};
    display:flex; align-items:center; justify-content:center; font-weight:700; font-size: 14px; flex-shrink:0;
  }
  .pi-sidebar-user { flex: 1; min-width: 0; }
  .pi-sidebar-user-name { color: #fff; font-size: 13px; font-weight: 600; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pi-sidebar-user-sub { color: ${colors.sidebarMuted}; font-size: 11px; margin: 0; }
  .pi-sidebar-logout { background: none; border: none; color: ${colors.sidebarMuted}; cursor: pointer; display:flex; }

  /* ---------- Main column ---------- */
  .pi-main { flex: 1; min-width: 0; display: flex; flex-direction: column; height: 100vh; background: linear-gradient(180deg, rgba(127,217,156,0.12) 0%, rgba(127,217,156,0.03) 30%, ${colors.background} 60%); }
  .pi-topbar { display: flex; align-items: center; gap: 16px; padding: 32px 40px 16px; flex-shrink: 0; }
  .pi-back-btn {
    width: 40px; height: 40px; border-radius: 20px; border: 1px solid ${colors.border}; background: #fff;
    display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: all 0.2s ease;
  }
  .pi-back-btn:hover { background: ${colors.background}; border-color: ${colors.mint}; }
  .pi-title { font-size: 24px; font-weight: 700; color: ${colors.textDark}; margin: 0; }

  .pi-scroll { flex: 1; overflow-y: auto; }
  .pi-content { padding: 32px 40px 48px; max-width: 560px; display: flex; flex-direction: column; gap: 28px; }

  .pi-field { display: flex; flex-direction: column; gap: 10px; }
  .pi-label { font-size: 14px; font-weight: 600; color: ${colors.textDark}; letter-spacing: -0.3px; }
  .pi-input-wrap {
    display: flex; align-items: center; gap: 12px; border: 1px solid ${colors.border}; border-radius: 16px;
    padding: 14px 16px; background: #fff; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  }
  .pi-input-wrap:focus-within { border-color: ${colors.mint}; box-shadow: 0 0 0 3px rgba(127,217,156,0.1); }
  .pi-input-wrap-disabled { background: #f9faf9}; cursor: not-allowed; }
  .pi-input { flex: 1; border: none; background: none; outline: none; padding: 0; font-size: 15px; color: ${colors.textDark}; }
  .pi-input::placeholder { color: ${colors.textMuted}; }
  .pi-input:disabled { cursor: default; color: ${colors.textMuted}; }
  .pi-helper-text { font-size: 12px; color: ${colors.textMuted}; margin: 0; }
  .pi-message { font-size: 14px; font-weight: 600; text-align: left; padding: 12px 16px; border-radius: 12px; margin: 8px 0 0; background: rgba(127,217,156,0.1); }

  .pi-save-btn {
    background: ${colors.mint}; border: none; border-radius: 18px; padding: 16px 0; cursor: pointer;
    font-size: 16px; font-weight: 700; color: ${colors.textDark}; margin-top: 12px; transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(127,217,156,0.25);
  }
  .pi-save-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(127,217,156,0.35); }
  .pi-save-btn:active:not(:disabled) { transform: translateY(0); }
  .pi-save-btn:disabled { opacity: 0.6; cursor: default; }

  /* ---------- Mobile bottom tab bar ---------- */
  .pi-mobile-tabbar { display: none; }

  @media (max-width: 900px) {
    .pi-sidebar { display: none; }
    .pi-topbar { padding: 20px 18px 8px; }
    .pi-content { padding: 12px 18px 100px; }

    .pi-mobile-tabbar {
      display: flex; position: fixed; bottom: 0; left: 0; right: 0; background: #fff;
      border-top: 0.5px solid ${colors.border}; padding: 6px 0 10px; height: 60px; z-index: 20;
    }
    .pi-tab-btn {
      flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 2px; background: none; border: none; cursor: pointer; color: ${colors.textMuted}; font-size: 11px;
    }
    .pi-tab-btn-active { color: ${colors.mintDark}; }
    .pi-fab-wrapper { flex: 1; display: flex; justify-content: center; align-items: center; position: relative; top: -20px; }
    .pi-fab {
      width: 56px; height: 56px; border-radius: 28px; background: ${colors.mint}; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.15);
    }
  }

  @media (max-width: 560px) {
    .pi-content { padding: 12px 14px 100px; }
    .pi-topbar { padding: 20px 14px 8px; }
  }
`;