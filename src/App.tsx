import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { TaskPage } from './features/tasks'

function App() {

  return (
    <BrowserRouter>
      <TaskPage />
    </BrowserRouter>
  )
}

export default App
