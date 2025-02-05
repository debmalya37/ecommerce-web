// src/hooks/useWallet.ts
import { useState, useEffect } from "react";

export const useWallet = (userEmail: string) => {
  const [walletBalance, setWalletBalance] = useState<number>(0);

  useEffect(() => {
    if (!userEmail) return;
    fetch(`/api/user/wallet?email=${userEmail}`)
      .then((res) => res.json())
      .then((data) => setWalletBalance(data.balance))
      .catch(() => setWalletBalance(0));
  }, [userEmail]);

  return { walletBalance };
};
