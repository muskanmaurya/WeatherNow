import {Routes, Route} from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import HistoricalPage from './pages/HistoricalPage'
import NotFoundPage from './pages/NotFoundPage'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/trends" element={<HistoricalPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App