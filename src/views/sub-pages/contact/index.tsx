'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
import ContactSection1 from './ContactSection1'
import ContactSection2 from './ContactSection2'
import ContactSection3 from './ContactSection3'
import ContactSection4 from './ContactSection4'

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
      <ContactSection1 />
      <ContactSection2 />
      <ContactSection3 />
      <ContactSection4 />
    </>
  )
}

export default LandingPageWrapper
