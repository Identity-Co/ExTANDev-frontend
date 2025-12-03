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

const OverviewTab = dynamic(() => import('@views/admin/resorts/Overview'))

const tabContentList = (props): { [key: string]: ReactElement } => ({
  overview: <OverviewTab {...props}/>,
  rooms: <OverviewTab {...props}/>,
  services_amenities: <OverviewTab {...props}/>,
  offers: <OverviewTab {...props}/>,
  stories: <OverviewTab {...props}/>,
})

const PageSection = ({ pgData, adventurePosts }: { pgData?: []; adventurePosts?: []; }) => {

  const [val, setVal] = useState<string>('overview')

  const [Id, setId] = useState(null)

  const [isDisabled, setisDisabled] = useState(true);

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
          <CardHeader title='Add Resort' />
          <Divider />

          {/* tabs */}
          <TabContext value={val} className="my-5">
            <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example' className="mt-5">
              <Tab value='overview' label='Overview' />
              <Tab value='rooms' label='Rooms' disabled={Id==null ? true : false} />
              <Tab value='services_amenities' label='Services & Amenities' disabled={Id==null ? true : false} />
              <Tab value='offers' label='Offers' disabled={Id==null ? true : false} />
              <Tab value='stories' label='Stories' disabled={Id==null ? true : false} />
            </TabList>
            <TabPanel value={val} className='pbs-0'>
              <CardContent>
                {tabContentList({ pgData: pgData, setFormId: setFormId, getFormId: getFormId, adventurePosts: adventurePosts })[val]}
              </CardContent>
            </TabPanel>
          </TabContext>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PageSection
