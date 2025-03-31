import { useState } from 'react'
import { decryptData } from '../utils/crypto'
import { Keypair } from '@solana/web3.js'

export const UnlockSolanaWallet = () => {
  const [unlockedAddress, setUnlockedAddress] = useState<string | null>(null)

  const handleUnlock = async () => {
    const password = prompt('Enter your Solana wallet password')
    if (!password) return alert('Password is required!')

    const result = await chrome.storage.local.get('solana')
    const encryptedKey = result?.solana?.encryptedKey

    if (!encryptedKey) {
      alert('No Solana wallet found. Please create one first.')
      return
    }

    try {
      const decryptedHex = decryptData(encryptedKey, password)
      const secretKeyBytes = new Uint8Array(
        decryptedHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
      )
      const keypair = Keypair.fromSecretKey(secretKeyBytes)
      setUnlockedAddress(keypair.publicKey.toBase58())
    } catch (error) {
      alert('Failed to decrypt Solana wallet. Wrong password?')
    }
  }

  return (
    <div>
      <button onClick={handleUnlock}>Unlock Solana Wallet</button>
      {unlockedAddress && (
        <p style={{ marginTop: '10px', wordBreak: 'break-word' }}>
          ✅ Solana Wallet Unlocked:
          <br />
          <strong>{unlockedAddress}</strong>
        </p>
      )}
    </div>
  )
}
