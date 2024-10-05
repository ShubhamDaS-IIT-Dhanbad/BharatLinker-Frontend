// index.js
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import store from './redux/store/store.jsx';
import './index.css';
import ReactGA from 'react-ga4';

ReactGA.initialize("G-VEKMNYQYQ1"); // Use your Measurement ID

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
