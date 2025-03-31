import { Keypair } from "@solana/web3.js";
import { encryptData } from "./crypto";

// ✅ Create new Solana wallet
export const createSolanaWallet = () => {
  const keypair = Keypair.generate();

  const privateKey = Array.from(keypair.secretKey)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const address = keypair.publicKey.toBase58();

  return {
    privateKey,
    address,
  };
};

// ✅ Import Solana wallet using hex private key string
export const importSolanaWallet = async (privateKeyStr: string, password: string) => {
  try {
    const privateKeyBytes = new Uint8Array(
      privateKeyStr.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    );

    const keypair = Keypair.fromSecretKey(privateKeyBytes);
    const address = keypair.publicKey.toBase58();
    const encryptedKey = await encryptData(privateKeyStr, password);

    await chrome.storage.local.set({
      solana: {
        address,
        encryptedKey,
      },
    });

    return { address };
  } catch (err) {
    console.error("❌ Failed to import Solana wallet:", err);
    throw err;
  }
};
