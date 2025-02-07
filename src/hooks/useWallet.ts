import { useState, useEffect } from "react";

export function useWallet(email: string) {
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    if (!email) return;

    fetch(`/api/update-wallet?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWalletBalance(data.balance);
        }
      })
      .catch((err) => console.error("Error fetching wallet:", err));
  }, [email]);

  return { walletBalance };
}
