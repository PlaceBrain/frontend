export interface Period {
  key: string;
  label: string;
  hours: number;
  interval: number;
}

export const PERIODS: Period[] = [
  { key: "1h", label: "1h", hours: 1, interval: 0 },
  { key: "8h", label: "8h", hours: 8, interval: 60 },
  { key: "24h", label: "24h", hours: 24, interval: 300 },
  { key: "7d", label: "7d", hours: 168, interval: 1800 },
  { key: "30d", label: "30d", hours: 720, interval: 7200 },
];
