/* eslint-disable prettier/prettier */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store.js'
import {
  AddFabricator,
  AddProject,
  AddTask,
  AddTeam,
  AddUser,
  AllFabricators,
  Allprojects,
  AllTask,
  AllUser,
  ApproveAssignee,
  Calendar,
  Fabricator,
  GaantChart,
  Home,
  Login,
  ManageTeam,
  MyProfile,
  MyTask,
  ProjectStats,
  ProjectTab,
  TaskRecord,
  TaskTab,
  UsersTaskRecord,
  UserTab
} from './components/index.js'

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
            path: 'all-project',
            element: <Allprojects />
          },
          {
            path: 'project-stats',
            element: <ProjectStats />
          },
          {
            path: 'manage-team',
            element: <ManageTeam />
          },
          {
            path: 'add-team',
            element: <AddTeam />
          }
        ]
      },
      {
        path: 'task',
        element: <TaskTab />,
        children: [
          {
            path: 'add-task',
            element: <AddTask />
          },
          {
            path:'all-task',
            element: <AllTask />
          },
          {
            path:'my-task',
            element:<MyTask/>
          },
          {
            path:'approve-assignee',
            element:<ApproveAssignee/>
          },
          {
            path:'myTask-record',
            element:<TaskRecord/>
          }
        ]
      },
      {
        path:'user',
        element:<UserTab />,
        children:[
          {
            path:'all-user',
            element:<AllUser/>
          },
          {
            path:'add-user',
            element:<AddUser/>
          },
          {
            path:'user-task-record',
            element:<UsersTaskRecord/>
          },
          {
            path:'calendar',
            element:<Calendar/>
          },
          {
            path:'gaant-chart',
            element:<GaantChart/>
          }
        ]
      },
      {
        path: 'profile',
        element: <MyProfile />
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
