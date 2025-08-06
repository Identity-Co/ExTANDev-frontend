// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import AddForm from './AddForm'

type roleData = {
  key: string;
  name: string;
}

const Account = ({ roles }: { roles?: roleData[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <AddForm roles={roles}/>
      </Grid>
    </Grid>
  )
}

export default Account
