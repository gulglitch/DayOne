import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getRun, getDossier } from '../lib/api'
import DossierView from '../components/DossierView'

export default function DossierPage() {
  const [dossierData, setDossierData] = useState(null)
  const [runData, setRunData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { runId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch run data
        const runData = await getRun(runId)
        setRunData(runData)

        // Fetch dossier data
        const dossierData = await getDossier(runId)
        setDossierData(dossierData)

        setIsLoading(false)
      } catch (err) {
        setError(err.message)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [runId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Compiling your company dossier...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate(`/company/${runId}`)}
              className="btn-secondary"
            >
              Back to Boardroom
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Start New Company
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <DossierView
      runData={runData}
      dossierData={dossierData}
      runId={runId}
    />
  )
}