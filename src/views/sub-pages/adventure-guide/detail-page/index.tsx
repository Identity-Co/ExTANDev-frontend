'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './BannerSection'
import AdventureGuideDetail1 from './AdventureGuideDetail1'
import AdventureGuideDetail2 from './AdventureGuideDetail2'
import AdventureGuideDetail3 from './AdventureGuideDetail3'
import AdventureGuideDetail5 from './AdventureGuideDetail5'
import AdventureGuideDetail6 from './AdventureGuideDetail6'

import { useSettings } from '@core/hooks/useSettings'

const AdventureGuideDetailPage = ({ mode, pgData, locations, locDestinations, adventurePosts }: { mode: Mode; pgData?: []; locations?: []; locDestinations?: []; adventurePosts?: [] }) => {
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
      <BannerSection mode={mode} data={pgData} locations={locations} locDestinations={locDestinations} />
      <AdventureGuideDetail1 data={pgData} />

      {pgData?.content_sections?.slice(1).map((section: any, index: number) => {
        if (!section.fields?.length) return null;
        
        const hasNonResortFields = section.fields.some(field => field.type !== 'resort');
        
        if (hasNonResortFields) {
          return <AdventureGuideDetail2 key={index + 1} data={section} />;
        }
        
        return <AdventureGuideDetail3 key={index + 1} data={section} />;
      })}
      <AdventureGuideDetail6 data={pgData} adventurePosts={adventurePosts} />
      <AdventureGuideDetail5 data={pgData} />
    </>
  )
}

export default AdventureGuideDetailPage
