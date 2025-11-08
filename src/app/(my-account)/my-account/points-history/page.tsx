// Component Imports
import LandingPageWrapper from '@views/sub-pages/my-account/points-history/PointsHistory'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getUserSaved } from '@/app/server/saved'

import { redirect } from 'next/navigation';

import * as Common from '@/app/server/common'
import * as Royalty from '@/app/server/royalty'

const LandingPage = async () => {

  const session = await Common.getUserSess()

  if(!session?.user?.id || session?.user?.role != 'user') {
    redirect('/my-account/')
  }

  const mData = { user_id: session?.user?.id }
  const history = await Royalty.getPointHistory(mData)
  const allactions = await Royalty.getActionList()

  console.log('Action List: ', allactions)

  const actionlist = allactions.reduce((acc, item) => {
    acc[item.action_code] = item.action_name;
    return acc;
  }, {});

  console.log('actionlist: ', actionlist);

  const mode = await getServerMode()

  return <LandingPageWrapper mode={mode} data={history} actionlist={actionlist} />
}

export default LandingPage
