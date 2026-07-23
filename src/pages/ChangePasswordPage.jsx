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
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { getCurrentUser, changeUserPassword, logoutUser } from "../services/authService";
import QuickAddExpenseModal from "../components/QuickAddExpenseModal";

/* ---------------------------------- THEME ----------------------------------
   Same palette as SettingsPage.jsx / PersonalInformationPage.jsx. */
const colors = {
  mint: "#7FD99C",
  mintDark: "#3F9E63",
  coral: "#FF6B6B",
  textDark: "#1F2A24",
  textMuted: "#8A9791",
  border: "#E3ECE6",
  background: "#F6F9F7",
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
    <aside className="cp-sidebar">
      <div className="cp-sidebar-brand">
        <button className="cp-sidebar-logo" onClick={() => onNavigate("/")}>
          <Wallet size={20} color={colors.mint} />
        </button>
        <span className="cp-sidebar-brand-text">Finly</span>
      </div>

      <button className="cp-sidebar-add" onClick={onAddExpense}>
        <Plus size={16} />
        Add expense
      </button>

      <nav className="cp-sidebar-nav">
        {NAV_ITEMS.map(({ key, label, Icon, path }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              className={`cp-sidebar-item${active ? " cp-sidebar-item-active" : ""}`}
              onClick={() => onNavigate(path)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="cp-sidebar-footer">
        <div className="cp-sidebar-avatar">{(userName || "U").charAt(0).toUpperCase()}</div>
        <div className="cp-sidebar-user">
          <p className="cp-sidebar-user-name">{userName || "..."}</p>
          <p className="cp-sidebar-user-sub">Personal account</p>
        </div>
        <button className="cp-sidebar-logout" title="Log out" onClick={onLogout}>
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}

/* ------------------------------- PASSWORD FIELD ------------------------------ */

function PasswordField({ label, value, onChange, show, onToggleShow, placeholder }) {
  return (
    <div className="cp-field">
      <label className="cp-label">{label}</label>
      <div className="cp-input-wrap">
        <Lock size={18} color={colors.textMuted} />
        <input
          className="cp-input"
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <button type="button" className="cp-eye-btn" onClick={onToggleShow}>
          {show ? <EyeOff size={18} color={colors.textMuted} /> : <Eye size={18} color={colors.textMuted} />}
        </button>
      </div>
    </div>
  );
}

/* --------------------------------- MAIN PAGE -------------------------------- */

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  useEffect(() => {
    let isActive = true;
    getCurrentUser()
      .then((user) => {
        if (isActive) setUserName(user.name?.split(" ")[0] || "");
      })
      .catch(() => {});
    return () => {
      isActive = false;
    };
  }, []);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setMessage("New password must be at least 6 characters.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      await changeUserPassword(currentPassword, newPassword);
      setMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage(err?.message || "Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cp-shell">
      <style>{css}</style>

      <Sidebar
        activeTab="Settings"
        userName={userName}
        onAddExpense={() => setShowQuickAdd(true)}
        onLogout={async () => {
          await logoutUser();
          navigate("/");
        }}
        onNavigate={navigate}
      />

      <div className="cp-main">
        <div className="cp-topbar">
          <button className="cp-back-btn" onClick={() => navigate("/settings")}>
            <ArrowLeft size={18} color={colors.mintDark} />
          </button>
          <h1 className="cp-title">Change Password</h1>
        </div>

        <div className="cp-scroll">
          <div className="cp-content">
            <PasswordField
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
              show={showCurrent}
              onToggleShow={() => setShowCurrent((v) => !v)}
              placeholder="Enter current password"
            />
            <PasswordField
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              show={showNew}
              onToggleShow={() => setShowNew((v) => !v)}
              placeholder="Enter new password"
            />
            <PasswordField
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirm}
              onToggleShow={() => setShowConfirm((v) => !v)}
              placeholder="Re-enter new password"
            />

            {message && (
              <p className="cp-message" style={{ color: message.includes("success") ? colors.mintDark : colors.coral }}>
                {message}
              </p>
            )}

            <button className="cp-save-btn" onClick={handleChangePassword} disabled={saving}>
              {saving ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile-only bottom tab bar */}
      <div className="cp-mobile-tabbar">
        <button className="cp-tab-btn" onClick={() => navigate("/")}>
          <Home size={22} />
          <span>Home</span>
        </button>
        <button className="cp-tab-btn" onClick={() => navigate("/insights")}>
          <BarChart2 size={22} />
          <span>Insights</span>
        </button>
        <div className="cp-fab-wrapper">
          <button className="cp-fab" onClick={() => setShowQuickAdd(true)}>
            <Plus size={28} color="#1A2438" />
          </button>
        </div>
        <button className="cp-tab-btn" onClick={() => navigate("/history")}>
          <Clock size={22} />
          <span>History</span>
        </button>
        <button className="cp-tab-btn cp-tab-btn-active" onClick={() => navigate("/settings")}>
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
  .cp-shell {
    display: flex;
    height: 100vh;
    width: 100%;
    background: ${colors.background};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    overflow: hidden;
  }

  /* ---------- Sidebar ---------- */
  .cp-sidebar {
    width: 240px; flex-shrink: 0; background: ${colors.sidebarBg}; display: flex;
    flex-direction: column; padding: 24px 16px; height: 100vh;
  }
  .cp-sidebar-brand { display: flex; align-items: center; gap: 10px; padding: 0 8px; margin-bottom: 28px; }
  .cp-sidebar-logo { width: 34px; height: 34px; border-radius: 10px; background: rgba(127,217,156,0.15); border: none; display:flex; align-items:center; justify-content:center; cursor: pointer; }
  .cp-sidebar-brand-text { color: #fff; font-weight: 700; font-size: 16px; }
  .cp-sidebar-add {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    background: ${colors.mint}; color: ${colors.textDark}; border: none; border-radius: 12px;
    padding: 12px 0; font-size: 14px; font-weight: 700; cursor: pointer; margin-bottom: 24px;
  }
  .cp-sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
  .cp-sidebar-item {
    display: flex; align-items: center; gap: 12px; background: none; border: none; cursor: pointer;
    color: ${colors.sidebarMuted}; padding: 11px 12px; border-radius: 10px; font-size: 14px; text-align: left;
  }
  .cp-sidebar-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
  .cp-sidebar-item-active { background: rgba(127,217,156,0.14); color: ${colors.mint}; font-weight: 700; }
  .cp-sidebar-footer { display: flex; align-items: center; gap: 10px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); }
  .cp-sidebar-avatar {
    width: 34px; height: 34px; border-radius: 17px; background: ${colors.mint}; color: ${colors.textDark};
    display:flex; align-items:center; justify-content:center; font-weight:700; font-size: 14px; flex-shrink:0;
  }
  .cp-sidebar-user { flex: 1; min-width: 0; }
  .cp-sidebar-user-name { color: #fff; font-size: 13px; font-weight: 600; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cp-sidebar-user-sub { color: ${colors.sidebarMuted}; font-size: 11px; margin: 0; }
  .cp-sidebar-logout { background: none; border: none; color: ${colors.sidebarMuted}; cursor: pointer; display:flex; }

  /* ---------- Main column ---------- */
  .cp-main { flex: 1; min-width: 0; display: flex; flex-direction: column; height: 100vh; background: linear-gradient(180deg, rgba(127,217,156,0.12) 0%, rgba(127,217,156,0.03) 30%, ${colors.background} 60%); }
  .cp-topbar { display: flex; align-items: center; gap: 16px; padding: 32px 40px 16px; flex-shrink: 0; }
  .cp-back-btn {
    width: 40px; height: 40px; border-radius: 20px; border: 1px solid ${colors.border}; background: #fff;
    display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: all 0.2s ease;
  }
  .cp-back-btn:hover { background: ${colors.background}; border-color: ${colors.mint}; }
  .cp-title { font-size: 24px; font-weight: 700; color: ${colors.textDark}; margin: 0; }

  .cp-scroll { flex: 1; overflow-y: auto; }
  .cp-content { padding: 32px 40px 48px; max-width: 560px; display: flex; flex-direction: column; gap: 28px; }

  .cp-field { display: flex; flex-direction: column; gap: 10px; }
  .cp-label { font-size: 14px; font-weight: 600; color: ${colors.textDark}; letter-spacing: -0.3px; }
  .cp-input-wrap {
    display: flex; align-items: center; gap: 12px; border: 1px solid ${colors.border}; border-radius: 16px;
    padding: 14px 16px; background: #fff; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  }
  .cp-input-wrap:focus-within { border-color: ${colors.mint}; box-shadow: 0 0 0 3px rgba(127,217,156,0.1); }
  .cp-input { flex: 1; border: none; background: none; outline: none; padding: 0; font-size: 15px; color: ${colors.textDark}; }
  .cp-input::placeholder { color: ${colors.textMuted}; }
  .cp-eye-btn { background: none; border: none; cursor: pointer; display: flex; padding: 6px; transition: all 0.2s ease; }
  .cp-eye-btn:hover { color: ${colors.mint}; }
  .cp-message { font-size: 14px; font-weight: 600; text-align: left; padding: 12px 16px; border-radius: 12px; margin: 8px 0 0; background: rgba(127,217,156,0.1); }

  .cp-save-btn {
    background: ${colors.mint}; border: none; border-radius: 18px; padding: 16px 0; cursor: pointer;
    font-size: 16px; font-weight: 700; color: ${colors.textDark}; margin-top: 12px; transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(127,217,156,0.25);
  }
  .cp-save-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(127,217,156,0.35); }
  .cp-save-btn:active:not(:disabled) { transform: translateY(0); }
  .cp-save-btn:disabled { opacity: 0.6; cursor: default; }

  /* ---------- Mobile bottom tab bar ---------- */
  .cp-mobile-tabbar { display: none; }

  @media (max-width: 900px) {
    .cp-sidebar { display: none; }
    .cp-topbar { padding: 20px 18px 8px; }
    .cp-content { padding: 12px 18px 100px; }

    .cp-mobile-tabbar {
      display: flex; position: fixed; bottom: 0; left: 0; right: 0; background: #fff;
      border-top: 0.5px solid ${colors.border}; padding: 6px 0 10px; height: 60px; z-index: 20;
    }
    .cp-tab-btn {
      flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 2px; background: none; border: none; cursor: pointer; color: ${colors.textMuted}; font-size: 11px;
    }
    .cp-tab-btn-active { color: ${colors.mintDark}; }
    .cp-fab-wrapper { flex: 1; display: flex; justify-content: center; align-items: center; position: relative; top: -20px; }
    .cp-fab {
      width: 56px; height: 56px; border-radius: 28px; background: ${colors.mint}; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.15);
    }
  }

  @media (max-width: 560px) {
    .cp-content { padding: 12px 14px 100px; }
    .cp-topbar { padding: 20px 14px 8px; }
  }
`;