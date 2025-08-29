import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import Sections from '@views/admin/cms/home/sections'

import { getSection } from '@/app/server/home_page'

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

const EditSection = async (props: { params: Promise<{ key: string }> }) => {
  const params = await props.params

  const sectionData = await getSection(params.key)

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Grid container size={{ xs: 12 }} spacing={2} alignItems='center' justifyContent='space-between'>
          <Grid className="flex flex-column gap-4">
            <Typography variant='h4'>Edit Section - {sectionData?.section_name}</Typography>
          </Grid>
          <Grid>
            <Link href='/admin/cms_home/'>
              <Button variant='outlined'>
                Back
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, md: 8, lg:8 }}>
        <Sections section={params.key} data={sectionData}/>
      </Grid>
    </Grid>
  )
}

export default EditSection