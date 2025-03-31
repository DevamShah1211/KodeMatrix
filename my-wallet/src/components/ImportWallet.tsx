import { useState } from 'react'
import { encryptData } from '../utils/crypto'
import { ethers } from 'ethers'

export const ImportWallet = () => {
  const [privateKey, setPrivateKey] = useState('')

  const handleImport = async () => {
    const password = prompt('Set a password to encrypt your wallet')
    if (!password) return alert('Password required!')

    try {
      const wallet = new ethers.Wallet(privateKey.trim())
      const encryptedKey = encryptData(wallet.privateKey, password)

      await chrome.storage.local.set({
        encryptedKey,
        address: wallet.address
      })

      alert(`Wallet imported!\nAddress: ${wallet.address}`)
    } catch (err) {
      alert('Invalid private key!')
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Enter private key"
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
        style={{
          marginBottom: '8px',
          padding: '6px',
          width: '200px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />
      <br />
      <button onClick={handleImport}>Import Wallet</button>
    </div>
  )
}
