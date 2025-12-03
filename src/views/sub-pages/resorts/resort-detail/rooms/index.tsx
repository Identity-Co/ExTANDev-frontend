'use client'

// React Imports
import { useEffect, useState } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import RoomsSection1 from './RoomsSection1'
import RoomsSection2 from './RoomsSection2'
import RoomsSection3 from '@/views/shared/review-form-section/ReviewFormSection'
import RoomsSection4 from './RoomsSection4'

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
      <RoomsSection1 data={pgData?.rooms ?? []} />
      <RoomsSection2 data={pgData?.rooms?.room_lists ?? []} />
      {isUserLoggedIn &&(
        <RoomsSection3 data={userData?.user?.id} collection_id={pgData?._id} collection_name="Resort" />
      )}
      <RoomsSection4 data={pgData?.rooms ?? []} />
    </>
  )
}

export default LandingPageWrapper
