import {Routes, Route} from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import HistoricalPage from './pages/HistoricalPage'

const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/trends" element={<HistoricalPage />} />
    </Routes>
    </>
  )
}

export default App