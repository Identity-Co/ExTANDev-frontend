'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

import TotalTravelSection1 from './TotalTravelSection1'

import { useSettings } from '@core/hooks/useSettings'

const LandingPageWrapper = ({ mode, banners, pgData }: { mode: Mode; banners?: []; pgData?: []; }) => {
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
      <TotalTravelSection1 data={pgData} />
    </>
  )
}

export default LandingPageWrapper
