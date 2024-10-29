import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard'
import MyTasks from './components/MyTasks/MyTasks'
let allRouter = createBrowserRouter([
  {path : '/signup',
    element: <Signup/>
  },
  {path : '/',
    element: <Login/>
  },
  {path : '/dashboard',
    element: <Dashboard/>
  },
  {path : '/tasks',
    element: <MyTasks/>
  }

])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <RouterProvider router={allRouter} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
