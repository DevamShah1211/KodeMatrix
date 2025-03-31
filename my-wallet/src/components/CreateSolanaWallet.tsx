import { createSolanaWallet } from '../utils/solanaWallet'
import { encryptData } from '../utils/crypto'

export const CreateSolanaWallet = () => {
  const handleCreate = async () => {
    const password = prompt('Set a password to encrypt your Solana wallet')
    if (!password) return alert('Password required!')

    const { privateKey, address } = createSolanaWallet()
    const encryptedKey = encryptData(privateKey, password)

    await chrome.storage.local.set({
      solana: {
        encryptedKey,
        address
      }
    })

    alert(`Solana wallet created!\nAddress: ${address}`)
  }

  return <button onClick={handleCreate}>Create Solana Wallet</button>
}
