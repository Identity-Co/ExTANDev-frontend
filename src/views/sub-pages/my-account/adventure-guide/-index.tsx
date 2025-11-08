'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import EditProfile from './List'

import { useSettings } from '@core/hooks/useSettings'

const LandingPageWrapper = ({ mode, pgData, user }: { mode: Mode; pgData?: []; user: {} }) => {
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
    <EditProfile user={user}/>
  )
}

export default LandingPageWrapper
