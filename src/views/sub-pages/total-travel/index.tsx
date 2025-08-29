'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
import TotalTravelSection1 from './TotalTravelSection1'
import TotalTravelSection2 from './TotalTravelSection2'

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
      {banners.length ? <BannerSection mode={mode} banners={banners} /> : null }
      <TotalTravelSection1 data={pgData} />
      <TotalTravelSection2 data={pgData} />
    </>
  )
}

export default LandingPageWrapper
