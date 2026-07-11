import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Select } from '@/components/ui/Select'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  'Sedan', 'SUV', 'Truck', 'Hatchback', 'Coupe',
  'Convertible', 'Van', 'Wagon', 'Electric', 'Hybrid', 'Crossover', 'Other',
]

const STOCK_OPTIONS = [
  { value: 'all',      label: 'All Stock' },
  { value: 'instock',  label: 'In Stock' },
  { value: 'low',      label: 'Low Stock (≤3)' },
  { value: 'out',      label: 'Out of Stock' },
]

/**
 * VehicleFilters — search input + category + stock status filter bar.
 *
 * @param {object}   props
 * @param {string}   props.search       - Controlled search value
 * @param {function} props.onSearch     - Called with new search string
 * @param {string}   props.category     - Controlled category filter
 * @param {function} props.onCategory   - Called with new category
 * @param {string}   props.stockFilter  - Controlled stock filter
 * @param {function} props.onStock      - Called with new stock filter
 * @param {number}   props.total        - Total vehicles count (for display)
 * @param {number}   props.filtered     - Filtered count (for display)
 */
export default function VehicleFilters({
  search = '',
  onSearch,
  category = '',
  onCategory,
  stockFilter = 'all',
  onStock,
  total = 0,
  filtered = 0,
}) {
  const [showFilters, setShowFilters] = useState(false)
  const hasActiveFilters = category !== '' || stockFilter !== 'all'

  function clearAll() {
    onSearch('')
    onCategory('')
    onStock('all')
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-5">
      {/* Main search bar row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Search input */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Search size={15} />
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by make or model…"
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
            aria-label="Search vehicles"
          />
          {search && (
            <button
              onClick={() => onSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Toggle filter panel */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-xl border transition-all',
            showFilters || hasActiveFilters
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          )}
          aria-expanded={showFilters}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal size={15} />
          Filters
          {hasActiveFilters && (
            <span className="w-4 h-4 bg-blue-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>

      {/* Expanded filter row */}
      {showFilters && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100 flex flex-wrap items-end gap-3">
          {/* Category */}
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Category</label>
            <Select
              value={category}
              onChange={(e) => onCategory(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </div>

          {/* Stock status */}
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Stock Status</label>
            <Select
              value={stockFilter}
              onChange={(e) => onStock(e.target.value)}
              aria-label="Filter by stock status"
            >
              {STOCK_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 px-3 py-2.5 text-sm text-rose-600 hover:text-rose-700 font-medium"
            >
              <X size={14} /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* Results count strip */}
      <div className="px-4 pb-3 flex items-center gap-2 text-xs text-slate-400 border-t border-slate-50">
        <span>
          Showing <strong className="text-slate-700">{filtered}</strong> of{' '}
          <strong className="text-slate-700">{total}</strong> vehicles
        </span>
        {(search || hasActiveFilters) && filtered < total && (
          <button
            onClick={clearAll}
            className="text-blue-500 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}
