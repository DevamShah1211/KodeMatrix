import { useEffect, useState } from 'react';
import { CreateWallet } from './components/CreateWallet';
import { ImportWallet } from './components/ImportWallet';
import { UnlockWallet } from './components/UnlockWallet';
import { CreateSolanaWallet } from './components/CreateSolanaWallet';
import { UnlockSolanaWallet } from './components/UnlockSolanaWallet';
import { NetworkSwitcher, Network } from './components/NetworkSwitcher';
import { ImportSolanaWallet } from './components/ImportSalonaWallet';
import ExportPrivateKey from './components/ExportPrivateKey';
import { SendTransaction } from './components/SendTransaction';
import { ReceiveWallet } from './components/ReciveWallet';
import { Balance } from './components/Balance';

function App() {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>('ethereum');
  const [walletAvailable, setWalletAvailable] = useState(false);

  // Check if a wallet is unlocked/created/imported
  useEffect(() => {
    const checkStorage = async () => {
      if (selectedNetwork === 'ethereum') {
        const res = await chrome.storage.local.get(['address', 'encryptedKey']);
        setWalletAvailable(!!res.address && !!res.encryptedKey);
      } else {
        const res = await chrome.storage.local.get(['solana']);
        setWalletAvailable(!!res.solana?.address && !!res.solana?.privateKey);
      }
    };
    checkStorage();
  }, [selectedNetwork]);

  return (
    <div style={{ padding: '1rem', minWidth: '320px' }}>
      <h2>My Crypto Wallet</h2>

      <NetworkSwitcher selected={selectedNetwork} onChange={setSelectedNetwork} />
      <button
        onClick={() => {
          chrome.storage.local.clear(() => {
            window.location.reload()
          })
        }}
        style={{ marginBottom: '1rem' }}
      >
        🔄 Reset Storage
      </button>

      {selectedNetwork === 'ethereum' && (
        <>
          <CreateWallet />
          <ImportWallet />
          <UnlockWallet />
          <ExportPrivateKey chain="ethereum" />
        </>
      )}

      {selectedNetwork === 'solana' && (
        <>
          <CreateSolanaWallet />
          <ImportSolanaWallet />
          <UnlockSolanaWallet />
          <ExportPrivateKey chain="solana" />
        </>
      )}

      {/* Show send/receive/balance if wallet is available */}
      {walletAvailable && (
        <>
          <Balance network={selectedNetwork} />
          <SendTransaction network={selectedNetwork} />
          <ReceiveWallet network={selectedNetwork} />
        </>
      )}
    </div>
  );
}

export default App;
