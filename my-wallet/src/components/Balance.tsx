import { useEffect, useState } from "react";
import { getEthereumBalance, getSolanaBalance } from "../utils/balance";

export function Balance({ network }: { network: "ethereum" | "solana" }) {
  const [balance, setBalance] = useState<string>("Loading...");

  useEffect(() => {
    chrome.storage.local.get([network === "ethereum" ? "address" : "solana"], async (res) => {
      const address = network === "ethereum" ? res.address : res.solana?.address;
      if (!address) return setBalance("Wallet not found");

      const bal = network === "ethereum"
        ? await getEthereumBalance(address)
        : await getSolanaBalance(address);
      setBalance(`${bal} ${network === "ethereum" ? "ETH" : "SOL"}`);
    });
  }, [network]);

  return <p>Balance: {balance}</p>;
}
