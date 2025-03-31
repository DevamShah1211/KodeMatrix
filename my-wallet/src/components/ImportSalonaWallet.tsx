import { useState } from 'react'
import { encryptData } from '../utils/crypto'
import { Keypair } from '@solana/web3.js'

export const ImportSolanaWallet = () => {
  const [status, setStatus] = useState<string>('')

  const handleImport = async () => {
    const privateKeyInput = prompt('Paste your Solana Private Key (hex format)')
    if (!privateKeyInput) return alert('Private key is required.')

    const password = prompt('Set a password to encrypt your wallet')
    if (!password) return alert('Password is required.')

    try {
      // Convert hex string to Uint8Array
      const secretKeyBytes = new Uint8Array(
        privateKeyInput.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
      )

      const keypair = Keypair.fromSecretKey(secretKeyBytes)
      const publicKey = keypair.publicKey.toBase58()

      const encryptedKey = encryptData(privateKeyInput, password)

      await chrome.storage.local.set({
        solana: {
          address: publicKey,
          encryptedKey,
        },
      })

      setStatus(`✅ Solana Wallet Imported: ${publicKey}`)
    } catch (err) {
      console.error(err)
      alert('Failed to import wallet. Invalid private key?')
    }
  }

  return (
    <div>
      <button onClick={handleImport}>Import Solana Wallet</button>
      {status && (
        <p style={{ marginTop: '10px', wordBreak: 'break-word' }}>
          {status}
        </p>
      )}
    </div>
  )
}
