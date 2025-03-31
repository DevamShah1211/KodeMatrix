console.log('[Extension] injected.js successfully injected ✅');

(function () {
  if (window.ethereum || window.solana) return;

  console.log('[Extension] Initializing custom wallet...');

  const createWallet = (name) => ({
    isMetaMask: name === 'ethereum',
    isPhantom: name === 'solana',
    request: (args) =>
      new Promise((resolve, reject) => {
        const reqType = `${name.toLowerCase()}_request`;
        const resType = `${name.toLowerCase()}_response`;

        const listener = (event) => {
          if (
            event.source === window &&
            event.data?.source === 'wallet-extension' &&
            event.data.type === resType
          ) {
            window.removeEventListener('message', listener);
            resolve(event.data.result);
          }
        };

        window.addEventListener('message', listener);

        window.postMessage(
          {
            source: 'wallet-extension',
            type: reqType,
            args,
          },
          '*'
        );
      }),
  });

  window.ethereum = createWallet('ethereum');
  window.solana = createWallet('solana');
})();
