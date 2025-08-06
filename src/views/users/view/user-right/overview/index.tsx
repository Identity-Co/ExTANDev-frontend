// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ExchangeListTable from './ExchangeListTable'

import UserActivityTimeLine from './UserActivityTimeline'


const OverViewTab = async () => {
  // Vars

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ExchangeListTable />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <UserActivityTimeLine />
      </Grid>
    </Grid>
  )
}

export default OverViewTab
