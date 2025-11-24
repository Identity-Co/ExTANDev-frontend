// Next Imports

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import SmartLink from '@/components/SmartLink'

// Component imports
import UserForm from '@views/apps/user/add'

import * as Common from '@/app/server/common'
import roles from '@/data/roleData'

import config from '@/configs/themeConfig'

export const metadata = {
  title: `Add User - ${config.appName}`,
  description:`${config.appName}`,
}

const CompanyApp = async () => {
  const session = await Common.getUserSess()
  const userRole = session?.user?.role;

  roles.sort((a, b) => a.name.localeCompare(b.name));
  console.log(roles);

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Grid container size={{ xs: 12 }} spacing={2} alignItems='center' justifyContent='space-between'>
          <Grid className="flex flex-column gap-4">
            <Typography variant='h4'>Add User</Typography>
          </Grid>
          <Grid>
            <SmartLink href='/admin/users/'>
              <Button variant='outlined'>
                Back
              </Button>
            </SmartLink>
          </Grid>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <UserForm roles={roles}/>
      </Grid>
    </Grid>
  )
}

export default CompanyApp
