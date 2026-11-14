function ShuttleList({ shuttles = [], onAdd }) {
  if (!shuttles || shuttles.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__title">Tidak ada shuttle sesuai pencarian.</p>
        <small className="empty-state__note">Coba ubah kata kunci atau sesi perjalanan.</small>
      </div>
    )
  }

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `Rp${price.toLocaleString('id-ID')}`
    }
    return price || 'Rp0'
  }

  return (
    <div className="shuttle-list">
      {shuttles.map((shuttle, index) => {
        const id = shuttle.id ?? index
        const name = shuttle.nama || shuttle.name || 'Shuttle Kampus'
        const session = shuttle.kategori || shuttle.sesi || shuttle.session || 'Semua'
        const price = shuttle.harga ?? shuttle.price ?? 0
        const seats =
          shuttle.sisaKursi ??
          shuttle.stok ??
          shuttle.kursi ??
          shuttle.availableSeats ??
          shuttle.seats ??
          shuttle.sisa ??
          0
        const isSoldOut = seats <= 0

        return (
          <article key={id} className="shuttle-card">
            <div className="shuttle-card-header">
              <h3 className="shuttle-name">{name}</h3>
              <span
                className={`shuttle-session-badge session-${session.toLowerCase()}`}
              >
                {session}
              </span>
            </div>

            <div className="shuttle-card-body">
              <div className="shuttle-info-item">
                <span className="shuttle-info-label">Sesi</span>
                <span className="shuttle-info-value">{session}</span>
              </div>
              <div className="shuttle-info-item">
                <span className="shuttle-info-label">Sisa Ketersediaan</span>
                <span
                  className={`shuttle-info-value ${
                    isSoldOut ? 'seats-empty' : 'seats-available'
                  }`}
                >
                  {isSoldOut ? 'Habis (0 kursi)' : `${seats} kursi`}
                </span>
              </div>
              <div className="shuttle-info-item shuttle-price-item">
                <span className="shuttle-info-label">Harga per Tiket</span>
                <span className="shuttle-price-value">{formatPrice(price)}</span>
              </div>
            </div>

            <div className="shuttle-card-footer">
              <button
                type="button"
                className="btn btn--accent"
                onClick={() => onAdd && onAdd(shuttle)}
                disabled={isSoldOut}
                aria-label={`Tambah tiket ${name}`}
              >
                Tambah
              </button>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default ShuttleList
