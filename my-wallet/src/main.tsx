import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// 👇 Add this to make Buffer work in browser
import { Buffer } from 'buffer'
window.Buffer = Buffer

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
