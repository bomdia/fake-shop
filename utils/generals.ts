export const EURO = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

export function toEuro(value: number | bigint) {
  return EURO.format(value)
}
