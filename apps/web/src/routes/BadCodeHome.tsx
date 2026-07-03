import { Navigate, useLocation } from 'react-router-dom'
import { TransmissionIndex } from '../home/landing/TransmissionIndex'
import { homeSteps } from '../home/timeline'

/**
 * `/` — the BadCode umbrella homepage (the Transmission Index).
 * Legacy deep links predate the Atlas moving to /gitpush-origin-master
 * (they looked like `/#camping`), so a hash naming an Atlas node redirects.
 */
export function BadCodeHome() {
  const location = useLocation()
  const hashId = location.hash.replace(/^#/, '')
  if (hashId && homeSteps.some((s) => s.id === hashId)) {
    return <Navigate to={`/gitpush-origin-master${location.hash}`} replace />
  }
  return <TransmissionIndex />
}
