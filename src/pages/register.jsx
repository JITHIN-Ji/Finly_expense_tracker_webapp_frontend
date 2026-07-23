import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Wallet, Check, AlertCircle } from "lucide-react";
import { registerUser } from "../services/authService";

const colors = {
  mint: "#7FD99C",
  mintDark: "#3F9E63",
  coral: "#FF6B6B",
  textDark: "#1F2A24",
  textMuted: "#8A9791",
  border: "#D8E3DC",
};

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.28 1.48-1.13 2.73-2.4 3.58v2.98h3.88c2.27-2.09 3.58-5.17 3.58-8.8z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.88-2.98c-1.08.72-2.46 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.92H1.3v3.08C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.31 14.34A7.2 7.2 0 0 1 4.9 12c0-.81.14-1.6.4-2.34V6.58H1.3A11.97 11.97 0 0 0 0 12c0 1.93.46 3.76 1.3 5.42l4.01-3.08z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.3 6.58l4.01 3.08C6.25 6.85 8.89 4.75 12 4.75z" />
    </svg>
  );
}

function AppleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="#000000" {...props}>
      <path d="M16.36 1.01c.1 1.1-.32 2.16-.96 2.94-.66.8-1.75 1.42-2.79 1.34-.12-1.07.4-2.18 1.02-2.9.7-.83 1.9-1.44 2.73-1.38zM20.6 17.06c-.53 1.22-.78 1.76-1.46 2.84-.95 1.5-2.29 3.38-3.96 3.4-1.48.01-1.86-.96-3.87-.95-2 .01-2.43.97-3.91.96-1.66-.02-2.93-1.7-3.88-3.2-2.66-4.2-2.94-9.13-1.3-11.76 1.17-1.86 3.02-2.95 4.75-2.95 1.76 0 2.87 1 4.33 1 1.42 0 2.28-1 4.32-1 1.55 0 3.19.85 4.36 2.31-3.83 2.1-3.2 7.57.62 9.35z" />
    </svg>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(180deg, #7FD99C 0%, #E4F5E9 35%, #FFFFFF 65%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    padding: "24px 32px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    minHeight: "100vh",
    padding: "32px 24px 40px",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    paddingTop: 16,
    marginBottom: 28,
  },
  logoBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    backgroundColor: "#FFFFFF",
    boxShadow: `0 6px 12px rgba(63, 158, 99, 0.2)`,
  },
  headline: {
    fontSize: 24,
    fontWeight: 700,
    color: colors.textDark,
    marginBottom: 6,
    textAlign: "left",
  },
  subtext: {
    fontSize: 14,
    color: colors.textDark,
    opacity: 0.7,
    textAlign: "left",
    maxWidth: 720,
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: colors.textDark,
    opacity: 0.65,
    marginBottom: 6,
    marginLeft: 2,
    display: "block",
  },
  inputWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    border: "1.5px solid rgba(255,255,255,0.8)",
    borderRadius: 14,
    padding: "0 14px",
    backgroundColor: "rgba(255,255,255,0.85)",
    transition: "border-color 0.15s ease, background-color 0.15s ease",
  },
  inputWrapperFocused: {
    borderColor: colors.mint,
    backgroundColor: "#FFFFFF",
  },
  inputIcon: {
    marginRight: 10,
    flexShrink: 0,
    color: colors.textMuted,
  },
  input: {
    flex: 1,
    padding: "13px 0",
    fontSize: 14,
    color: colors.textDark,
    border: "none",
    outline: "none",
    background: "transparent",
    minWidth: 0,
  },
  eyeButton: {
    background: "none",
    border: "none",
    padding: 4,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    color: colors.textMuted,
  },
  strengthRow: {
    display: "flex",
    flexDirection: "row",
    gap: 4,
    padding: "0 2px",
    marginTop: 8,
  },
  strengthSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    transition: "background-color 0.2s ease",
  },
  termsRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    textAlign: "left",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    border: `1.5px solid ${colors.border}`,
    backgroundColor: "#FFFFFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: colors.mint,
    borderColor: colors.mint,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: colors.textDark,
    opacity: 0.75,
    lineHeight: "18px",
    margin: 0,
  },
  termsLink: {
    color: colors.mintDark,
    fontWeight: 700,
    opacity: 1,
  },
  errorBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 10,
    padding: "8px 10px",
  },
  errorText: {
    flex: 1,
    fontSize: 12.5,
    color: colors.coral,
    fontWeight: 500,
    margin: 0,
  },
  ctaButton: {
    backgroundColor: colors.mint,
    borderRadius: 999,
    padding: "17px 0",
    border: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: `0 6px 14px rgba(63, 158, 99, 0.3)`,
    cursor: "pointer",
    transition: "opacity 0.15s ease, transform 0.1s ease",
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
  dividerRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  dividerText: {
    margin: "0 10px",
    fontSize: 11.5,
    color: colors.textDark,
    opacity: 0.6,
    whiteSpace: "nowrap",
  },
  socialRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    border: "1.5px solid rgba(255,255,255,0.9)",
    boxShadow: "0 3px 6px rgba(0,0,0,0.06)",
    cursor: "pointer",
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 14,
    color: colors.textDark,
    opacity: 0.7,
    margin: 0,
  },
  footerLink: {
    color: colors.mintDark,
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default function RegisterPage({ onRegisterSuccess }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setErrorMsg("Please agree to the Terms of Service.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      const user = await registerUser(fullName, email, password);
      if (onRegisterSuccess) onRegisterSuccess(user);
      navigate("/onboarding");
    } catch (err) {
      setErrorMsg(err?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const getStrength = (val) => {
    if (val.length === 0) return 0;
    if (val.length < 6) return 1;
    if (val.length < 10) return 2;
    return 3;
  };
  const strength = getStrength(password);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoBox}>
            <Wallet size={26} color={colors.mintDark} />
          </div>
          <h1 style={styles.headline}>Create your account</h1>
          <p style={styles.subtext}>
            Track smarter, spend better — let's get started
          </p>
        </div>

        {/* Form */}
        <form style={styles.form} onSubmit={handleRegister}>
          {/* Full Name */}
          <div>
            <label style={styles.fieldLabel}>Full name</label>
            <div
              style={{
                ...styles.inputWrapper,
                ...(focusedField === "name" ? styles.inputWrapperFocused : {}),
              }}
            >
              <User size={18} style={styles.inputIcon} />
              <input
                style={styles.input}
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={styles.fieldLabel}>Email</label>
            <div
              style={{
                ...styles.inputWrapper,
                ...(focusedField === "email" ? styles.inputWrapperFocused : {}),
              }}
            >
              <Mail size={18} style={styles.inputIcon} />
              <input
                style={styles.input}
                type="email"
                placeholder="you@example.com"
                autoCapitalize="none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={styles.fieldLabel}>Password</label>
            <div
              style={{
                ...styles.inputWrapper,
                ...(focusedField === "password" ? styles.inputWrapperFocused : {}),
              }}
            >
              <Lock size={18} style={styles.inputIcon} />
              <input
                style={styles.input}
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
              />
              <button
                type="button"
                style={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {password.length > 0 && (
              <div style={styles.strengthRow}>
                {[1, 2, 3].map((seg) => (
                  <div
                    key={seg}
                    style={{
                      ...styles.strengthSegment,
                      backgroundColor:
                        strength >= seg
                          ? strength === 1
                            ? colors.coral
                            : strength === 2
                            ? "#FFBF00"
                            : colors.mint
                          : "rgba(255,255,255,0.6)",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label style={styles.fieldLabel}>Confirm password</label>
            <div
              style={{
                ...styles.inputWrapper,
                ...(focusedField === "confirm" ? styles.inputWrapperFocused : {}),
              }}
            >
              <Lock size={18} style={styles.inputIcon} />
              <input
                style={styles.input}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocusedField("confirm")}
                onBlur={() => setFocusedField(null)}
              />
              <button
                type="button"
                style={styles.eyeButton}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Terms checkbox */}
          <button
            type="button"
            style={styles.termsRow}
            onClick={() => setAgreed(!agreed)}
          >
            <div
              style={{
                ...styles.checkbox,
                ...(agreed ? styles.checkboxChecked : {}),
              }}
            >
              {agreed && <Check size={13} color={colors.textDark} />}
            </div>
            <p style={styles.termsText}>
              I agree to the <span style={styles.termsLink}>Terms of Service</span>{" "}
              and <span style={styles.termsLink}>Privacy Policy</span>
            </p>
          </button>

          {errorMsg && (
            <div style={styles.errorBox}>
              <AlertCircle size={15} color={colors.coral} />
              <p style={styles.errorText}>{errorMsg}</p>
            </div>
          )}

          {/* CTA Button */}
          <button
            type="submit"
            style={{
              ...styles.ctaButton,
              ...(loading ? styles.ctaButtonDisabled : {}),
            }}
            disabled={loading}
          >
            <span style={styles.ctaText}>
              {loading ? "Creating account…" : "Create account"}
            </span>
          </button>

          {/* Divider */}
          <div style={styles.dividerRow}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or sign up with</span>
            <div style={styles.dividerLine} />
          </div>

          {/* Social buttons */}
          <div style={styles.socialRow}>
            <button type="button" style={styles.socialCircle}>
              <GoogleIcon />
            </button>
            <button type="button" style={styles.socialCircle}>
              <AppleIcon />
            </button>
          </div>
        </form>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account?{" "}
            <Link to="/login" style={styles.footerLink}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}