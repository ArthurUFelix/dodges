import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ReactGA from 'react-ga4';
import './index.css';
import reportWebVitals from './reportWebVitals';
import DodgesList from './pages/DodgesList';

const router = createBrowserRouter([
  {
    path: "/",
    element: <DodgesList />,
  },
]);

ReactGA.initialize(process.env.REACT_APP_GA_ID);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
