'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
import StoryDetailSection1 from './StoryDetailSection1'
import StoryDetailSection2 from './StoryDetailSection2'

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
      <StoryDetailSection1 />
      <StoryDetailSection2 />
    </>
  )
}

export default LandingPageWrapper
