import { ethers } from "ethers";
import { Connection, PublicKey } from "@solana/web3.js";

export async function getEthereumBalance(address: string) {
  const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/demo");
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

export async function getSolanaBalance(address: string) {
  const conn = new Connection("https://api.devnet.solana.com");
  const publicKey = new PublicKey(address);
  const lamports = await conn.getBalance(publicKey);
  return lamports / 1e9; // Convert lamports to SOL
}
