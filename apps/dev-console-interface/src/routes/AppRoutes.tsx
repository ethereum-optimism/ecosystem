import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import Faucet from '@/pages/Faucet'

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/faucet" element={<Faucet />} />
  </Routes>
)

export default AppRouter
