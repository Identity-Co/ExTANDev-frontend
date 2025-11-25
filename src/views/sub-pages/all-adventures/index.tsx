'use client'

// React Imports
import { useState, useEffect, useRef } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
import OurAdventureSection1 from './OurAdventureSection1'
import OurAdventureSection2 from './OurAdventureSection2'
import OverviewSection3 from '@/views/shared/instagram-feed-slider-section/InstagramFeedSlider'
import OverviewSection4 from '@/views/shared/instagram-feed-section/InstagramFeed'
import OverviewSection5 from '@/views/shared/cta-section/CTASection'
import { useSettings } from '@core/hooks/useSettings'

const LandingPageWrapper = ({ mode, banners, pgData, filter_categories, toursData, hasParam }: { mode: Mode; banners?: []; pgData?: []; filter_categories?: []; toursData?: []; hasParam?: false }) => {
  const adventure_Posts = pgData?.adventure_posts;
  // Hooks
  const { updatePageSettings } = useSettings()

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scrollref = useRef(null);

  useEffect(() => {
    if (hasParam) {
      const el = scrollref.current;
      if (!el) return;

      const vw = window.innerWidth / 100;

      const desktopOffsetVW = 8;
      const desktopOffset = desktopOffsetVW * vw;

      const mobileOffsetVW = 14;
      const mobileOffset = mobileOffsetVW * vw;

      const offset = window.innerWidth < 768 ? mobileOffset : desktopOffset;

      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [hasParam]);

  const instagramSliderSectionProps = {
    class: 'py_150',
    lists: adventure_Posts?? []
  }

  const featuredResortsSectionProps = {
    resorts : [
        {   
          title: 'Kalon Surf Resort',
          sub_title: 'Guenacaste, Costa Rica',
          description: 'An Idyllic Beach Retreat Set in Paradise on Costa Rica’s Pacific Coast',
          image: '/images/front-pages/images/resort1.jpg',
        },
        {
          title: 'Tan resort jarabacoa',
          sub_title: 'Jarabacoa, Dominican Republic',
          description: 'An Idyllic Beach Retreat Set in Paradise on Costa Rica’s Pacific Coast',
          image: '/images/front-pages/images/resort2.jpg',
        },
        {
          title: 'mashpi Lodge',
          sub_title: 'Mashpi, Ecuador',
          description: 'An Idyllic Beach Retreat Set in Paradise on Costa Rica’s Pacific Coast',
          image: '/images/front-pages/images/resort3.jpg',
        },
    ],
    heading_class: 'fs_35',
    class: ''
  }

  const instagramFeedSectionProps = {
    username: '@anadventures',
    general_class: 'pb_150'
  }

  return (
    <>
      {banners.length ? <BannerSection mode={mode} banners={banners} filter_categories={filter_categories} scrollRef={scrollref} /> : null}
      <OurAdventureSection1 data={pgData} />
      <OurAdventureSection2 data={pgData} toursData={toursData} />
      <OverviewSection3 data={pgData} sectionProps={instagramSliderSectionProps} />
      <OverviewSection4 data={pgData} sectionProps={instagramFeedSectionProps} />
      <OverviewSection5 data={pgData} />
    </>
  )
}

export default LandingPageWrapper
