import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { AppLayout } from './components/AppLayout'
import { HomePage } from './pages/HomePage'
import { CarDetailPage } from './pages/CarDetailPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/detail/:carId" element={<CarDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
