// Currency formatting utility for Pakistani Rupees
export function formatRupees(amount: number): string {
  return `Rs ${Math.round(amount)}`;
}
