'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
import BlogDetailSection1 from './BlogDetailSection1'
import BlogDetailSection2 from './BlogDetailSection2'
import BlogDetailSection3 from './BlogDetailSection3'
import BlogDetailSection4 from './BlogDetailSection4'
import BlogDetailSection5 from './BlogDetailSection5'

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
      <BlogDetailSection1 />
      <BlogDetailSection2 />
      <BlogDetailSection3 />
      <BlogDetailSection4 />
      <BlogDetailSection5 />
    </>
  )
}

export default LandingPageWrapper
