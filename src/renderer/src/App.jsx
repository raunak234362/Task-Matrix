// import Versions from './components/Versions'
// import electronLogo from './assets/electron.svg'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components'

function App() {
  // const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <div className="action">
        <Routes>
          <Route path="/*" element={<Layout />} />
        </Routes>
        {/* <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
          Send IPC
        </a> */}
      </div>
    </>
  )
}

export default App
