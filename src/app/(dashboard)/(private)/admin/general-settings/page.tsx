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
import SettingsForm from '@views/admin/general-settings/SettingsForm'

import * as GeneralSettings from '@/app/server/general_settings'

import config from '@/configs/themeConfig'

export const metadata = {
  title: `Update General Settings - ${config.appName}`,
  description:`${config.appName}`,
}

const EditRoyaltySettings = async () => {

  const gSettings = await GeneralSettings.getGeneralSettings()

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Grid container size={{ xs: 12 }} spacing={2} alignItems='center' justifyContent='space-between'>
          <Grid className="flex flex-column gap-4">
            <Typography variant='h4'>General Site Settings</Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, md: 12, lg:12 }}>
        <SettingsForm gSettings={gSettings} />
      </Grid>
    </Grid>
  )
}

export default EditRoyaltySettings
