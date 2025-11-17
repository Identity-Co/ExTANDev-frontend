'use client'

// React Imports
import { useState } from 'react'

import dynamic from 'next/dynamic'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

const OverviewTab = dynamic(() => import('@views/admin/destinations/Overview'))
const ResortTab = dynamic(() => import('@views/admin/destinations/Resorts'))
const AdventureTab = dynamic(() => import('@views/admin/destinations/Adventures'))
const StoryTab = dynamic(() => import('@views/admin/destinations/Stories'))

const tabContentList = (props): { [key: string]: ReactElement } => ({
  overview: <OverviewTab {...props}/>,
  resorts: <ResortTab {...props}/>,
  adventures: <AdventureTab {...props}/>,
  stories: <StoryTab {...props}/>
})

const PageSection = ({ pgData, id, destinations, adventurePosts, reviews }: { pgData?: []; id?: String; destinations?: []; adventurePosts?: []; reviews?: []; }) => {

  const [val, setVal] = useState<string>('overview')

  const [Id, setId] = useState(id)

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setVal(newValue)
  }

  const setFormId = (id) => {
    setId(id)
  }

  const getFormId = () => {
    return Id
  }

  return (
    <Grid container spacing={6} sx={{ rowGap: 4 }}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Add Destinations' />
          <Divider />

          {/* tabs */}
          <TabContext value={val} className="my-5">
            <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example' className="mt-5">
              <Tab value='overview' label='Overview' />
              <Tab value='resorts' label='Resorts' disabled={Id==null ? true : false} />
              <Tab value='adventures' label='Adventures' disabled={Id==null ? true : false} />
              <Tab value='stories' label='Stories' disabled={Id==null ? true : false} />
            </TabList>
            <TabPanel value={val} className='pbs-0'>
              <CardContent>
                {tabContentList({ pgData: pgData, destinations: destinations, setFormId: setFormId, getFormId: getFormId, adventurePosts: adventurePosts, reviews: reviews })[val]}
              </CardContent>
            </TabPanel>
          </TabContext>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PageSection
