'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
import AdventureGuideDetail1 from './AdventureGuideDetail1'

import { useSettings } from '@core/hooks/useSettings'

const AdventureGuideDetailPage = ({ mode, pgData, mianPgData }: { mode: Mode; pgData?: []; mianPgData?: []; }) => {
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
      <BannerSection mode={mode} data={pgData} bannerImage={mianPgData?.banner_image || ''} />
      <AdventureGuideDetail1 data={pgData} mainPgData={mianPgData} />
    </>
  )
}

export default AdventureGuideDetailPage
