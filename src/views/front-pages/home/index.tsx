'use client'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
import HomeSection1 from './HomeSection1'
import HomeSection2 from './HomeSection2'
import HomeSection3 from './HomeSection3'
import HomeSection4 from './HomeSection4'
import HomeSection5 from '@/views/shared/instagram-feed-slider-section/InstagramFeedSlider'
import HomeSection6 from './HomeSection6'
import HomeSection7 from '@/views/shared/cta-section/CTASection'

const LandingPageWrapper = ({ mode, banners, pgData, fieldNotes, destinations, locations, adventurePosts, locDestinations }: { mode: Mode; banners?: []; pgData?: []; fieldNotes?: []; destinations?: []; locations?: []; adventurePosts?: []; locDestinations?: []; }) => {

  const adventure_Posts = pgData?.adventure_posts;

  const instagramSliderSectionProps = {
    class: 'py_150',
    lists: adventure_Posts?? []
  }
  
  return (
    <>
      {banners.length ? <BannerSection mode={mode} banners={banners} locations={locations} locDestinations={locDestinations.data?? []} /> : null}
      <HomeSection1 data={pgData}/>
      {destinations.length ? <HomeSection2 slides={destinations}/> : null}
      <HomeSection3 data={pgData} adventurePosts={adventurePosts} />
      <HomeSection4 data={pgData}/>
      <HomeSection5 sectionProps={instagramSliderSectionProps} />
      <HomeSection6 data={pgData} fieldNotes={fieldNotes}/>
      <HomeSection7 data={pgData} />
    </>
  )
}

export default LandingPageWrapper
