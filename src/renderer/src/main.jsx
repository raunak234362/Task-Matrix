/* eslint-disable prettier/prettier */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { Dashboard, Login } from './components/index.js'

const router = createBrowserRouter([
  {
    path:'/',
    element: <Login />,
  },
  {
    path:'/dashboard',
    element: <Dashboard />,
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)