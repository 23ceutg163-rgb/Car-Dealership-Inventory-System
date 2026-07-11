import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useVehiclesQuery, useDeleteVehicleMutation } from '@/features/vehicles/hooks/useVehicles'
import { useAuthContext } from '@/context/AuthContext'
import { useDebounce } from '@/hooks/useDebounce'
import VehicleTable   from '../components/VehicleTable'
import VehicleFilters from '../components/VehicleFilters'
import DeleteDialog   from '../components/DeleteDialog'
import Pagination     from '@/components/ui/Pagination'
import { Button }     from '@/components/ui/Button'

const PAGE_SIZE = 10

/**
 * VehiclesPage — full vehicle list with search, filter, sort, and delete.
 */
export default function VehiclesPage() {
  const { isAdmin } = useAuthContext()
  const { data: vehicles = [], isLoading } = useVehiclesQuery()
  const deleteMutation = useDeleteVehicleMutation()

  // ── Filter / Search state ───────────────────────────────────────────────────────
  const [search,      setSearch]      = useState('')
  const [category,    setCategory]    = useState('')
  const [stockFilter, setStockFilter] = useState('all')

  // ── Pagination state ────────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1)

  // ── Sort state ─────────────────────────────────────────────────────────────
  const [sortKey, setSortKey] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setCurrentPage(1) // reset page on sort change
  }

  // Reset page when filters/search change
  function handleSearch(val)   { setSearch(val);      setCurrentPage(1) }
  function handleCategory(val) { setCategory(val);    setCurrentPage(1) }
  function handleStock(val)    { setStockFilter(val); setCurrentPage(1) }

  // ── Delete state ───────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null)

  function handleDeleteConfirm() {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget._id, {
      onSuccess: () => setDeleteTarget(null),
    })
  }

  // ── Debounce search ────────────────────────────────────────────────────────
  const debouncedSearch = useDebounce(search, 350)

  // ── Client-side filter + sort ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...vehicles]

    // Text search (make or model)
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      list = list.filter(
        (v) =>
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q)
      )
    }

    // Category filter
    if (category) {
      list = list.filter((v) => v.category === category)
    }

    // Stock filter
    if (stockFilter === 'instock') list = list.filter((v) => v.quantity > 3)
    if (stockFilter === 'low')     list = list.filter((v) => v.quantity > 0 && v.quantity <= 3)
    if (stockFilter === 'out')     list = list.filter((v) => v.quantity === 0)

    // Sort
    list.sort((a, b) => {
      let va = a[sortKey]
      let vb = b[sortKey]

      // String comparison (make, model, category)
      if (typeof va === 'string') {
        va = va.toLowerCase()
        vb = vb.toLowerCase()
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      }

      // Numeric / date comparison
      return sortDir === 'asc' ? va - vb : vb - va
    })

    return list
  }, [vehicles, debouncedSearch, category, stockFilter, sortKey, sortDir])

  // ── Pagination slice ──────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginated = filtered.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE
  )

  return (
    <div>
      {/* ── Page header ── */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">Vehicles</h1>
          <p className="page-subtitle">
            Manage your dealership&apos;s full vehicle inventory
          </p>
        </div>
        <Link to="/vehicles/add">
          <Button id="add-vehicle-btn" className="gap-2">
            <Plus size={16} />
            Add Vehicle
          </Button>
        </Link>
      </div>

      {/* ── Filters ── */}
      <VehicleFilters
        search={search}
        onSearch={handleSearch}
        category={category}
        onCategory={handleCategory}
        stockFilter={stockFilter}
        onStock={handleStock}
        total={vehicles.length}
        filtered={filtered.length}
      />

      {/* ── Table ── */}
      <VehicleTable
        vehicles={paginated}
        isLoading={isLoading}
        isAdmin={isAdmin}
        onDelete={setDeleteTarget}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
      />

      {/* ── Pagination ── */}
      <Pagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />

      {/* ── Delete confirmation dialog ── */}
      <DeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
        vehicle={deleteTarget}
      />
    </div>
  )
}
