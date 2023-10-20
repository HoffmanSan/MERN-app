// Imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Context Providers
import { AuthContextProvider } from "./context/AuthContext";
import { ProductsContextProvider } from "./context/ProductsContext";

// Styles
import './assets/global.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ProductsContextProvider>
        <App />
      </ProductsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);