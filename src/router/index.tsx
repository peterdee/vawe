import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Player from '@/pages/Player';
import TrackDetails from '@/pages/TrackDetails';

export default createBrowserRouter([
  {
    element: <Player />,
    path: '/',
  },
  {
    element: <TrackDetails />,
    path: '/details/:id',
  },
]);
