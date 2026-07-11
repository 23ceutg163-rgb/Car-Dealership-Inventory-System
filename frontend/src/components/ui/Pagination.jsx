import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Pagination — page controls for client-side paginated lists.
 *
 * @param {number}   currentPage  - 1-indexed current page
 * @param {number}   totalPages   - Total number of pages
 * @param {number}   totalItems   - Total number of items (for "X–Y of Z" label)
 * @param {number}   pageSize     - Items per page
 * @param {function} onPageChange - Called with new page number
 */
export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) {
  if (totalPages <= 1) return null

  const start = (currentPage - 1) * pageSize + 1
  const end   = Math.min(currentPage * pageSize, totalItems)

  // Build page number array with ellipsis
  function getPages() {
    const pages = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }
    // Always show first, last, current ±1, and ellipsis
    const around = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1])
    const sorted  = [...around].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)

    for (let i = 0; i < sorted.length; i++) {
      pages.push(sorted[i])
      if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) {
        pages.push('…')
      }
    }
    return pages
  }

  const pages = getPages()

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5 px-1">
      {/* Results info */}
      <p className="text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-700">{start}–{end}</span> of{' '}
        <span className="font-semibold text-slate-700">{totalItems}</span> vehicles
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all',
            currentPage === 1
              ? 'text-slate-300 border-slate-100 cursor-not-allowed bg-slate-50'
              : 'text-slate-600 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
          )}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} /> Prev
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-1">
          {pages.map((page, idx) =>
            page === '…' ? (
              <span
                key={`ellipsis-${idx}`}
                className="w-9 h-9 flex items-center justify-center text-sm text-slate-400 select-none"
              >
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={cn(
                  'w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold border transition-all',
                  page === currentPage
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'text-slate-600 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                )}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all',
            currentPage === totalPages
              ? 'text-slate-300 border-slate-100 cursor-not-allowed bg-slate-50'
              : 'text-slate-600 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
          )}
          aria-label="Next page"
        >
          Next <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
