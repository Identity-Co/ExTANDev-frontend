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
import ViewEnquiry from '@views/admin/contact-enquiries/view/view'

import { getEntry } from '@/app/server/contact_form_entries'
import * as Common from '@/app/server/common'

import config from '@/configs/themeConfig'

export const metadata = {
  title: `View Contact Enquiry - ${config.appName}`,
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

const ViewContactEnquiry = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params

  const session = await Common.getUserSess()
  const userRole = session?.user?.role;

  const contactEnquiry = await getEntry(params.id)
  
  if (contactEnquiry) {
  } else {
    redirect('/admin/contact-enquiries/')
  }

  if (!contactEnquiry) {
    redirect('/admin/contact-enquiries/')
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Grid container size={{ xs: 12 }} spacing={2} alignItems='center' justifyContent='space-between'>
          <Grid className="flex flex-column gap-4">
            <Typography variant='h4'>View Contact Enquiry</Typography>
          </Grid>
          <Grid>
            <Link href='/admin/contact-enquiries/'>
              <Button variant='outlined'>
                Back
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, md: 12, lg:12 }}>
        <ViewEnquiry data={contactEnquiry} />
      </Grid>
    </Grid>
  )
}

export default ViewContactEnquiry
