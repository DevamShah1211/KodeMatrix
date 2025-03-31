import { ethers } from 'ethers'

export const createEthereumWallet = () => {
  const wallet = ethers.Wallet.createRandom()
  return {
    privateKey: wallet.privateKey,
    address: wallet.address
  }
}
