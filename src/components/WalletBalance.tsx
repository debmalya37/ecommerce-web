// src/components/WalletBalance.tsx
"use client";
import { useWallet } from '@/hooks/useWallet';

export default function WalletBalance() {
  const userEmail = "user@example.com"; // Replace with actual user email
  const { walletBalance } = useWallet(userEmail);

  return (
    <div className="flex items-center space-x-2">
      <span className="text-black">Wallet: ₹{walletBalance}</span>
    </div>
  );
}