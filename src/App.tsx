import { useRoutes } from 'react-router-dom';
import routes from './router';
import { ToastContainer } from 'react-toastify';
import './App.css'

function App() {
  const content = useRoutes(routes);

  return (
    <>
      <ToastContainer />
      {content}
    </>
  )
}

export default App
