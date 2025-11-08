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
import SettingsForm from '@views/admin/royalty-settings/SettingsForm'

import * as Royalty from '@/app/server/royalty'
import * as Common from '@/app/server/common'

import config from '@/configs/themeConfig'

export const metadata = {
  title: `Update Royalty Settings - ${config.appName}`,
  description:`${config.appName}`,
}

const EditRoyaltySettings = async () => {
  const session = await Common.getUserSess()
  const userRole = session?.user?.role;

  const royalty = await Royalty.getAllParameters()

  if (!royalty) {
    redirect('/admin/dashboards/')
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Grid container size={{ xs: 12 }} spacing={2} alignItems='center' justifyContent='space-between'>
          <Grid className="flex flex-column gap-4">
            <Typography variant='h4'>Royalty Settings</Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, md: 12, lg:12 }}>
        <SettingsForm royalty={royalty} />
      </Grid>
    </Grid>
  )
}

export default EditRoyaltySettings
