/* eslint-disable prettier/prettier */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { AddFabricator, AllFabricators, Fabricator, Home, Login } from './components/index.js'
import './index.css'
import App from './App.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/admin',
    element: <App />,
    children: [
      {
        path: 'home',
        element: <Home />
      },
      {
        path: 'fabricator',
        element: <Fabricator />,
        children: [
          {
            path: 'add-fabricator',
            element: <AddFabricator />
          },
          {
            path: 'all-fabricator',
            element: <AllFabricators />
          }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)
