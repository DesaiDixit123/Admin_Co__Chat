import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './store/store.js'
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'react-phone-input-2/lib/style.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {/* <PrimeReactProvider value={{ unstyled: true }}> */}
            <App />
          {/* </PrimeReactProvider> */}
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  </BrowserRouter>
)
