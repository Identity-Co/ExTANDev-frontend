'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
import AdventuresDetailSection1 from './AdventuresDetailSection1'
import AdventuresDetailSection2 from './AdventuresDetailSection2'
import AdventuresDetailSection3 from './AdventuresDetailSection3'
import AdventuresSection4 from '@/views/shared/instagram-feed-section/InstagramFeed'

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

  const instagramFeedSectionProps = {
    username: '@anbiking',
    general_class: 'py_150'
  }

  return (
    <>
      <BannerSection mode={mode} />
      <AdventuresDetailSection1 />
      <AdventuresDetailSection2 />
      <AdventuresDetailSection3 />
      <AdventuresSection4 sectionProps={instagramFeedSectionProps} />
    </>
  )
}

export default LandingPageWrapper
