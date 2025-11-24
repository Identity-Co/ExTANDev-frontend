'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

import TotalTravelSection1 from './TotalTravelSection1'

import { useSettings } from '@core/hooks/useSettings'

const LandingPageWrapper = ({ mode, banners, pgData, setOpenAccess, accessToken }: { mode: Mode; banners?: []; pgData?: []; setOpenAccess: string; accessToken?: string; }) => {
  // Hooks
  const { updatePageSettings } = useSettings()

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <TotalTravelSection1 data={pgData} setOpenAccess={setOpenAccess} accessToken={accessToken} />
    </>
  )
}

export default LandingPageWrapper
