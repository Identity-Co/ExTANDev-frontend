// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import RoleCards from './RoleCards'

const Roles = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Typography variant='h4' className='mbe-1'>
          User Roles
        </Typography>
        <Typography>
          Create Custom Roles to manage what your team can access.
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <RoleCards />
      </Grid>
      
    </Grid>
  )
}

export default Roles
