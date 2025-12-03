// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

import AddResorts from '@views/admin/resorts/add/'

import config from '@/configs/themeConfig'

import { getAllTours } from '@/app/server/tours'

export const metadata = {
  title: `Add Resort - ${config.appName}`,
}

const AddResortsPage = async () => {

  const adventurePosts = await getAllTours('id,name');

  return <AddResorts pgData={[]} adventurePosts={adventurePosts??[]}/>
}

export default AddResortsPage