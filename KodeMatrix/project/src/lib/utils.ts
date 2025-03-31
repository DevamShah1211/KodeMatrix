import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Wallet, JsonRpcProvider, formatEther } from 'ethers';
import { openDB } from 'idb';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatBalance(balance: bigint, decimals: number = 18): string {
  const divisor = BigInt(10) ** BigInt(decimals);
  const integerPart = balance / divisor;
  const fractionalPart = balance % divisor;
  return `${integerPart}.${fractionalPart.toString().padStart(decimals, '0')}`;
}

export async function initializeDB() {
  return openDB('metamask-clone', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('wallets')) {
        db.createObjectStore('wallets', { keyPath: 'address' });
      }
      if (!db.objectStoreNames.contains('transactions')) {
        db.createObjectStore('transactions', { keyPath: 'hash' });
      }
    },
  });
}

export async function storeWallet(wallet: Wallet, password: string) {
  const db = await initializeDB();
  const encryptedJson = await wallet.encrypt(password);
  await db.put('wallets', {
    address: wallet.address,
    encryptedJson,
  });
}

export function validatePassword(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  return errors;
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export const mockTransactions = [
  {
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    to: '0x123456789abcdef123456789abcdef123456789a',
    value: '0.1',
    timestamp: Date.now() - 3600000,
    status: 'confirmed',
    type: 'send'
  },
  {
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    from: '0x123456789abcdef123456789abcdef123456789a',
    to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    value: '0.05',
    timestamp: Date.now() - 7200000,
    status: 'confirmed',
    type: 'receive'
  }
];

export const mockTokens = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    balance: '1.5',
    price: 3500,
    change24h: 2.5,
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg'
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    balance: '500',
    price: 1,
    change24h: 0.01,
    icon: 'https://cryptologos.cc/logos/tether-usdt-logo.svg'
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    balance: '50',
    price: 15,
    change24h: -1.2,
    icon: 'https://cryptologos.cc/logos/chainlink-link-logo.svg'
  }
];

export const networks = [
  {
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpcUrl: 'https://mainnet.infura.io/v3/your-project-id',
    symbol: 'ETH',
    explorer: 'https://etherscan.io'
  },
  {
    name: 'Sepolia',
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/your-project-id',
    symbol: 'ETH',
    explorer: 'https://sepolia.etherscan.io'
  }
];