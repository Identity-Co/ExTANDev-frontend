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
import ViewComment from '@views/admin/comments/View/'

import { getCommentById } from '@/app/server/comments'
import * as Common from '@/app/server/common'

import config from '@/configs/themeConfig'

export const metadata = {
  title: `View Comment - ${config.appName}`,
  robots:'noindex, nofollow, noarchive',
}

const ViewCommentEnquiry = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params

  const session = await Common.getUserSess()
  const userRole = session?.user?.role;

  const comment = await getCommentById(params.id)

  if (comment) {
  } else {
    redirect('/admin/comments/')
  }

  if (!comment?._id) {
    redirect('/admin/comments/')
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Grid container size={{ xs: 12 }} spacing={2} alignItems='center' justifyContent='space-between'>
          <Grid className="flex flex-column gap-4">
            <Typography variant='h4'>Comment Detail</Typography>
          </Grid>
          <Grid>
            <Link href='/admin/comments/'>
              <Button variant='outlined'>
                Back
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, md: 12, lg:12 }}>
        <ViewComment data={comment} />
      </Grid>
    </Grid>
  )
}

export default ViewCommentEnquiry
