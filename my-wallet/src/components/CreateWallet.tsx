import { createEthereumWallet } from '../utils/wallet'
import { encryptData } from '../utils/crypto'

export const CreateWallet = () => {
  const handleCreate = async () => {
    const password = prompt('Set a password to encrypt your wallet')
    if (!password) return alert('Password required!')

    const { privateKey, address } = createEthereumWallet()
    const encryptedKey = encryptData(privateKey, password)

    await chrome.storage.local.set({
      encryptedKey,
      address
    })

    alert(`Wallet created!\nAddress: ${address}`)
  }

  return <button onClick={handleCreate}>Create Wallet</button>
}
