import Destinations from '@views/admin/destinations'

import * as Common from '@/app/server/common'
import { getDestinations } from '@/app/server/destinations'

import config from '@/configs/themeConfig'

export const metadata = {
  title: `Home Page Management - ${config.appName}`,
  description:`${config.appName}`,
  keywords:`${config.appName}`,
  robots:'noindex, nofollow, noarchive',
  authors: [{ name: `${config.appName}` }],
  publisher:`${config.appName}`,
  classification:'Business: Real Estate',
  other: {
    'revisit-after': '365 days',
    'ratings':'general',
    'geo.region':'US',
    'copyright':`${config.appName}`
  }
}

const ManageDestinations = async () => {
  const session = await Common.getUserSess();

  // Vars
  const data = await getDestinations();

  console.log(data);

  return <Destinations data={data} />
}

export default ManageDestinations