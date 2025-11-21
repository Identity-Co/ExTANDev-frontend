// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import Footer from '@components/layout/front-pages/Footer'
import Header from '@components/layout/front-pages/Header'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

import { getPublicSettings } from '@/app/server/general_settings'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

const FrontLayout = async ({ children }: ChildrenType) => {
  // Vars
  const mode = await getServerMode()

  const siteSettings = await getPublicSettings('header_logo, footer_logo, facebook_url, instagram_url, youtube_url, twitter_url')

  return (
    <div className={frontLayoutClasses.root}>
      <Header mode={mode} siteSettings={siteSettings} />
      {children}
      <Footer siteSettings={siteSettings} />
    </div>
  )
}

export default FrontLayout
