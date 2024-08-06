// import Versions from './components/Versions'
// import electronLogo from './assets/electron.svg'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components'

function App() {
  // const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      {/* <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
      </div>
      <Versions></Versions> */}
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
