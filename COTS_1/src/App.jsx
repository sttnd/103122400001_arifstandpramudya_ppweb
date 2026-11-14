import { useCallback, useEffect, useMemo, useState } from 'react'
import ShuttleList from './components/ShuttleList'
import SearchFilter from './components/SearchFilter'
import ReservationList from './components/ReservationList'
import Summary from './components/Summary'
import { useReveal } from './hooks/useReveal'
import './App.css'

const ADMINISTRATION_FEE = 5000

function App() {
  const [shuttles, setShuttles] = useState([])
  const [reservations, setReservations] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [loading, setLoading] = useState(true)
  const [requestError, setRequestError] = useState('')
  const [quantityErrors, setQuantityErrors] = useState({})

  useReveal()

  const loadShuttles = useCallback(async () => {
    setLoading(true)
    setRequestError('')

    try {
      const response = await fetch('/data/shuttle.json')
      if (!response.ok) {
        throw new Error(`Request gagal (${response.status})`)
      }

      const data = await response.json()
      if (!Array.isArray(data)) {
        throw new Error('Format data shuttle tidak valid')
      }
      setShuttles(data)
    } catch (error) {
      setRequestError(error.message || 'Data shuttle gagal dimuat.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Loading state starts true; fetch completion updates it asynchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadShuttles()
  }, [loadShuttles])

  const filteredShuttles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return shuttles.filter((shuttle) => {
      const name = String(shuttle.nama ?? '').toLowerCase()
      const matchesName = name.includes(query)
      const matchesCategory =
        selectedCategory === 'Semua' || shuttle.kategori === selectedCategory
      return matchesName && matchesCategory
    })
  }, [searchQuery, selectedCategory, shuttles])

  const handleAdd = (shuttle) => {
    const maxQuantity = Math.min(4, Number(shuttle.stok) || 0)
    const existing = reservations.find((item) => item.id === shuttle.id)

    if (maxQuantity < 1) return
    if (existing?.quantity >= maxQuantity) {
      setQuantityErrors((currentErrors) => ({
        ...currentErrors,
        [shuttle.id]: `Maksimal ${maxQuantity} tiket untuk shuttle ini.`,
      }))
      return
    }

    setReservations((currentReservations) => {
      const currentItem = currentReservations.find((item) => item.id === shuttle.id)

      if (currentItem) {
        return currentReservations.map((item) =>
          item.id === shuttle.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...currentReservations, { ...shuttle, quantity: 1 }]
    })
    setQuantityErrors((currentErrors) => ({
      ...currentErrors,
      [shuttle.id]: '',
    }))
  }

  const handleUpdateQuantity = (id, rawQuantity) => {
    const shuttle = shuttles.find((item) => item.id === id)
    const quantity = Number(rawQuantity)
    const maxQuantity = Math.min(4, Number(shuttle?.stok) || 0)
    let message = ''

    if (!Number.isInteger(quantity) || quantity < 1) {
      message = 'Jumlah tiket harus bilangan bulat positif.'
    } else if (quantity > 4) {
      message = 'Maksimal 4 tiket untuk satu shuttle.'
    } else if (quantity > maxQuantity) {
      message = `Jumlah tiket melebihi stok. Maksimal ${maxQuantity} tiket.`
    }

    if (message) {
      setQuantityErrors((currentErrors) => ({
        ...currentErrors,
        [id]: message,
      }))
      return
    }

    setReservations((currentReservations) =>
      currentReservations.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      ),
    )
    setQuantityErrors((currentErrors) => ({ ...currentErrors, [id]: '' }))
  }

  const handleRemove = (id) => {
    setReservations((currentReservations) =>
      currentReservations.filter((item) => item.id !== id),
    )
    setQuantityErrors((currentErrors) => {
      const nextErrors = { ...currentErrors }
      delete nextErrors[id]
      return nextErrors
    })
  }

  const totalTickets = reservations.reduce(
    (total, item) => total + item.quantity,
    0,
  )
  const subtotal = reservations.reduce(
    (total, item) => total + Number(item.harga) * item.quantity,
    0,
  )
  const administrationFee = reservations.length > 0 ? ADMINISTRATION_FEE : 0
  const totalPayment = subtotal + administrationFee

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Sistem Transportasi Kampus</p>
          <h1 className="hero-title">
            <span className="hero-word"><span className="hero-word__inner" style={{ '--i': 0 }}>Reservasi</span></span>{' '}
            <span className="hero-word"><span className="hero-word__inner" style={{ '--i': 1 }}>Tiket</span></span>{' '}
            <span className="hero-word"><span className="hero-word__inner" style={{ '--i': 2 }}>Shuttle</span></span>
          </h1>
          <p className="app-description">
            Pilih jadwal shuttle kampus dan siapkan reservasi perjalananmu.
          </p>
        </div>
      </header>

      <main className="app-content">
        <section className="search-section" data-reveal style={{ '--i': 0 }} aria-labelledby="search-title">
          <div className="section-heading">
            <p className="eyebrow">Katalog perjalanan</p>
            <h2 id="search-title">Cari shuttle</h2>
          </div>
          <SearchFilter
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            selectedCategory={selectedCategory}
            onFilter={setSelectedCategory}
            resultCount={filteredShuttles.length}
          />
        </section>

        <div className="workspace-grid">
          <section className="panel catalog-panel" data-reveal style={{ '--i': 1 }} aria-labelledby="catalog-title">
            <div className="section-heading">
              <p className="eyebrow">Jadwal tersedia</p>
              <h2 id="catalog-title">Daftar shuttle</h2>
            </div>
            {loading ? (
              <div className="empty-state"><p>Memuat data shuttle...</p></div>
            ) : requestError ? (
              <div className="empty-state error-state">
                <p>{requestError}</p>
                <button type="button" onClick={loadShuttles}>Coba Lagi</button>
              </div>
            ) : (
              <ShuttleList shuttles={filteredShuttles} onAdd={handleAdd} />
            )}
          </section>

          <aside className="panel reservation-panel" data-reveal style={{ '--i': 2 }} aria-labelledby="reservation-title">
            <div className="section-heading">
              <p className="eyebrow">Tiket pilihanmu</p>
              <h2 id="reservation-title">Daftar reservasi</h2>
            </div>
            <ReservationList
              reservations={reservations}
              quantityErrors={quantityErrors}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
            />
            <Summary
              totalTickets={totalTickets}
              subtotal={subtotal}
              administrationFee={administrationFee}
              totalPayment={totalPayment}
            />
          </aside>
        </div>
      </main>
    </div>
  )
}

export default App
