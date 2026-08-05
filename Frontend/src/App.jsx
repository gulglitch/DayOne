import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CompanyPage from './pages/CompanyPage'
import DossierPage from './pages/DossierPage'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/company/:runId" element={<CompanyPage />} />
        <Route path="/company/:runId/dossier" element={<DossierPage />} />
      </Routes>
    </div>
  )
}

export default App