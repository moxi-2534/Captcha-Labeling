import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './prototype/App'
import './prototype/style.css'
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
