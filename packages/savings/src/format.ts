export function formatUsd(value: number, opts?: { cents?: boolean }): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: opts?.cents ? 2 : 0,
    maximumFractionDigits: opts?.cents ? 2 : 0,
  }).format(value);
}

export function formatKcal(value: number): string {
  return `${new Intl.NumberFormat("en-US").format(Math.round(value))} kcal`;
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
