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
import EditForm from '@views/admin/adventure-guide/edit/EditForm'

import * as AdventureGuide from '@/app/server/adventure_guide'
import { getAllUniqueTags } from '@/app/server/resorts'
import * as Common from '@/app/server/common'

import config from '@/configs/themeConfig'

export const metadata = {
  title: `Edit Adventure Guide - ${config.appName}`,
  description:`${config.appName}`,
}

const EditAdventureGuide = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params

  const session = await Common.getUserSess()
  const userRole = session?.user?.role;

  const adventureGuide = await AdventureGuide.getAdventureGuide(params.id)
  
  if (adventureGuide) {
  } else {
    redirect('/admin/adventure-guide/')
  }

  if (!adventureGuide) {
    redirect('/admin/adventure-guide/')
  }

  const allTags = await getAllUniqueTags();

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Grid container size={{ xs: 12 }} spacing={2} alignItems='center' justifyContent='space-between'>
          <Grid className="flex flex-column gap-4">
            <Typography variant='h4'>Edit Adventure Guide</Typography>
          </Grid>
          <Grid>
            <Link href='/admin/adventure-guide/'>
              <Button variant='outlined'>
                Back
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, md: 12, lg:12 }}>
        <EditForm setId={params.id} adventureguide={adventureGuide} resortTags={allTags?? []} />
      </Grid>
    </Grid>
  )
}

export default EditAdventureGuide
