// Next Imports

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import SmartLink from '@/components/SmartLink'

// Component imports
import AddForm from '@views/admin/custom-categories/add/AddForm'

import * as Common from '@/app/server/common'

import config from '@/configs/themeConfig'

export const metadata = {
  title: `Add Custom Category - ${config.appName}`,
  description:`${config.appName}`,
}

const CompanyApp = async () => {
  const session = await Common.getUserSess()
  const userRole = session?.user?.role;

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Grid container size={{ xs: 12 }} spacing={2} alignItems='center' justifyContent='space-between'>
          <Grid className="flex flex-column gap-4">
            <Typography variant='h4'>Add Custom Category</Typography>
          </Grid>
          <Grid>
            <SmartLink href='/admin/custom-categories/'>
              <Button variant='outlined'>
                Back
              </Button>
            </SmartLink>
          </Grid>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, md: 12, lg:12 }}>
        <AddForm />
      </Grid>
    </Grid>
  )
}

export default CompanyApp
