import { useState } from "react";
import { sendEthereumTransaction, sendSolanaTransaction } from "../utils/transaction";

export function SendTransaction({ network }: { network: "ethereum" | "solana" }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const send = async () => {
    setStatus("Sending...");
    chrome.storage.local.get(["encryptedKey", "password", "solana"], async (res) => {
      try {
        const privateKey =
          network === "ethereum"
            ? res.encryptedKey
            : res.solana?.privateKey;

        if (!privateKey) return setStatus("Wallet not unlocked");

        const hash =
          network === "ethereum"
            ? await sendEthereumTransaction(privateKey, to, amount)
            : await sendSolanaTransaction(privateKey, to, amount);

        setStatus(`✅ Sent: ${hash}`);
      } catch (err: any) {
        console.error(err);
        setStatus("❌ Error sending");
      }
    });
  };

  return (
    <div>
      <h4>Send {network === "ethereum" ? "ETH" : "SOL"}</h4>
      <input placeholder="To Address" value={to} onChange={(e) => setTo(e.target.value)} />
      <input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={send}>Send</button>
      <p>{status}</p>
    </div>
  );
}
