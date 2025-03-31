import { useEffect, useState } from "react";

export function ReceiveWallet({ network }: { network: "ethereum" | "solana" }) {
  const [address, setAddress] = useState("");

  useEffect(() => {
    chrome.storage.local.get([network === "ethereum" ? "address" : "solana"], (res) => {
      const addr = network === "ethereum" ? res.address : res.solana?.address;
      setAddress(addr || "");
    });
  }, [network]);

  return (
    <div>
      <p><strong>Your {network} Address:</strong></p>
      <code>{address}</code>
    </div>
  );
}
