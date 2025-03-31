import { ethers } from "ethers";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export async function sendEthereumTransaction(fromPrivateKey: string, to: string, amount: string) {
  const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/demo");
  const wallet = new ethers.Wallet(fromPrivateKey, provider);
  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(amount)
  });
  return tx.hash;
}

export async function sendSolanaTransaction(fromPrivateKey: string, to: string, amount: string) {
  const conn = new Connection("https://api.devnet.solana.com");
  const secretKey = Uint8Array.from(Buffer.from(fromPrivateKey, "hex"));
  const keypair = Keypair.fromSecretKey(secretKey);
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: keypair.publicKey,
      toPubkey: new PublicKey(to),
      lamports: Math.floor(Number(amount) * 1e9)
    })
  );
  const sig = await conn.sendTransaction(tx, [keypair]);
  return sig;
}
