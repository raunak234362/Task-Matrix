/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Provider, useDispatch } from 'react-redux'
import store from './store/store'

import { useCallback, useEffect, useState } from 'react'
import { Header, Sidebar } from './components/index'
import { Outlet, useNavigate } from 'react-router-dom'
import Service from './api/configAPI'
// import FrappeService from "./frappeConfig/FrappeService";
import { setUserData } from './store/userSlice'
// import { loadFabricator, showClient } from "./store/fabricatorSlice";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = sessionStorage.getItem('token')

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [setSidebarOpen])

  

  useEffect(() => {
    const fetchUser = async () => {
      const user = await Service.getCurrentUser(token)
      // console.log("User :", user);
      try {
        // const fabricator= await Service.allFabricator(token);
        // const client = await Service.allClient(token);
        // // const project = await Service.allprojects(token);
        dispatch(setUserData(user[0]))
        // dispatch(loadFabricator(fabricator));
        // dispatch(showClient(client));
        // dispatch(showProjects(project));
      } catch (error) {
        console.log(error)
        navigate('/')
      }
    }

    fetchUser()
  }, [dispatch])

  return (
    <Provider store={store}>
      <div className="flex flex-col md:flex-row w-screen h-screen overflow-hidden bg-gradient-to-r from-green-300/50 to-teal-300">
        {/* Sidebar */}

        {/* {!isConnected && (
          <>
            <div className="absolute z-50 top-0 left-0 bg-black bg-opacity-50 w-screen h-screen">
              <div className="flex w-full h-full items-center justify-center px-20 py-10">
                <div className="bg-white text-red-700 px-32 py-20 rounded-3xl border-2 border-red-700">
                  {result
                    ? 'Connecting to Server, Please Wait...'
                    : 'Connection Failed, Please Check Your Internet Connection'}
                </div>
              </div>
            </div>
          </>
        )} */}

        <div className="flex flex-col w-full">
          <div className="mx-5 my-2 shadow-2xl drop-shadow-lg">
            <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          </div>
          {/* Header */}
          <div className="flex flex-row">
            <div
              className={`fixed md:static flex flex-col md:bg-opacity-0 bg-white w-64 z-20 transition-transform duration-300 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              } md:translate-x-0 md:w-64`}
            >
              <div className="flex justify-between items-center p-4">
                <Sidebar />
              </div>
            </div>
            {/* Main Content */}
            <div
              className={`flex h-[89vh] overflow-y-auto flex-grow transition-all duration-300 ${
                sidebarOpen ? 'md:ml-64 ml-0 bg-black/50' : 'md:ml-0 ml-0'
              }`}
            >
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </Provider>
  )
}

export default App
