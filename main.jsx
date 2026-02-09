import React from 'react'
import ReactDOM from 'react-dom/client'
import BirthdayApp from './App.jsx' // Inga 'App' nu illama 'BirthdayApp' nu irukanum

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BirthdayApp /> 
  </React.StrictMode>,
)
