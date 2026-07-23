import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  BarChart2,
  Plus,
  Clock,
  Settings,
  Bell,
  ChevronDown,
  Wallet,
  Sparkles,
  Lightbulb,
  Flame,
  TrendingUp,
  CheckCircle2,
  MessageCircle,
  ArrowUp,
  LogOut,
  X,
} from "lucide-react";
import { getInsights } from "../services/financeService";
import { getCurrentUser, logoutUser } from "../services/authService";
import { sendChatMessage, logExpenseDirect } from "../services/chatService";
import QuickAddExpenseModal from "../components/QuickAddExpenseModal";

/* ---------------------------------- THEME ---------------------------------
   Same palette as DashboardPage.jsx — green is the accent, everything else
   stays neutral so the accent actually reads as an accent. */
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
  soft: "rgba(63,158,99,0.10)",
  softer: "rgba(63,158,99,0.06)",
  ring: "rgba(63,158,99,0.18)",
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
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
    <aside className="ins-sidebar">
      <div className="ins-sidebar-brand">
        <button className="ins-sidebar-logo" onClick={() => onNavigate("/dashboard")}>
          <Wallet size={20} color={colors.mint} />
        </button>
        <span className="ins-sidebar-brand-text">Finly</span>
      </div>

      <button className="ins-sidebar-add" onClick={onAddExpense}>
        <Plus size={16} />
        Add expense
      </button>

      <nav className="ins-sidebar-nav">
        {NAV_ITEMS.map(({ key, label, Icon, path }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              className={`ins-sidebar-item${active ? " ins-sidebar-item-active" : ""}`}
              onClick={() => onNavigate(path)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="ins-sidebar-footer">
        <div className="ins-sidebar-avatar">{(userName || "U").charAt(0).toUpperCase()}</div>
        <div className="ins-sidebar-user">
          <p className="ins-sidebar-user-name">{userName || "..."}</p>
          <p className="ins-sidebar-user-sub">Personal account</p>
        </div>
        <button className="ins-sidebar-logout" title="Log out" onClick={onLogout}>
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}



/* -------------------------------- SMALL BITS -------------------------------- */

function IconBadge({ Icon, tint = colors.mintDark, bg = colors.soft }) {
  return (
    <div className="ins-icon-badge" style={{ backgroundColor: bg }}>
      <Icon size={16} color={tint} />
    </div>
  );
}

function TypingDots() {
  return (
    <div className="ins-typing-row">
      <span className="ins-typing-dot" style={{ animationDelay: "0ms" }} />
      <span className="ins-typing-dot" style={{ animationDelay: "150ms" }} />
      <span className="ins-typing-dot" style={{ animationDelay: "300ms" }} />
    </div>
  );
}

function InsightsLoading() {
  return (
    <div className="ins-loading-wrap">
      <div className="ins-loading-ring">
        <Sparkles size={22} color={colors.mintDark} />
      </div>
      <p className="ins-loading-text">Preparing your insights…</p>
    </div>
  );
}

/* --------------------------------- MAIN PAGE -------------------------------- */

export default function InsightsPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    let isActive = true;
    setLoading(true);
    setLoadError("");
    (async () => {
      try {
        const [user, data] = await Promise.all([getCurrentUser(), getInsights()]);
        if (isActive) {
          setUserName(user.name?.split(" ")[0] || "");
          setInsights(data);
        }
      } catch (err) {
        console.error("Failed to load insights:", err);
        if (isActive) setLoadError(err?.message || "Could not load your insights.");
      } finally {
        if (isActive) setLoading(false);
      }
    })();
    return () => {
      isActive = false;
    };
  }, []);

  const scrollToEnd = () => {
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    });
  };

  const handleAsk = async () => {
    const text = question.trim();
    if (!text || asking) return;
    const userMsg = { id: Date.now().toString(), sender: "user", text };
    setChatMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setAsking(true);
    scrollToEnd();
    try {
      const res = await sendChatMessage(text);
      setChatMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: "bot", text: res.response }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: "bot", text: "Sorry, I couldn't process that. Please try again." },
      ]);
    } finally {
      setAsking(false);
      scrollToEnd();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAsk();
  };

  return (
    <div className="ins-shell">
      <style>{css}</style>

      <Sidebar
        activeTab="Insights"
        userName={userName}
        onAddExpense={() => setShowQuickAdd(true)}
        onLogout={async () => {
          await logoutUser();
          navigate("/");
        }}
        onNavigate={navigate}
      />

      <div className="ins-main">
        {/* Top App Bar */}
        <div className="ins-topbar">
          <div className="ins-eyebrow-row">
            <Sparkles size={13} color={colors.mintDark} />
            <span className="ins-eyebrow">AI COACH</span>
          </div>
          <div className="ins-topbar-right">
            <button className="ins-bell-btn">
              <Bell size={20} color={colors.textMuted} />
            </button>
          </div>
        </div>

        <div className="ins-scroll" ref={scrollRef}>
          <div className="ins-content">
            <h1 className="ins-greeting">
              {getGreeting()}, {userName || "..."}
            </h1>

            {loadError && <p className="ins-load-error">{loadError}</p>}

            {loading ? (
              <InsightsLoading />
            ) : (
              <div className="ins-cards">
                {insights?.todayInsight && (
                  <div className="ins-card ins-fade-in" style={{ animationDelay: "0ms" }}>
                    <div className="ins-card-header-row">
                      <IconBadge Icon={Lightbulb} />
                      <p className="ins-card-label">Today's Insight</p>
                    </div>
                    <p className="ins-card-body">{insights.todayInsight.text}</p>
                  </div>
                )}

                {insights?.recommendations?.length > 0 && (
                  <div className="ins-card ins-fade-in" style={{ animationDelay: "80ms" }}>
                    <div className="ins-card-header-row">
                      <IconBadge Icon={BarChart2} />
                      <p className="ins-card-label">Recommendations</p>
                    </div>
                    {insights.recommendations.map((rec, i) => (
                      <div key={i} className="ins-rec-row">
                        <span className="ins-rec-dot" />
                        <div className="ins-rec-body">
                          <p className="ins-rec-text">{rec.text}</p>
                          {rec.savingsText ? (
                            <span className="ins-savings-pill">
                              <TrendingUp size={11} color={colors.mintDark} />
                              {rec.savingsText}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {insights?.spendingHabits?.length > 0 && (
                  <div className="ins-card ins-fade-in" style={{ animationDelay: "160ms" }}>
                    <div className="ins-card-header-row">
                      <IconBadge Icon={Flame} />
                      <p className="ins-card-label">Spending Habits</p>
                    </div>
                    {insights.spendingHabits.map((h, i) => (
                      <div key={i} className="ins-habit-row">
                        <CheckCircle2 size={16} color={colors.mintDark} />
                        <span className="ins-habit-text">{h.category}</span>
                        <span className="ins-habit-amount-pill">{h.amountText}</span>
                      </div>
                    ))}
                  </div>
                )}

                {insights?.savingOpportunity && (
                  <div className="ins-card ins-saving-card ins-fade-in" style={{ animationDelay: "240ms" }}>
                    <div className="ins-card-header-row">
                      <IconBadge Icon={Wallet} tint={colors.mintDark} bg={colors.soft} />
                      <p className="ins-card-label">Saving Opportunities</p>
                    </div>
                    <p className="ins-card-body">{insights.savingOpportunity.text}</p>
                  </div>
                )}

                {!insights?.todayInsight &&
                  !insights?.recommendations?.length &&
                  !insights?.spendingHabits?.length &&
                  !insights?.savingOpportunity && (
                    <div className="ins-empty-state">
                      <p>No insights yet — log a few expenses and check back.</p>
                    </div>
                  )}
              </div>
            )}

            {chatMessages.length > 0 && (
              <div className="ins-chat-list">
                {chatMessages.map((msg) =>
                  msg.sender === "user" ? (
                    <div key={msg.id} className="ins-user-row ins-fade-in">
                      <div className="ins-user-bubble">{msg.text}</div>
                    </div>
                  ) : (
                    <div key={msg.id} className="ins-bot-row ins-fade-in">
                      <div className="ins-bot-avatar">
                        <Sparkles size={11} color={colors.mintDark} />
                      </div>
                      <div className="ins-bot-bubble">{msg.text}</div>
                    </div>
                  )
                )}
                {asking && (
                  <div className="ins-bot-row">
                    <div className="ins-bot-avatar">
                      <Sparkles size={12} color={colors.mintDark} />
                    </div>
                    <div className="ins-bot-bubble">
                      <TypingDots />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Ask bar */}
        <div className="ins-ask-bar">
          <div className="ins-ask-label-row">
            <MessageCircle size={13} color={colors.mintDark} />
            <span className="ins-ask-label">Ask anything</span>
          </div>
          <div className="ins-ask-input-row">
            <input
              className="ins-ask-input"
              placeholder="Type here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={asking}
            />
            <button
              className="ins-ask-send"
              onClick={handleAsk}
              disabled={!question.trim() || asking}
            >
              <ArrowUp size={18} color="#FFFFFF" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile-only bottom tab bar */}
      <div className="ins-mobile-tabbar">
        <button className="ins-tab-btn" onClick={() => navigate("/dashboard")}>
          <Home size={22} />
          <span>Home</span>
        </button>
        <button className="ins-tab-btn ins-tab-btn-active">
          <BarChart2 size={22} />
          <span>Insights</span>
        </button>
        <div className="ins-fab-wrapper">
          <button className="ins-fab" onClick={() => setShowQuickAdd(true)}>
            <Plus size={28} color="#1A2438" />
          </button>
        </div>
        <button className="ins-tab-btn" onClick={() => navigate("/history")}>
          <Clock size={22} />
          <span>History</span>
        </button>
        <button className="ins-tab-btn" onClick={() => navigate("/settings")}>
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
  .ins-shell {
    display: flex;
    height: 100vh;
    width: 100%;
    background: ${colors.background};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    overflow: hidden;
  }

  /* ---------- Sidebar ---------- */
  .ins-sidebar {
    width: 240px;
    flex-shrink: 0;
    background: ${colors.sidebarBg};
    display: flex;
    flex-direction: column;
    padding: 24px 16px;
    height: 100vh;
  }
  .ins-sidebar-brand { display: flex; align-items: center; gap: 10px; padding: 0 8px; margin-bottom: 28px; }
  .ins-sidebar-logo { width: 34px; height: 34px; border-radius: 10px; background: rgba(127,217,156,0.15); border: none; display:flex; align-items:center; justify-content:center; cursor: pointer; }
  .ins-sidebar-brand-text { color: #fff; font-weight: 700; font-size: 16px; }
  .ins-sidebar-add {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    background: ${colors.mint}; color: ${colors.textDark}; border: none; border-radius: 12px;
    padding: 12px 0; font-size: 14px; font-weight: 700; cursor: pointer; margin-bottom: 24px;
  }
  .ins-sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
  .ins-sidebar-item {
    display: flex; align-items: center; gap: 12px; background: none; border: none; cursor: pointer;
    color: ${colors.sidebarMuted}; padding: 11px 12px; border-radius: 10px; font-size: 14px; text-align: left;
  }
  .ins-sidebar-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
  .ins-sidebar-item-active { background: rgba(127,217,156,0.14); color: ${colors.mint}; font-weight: 700; }
  .ins-sidebar-footer { display: flex; align-items: center; gap: 10px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); }
  .ins-sidebar-avatar {
    width: 34px; height: 34px; border-radius: 17px; background: ${colors.mint}; color: ${colors.textDark};
    display:flex; align-items:center; justify-content:center; font-weight:700; font-size: 14px; flex-shrink:0;
  }
  .ins-sidebar-user { flex: 1; min-width: 0; }
  .ins-sidebar-user-name { color: #fff; font-size: 13px; font-weight: 600; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ins-sidebar-user-sub { color: ${colors.sidebarMuted}; font-size: 11px; margin: 0; }
  .ins-sidebar-logout { background: none; border: none; color: ${colors.sidebarMuted}; cursor: pointer; display:flex; }

  /* ---------- Main column ---------- */
  .ins-main { flex: 1; min-width: 0; display: flex; flex-direction: column; height: 100vh; background:
    linear-gradient(180deg, rgba(127,217,156,0.14) 0%, rgba(127,217,156,0.04) 35%, rgba(255,255,255,0) 70%); overflow: hidden; }
  .ins-topbar { display: flex; justify-content: space-between; align-items: center; padding: 28px 40px 4px; flex-shrink: 0; }
  .ins-eyebrow-row { display: flex; align-items: center; gap: 6px; }
  .ins-eyebrow { font-size: 11.5px; font-weight: 800; color: ${colors.textMuted}; letter-spacing: 1.4px; }
  .ins-topbar-right { display: flex; gap: 10px; }
  .ins-bell-btn {
    width: 44px; height: 44px; border-radius: 22px; border: 1px solid ${colors.border}; background: #fff;
    display: flex; align-items: center; justify-content: center; cursor: pointer;
  }
  .ins-load-error { color: ${colors.coral}; font-size: 13px; margin: 0 0 12px; }

  .ins-scroll { flex: 1; overflow-y: auto; }
  .ins-content { padding: 4px 40px 24px; width: 100%; max-width: none; }
  .ins-greeting { font-size: 25px; font-weight: 800; color: ${colors.textDark}; letter-spacing: -0.4px; margin: 2px 0 20px; }

  /* ---------- Loading ---------- */
  .ins-loading-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 56px 0; gap: 14px; }
  .ins-loading-ring {
    width: 46px; height: 46px; border-radius: 23px; display: flex; align-items: center; justify-content: center;
    background: ${colors.soft}; border: 1.5px solid ${colors.ring}; animation: ins-spin 1.1s linear infinite;
  }
  .ins-loading-text { font-size: 13px; font-weight: 600; color: ${colors.textMuted}; animation: ins-pulse 1.4s ease-in-out infinite; margin: 0; }
  @keyframes ins-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes ins-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }

  /* ---------- Cards ---------- */
  .ins-cards { display: flex; flex-direction: column; gap: 16px; }
  .ins-fade-in { animation: ins-fade-up 0.42s cubic-bezier(0.16, 1, 0.3, 1) both; }
  @keyframes ins-fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  .ins-card {
    background: ${colors.cardBg}; border-radius: 20px; padding: 18px; display: flex; flex-direction: column; gap: 10px;
    border: 1px solid ${colors.border}; box-shadow: 0 8px 16px rgba(15,23,42,0.05);
  }
  .ins-saving-card { background: ${colors.soft}; border: 1px solid ${colors.ring}; border-left: 3px solid ${colors.mint}; }

  .ins-card-header-row { display: flex; align-items: center; gap: 8px; }
  .ins-icon-badge { width: 28px; height: 28px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ins-card-label { font-size: 13.5px; font-weight: 700; color: ${colors.textDark}; margin: 0; }
  .ins-card-body { font-size: 13.5px; color: ${colors.textDark}; line-height: 20px; opacity: 0.8; margin: 0; }

  .ins-rec-row { display: flex; gap: 10px; margin-top: 2px; }
  .ins-rec-dot { width: 6px; height: 6px; border-radius: 3px; background: #D1D5DB; margin-top: 7px; flex-shrink: 0; }
  .ins-rec-body { flex: 1; min-width: 0; }
  .ins-rec-text { font-size: 13.5px; color: ${colors.textDark}; line-height: 19px; margin: 0; }
  .ins-savings-pill {
    display: inline-flex; align-items: center; gap: 4px; background: ${colors.background}; border-radius: 999px;
    padding: 3px 8px; margin-top: 5px; font-size: 11.5px; font-weight: 700; color: ${colors.mintDark};
  }

  .ins-habit-row { display: flex; align-items: center; gap: 8px; margin-top: 2px; }
  .ins-habit-text { font-size: 13.5px; color: ${colors.textDark}; flex: 1; }
  .ins-habit-amount-pill { background: ${colors.background}; border-radius: 999px; padding: 3px 9px; font-size: 12px; font-weight: 700; color: ${colors.textDark}; }

  .ins-empty-state { text-align: center; padding: 40px 20px; color: ${colors.textMuted}; font-size: 13.5px; }

  /* ---------- Chat ---------- */
  .ins-chat-list { display: flex; flex-direction: column; gap: 14px; margin-top: 22px; }
  .ins-user-row { display: flex; justify-content: flex-end; }
  .ins-user-bubble {
    max-width: 85%; background: ${colors.textDark}; color: #fff; border-radius: 18px; border-bottom-right-radius: 4px;
    padding: 13px; font-size: 13.5px; font-weight: 500; line-height: 19px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  .ins-bot-row { display: flex; align-items: flex-end; gap: 6px; }
  .ins-bot-avatar {
    width: 22px; height: 22px; border-radius: 11px; background: ${colors.background};
    display: flex; align-items: center; justify-content: center; margin-bottom: 2px; flex-shrink: 0;
  }
  .ins-bot-bubble {
    max-width: 78%; background: #fff; border: 1px solid ${colors.border}; border-radius: 18px; border-bottom-left-radius: 4px;
    padding: 13px; font-size: 13.5px; color: ${colors.textDark}; line-height: 19px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.03);
  }
  .ins-typing-row { display: flex; gap: 4px; padding: 2px; }
  .ins-typing-dot { width: 6px; height: 6px; border-radius: 3px; background: ${colors.mintDark}; animation: ins-typing 0.9s ease-in-out infinite; }
  @keyframes ins-typing { 0%, 60%, 100% { opacity: 0.3; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-4px); } }

  /* ---------- Ask bar ---------- */
  .ins-ask-bar {
    flex-shrink: 0; border-top: 1px solid ${colors.border}; background: rgba(255,255,255,0.92); backdrop-filter: blur(6px);
    padding: 12px 40px 16px; display: flex; flex-direction: column; gap: 8px;
  }
  .ins-ask-label-row { display: flex; align-items: center; gap: 6px; }
  .ins-ask-label { font-size: 12px; font-weight: 700; color: ${colors.textMuted}; }
  .ins-ask-input-row { display: flex; align-items: center; gap: 10px; width: 100%; max-width: 100%; }
  .ins-ask-input {
    flex: 1; border: 1.5px solid ${colors.border}; border-radius: 999px; padding: 12px 18px; font-size: 14px;
    color: ${colors.textDark}; background: ${colors.background}; outline: none;
    min-width: 0;
  }
  .ins-ask-input:focus { border-color: ${colors.mintDark}; }
  .ins-ask-send {
    width: 42px; height: 42px; border-radius: 21px; background: ${colors.mintDark}; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    box-shadow: 0 4px 8px rgba(63,158,99,0.3);
  }
  .ins-ask-send:disabled { opacity: 0.35; box-shadow: none; cursor: default; }

  /* ---------- Modals ---------- */
  .ins-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 50; }
  .ins-modal-title { font-size: 16px; font-weight: 700; color: ${colors.textDark}; margin: 0 0 12px; }
  .ins-quickadd-sheet { background: #fff; border-radius: 20px; padding: 24px; width: 90%; max-width: 340px; }
  .ins-quickadd-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .ins-close-btn { background: none; border: none; cursor: pointer; color: ${colors.textMuted}; display: flex; }
  .ins-quickadd-input { width: 100%; border: 1.5px solid ${colors.border}; border-radius: 12px; padding: 12px 14px; font-size: 14px; color: ${colors.textDark}; margin-bottom: 12px; outline: none; }
  .ins-quickadd-btn { width: 100%; background: ${colors.mint}; border-radius: 999px; padding: 14px 0; border: none; font-size: 15px; font-weight: 700; color: ${colors.textDark}; cursor: pointer; }
  .ins-quickadd-error { font-size: 12.5px; color: ${colors.coral}; margin-bottom: 8px; }

  /* ---------- Mobile bottom tab bar ---------- */
  .ins-mobile-tabbar { display: none; }

  @media (max-width: 900px) {
    .ins-sidebar { display: none; }
    .ins-topbar { padding: 20px 18px 4px; }
    .ins-content { padding: 4px 18px 24px; }
    .ins-ask-bar { padding: 10px 18px 14px; }

    .ins-mobile-tabbar {
      display: flex;
      position: fixed;
      bottom: 0; left: 0; right: 0;
      background: #fff;
      border-top: 0.5px solid ${colors.border};
      padding: 6px 0 10px;
      height: 60px;
      z-index: 20;
    }
    .ins-tab-btn {
      flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 2px; background: none; border: none; cursor: pointer; color: ${colors.textMuted}; font-size: 11px;
    }
    .ins-tab-btn-active { color: ${colors.mintDark}; }
    .ins-fab-wrapper { flex: 1; display: flex; justify-content: center; align-items: center; position: relative; top: -20px; }
    .ins-fab {
      width: 56px; height: 56px; border-radius: 28px; background: ${colors.mint}; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.15);
    }
    .ins-shell { padding-bottom: 0; }
    .ins-main { padding-bottom: 60px; }
  }

  @media (max-width: 560px) {
    .ins-content { padding: 4px 14px 24px; }
    .ins-ask-bar { padding: 10px 14px 14px; }
    .ins-card { padding: 14px; border-radius: 16px; }
  }
`;