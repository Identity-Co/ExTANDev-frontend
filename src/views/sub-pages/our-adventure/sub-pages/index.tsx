'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
import OurAdventureDetailSection1 from './OurAdventureDetailSection1'
import OurAdventureDetailSection2 from './OurAdventureDetailSection2'
import OurAdventureDetailSection3 from './OurAdventureDetailSection3'
import OurAdventureDetailSection4 from './OurAdventureDetailSection4'
import OurAdventureDetailSection5 from './OurAdventureDetailSection5'
import OurAdventureDetailSection6 from './OurAdventureDetailSection6'
import OurAdventureDetailSection7 from '@/views/shared/instagram-feed-section/InstagramFeed'
import OurAdventureDetailSection8 from '@/views/shared/cta-section/CTASection'
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
    username: '',
    general_class: 'py_150'
  }

  return (
    <>
      <BannerSection mode={mode} />
      <OurAdventureDetailSection1 />
      <OurAdventureDetailSection2 />
      <OurAdventureDetailSection3 />
      <OurAdventureDetailSection4 />
      <OurAdventureDetailSection5 />
      <OurAdventureDetailSection6 />
      <OurAdventureDetailSection7 sectionProps={instagramFeedSectionProps} />
      <OurAdventureDetailSection8 />
    </>
  )
}

export default LandingPageWrapper
