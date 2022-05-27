import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import './assets/styles/index.css';
import BoxList from './components/BoxList';
import BoxDetails from './components/BoxDetails';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<BoxList />} />
        <Route path="/details/:id" element={<BoxDetails />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
