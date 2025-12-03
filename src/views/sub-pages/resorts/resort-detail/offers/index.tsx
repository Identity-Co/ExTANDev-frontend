'use client'

// React Imports
import { useEffect, useState } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import OffersSection1 from './OffersSection1'
import OffersSection2 from './OffersSection2'
import OffersSection3 from './OffersSection3'

import * as Common from '@/app/server/common'

import { useSettings } from '@core/hooks/useSettings'

const LandingPageWrapper = ({ pgData}: ResortsProps) => {

  const [isUserLoggedIn, setisUserLoggedIn] = useState(null)
  const [userData, setuserData] = useState(null)

  // Hooks
  const { updatePageSettings } = useSettings()

  useEffect(() => {
    const getSessData = async () => {
      const sess = await Common.getUserSess();
      if(sess && sess?.user?.role == 'user'){
        setuserData(sess)
        setisUserLoggedIn(true);
      }
    };
    getSessData();
  }, []);

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <OffersSection1 data={pgData?.offers ?? []} />
      <OffersSection2 data={pgData?.offers ?? []} />
      <OffersSection3 data={pgData?.offers?.bottom_image ?? ''} />
    </>
  )
}

export default LandingPageWrapper
