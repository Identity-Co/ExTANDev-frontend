import ResortsLists from '@views/admin/resorts'

import * as Common from '@/app/server/common'
import { getResorts, getResortsByUser } from '@/app/server/resorts'

import config from '@/configs/themeConfig'

export const metadata = {
  title: `Manage Resorts - ${config.appName}`,
  description:`${config.appName}`,
}

const ManageDestinations = async () => {
  const session = await Common.getUserSess();

  let data: any[] = [];
  if(session?.user?.role == 'property_owner'){
    data = await getResortsByUser('name,location,created_at', session?.user?.id);
  }else{
    data = await getResorts('name,location,created_at')
  }

  console.log(data);

  return <ResortsLists data={data} session={session} />
}

export default ManageDestinations