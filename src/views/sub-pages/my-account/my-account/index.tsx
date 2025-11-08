'use client'

// React Imports
import { useEffect, useState } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import BannerSection from './../BannerSection'
import AmbassadorshipSection1 from './../AmbassadorshipSection1'
import MyAccount from './MyAccount'

import { useSettings } from '@core/hooks/useSettings'

import * as Royalty from '@/app/server/royalty'

const LandingPageWrapper = ({ mode, session }: { mode: Mode; session: any }) => {
  // Hooks
  const { updatePageSettings } = useSettings()
  const [history, setHistory] = useState<any>(null)

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const mData = { user_id: session?.user.id }
        const res = await Royalty.getCurrentBalance(mData)
        console.log('history log: ', res)
        setHistory(res)
      } catch (err) {
        console.error('Error fetching history:', err)
      }
    }

    fetchHistory()
  }, [session?.user.id])

  return (
    <>
      {history && <MyAccount session={session} history={history} />}
    </>
  );
}

export default LandingPageWrapper
