'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import ServicesSection1 from './ServicesSection1'
import ServicesSection2 from './ServicesSection2'
import ServicesSection3 from './ServicesSection3'

import { useSettings } from '@core/hooks/useSettings'

const LandingPageWrapper = ({ pgData }: { pgData?: any }) => {  
  // Hooks
  const { updatePageSettings } = useSettings()

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Group sections in order
  const groupedSections = () => {
    if (!pgData?.services_amenities?.services_sections) return []

    const sections = []
    let currentGroup = []
    let currentType = null

    for (const item of pgData.services_amenities?.services_sections) {
      if (item.section_type === 'Service') {
        if (currentType === 'Review' && currentGroup.length > 0) {
          sections.push({ type: 'Review', data: [...currentGroup] })
          currentGroup = []
        }
        currentGroup.push(item)
        currentType = 'Service'
      } else if (item.section_type === 'Review') {
        if (currentType === 'Service' && currentGroup.length > 0) {
          sections.push({ type: 'Service', data: [...currentGroup] })
          currentGroup = []
        }
        currentGroup.push(item)
        currentType = 'Review'
      }
    }

    // Add the last group
    if (currentGroup.length > 0) {
      sections.push({ type: currentType, data: currentGroup })
    }

    return sections
  }

  const sections = groupedSections()

  let imageLeft = true;

  return (
    <>
      <ServicesSection1 data={pgData?.services_amenities ?? []} />
      {sections?.map((section, index) => {
        if (section.type === 'Service') {
          
          const isImageLeft = imageLeft
          const isOdd = section?.data?.length % 2 === 0
          
          if(!isOdd){
            imageLeft = false;
          }
        
          return <ServicesSection2 key={`service-${index}`} data={section.data} imageLeft={isImageLeft} sectionIndex={index} />
        } else if (section.type === 'Review') {
          return section.data?.map((review, j) => (
            <ServicesSection3 key={`review-${index}-${j}`} data={review} />
          ));
        }
        return null
      })}
    </>
  )
}

export default LandingPageWrapper