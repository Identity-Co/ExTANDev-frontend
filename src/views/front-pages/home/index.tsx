'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
import HomeSection1 from './HomeSection1'
import HomeSection2 from './HomeSection2'
import HomeSection3 from './HomeSection3'
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
      <HomeSection1 />
      <HomeSection2 />
      <HomeSection3 />
      {/*<UsefulFeature />
      <OurTeam />
      <Pricing />
      <ProductStat />
      <Faqs />
      <GetStarted />
      <ContactUs />*/}
    </>
  )
}

export default LandingPageWrapper
