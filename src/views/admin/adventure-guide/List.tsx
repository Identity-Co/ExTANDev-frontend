// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { adventureguideTypes } from '@/types/apps/adventureguideTypes'

// Component Imports
import ListTable from './ListTable'

const AdventureGuideLists = ({ adventureguides }: { adventureguides?: adventureguideTypes[] }) => {
  
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ListTable tableData={adventureguides} />
      </Grid>
    </Grid>
  )
}

export default AdventureGuideLists
