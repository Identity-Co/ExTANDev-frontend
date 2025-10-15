// Component Imports
import LandingPageWrapper from '@views/sub-pages/my-account/adventure-guide/add/AddForm'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

import { redirect } from 'next/navigation';

import * as Common from '@/app/server/common'

import config from '@/configs/themeConfig'

export const metadata = {
  title: `Add Adventure Guide - ${config.appName}`,
}

const LandingPage = async () => {

  const session = await Common.getUserSess()

  if(!session?.user?.id || session?.user?.role != 'ambassador') {
    redirect('/my-account/')
  }

  return <LandingPageWrapper/>
}

export default LandingPage
