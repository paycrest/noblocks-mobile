import USDC from "@/components/svgs/usdc-icon";

export interface ITransaction {
  icon: React.FC<{ width: number; height: number }>;
  amountUSD: number;
  amountNGN: number;
  status: "Completed" | "Ongoing" | "Failed";
  date: string; // ISO format date string
  token: string;
}

export const transactions: ITransaction[] = [
  {
    icon: USDC,
    amountUSD: 47.48,
    amountNGN: 25000,
    status: "Completed",
    date: "2026-04-28",
    token: "USDC",
  },
  {
    icon: USDC,
    amountUSD: 47.48,
    amountNGN: 25000,
    status: "Ongoing",
    date: "2026-04-28",
    token: "USDC",
  },
  {
    icon: USDC,
    amountUSD: 47.48,
    amountNGN: 25000,
    status: "Ongoing",
    date: "2026-04-28",
    token: "USDC",
  },
  {
    icon: USDC,
    amountUSD: 47.48,
    amountNGN: 25000,
    status: "Ongoing",
    date: "2024-04-28",
    token: "USDC",
  },
  // Additional random sample data
  {
    icon: USDC,
    amountUSD: 120.15,
    amountNGN: 63500,
    status: "Completed",
    date: "2024-03-15",
    token: "USDC",
  },
  {
    icon: USDC,
    amountUSD: 5.0,
    amountNGN: 2650,
    status: "Failed",
    date: "2024-02-10",
    token: "USDC",
  },
  {
    icon: USDC,
    amountUSD: 200.0,
    amountNGN: 105000,
    status: "Completed",
    date: "2023-12-25",
    token: "USDC",
  },
  {
    icon: USDC,
    amountUSD: 75.25,
    amountNGN: 40000,
    status: "Ongoing",
    date: "2024-04-01",
    token: "USDC",
  },
  {
    icon: USDC,
    amountUSD: 15.75,
    amountNGN: 8500,
    status: "Completed",
    date: "2024-01-20",
    token: "USDC",
  },
  {
    icon: USDC,
    amountUSD: 300.0,
    amountNGN: 158000,
    status: "Failed",
    date: "2023-11-05",
    token: "USDC",
  },
  {
    icon: USDC,
    amountUSD: 60.0,
    amountNGN: 32000,
    status: "Completed",
    date: "2024-03-30",
    token: "USDC",
  },
];
