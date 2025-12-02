// Component Imports
import LandingPageWrapper from '@views/sub-pages/my-account/my-trips'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

import * as Common from '@/app/server/common'
import { getSingleUser } from '@/app/server/users'

const LandingPage = async () => {
  // Vars
  const mode = await getServerMode()

  const session = await Common.getUserSess();

  const userid = session?.user?.id;

  var user = {}
  if (userid) {
    user = await getSingleUser(userid);
    console.log(userid, user)
  }

  return <LandingPageWrapper mode={mode} user={user}/>
}

export default LandingPage
