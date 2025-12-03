// Next Imports

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import SmartLink from '@/components/SmartLink'

// Component imports
import AddForm from '@views/admin/adventure-guide/add/AddForm'

import { getAllUniqueTags } from '@/app/server/resorts'
import * as Common from '@/app/server/common'

import config from '@/configs/themeConfig'

export const metadata = {
  title: `Add Adventure Guide - ${config.appName}`,
  description:`${config.appName}`,
}

const CompanyApp = async () => {
  const session = await Common.getUserSess()
  const userRole = session?.user?.role;

  const allTags = await getAllUniqueTags();

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Grid container size={{ xs: 12 }} spacing={2} alignItems='center' justifyContent='space-between'>
          <Grid className="flex flex-column gap-4">
            <Typography variant='h4'>Add Adventure Guide</Typography>
          </Grid>
          <Grid>
            <SmartLink href='/admin/adventure-guide/'>
              <Button variant='outlined'>
                Back
              </Button>
            </SmartLink>
          </Grid>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, md: 12, lg:12 }}>
        <AddForm resortTags={allTags?? []} />
      </Grid>
    </Grid>
  )
}

export default CompanyApp
