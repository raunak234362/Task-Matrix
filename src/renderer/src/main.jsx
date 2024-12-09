/* eslint-disable prettier/prettier */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { AddFabricator, AddProject, AllFabricators, Allprojects, Fabricator, Home, Login, ProjectStats, ProjectTab } from './components/index.js'

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
      },
      {
        path: 'project',
        element: <ProjectTab />,
        children: [
          {
            path: 'add-project',
            element: <AddProject />
          },
          {
            path:'all-project',
            element: <Allprojects/>
          },
          {
            path:'project-stats',
            element: <ProjectStats/>
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
