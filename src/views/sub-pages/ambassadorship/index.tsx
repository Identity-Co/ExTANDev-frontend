'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
import AmbassadorshipSection1 from './AmbassadorshipSection1'
import AmbassadorshipSection2 from './AmbassadorshipSection2'
import AmbassadorshipSection3 from './AmbassadorshipSection3'

import { useSettings } from '@core/hooks/useSettings'

const LandingPageWrapper = ({ mode, pgData }: { mode: Mode; pgData?: [] }) => {

  console.log(pgData);
  
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
      <BannerSection mode={mode} />
      <AmbassadorshipSection1 data={pgData} />
      <AmbassadorshipSection2 data={pgData}/>
      <AmbassadorshipSection3 />
    </>
  )
}

export default LandingPageWrapper
