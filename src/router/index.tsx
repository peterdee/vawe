import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Player from '@/pages/Player';

export default createBrowserRouter([
  {
    element: <Player />,
    path: '/',
  },
]);
