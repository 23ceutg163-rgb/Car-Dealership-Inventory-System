import { useState, useEffect } from 'react'

/**
 * Delays updating the returned value until the user stops typing.
 * Useful for live search inputs to avoid firing an API call on every keystroke.
 *
 * @param {any}    value - The value to debounce
 * @param {number} delay - Milliseconds to wait (default 400ms)
 * @returns {any}  The debounced value
 */
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
