// Component Imports
import LandingPageWrapper from '@views/sub-pages/my-account/liked-items/LikedItems'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getUserLikes } from '@/app/server/likes'

import { redirect } from 'next/navigation';

import * as Common from '@/app/server/common'

const LandingPage = async () => {

  const session = await Common.getUserSess()

  if(!session?.user?.id || session?.user?.role != 'user') {
    redirect('/my-account/')
  }

  const formData = {
    'user_id': session?.user?.id,
  }

  const pgData = await getUserLikes(formData)

  const mode = await getServerMode()

  return <LandingPageWrapper mode={mode} data={pgData} />
}

export default LandingPage
