// src/utils/expenseParser.js
import { CATEGORY_KEYWORDS, CATEGORY_PHRASES } from './categoryDictionary';

let learnedCategories = {};

export function loadLearnedCategories(map) {
  learnedCategories = { ...map };
}

export function learnCategory(word, category) {
  learnedCategories[word.toLowerCase()] = category;
}

export function getLearnedCategories() {
  return { ...learnedCategories };
}

const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const CURRENCY_SYMBOLS = {
  '₹': 'INR', inr: 'INR', rs: 'INR',
  '$': 'USD', usd: 'USD',
  '€': 'EUR', eur: 'EUR',
  '£': 'GBP', gbp: 'GBP',
};

// Longest phrases first, so "gulab jamun" is tried before any single-word
// fallback would otherwise steal the match.
const SORTED_CATEGORY_PHRASES = [...CATEGORY_PHRASES].sort(
  (a, b) => b.phrase.length - a.phrase.length
);

function toISO(d) {
  return d.toISOString().slice(0, 10);
}

function pad(n) {
  return n < 10 ? `0${n}` : `${n}`;
}

// ---- Amount parsing: handles ₹250, $20, 250 INR, 1,200, 1,20,000, 250.50 ----
function parseAmount(text) {
  const re = /(?:^|[\s(])(?:₹|\$|€|£)?\s?(\d+(?:,\d{2,3})*(?:\.\d{1,2})?)\s?(inr|usd|eur|gbp|rs)?(?=$|[\s)])/i;
  const match = text.match(re);
  if (!match) return { amount: null, match: null, currency: null };

  const numStr = match[1];
  if (!numStr) return { amount: null, match: null, currency: null };

  const amount = Number(numStr.replace(/,/g, ''));
  if (Number.isNaN(amount)) return { amount: null, match: null, currency: null };

  const symbol = match[0].trim().match(/^(₹|\$|€|£)/i)?.[1]?.toLowerCase();
  const suffix = match[2]?.toLowerCase();
  const currency = (symbol && CURRENCY_SYMBOLS[symbol]) || (suffix && CURRENCY_SYMBOLS[suffix]) || null;

  return { amount, match: match[0].trim(), currency };
}

// ---- Date parsing ----
function parseDate(text, now) {
  const lower = text.toLowerCase();

  if (/\btoday\b/.test(lower)) {
    return { label: 'Today', iso: toISO(now), match: 'today', confidence: 1 };
  }
  if (/\byesterday\b/.test(lower)) {
    const d = new Date(now); d.setDate(d.getDate() - 1);
    return { label: 'Yesterday', iso: toISO(d), match: 'yesterday', confidence: 1 };
  }
  if (/\btomorrow\b/.test(lower)) {
    const d = new Date(now); d.setDate(d.getDate() + 1);
    return { label: 'Tomorrow', iso: toISO(d), match: 'tomorrow', confidence: 1 };
  }

  // "N days ago" / "N weeks ago"
  let m = lower.match(/(\d+)\s*day(?:s)?\s*ago/);
  if (m) {
    const d = new Date(now); d.setDate(d.getDate() - Number(m[1]));
    return { label: `${m[1]} day(s) ago`, iso: toISO(d), match: m[0], confidence: 0.95 };
  }
  m = lower.match(/(\d+)\s*week(?:s)?\s*ago/);
  if (m) {
    const d = new Date(now); d.setDate(d.getDate() - Number(m[1]) * 7);
    return { label: `${m[1]} week(s) ago`, iso: toISO(d), match: m[0], confidence: 0.95 };
  }

  // "last <weekday>"
  m = lower.match(/last\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/);
  if (m) {
    const target = WEEKDAYS.indexOf(m[1]);
    const d = new Date(now);
    let diff = (d.getDay() - target + 7) % 7;
    if (diff === 0) diff = 7;
    d.setDate(d.getDate() - diff);
    return { label: `Last ${m[1][0].toUpperCase()}${m[1].slice(1)}`, iso: toISO(d), match: m[0], confidence: 0.9 };
  }

  // "12 July" / "12 Jul" / "12 July 2026"
  m = lower.match(/(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*(\d{4})?/);
  if (m) {
    const day = Number(m[1]);
    const month = MONTHS.indexOf(m[2]);
    const year = m[3] ? Number(m[3]) : now.getFullYear();
    const d = new Date(year, month, day);
    return { label: `${pad(day)} ${m[2][0].toUpperCase()}${m[2].slice(1)} ${year}`, iso: toISO(d), match: m[0], confidence: 0.92 };
  }

  // "12/07" / "12-07-2026" / "2026-07-12"
  m = lower.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/);
  if (m) {
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return { label: toISO(d), iso: toISO(d), match: m[0], confidence: 0.9 };
  }
  m = lower.match(/\b(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?\b/);
  if (m) {
    const day = Number(m[1]);
    const month = Number(m[2]) - 1;
    const year = m[3] ? (m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3])) : now.getFullYear();
    const d = new Date(year, month, day);
    if (!Number.isNaN(d.getTime())) {
      return { label: toISO(d), iso: toISO(d), match: m[0], confidence: 0.85 };
    }
  }

  // default: today, but low confidence since it wasn't explicit
  return { label: 'Today', iso: toISO(now), match: null, confidence: 0.5 };
}

function resolveCategory(words, rawTextLower) {
  for (const w of words) {
    const key = w.toLowerCase();
    if (learnedCategories[key]) {
      return { category: learnedCategories[key], confidence: 0.97, source: key };
    }
  }

  for (const { phrase, category } of SORTED_CATEGORY_PHRASES) {
    if (rawTextLower.includes(phrase)) {
      return { category, confidence: 0.93, source: phrase };
    }
  }

  for (const w of words) {
    const key = w.toLowerCase();
    if (CATEGORY_KEYWORDS[key]) {
      return { category: CATEGORY_KEYWORDS[key], confidence: 0.9, source: key };
    }
  }

  return { category: 'uncategorized', confidence: 0.35, source: null };
}

const INCOME_WORDS = new Set(['salary', 'bonus', 'freelance', 'refund', 'interest', 'commission', 'cashback']);

/**
 * Parse a single line of free-typed expense/income text into structured fields.
 * Pure function, no I/O — safe to call on every keystroke.
 */
export function parseExpenseInput(rawText, now = new Date()) {
  const uncertainFields = [];
  const text = rawText.trim();

  if (!text) {
    return {
      amount: null, category: null, type: 'expense', date: 'Today', isoDate: toISO(now),
      description: '', currency: null, confidence: 0, uncertainFields: ['amount', 'category', 'date'],
    };
  }

  const { amount, match: amountMatch, currency } = parseAmount(text);
  const { label: dateLabel, iso: isoDate, match: dateMatch, confidence: dateConfidence } = parseDate(text, now);

  const words = text.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean);
  const { category, confidence: categoryConfidence } = resolveCategory(words, text.toLowerCase());

  const type = category === 'income' || words.some((w) => INCOME_WORDS.has(w.toLowerCase()))
    ? 'income'
    : 'expense';

  // Description = original text with the matched amount/date fragments stripped out
  let description = text;
  if (amountMatch) description = description.replace(amountMatch, ' ');
  if (dateMatch) description = description.replace(new RegExp(dateMatch, 'i'), ' ');
  description = description.replace(/\s+/g, ' ').trim();
  if (!description) description = words[0] || '';

  if (amount === null) uncertainFields.push('amount');
  if (categoryConfidence < 0.75) uncertainFields.push('category');
  if (dateConfidence < 0.75) uncertainFields.push('date');

  const amountConfidence = amount !== null ? 1 : 0.2;
  const overallConfidence = Math.round(
    ((amountConfidence + categoryConfidence + dateConfidence) / 3) * 100
  ) / 100;

  return {
    amount,
    category,
    type,
    date: dateLabel,
    isoDate,
    description,
    currency,
    confidence: overallConfidence,
    uncertainFields,
  };
}

/** Whether this parse is weak enough that we should fall back to the Gemini chat pipeline. */
export function needsAiFallback(parsed) {
  return parsed.amount === null || parsed.confidence < 0.6;
}