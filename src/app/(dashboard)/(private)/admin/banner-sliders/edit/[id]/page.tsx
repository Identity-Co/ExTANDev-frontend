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
import EditForm from '@views/admin/sliders/edit/EditForm'

import * as Banner from '@/app/server/banners'
import * as Common from '@/app/server/common'

import config from '@/configs/themeConfig'

export const metadata = {
  title: `Edit Banners/Sliders - ${config.appName}`,
  description:`${config.appName}`,
}

const EditBanner = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params

  const session = await Common.getUserSess()
  const userRole = session?.user?.role;

  const banner = await Banner.getBanner(params.id)
  
  if (banner) {
  } else {
    redirect('/admin/banner-sliders/')
  }

  if (!banner) {
    redirect('/admin/banner-sliders/')
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Grid container size={{ xs: 12 }} spacing={2} alignItems='center' justifyContent='space-between'>
          <Grid className="flex flex-column gap-4">
            <Typography variant='h4'>Edit Banners/Sliders</Typography>
          </Grid>
          <Grid>
            <Link href='/admin/banner-sliders/'>
              <Button variant='outlined'>
                Back
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, md: 12, lg:12 }}>
        <EditForm setId={params.id} banner={banner} />
      </Grid>
    </Grid>
  )
}

export default EditBanner
