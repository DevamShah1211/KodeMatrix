import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

const ExportWalletKey: React.FC = () => {
  const [password, setPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [error, setError] = useState('');

  const handleExport = () => {
    chrome.storage.local.get(['wallet', 'solana'], (result) => {
      try {
        const encrypted = result.wallet?.encryptedKey || result.solana?.encryptedKey;
        if (!encrypted) {
          setError('No wallet found');
          return;
        }

        const decrypted = CryptoJS.AES.decrypt(encrypted, password).toString(CryptoJS.enc.Utf8);

        if (!decrypted) {
          setError('Wrong password!');
        } else {
          setPrivateKey(decrypted);
          setError('');
        }
      } catch (e) {
        console.error(e);
        setError('Decryption failed!');
      }
    });
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>🔑 Export Private Key</h3>
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleExport}>Export</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {privateKey && (
        <div>
          <p><strong>Private Key:</strong></p>
          <textarea value={privateKey} readOnly rows={3} cols={40} />
        </div>
      )}
    </div>
  );
};

export default ExportWalletKey;
