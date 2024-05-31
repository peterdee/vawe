import { createBrowserRouter } from 'react-router-dom';

import Player from '@/pages/Player';
import Settings from '@/pages/Settings';

export default createBrowserRouter([
  {
    element: <Player />,
    path: '/',
  },
  {
    element: <Settings />,
    path: '/settings',
  },
]);
