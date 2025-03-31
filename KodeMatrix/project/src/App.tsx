import React, { useState } from 'react';
import { Wallet, parseEther } from 'ethers';
import { WalletIcon, Plus, Import, AlertCircle, Eye, EyeOff, CheckCircle2, XCircle, Settings, Send, Download, RefreshCw, ChevronDown, ExternalLink, Copy, Clock, X, QrCode } from 'lucide-react';
import { storeWallet, validatePassword, shuffleArray, mockTransactions, mockTokens, networks, truncateAddress } from './lib/utils';

type Step = 'welcome' | 'create-password' | 'show-seed' | 'confirm-seed' | 'import' | 'success' | 'dashboard';
type Modal = 'none' | 'send' | 'receive';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [shuffledSeedWords, setShuffledSeedWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [importSeedPhrase, setImportSeedPhrase] = useState('');
  const [error, setError] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [currentModal, setCurrentModal] = useState<Modal>('none');
  
  // Send transaction states
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [gasPrice, setGasPrice] = useState('');
  const [sendError, setSendError] = useState('');
  const [sendingTransaction, setSendingTransaction] = useState(false);

  const handleCreateWallet = () => {
    const newWallet = Wallet.createRandom();
    setWallet(newWallet);
    setSeedPhrase(newWallet.mnemonic?.phrase || '');
    setCurrentStep('create-password');
  };

  const handlePasswordSubmit = async () => {
    const errors = validatePassword(password);
    setPasswordErrors(errors);

    if (errors.length > 0) return;
    if (password !== confirmPassword) {
      setPasswordErrors(['Passwords do not match']);
      return;
    }

    if (currentStep === 'create-password') {
      setCurrentStep('show-seed');
    } else if (currentStep === 'import') {
      try {
        const importedWallet = Wallet.fromPhrase(importSeedPhrase);
        await storeWallet(importedWallet, password);
        setWallet(importedWallet);
        setCurrentStep('dashboard');
      } catch (err) {
        setError('Invalid seed phrase');
      }
    }
  };

  const handleShowSeed = () => {
    const words = seedPhrase.split(' ');
    setShuffledSeedWords(shuffleArray(words));
    setCurrentStep('confirm-seed');
  };

  const handleWordSelect = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleConfirmSeed = async () => {
    if (selectedWords.join(' ') === seedPhrase) {
      if (wallet) {
        await storeWallet(wallet, password);
        setCurrentStep('dashboard');
      }
    } else {
      setError('Incorrect seed phrase order');
      setSelectedWords([]);
    }
  };

  const handleCopyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const handleSendTransaction = async () => {
    setSendError('');
    setSendingTransaction(true);

    try {
      // Validate inputs
      if (!recipientAddress || !sendAmount) {
        throw new Error('Please fill in all fields');
      }

      if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
        throw new Error('Invalid Ethereum address');
      }

      const amount = parseFloat(sendAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount');
      }

      // Simulate transaction success
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add mock transaction to history
      const newTx = {
        hash: '0x' + Math.random().toString(16).slice(2).padEnd(64, '0'),
        from: wallet?.address || '',
        to: recipientAddress,
        value: sendAmount,
        timestamp: Date.now(),
        status: 'confirmed',
        type: 'send'
      };

      mockTransactions.unshift(newTx);
      
      // Close modal and reset form
      setCurrentModal('none');
      setSendAmount('');
      setRecipientAddress('');
      setGasPrice('');
    } catch (err: any) {
      setSendError(err.message);
    } finally {
      setSendingTransaction(false);
    }
  };

  const renderModal = () => {
    switch (currentModal) {
      case 'send':
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[360px] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-medium">Send</h3>
                <button
                  onClick={() => setCurrentModal('none')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset
                  </label>
                  <select className="w-full p-2 border rounded-lg">
                    {mockTokens.map(token => (
                      <option key={token.symbol} value={token.symbol}>
                        {token.symbol} - Balance: {token.balance}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    placeholder="0x..."
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-lg"
                    placeholder="0.0"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gas Price (GWEI)
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={gasPrice}
                    onChange={(e) => setGasPrice(e.target.value)}
                  >
                    <option value="slow">Slow (12 GWEI)</option>
                    <option value="medium">Medium (15 GWEI)</option>
                    <option value="fast">Fast (18 GWEI)</option>
                  </select>
                </div>
                {sendError && (
                  <div className="text-red-500 text-sm">
                    {sendError}
                  </div>
                )}
                <button
                  className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                  onClick={handleSendTransaction}
                  disabled={sendingTransaction}
                >
                  {sendingTransaction ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'receive':
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[360px] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-medium">Receive</h3>
                <button
                  onClick={() => setCurrentModal('none')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-center">
                  <QrCode size={200} />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Your Address</p>
                  <div className="bg-gray-50 p-3 rounded-lg break-all font-mono text-sm">
                    {wallet?.address}
                  </div>
                  <button
                    className="mt-2 text-blue-500 hover:text-blue-600"
                    onClick={handleCopyAddress}
                  >
                    {copiedAddress ? 'Copied!' : 'Copy to clipboard'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderDashboard = () => {
    return (
      <div className="flex flex-col h-[600px]">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <button
                className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
                onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
              >
                <span>{selectedNetwork.name}</span>
                <ChevronDown size={16} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Settings size={20} />
              </button>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <RefreshCw size={20} />
            </button>
          </div>

          {/* Network Dropdown */}
          {showNetworkDropdown && (
            <div className="absolute top-16 left-4 bg-white rounded-lg shadow-lg border p-2 z-10">
              {networks.map((network) => (
                <button
                  key={network.chainId}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded"
                  onClick={() => {
                    setSelectedNetwork(network);
                    setShowNetworkDropdown(false);
                  }}
                >
                  {network.name}
                </button>
              ))}
            </div>
          )}

          {/* Account */}
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 mb-2">
              <button
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
                onClick={handleCopyAddress}
              >
                <span className="font-mono">{truncateAddress(wallet?.address || '')}</span>
                <Copy size={16} />
              </button>
              {copiedAddress && (
                <span className="text-green-500 text-sm">Copied!</span>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                className="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
                onClick={() => setCurrentModal('send')}
              >
                <Send size={16} />
                <span>Send</span>
              </button>
              <button
                className="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
                onClick={() => setCurrentModal('receive')}
              >
                <Download size={16} />
                <span>Receive</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button className="flex-1 px-4 py-2 border-b-2 border-blue-500 font-medium">
            Assets
          </button>
          <button className="flex-1 px-4 py-2 text-gray-500 hover:text-gray-700">
            Activity
          </button>
        </div>

        {/* Token List */}
        <div className="flex-1 overflow-auto">
          {mockTokens.map((token) => (
            <div key={token.symbol} className="p-4 border-b hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={token.icon} alt={token.name} className="w-8 h-8" />
                  <div>
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-gray-500">{token.balance} {token.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div>${(parseFloat(token.balance) * token.price).toFixed(2)}</div>
                  <div className={`text-sm ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {token.change24h > 0 ? '+' : ''}{token.change24h}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="border-t">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Activity</h3>
            {mockTransactions.map((tx) => (
              <div key={tx.hash} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  {tx.type === 'send' ? <Send size={16} /> : <Download size={16} />}
                  <div>
                    <div className="font-medium">{tx.type === 'send' ? 'Sent' : 'Received'} ETH</div>
                    <div className="text-sm text-gray-500">
                      {new Date(tx.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={tx.type === 'send' ? 'text-red-500' : 'text-green-500'}>
                    {tx.type === 'send' ? '-' : '+'}{tx.value} ETH
                  </span>
                  <a
                    href={`${selectedNetwork.explorer}/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <div className="flex flex-col items-center justify-center h-[600px] p-6">
            <WalletIcon className="w-16 h-16 text-blue-500 mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to MetaMask Clone</h1>
            <p className="text-gray-600 text-center mb-8">
              A secure wallet for the decentralized web
            </p>
            <div className="space-y-4 w-full">
              <button
                className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors"
                onClick={handleCreateWallet}
              >
                <Plus className="w-5 h-5" />
                <span>Create New Wallet</span>
              </button>
              <button
                className="w-full border border-blue-500 text-blue-500 rounded-lg px-4 py-2 flex items-center justify-center space-x-2 hover:bg-blue-50 transition-colors"
                onClick={() => setCurrentStep('import')}
              >
                <Import className="w-5 h-5" />
                <span>Import Existing Wallet</span>
              </button>
            </div>
          </div>
        );

      case 'create-password':
      case 'import':
        return (
          <div className="p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {currentStep === 'create-password' ? 'Create Password' : 'Import Wallet'}
              </h2>
              <p className="text-gray-600">
                This password will unlock your wallet only on this device
              </p>
            </div>

            {currentStep === 'import' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Seed Phrase
                </label>
                <textarea
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter your 12 or 24-word seed phrase"
                  value={importSeedPhrase}
                  onChange={(e) => setImportSeedPhrase(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full p-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="absolute right-2 top-2.5 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {passwordErrors.length > 0 && (
                <div className="text-red-500 text-sm space-y-1">
                  {passwordErrors.map((error, index) => (
                    <div key={index} className="flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {error}
                    </div>
                  ))}
                </div>
              )}

              <button
                className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors"
                onClick={handlePasswordSubmit}
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 'show-seed':
        return (
          <div className="p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Secret Recovery Phrase</h2>
              <p className="text-gray-600">
                Write down these 12 words in order and keep them safe. Never share them with anyone!
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="grid grid-cols-3 gap-2">
                {seedPhrase.split(' ').map((word, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-gray-500 mr-1">{index + 1}.</span>
                    <span className="font-mono">{word}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors"
              onClick={handleShowSeed}
            >
              I've Written It Down
            </button>
          </div>
        );

      case 'confirm-seed':
        return (
          <div className="p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Confirm Recovery Phrase</h2>
              <p className="text-gray-600">
                Select the words in the correct order
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border min-h-[100px]">
              <div className="flex flex-wrap gap-2">
                {selectedWords.map((word, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm cursor-pointer"
                    onClick={() => handleWordSelect(word)}
                  >
                    {word}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {shuffledSeedWords.map((word, index) => (
                <div
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                    selectedWords.includes(word)
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => handleWordSelect(word)}
                >
                  {word}
                </div>
              ))}
            </div>

            {error && (
              <div className="text-red-500 text-sm flex items-center">
                <XCircle size={16} className="mr-1" />
                {error}
              </div>
            )}

            <button
              className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors"
              onClick={handleConfirmSeed}
              disabled={selectedWords.length !== seedPhrase.split(' ').length}
            >
              Confirm
            </button>
          </div>
        );

      case 'dashboard':
        return renderDashboard();
    }
  };

  return (
    <div className="w-[360px] min-h-[600px] bg-white">
      {renderStep()}
      {renderModal()}
    </div>
  );
}

export default App;