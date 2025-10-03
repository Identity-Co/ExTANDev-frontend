'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import StorySection1 from './StorySection1'
import StorySection2 from './StorySection2'
import StorySection3 from '@/views/shared/cta-section/CTASection'

import { useSettings } from '@core/hooks/useSettings'

const LandingPageWrapper = ({ pgData, destinations}: AdventureProps) => {
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
      <StorySection1 data={pgData?.stories ?? []} />
      <StorySection2 data={pgData?.stories?.stories ?? []} />
      <StorySection3 data={pgData ?? []} />
    </>
  )
}

export default LandingPageWrapper
