import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

const ExportPrivateKey = ({ chain }: { chain: 'ethereum' | 'solana' }) => {
  const [password, setPassword] = useState('');
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleExport = async () => {
    try {
      const data = await chrome.storage.local.get(null);

      const encrypted = chain === 'ethereum'
        ? data.encryptedKey
        : data.solana?.encryptedKey;

      if (!encrypted) {
        setError('Encrypted key not found');
        return;
      }

      const decrypted = CryptoJS.AES.decrypt(encrypted, password).toString(CryptoJS.enc.Utf8);
      if (!decrypted) {
        setError('Incorrect password');
        return;
      }

      setPrivateKey(decrypted);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error decrypting key');
    }
  };

  return (
    <div>
      <h3>Export {chain} Private Key</h3>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleExport}>Show Private Key</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {privateKey && (
        <p style={{ wordBreak: 'break-all' }}>
          <strong>Private Key:</strong> {privateKey}
        </p>
      )}
    </div>
  );
};

export default ExportPrivateKey;
