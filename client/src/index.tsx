// Imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Context Providers
import { AuthContextProvider } from "./contexts/AuthContext";
import { ProductsContextProvider } from "./contexts/ProductsContext";
import { CategoriesContextProvider } from './contexts/CategoriesContext';
import { CartContextProvider } from './contexts/CartContext';

// Styles
import './assets/global.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <CartContextProvider>
        <CategoriesContextProvider>
          <ProductsContextProvider>
            <App />
          </ProductsContextProvider>
        </CategoriesContextProvider>
      </CartContextProvider>
    </AuthContextProvider>
  </React.StrictMode>

);