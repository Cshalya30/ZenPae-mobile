export function formatCurrency(amount: number): string {
  return `\u20B9${amount.toFixed(2)}`;
}

export function parseAmount(input: string): number {
  const normalized = input.replace(/[^0-9.]/g, '');
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : 0;
}
