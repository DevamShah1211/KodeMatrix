console.log('[Extension] contentScript.js loaded');

try {
  const injectedScriptUrl = chrome.runtime.getURL('injected.js');
  console.log('[Extension] injecting:', injectedScriptUrl);

  const script = document.createElement('script');
  script.src = injectedScriptUrl;
  script.onload = () => {
    console.log('[Extension] injected.js loaded and removed ✅');
    script.remove();
  };
  script.onerror = () => {
    console.error('[Extension] failed to load injected.js ❌');
  };

  document.documentElement.appendChild(script);
} catch (e) {
  console.error('[Extension] Injection failed:', e);
}

// Bridge between injected.js ↔ background.js
window.addEventListener('message', (event) => {
  if (event.source !== window || event.data?.source !== 'wallet-extension') return;

  const { type, args } = event.data;
  const port = chrome.runtime.connect({ name: 'wallet-bridge' });

  port.postMessage({ type: type.toUpperCase(), args });

  port.onMessage.addListener((msg) => {
    window.postMessage(
      {
        source: 'wallet-extension',
        type: type.replace('_request', '_response'),
        result: msg.result,
      },
      '*'
    );
  });
});
