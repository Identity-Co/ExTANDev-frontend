'use client'

// React Imports
import { useEffect, useState } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import TotalTravelSection1 from './TotalTravelSection1'
import TotalTravelSection2 from './TotalTravelSection2'

import { useSettings } from '@core/hooks/useSettings'

const LandingPageWrapper = ({ mode, banners, pgData, setOpenAccess }: { mode: Mode; banners?: []; pgData?: []; setOpenAccess?:string }) => {
  // Hooks
  const { updatePageSettings } = useSettings()

  const [isMore, setIsMore] = useState(0)

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <TotalTravelSection1 data={pgData} isMore={isMore} setIsMore={setIsMore} setOpenAccess={setOpenAccess} />
      <TotalTravelSection2 data={pgData} isMore={isMore} setIsMore={setIsMore} />
    </>
  )
}

export default LandingPageWrapper
