import { useState } from 'react'

export type Network = 'ethereum' | 'solana'

interface Props {
  selected: Network
  onChange: (network: Network) => void
}

export const NetworkSwitcher = ({ selected, onChange }: Props) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ fontWeight: 'bold', marginRight: '8px' }}>Network:</label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value as Network)}
        style={{ padding: '6px', borderRadius: '6px' }}
      >
        <option value="ethereum">Ethereum</option>
        <option value="solana">Solana</option>
      </select>
    </div>
  )
}
