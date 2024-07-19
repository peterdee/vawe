import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import 'common-styles/styles.css';

import { persistor, store } from './store';
import router from './router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <div className="f d-col wrap">
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </div>,
);

postMessage({ payload: 'removeLoading' }, '*');
