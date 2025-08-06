// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import UserListTable from './UserListTable'
import UserListCards from './UserListCards'

type roleData = {
  key: string;
  name: string;
}

const UserList = ({ userData, roles }: { userData?: UsersType[]; roles?: roleData[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <UserListCards users={userData} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <UserListTable tableData={userData} roles={roles}/>
      </Grid>
    </Grid>
  )
}

export default UserList
