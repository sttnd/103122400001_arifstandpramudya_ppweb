function Summary({
  totalTickets = 0,
  subtotal = 0,
  administrationFee = 0,
  totalPayment = 0,
}) {
  const formatCurrency = (value) => `Rp${Number(value).toLocaleString('id-ID')}`

  return (
    <div className="summary" aria-label="Ringkasan pembayaran">
      <div className="summary-row">
        <span>Jumlah tiket</span>
        <strong>{totalTickets}</strong>
      </div>
      <div className="summary-row">
        <span>Subtotal</span>
        <strong>{formatCurrency(subtotal)}</strong>
      </div>
      <div className="summary-row">
        <span>Biaya administrasi</span>
        <strong>{formatCurrency(administrationFee)}</strong>
      </div>
      <div className="summary-total">
        <span>Total pembayaran</span>
        <strong>{formatCurrency(totalPayment)}</strong>
      </div>
    </div>
  )
}

export default Summary
