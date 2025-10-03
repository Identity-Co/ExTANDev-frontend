'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
import StaticPageSection1 from './StaticPageSection1'

import { useSettings } from '@core/hooks/useSettings'

const AdventureGuideDetailPage = ({ mode, pgData }: { mode: Mode; pgData?: []; }) => {
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
      <BannerSection mode={mode} data={pgData} />
      <StaticPageSection1 data={pgData} />
    </>
  )
}

export default AdventureGuideDetailPage
