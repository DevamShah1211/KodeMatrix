import CryptoJS from 'crypto-js'

export const encryptData = (data: string, password: string): string => {
  return CryptoJS.AES.encrypt(data, password).toString()
}

export const decryptData = (cipherText: string, password: string): string => {
  const bytes = CryptoJS.AES.decrypt(cipherText, password)
  return bytes.toString(CryptoJS.enc.Utf8)
}
