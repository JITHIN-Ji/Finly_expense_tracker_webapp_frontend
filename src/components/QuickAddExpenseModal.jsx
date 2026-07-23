// src/components/QuickAddExpenseModal.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  XCircle,
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Film,
  HeartPulse,
  Banknote,
  CircleEllipsis,
  Tag,
  Calendar,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { logExpenseDirect } from "../services/chatService";
import { parseExpenseInput, learnCategory } from "../utils/expenseParser";

const colors = {
  mint: "#7FD99C",
  mintDark: "#3F9E63",
  coral: "#FF6B6B",
  textDark: "#1F2A24",
  textMuted: "#8A9791",
  border: "#E3ECE6",
  background: "#F6F9F7",
};

const CATEGORIES = [
  { key: "food", label: "Food", Icon: Utensils },
  { key: "transport", label: "Transport", Icon: Car },
  { key: "shopping", label: "Shopping", Icon: ShoppingBag },
  { key: "bills", label: "Bills", Icon: Receipt },
  { key: "entertainment", label: "Entertainment", Icon: Film },
  { key: "health", label: "Health", Icon: HeartPulse },
  { key: "income", label: "Income", Icon: Banknote },
  { key: "uncategorized", label: "Other", Icon: CircleEllipsis },
];

const DATE_CHIPS = ["Today", "Yesterday"];
const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function startOfDay(d) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}
function addDays(d, n) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}
function toIsoDateString(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function formatDateLabel(d) {
  const today = startOfDay(new Date());
  const yesterday = addDays(today, -1);
  if (isSameDay(d, today)) return "Today";
  if (isSameDay(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
function buildMonthGrid(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstOfMonth.getDay();

  const cells = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, month, day));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function FieldRow({ Icon, label, children, last }) {
  return (
    <div className={`qa-field-row${!last ? " qa-field-row-border" : ""}`}>
      <div className="qa-field-left">
        <Icon size={14} color={colors.textMuted} />
        <span className="qa-field-label">{label}</span>
      </div>
      {children}
    </div>
  );
}

export default function QuickAddExpenseModal({ visible, onClose, onSaved }) {
  const [text, setText] = useState("");
  const [amountOverride, setAmountOverride] = useState(null);
  const [descOverride, setDescOverride] = useState(null);
  const [categoryOverride, setCategoryOverride] = useState(null);
  const [typeOverride, setTypeOverride] = useState(null);
  const [dateOverride, setDateOverride] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(startOfDay(new Date()));
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [entered, setEntered] = useState(false); // drives the slide-up transition
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      // next tick so the initial (off-screen) state paints before transitioning in
      requestAnimationFrame(() => setEntered(true));
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setEntered(false);
    }
  }, [visible]);

  const parsed = useMemo(() => parseExpenseInput(text), [text]);

  const amount = amountOverride !== null ? Number(amountOverride) || null : parsed.amount;
  const category = categoryOverride ?? parsed.category ?? "uncategorized";
  const type = typeOverride ?? parsed.type;
  const description = descOverride !== null ? descOverride : parsed.description;

  const effectiveDate = dateOverride
    ?? (parsed.isoDate ? startOfDay(new Date(parsed.isoDate)) : startOfDay(new Date()));
  const dateLabel = formatDateLabel(effectiveDate);

  const showFields = text.trim().length > 0;
  const categoryMeta = CATEGORIES.find((c) => c.key === category) ?? CATEGORIES[CATEGORIES.length - 1];
  const today = startOfDay(new Date());

  if (!visible) return null;

  const reset = () => {
    setText("");
    setAmountOverride(null);
    setDescOverride(null);
    setCategoryOverride(null);
    setTypeOverride(null);
    setDateOverride(null);
    setCalendarOpen(false);
    setCalendarMonth(startOfDay(new Date()));
    setCategoryPickerOpen(false);
    setFeedback(null);
    setLoading(false);
  };

  const handleClose = () => {
    setEntered(false);
    setTimeout(() => {
      reset();
      onClose();
    }, 200);
  };

  const handleCategoryPick = (key) => {
    setCategoryOverride(key);
    setCategoryPickerOpen(false);
    const firstWord = text.trim().split(/\s+/)[0];
    if (firstWord) learnCategory(firstWord, key);
  };

  const handleDateChipPick = (chip) => {
    const picked = chip === "Yesterday" ? addDays(today, -1) : today;
    setDateOverride(picked);
    setCalendarOpen(false);
    setCalendarMonth(picked);
  };

  const handleCalendarDayPick = (day) => {
    if (day > today) return;
    setDateOverride(day);
    setCalendarOpen(false);
  };

  const goToPrevMonth = () => setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const goToNextMonth = () => setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  const isNextMonthDisabled =
    calendarMonth.getFullYear() === today.getFullYear() && calendarMonth.getMonth() === today.getMonth();

  const handleSubmit = async () => {
    if (!amount || loading) return;
    setLoading(true);
    setFeedback(null);
    try {
      const res = await logExpenseDirect({
        item: description || categoryMeta.label,
        amount,
        category,
        type,
        date: toIsoDateString(effectiveDate),
      });
      setFeedback({ type: "success", message: res?.message || "Expense added." });
      if (onSaved) await onSaved();
      setTimeout(handleClose, 900);
    } catch (err) {
      setFeedback({ type: "error", message: err?.message || "Couldn't add that. Try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (t) => {
    setText(t);
    setAmountOverride(null);
    setDescOverride(null);
    setCategoryOverride(null);
    setTypeOverride(null);
    setDateOverride(null);
    setCalendarOpen(false);
  };

  const CategoryMetaIcon = categoryMeta.Icon;

  return (
    <div className="qa-overlay" onClick={handleClose}>
      <style>{css}</style>
      <div className={`qa-sheet${entered ? " qa-sheet-in" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="qa-grabber" />

        <div className="qa-header">
          <p className="qa-title">Add Expense</p>
          <button className="qa-icon-btn" onClick={handleClose}>
            <X size={20} color={colors.textMuted} />
          </button>
        </div>

        <div className="qa-input-row">
          <input
            ref={inputRef}
            className="qa-input"
            placeholder="Describe your expense..."
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && amount && !loading) handleSubmit();
            }}
            disabled={loading}
          />
          {text.length > 0 && (
            <button className="qa-icon-btn" onClick={() => handleTextChange("")}>
              <XCircle size={18} color={colors.textMuted} />
            </button>
          )}
        </div>
        {!showFields && <p className="qa-hint">e.g. "Lunch 250" · "Uber 180" · "Salary 50000"</p>}

        {showFields && (
          <div className="qa-fields-card">
            <FieldRow Icon={Tag} label="Amount">
              <input
                className="qa-field-input"
                value={amount !== null ? String(amount) : ""}
                onChange={(e) => setAmountOverride(e.target.value)}
                type="text"
                inputMode="decimal"
                placeholder="0.00"
              />
            </FieldRow>

            <FieldRow Icon={CategoryMetaIcon} label="Category">
              <button className="qa-field-press" onClick={() => setCategoryPickerOpen((v) => !v)}>
                <span className="qa-field-value">{categoryMeta.label}</span>
                {categoryPickerOpen ? (
                  <ChevronUp size={14} color={colors.textMuted} />
                ) : (
                  <ChevronDown size={14} color={colors.textMuted} />
                )}
              </button>
            </FieldRow>

            {categoryPickerOpen && (
              <div className="qa-chip-wrap">
                {CATEGORIES.map((c) => {
                  const active = c.key === category;
                  const Icon = c.Icon;
                  return (
                    <button
                      key={c.key}
                      className={`qa-chip${active ? " qa-chip-active" : ""}`}
                      onClick={() => handleCategoryPick(c.key)}
                    >
                      <Icon size={13} color={active ? "#FFFFFF" : colors.textDark} />
                      {c.label}
                    </button>
                  );
                })}
              </div>
            )}

            <FieldRow Icon={Calendar} label="Date">
              <div className="qa-date-chip-row">
                {DATE_CHIPS.map((d) => (
                  <button
                    key={d}
                    className={`qa-date-chip${dateLabel === d ? " qa-date-chip-active" : ""}`}
                    onClick={() => handleDateChipPick(d)}
                  >
                    {d}
                  </button>
                ))}
                {!DATE_CHIPS.includes(dateLabel) && (
                  <span className="qa-date-chip qa-date-chip-active">{dateLabel}</span>
                )}
                <button
                  className="qa-calendar-arrow-btn"
                  onClick={() => {
                    setCalendarMonth(effectiveDate);
                    setCalendarOpen((v) => !v);
                  }}
                >
                  {calendarOpen ? (
                    <ChevronUp size={18} color={colors.mintDark} />
                  ) : (
                    <ChevronDown size={18} color={colors.mintDark} />
                  )}
                </button>
              </div>
            </FieldRow>

            {calendarOpen && (
              <div className="qa-calendar-box">
                <div className="qa-calendar-header">
                  <button className="qa-icon-btn" onClick={goToPrevMonth}>
                    <ChevronLeft size={18} color={colors.textDark} />
                  </button>
                  <span className="qa-calendar-month-label">
                    {MONTH_LABELS[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                  </span>
                  <button className="qa-icon-btn" onClick={goToNextMonth} disabled={isNextMonthDisabled}>
                    <ChevronRight size={18} color={isNextMonthDisabled ? colors.border : colors.textDark} />
                  </button>
                </div>

                <div className="qa-calendar-week-row">
                  {WEEKDAY_LABELS.map((w, i) => (
                    <span key={`${w}-${i}`} className="qa-calendar-weekday">{w}</span>
                  ))}
                </div>

                <div className="qa-calendar-grid">
                  {buildMonthGrid(calendarMonth).map((day, idx) => {
                    if (!day) return <div key={`blank-${idx}`} className="qa-calendar-cell" />;
                    const isFuture = day > today;
                    const isSelected = isSameDay(day, effectiveDate);
                    const isTodayCell = isSameDay(day, today);
                    return (
                      <button
                        key={day.toISOString()}
                        className="qa-calendar-cell"
                        disabled={isFuture}
                        onClick={() => handleCalendarDayPick(day)}
                      >
                        <span
                          className={`qa-calendar-cell-text${isFuture ? " qa-disabled" : ""}${
                            isTodayCell && !isSelected ? " qa-today" : ""
                          }${isSelected ? " qa-selected" : ""}`}
                        >
                          {day.getDate()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <FieldRow Icon={ArrowUpDown} label="Type">
              <div className="qa-type-toggle">
                <button
                  className={`qa-type-option${type === "expense" ? " qa-type-option-active" : ""}`}
                  onClick={() => setTypeOverride("expense")}
                >
                  Expense
                </button>
                <button
                  className={`qa-type-option${type === "income" ? " qa-type-option-active" : ""}`}
                  onClick={() => setTypeOverride("income")}
                >
                  Income
                </button>
              </div>
            </FieldRow>

            <FieldRow Icon={FileText} label="Description" last>
              <input
                className="qa-field-input"
                value={description}
                onChange={(e) => setDescOverride(e.target.value)}
                placeholder="—"
              />
            </FieldRow>
          </div>
        )}

        {feedback && (
          <div className={`qa-feedback-box ${feedback.type === "success" ? "qa-feedback-success" : "qa-feedback-error"}`}>
            {feedback.type === "success" ? (
              <CheckCircle2 size={16} color={colors.mintDark} />
            ) : (
              <AlertCircle size={16} color={colors.coral} />
            )}
            <span style={{ color: feedback.type === "success" ? colors.mintDark : colors.coral }}>
              {feedback.message}
            </span>
          </div>
        )}

        {showFields && (
          <button className="qa-submit-btn" onClick={handleSubmit} disabled={!amount || loading}>
            {loading ? <Loader2 size={18} color="#fff" className="qa-spin" /> : "Add Expense"}
          </button>
        )}
      </div>
    </div>
  );
}

const css = `
  .qa-overlay {
    position: fixed; inset: 0; background: rgba(14,31,23,0.45); backdrop-filter: blur(3px);
    display: flex; align-items: flex-end; justify-content: center; z-index: 100;
  }
  .qa-sheet {
    width: 100%; max-width: 480px; background: #fff; border-radius: 28px 28px 0 0;
    padding: 10px 20px 28px; display: flex; flex-direction: column; gap: 12px;
    max-height: 88vh; overflow-y: auto;
    transform: translateY(100%); transition: transform 0.28s cubic-bezier(0.22,1,0.36,1);
  }
  .qa-sheet-in { transform: translateY(0); }

  .qa-grabber { width: 40px; height: 4px; border-radius: 2px; background: ${colors.border}; align-self: center; margin-bottom: 4px; }
  .qa-header { display: flex; align-items: center; justify-content: space-between; }
  .qa-title { font-size: 17px; font-weight: 700; color: ${colors.textDark}; margin: 0; }
  .qa-icon-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; }
  .qa-icon-btn:disabled { cursor: default; opacity: 0.5; }

  .qa-input-row {
    display: flex; align-items: center; gap: 8px; border: 1.5px solid ${colors.border}; border-radius: 14px;
    padding: 0 14px; background: ${colors.background};
  }
  .qa-input { flex: 1; border: none; background: none; outline: none; padding: 13px 0; font-size: 15px; color: ${colors.textDark}; }
  .qa-hint { font-size: 12px; color: ${colors.textMuted}; margin: 0 0 0 2px; }

  .qa-fields-card { border: 1px solid rgba(17,24,39,0.06); border-radius: 16px; background: #FAFAFB; padding: 0 14px; }
  .qa-field-row { display: flex; align-items: center; justify-content: space-between; padding: 11px 0; gap: 12px; }
  .qa-field-row-border { border-bottom: 1px solid rgba(17,24,39,0.06); }
  .qa-field-left { display: flex; align-items: center; gap: 7px; width: 110px; flex-shrink: 0; }
  .qa-field-label { font-size: 12.5px; color: ${colors.textMuted}; font-weight: 600; }
  .qa-field-value { font-size: 13.5px; color: ${colors.textDark}; font-weight: 600; }
  .qa-field-input {
    flex: 1; text-align: right; font-size: 13.5px; color: ${colors.textDark}; font-weight: 600;
    border: none; background: none; outline: none;
  }
  .qa-field-press { display: flex; align-items: center; gap: 4px; background: none; border: none; cursor: pointer; }

  .qa-chip-wrap { display: flex; flex-wrap: wrap; gap: 6px; padding-bottom: 10px; }
  .qa-chip {
    display: flex; align-items: center; gap: 4px; border-radius: 999px; padding: 6px 10px;
    background: #EFEFF2; border: none; cursor: pointer; font-size: 12px; font-weight: 600; color: ${colors.textDark};
  }
  .qa-chip-active { background: ${colors.mintDark}; color: #fff; }

  .qa-date-chip-row { display: flex; align-items: center; gap: 6px; }
  .qa-date-chip {
    border-radius: 999px; padding: 4px 10px; background: #EFEFF2; border: none; cursor: pointer;
    font-size: 12px; font-weight: 600; color: ${colors.textDark};
  }
  .qa-date-chip-active { background: ${colors.mintDark}; color: #fff; }
  .qa-calendar-arrow-btn { background: none; border: none; cursor: pointer; display: flex; padding: 2px; }

  .qa-calendar-box { border-radius: 14px; background: #fff; border: 1px solid rgba(17,24,39,0.08); padding: 12px; margin-bottom: 10px; }
  .qa-calendar-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .qa-calendar-month-label { font-size: 13px; font-weight: 700; color: ${colors.textDark}; }
  .qa-calendar-week-row { display: flex; margin-bottom: 4px; }
  .qa-calendar-weekday { flex: 1; text-align: center; font-size: 11px; font-weight: 600; color: ${colors.textMuted}; }
  .qa-calendar-grid { display: flex; flex-wrap: wrap; }
  .qa-calendar-cell {
    width: ${100 / 7}%; aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
    background: none; border: none; cursor: pointer;
  }
  .qa-calendar-cell:disabled { cursor: default; }
  .qa-calendar-cell-text { font-size: 13px; color: ${colors.textDark}; font-weight: 500; }
  .qa-calendar-cell-text.qa-disabled { color: ${colors.border}; }
  .qa-calendar-cell-text.qa-today { color: ${colors.mintDark}; font-weight: 700; }
  .qa-calendar-cell-text.qa-selected {
    color: #fff; font-weight: 700; background: ${colors.mintDark};
    width: 26px; height: 26px; border-radius: 13px; display: flex; align-items: center; justify-content: center;
  }

  .qa-type-toggle { display: flex; background: #EFEFF2; border-radius: 999px; padding: 2px; }
  .qa-type-option { padding: 5px 12px; border-radius: 999px; background: none; border: none; cursor: pointer; font-size: 12px; font-weight: 600; color: ${colors.textDark}; }
  .qa-type-option-active { background: ${colors.mintDark}; color: #fff; }

  .qa-feedback-box { display: flex; align-items: center; gap: 8px; border-radius: 12px; padding: 10px 12px; font-size: 13px; font-weight: 500; }
  .qa-feedback-success { background: rgba(184,230,200,0.35); }
  .qa-feedback-error { background: #FDEDEC; }

  .qa-submit-btn {
    background: ${colors.mintDark}; border-radius: 14px; padding: 14px 0; border: none; cursor: pointer;
    color: #fff; font-size: 15px; font-weight: 700; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 12px -4px rgba(63,158,99,0.35);
  }
  .qa-submit-btn:disabled { opacity: 0.4; box-shadow: none; cursor: default; }
  .qa-spin { animation: qa-spin 0.8s linear infinite; }
  @keyframes qa-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  @media (max-width: 560px) {
    .qa-sheet { padding: 10px 16px 24px; border-radius: 24px 24px 0 0; }
  }
`;