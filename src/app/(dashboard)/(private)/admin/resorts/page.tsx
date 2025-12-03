import ResortsLists from '@views/admin/resorts'

import * as Common from '@/app/server/common'
import { getResorts } from '@/app/server/resorts'

import config from '@/configs/themeConfig'

export const metadata = {
  title: `Manage Resorts - ${config.appName}`,
  description:`${config.appName}`,
}

const ManageDestinations = async () => {
  const session = await Common.getUserSess();

  // Vars
  const data = await getResorts('name,location,created_at')

  return <ResortsLists data={data} />
}

export default ManageDestinations