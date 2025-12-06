// Next Imports
import Link from 'next/link'

import { redirect } from 'next/navigation';

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Type Imports
//import type { companyType } from '@/types/apps/companyType'

// Component imports
import EditForm from '@views/admin/user-profile/EditForm'

import * as User from '@/app/server/users'
import * as Common from '@/app/server/common'
import roles from '@/data/roleData'

import config from '@/configs/themeConfig'

export const metadata = {
  title: `Update Profile - ${config.appName}`,
  description:`${config.appName}`,
}

const EditUserApp = async () => {
  const session = await Common.getUserSess()
  const userRole = session?.user?.role;

  const log = await User.getSingleUser(session?.user?.id)
  
  if (log) {
  } else {
    redirect('/admin/users/')
  }

  if (!log) {
    redirect('/admin/users/')
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Grid container size={{ xs: 12 }} spacing={2} alignItems='center' justifyContent='space-between'>
          <Grid className="flex flex-column gap-4">
            <Typography variant='h4'>Update Profile</Typography>
          </Grid>
          <Grid>
            <Link href='/admin/dashboards/'>
              <Button variant='outlined'>
                Back
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <EditForm setId={session?.user?.id} userInfo={log} roles={roles}/>
      </Grid>
    </Grid>
  )
}

export default EditUserApp
