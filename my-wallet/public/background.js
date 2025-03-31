chrome.runtime.onConnect.addListener((port) => {
    if (port.name === 'wallet-bridge') {
      port.onMessage.addListener(async (msg) => {
        if (msg.type === 'ETHEREUM_REQUEST') {
          const response = await handleEvmRequest(msg.args);
          port.postMessage({ type: 'ETHEREUM_RESPONSE', result: response });
        }
  
        if (msg.type === 'SOLANA_REQUEST') {
          const response = await handleSolanaRequest(msg.args);
          port.postMessage({ type: 'SOLANA_RESPONSE', result: response });
        }
      });
    }
  });
  
  async function handleEvmRequest(args) {
    if (args.method === 'eth_accounts') {
      const data = await chrome.storage.local.get(['address']);
      return [data.address];
    }
    return null;
  }
  
  async function handleSolanaRequest(args) {
    if (args.method === 'connect') {
      const data = await chrome.storage.local.get('solana');
      console.log('[Solana] Storage:', data);
      return { publicKey: data?.solana?.address || "" };
    }
    return null;
  }
  // public/background.js

chrome.runtime.onInstalled.addListener(() => {
  console.log('[SW] Service worker installed.');
});

chrome.runtime.onStartup.addListener(() => {
  console.log('[SW] Service worker started.');
});

  