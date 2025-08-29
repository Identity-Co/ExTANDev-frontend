'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
import MerchandiseSection1 from './MerchandiseSection1'
import MerchandiseSection2 from './MerchandiseSection2'
import MerchandiseSection3 from './MerchandiseSection3'

import { useSettings } from '@core/hooks/useSettings'

const LandingPageWrapper = ({ mode }: { mode: Mode }) => {
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
      <MerchandiseSection1 />
      <MerchandiseSection2 />
      <MerchandiseSection3 />
    </>
  )
}

export default LandingPageWrapper
