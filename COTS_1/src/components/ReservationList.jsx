function ReservationList({
  reservations = [],
  quantityErrors = {},
  onUpdateQuantity,
  onRemove,
}) {
  if (reservations.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__title">Belum ada reservasi.</p>
        <small className="empty-state__note">Shuttle yang dipilih akan muncul di sini.</small>
      </div>
    )
  }

  return (
    <div className="reservation-list" aria-label="Daftar reservasi">
      {reservations.map((reservation) => {
        const id = reservation.id
        const name = reservation.nama || 'Shuttle'
        const session = reservation.kategori || 'Umum'
        const price = Number(reservation.harga) || 0
        const quantity = reservation.quantity
        const subtotal = price * quantity
        const error = quantityErrors[id]

        return (
          <article key={id} className="reservation-item">
            <div className="reservation-details">
              <div className="reservation-header">
                <h3>{name}</h3>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => onRemove(id)}
                >
                  Hapus
                </button>
              </div>
              <p className="reservation-meta">
                {session} • Rp{price.toLocaleString('id-ID')} / tiket
              </p>
              <p className="reservation-total">
                Subtotal: Rp{subtotal.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="reservation-actions">
              <label htmlFor={`qty-${id}`}>Jumlah tiket</label>
              <input
                id={`qty-${id}`}
                type="number"
                min="1"
                max="4"
                step="1"
                value={quantity}
                onChange={(event) => onUpdateQuantity(id, event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `error-${id}` : undefined}
              />
              {error && <small id={`error-${id}`} className="validation-error">{error}</small>}
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default ReservationList