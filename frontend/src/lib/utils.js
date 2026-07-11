import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges Tailwind classes safely, resolving conflicts intelligently.
 * @param  {...any} inputs - Class names, arrays, or conditional objects
 * @returns {string} Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as Indian Rupee (INR) currency.
 * @param {number} amount
 * @returns {string} e.g. "₹25,000" or "₹1,25,000"
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Returns user initials from a full name string.
 * @param {string} name
 * @returns {string} e.g. "John Doe" → "JD"
 */
export function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

/**
 * Formats a date string into a human-readable format.
 * @param {string} dateStr
 * @returns {string} e.g. "Jan 5, 2025"
 */
export function formatDate(dateStr) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateStr))
}
