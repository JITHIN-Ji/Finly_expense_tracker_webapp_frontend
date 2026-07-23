import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, GraduationCap, MoreHorizontal, Banknote, UserCircle } from "lucide-react";
import { completeOnboarding } from "../services/authService";
import { setIncome as saveIncome } from "../services/financeService";

const colors = {
  mint: "#7FD99C",
  mintDark: "#3F9E63",
  coral: "#FF6B6B",
  textDark: "#1F2A24",
  textMuted: "#8A9791",
  border: "#E3ECE6",
  background: "#F6F9F7",
  cardBg: "#FFFFFF",
};

const OCCUPATIONS = [
  { label: "Working professional", value: "professional", Icon: Briefcase },
  { label: "Student", value: "student", Icon: GraduationCap },
  { label: "Other", value: "other", Icon: MoreHorizontal },
];

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    backgroundColor: colors.background,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    padding: "24px 32px",
  },
  container: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: colors.background,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "40px 28px",
    boxSizing: "border-box",
    boxShadow: "none",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 28,
    gap: 12,
    maxWidth: 720,
  },
  logoBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.cardBg,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  headline: {
    fontSize: 22,
    fontWeight: 700,
    color: colors.textDark,
    marginBottom: 6,
    textAlign: "left",
  },
  subtext: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "left",
    maxWidth: 720,
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: colors.textDark,
    marginBottom: 4,
    display: "block",
  },
  occupationRow: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  occupationCard: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    padding: "16px 8px",
    borderRadius: 14,
    border: `1.5px solid ${colors.border}`,
    backgroundColor: "#FFFFFF",
    cursor: "pointer",
    transition: "border-color 0.15s ease, background-color 0.15s ease",
  },
  occupationCardActive: {
    borderColor: colors.mint,
    backgroundColor: "rgba(184,230,200,0.15)",
  },
  occupationText: {
    fontSize: 11.5,
    color: colors.textMuted,
    textAlign: "center",
    fontWeight: 600,
    margin: 0,
  },
  occupationTextActive: {
    color: colors.mintDark,
  },
  inputWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    border: `1px solid ${colors.border}`,
    borderRadius: 14,
    padding: "0 14px",
    backgroundColor: "#FFFFFF",
  },
  inputIcon: {
    marginRight: 10,
    flexShrink: 0,
    color: colors.textMuted,
  },
  input: {
    flex: 1,
    padding: "14px 0",
    fontSize: 15,
    color: colors.textDark,
    border: "none",
    outline: "none",
    background: "transparent",
    minWidth: 0,
  },
  switchRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    border: `1px solid ${colors.border}`,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.textDark,
    margin: 0,
  },
  switchSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    margin: 0,
  },
  switchTrack: {
    width: 46,
    height: 26,
    borderRadius: 13,
    border: "none",
    padding: 2,
    cursor: "pointer",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    transition: "background-color 0.2s ease",
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
    transition: "transform 0.2s ease",
  },
  errorText: {
    color: colors.coral,
    fontSize: 13,
    textAlign: "center",
    margin: 0,
  },
  ctaButton: {
    backgroundColor: colors.mint,
    borderRadius: 16,
    padding: "16px 0",
    border: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    cursor: "pointer",
  },
  ctaButtonDisabled: {
    opacity: 0.6,
    cursor: "default",
  },
  ctaText: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.textDark,
  },
};

function Switch({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        ...styles.switchTrack,
        backgroundColor: value ? colors.mint : colors.border,
        justifyContent: value ? "flex-end" : "flex-start",
      }}
    >
      <div style={styles.switchThumb} />
    </button>
  );
}

export default function OnboardingPage({ onOnboardingComplete }) {
  const [occupation, setOccupation] = useState(null);
  const [income, setIncomeValue] = useState("");
  const [budgetNotifications, setBudgetNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();
    if (!occupation) {
      setErrorMsg("Please select what best describes you.");
      return;
    }
    setSaving(true);
    setErrorMsg("");
    try {
      const user = await completeOnboarding(occupation, budgetNotifications);
      const parsedIncome = parseFloat(income.replace(/,/g, ""));
      if (income.trim() && !isNaN(parsedIncome) && parsedIncome > 0) {
        await saveIncome(parsedIncome);
      }
      if (onOnboardingComplete) onOnboardingComplete(user);
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.logoBox}>
            <UserCircle size={28} color={colors.mintDark} />
          </div>
          <h1 style={styles.headline}>Tell us about you</h1>
          <p style={styles.subtext}>This help us personalize your budget insights</p>
        </div>

        <form style={styles.form} onSubmit={handleSave}>
          <div>
            <label style={styles.fieldLabel}>You are a...</label>
            <div style={styles.occupationRow}>
              {OCCUPATIONS.map((opt) => {
                const active = occupation === opt.value;
                const { Icon } = opt;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    style={{
                      ...styles.occupationCard,
                      ...(active ? styles.occupationCardActive : {}),
                    }}
                    onClick={() => setOccupation(opt.value)}
                  >
                    <Icon size={22} color={active ? colors.mintDark : colors.textMuted} />
                    <p style={{ ...styles.occupationText, ...(active ? styles.occupationTextActive : {}) }}>
                      {opt.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={styles.fieldLabel}>Monthly income (if applicable)</label>
            <div style={styles.inputWrapper}>
              <Banknote size={18} style={styles.inputIcon} />
              <input
                style={styles.input}
                placeholder="e.g. 5000"
                inputMode="numeric"
                value={income}
                onChange={(e) => setIncomeValue(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.switchRow}>
            <div style={{ flex: 1 }}>
              <p style={styles.switchLabel}>Budget notifications</p>
              <p style={styles.switchSub}>Get notified when you're close to your limit</p>
            </div>
            <Switch value={budgetNotifications} onChange={setBudgetNotifications} />
          </div>

          {errorMsg && <p style={styles.errorText}>{errorMsg}</p>}

          <button
            type="submit"
            style={{ ...styles.ctaButton, ...(saving ? styles.ctaButtonDisabled : {}) }}
            disabled={saving}
          >
            <span style={styles.ctaText}>{saving ? "Saving..." : "Save and continue"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}