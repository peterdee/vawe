import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import 'common-styles/styles.css';

import router from './router';
import { store } from './store';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <div className="f d-col h-100vh">
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </div>,
);

postMessage({ payload: 'removeLoading' }, '*');
