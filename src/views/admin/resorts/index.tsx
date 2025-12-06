// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ListTable from './ListTable'

const AdventureGuideLists = ({ data, session }: { data?: []; session?: [] }) => {

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ListTable tableData={data} session={session?? []} />
      </Grid>
    </Grid>
  )
}

export default AdventureGuideLists
