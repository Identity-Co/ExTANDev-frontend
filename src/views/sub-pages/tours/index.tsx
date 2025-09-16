'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
import ToursListing from './ToursListing'
import { useSettings } from '@core/hooks/useSettings'

const LandingPageWrapper = ({ mode, banners, pgData, toursData, filter_locations }: { mode: Mode; banners?: []; pgData?: []; toursData?: []; filter_locations?: []; }) => {
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
      {banners.length ? <BannerSection mode={mode} banners={banners} filter_locations={filter_locations} /> : null}
      <ToursListing data={pgData} toursData={toursData} />
    </>
  )
}

export default LandingPageWrapper
