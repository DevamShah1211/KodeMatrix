import { useState } from 'react'
import { decryptData } from '../utils/crypto'
import { ethers } from 'ethers'

export const UnlockWallet = () => {
  const [unlockedAddress, setUnlockedAddress] = useState<string | null>(null)

  const handleUnlock = async () => {
    const password = prompt('Enter your wallet password')
    if (!password) return alert('Password is required!')

    const { encryptedKey } = await chrome.storage.local.get(['encryptedKey'])

    if (!encryptedKey) {
      alert('No wallet found. Please create or import one first.')
      return
    }

    try {
      const decryptedPrivateKey = decryptData(encryptedKey, password)
      const wallet = new ethers.Wallet(decryptedPrivateKey)
      setUnlockedAddress(wallet.address)
    } catch (err) {
      alert('Failed to decrypt wallet. Wrong password?')
    }
  }

  return (
    <div>
      <button onClick={handleUnlock}>Unlock Wallet</button>
      {unlockedAddress && (
        <p style={{ marginTop: '10px', wordBreak: 'break-word' }}>
          ✅ Wallet Unlocked:<br />
          <strong>{unlockedAddress}</strong>
        </p>
      )}
    </div>
  )
}
