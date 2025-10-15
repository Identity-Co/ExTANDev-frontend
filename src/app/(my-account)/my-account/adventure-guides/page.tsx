// Component Imports
import LandingPageWrapper from '@views/sub-pages/my-account/adventure-guide/List'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getAdventureGuidesByCurrentUser } from '@/app/server/adventure_guide'

import { redirect } from 'next/navigation';

import * as Common from '@/app/server/common'

const LandingPage = async () => {
  // Vars

  const session = await Common.getUserSess()

  if(!session?.user?.id || session?.user?.role != 'ambassador') {
    redirect('/my-account/')
  }

  const pgData = await getAdventureGuidesByCurrentUser('title,created_at')

  const mode = await getServerMode()

  return <LandingPageWrapper mode={mode} adventureguides={pgData} />
}

export default LandingPage
