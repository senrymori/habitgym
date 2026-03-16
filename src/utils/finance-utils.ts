export function formatBalance(amount: number, currency: string): string {
  return `${amount.toLocaleString('en-US')} ${currency}`;
}

export function formatFiat(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
