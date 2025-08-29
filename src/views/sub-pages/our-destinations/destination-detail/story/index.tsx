'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
import StorySection1 from './StorySection1'
import StorySection2 from './StorySection2'
import StorySection3 from '@/views/shared/cta-section/CTASection'

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
      <StorySection1 />
      <StorySection2 />
      <StorySection3 />
    </>
  )
}

export default LandingPageWrapper
