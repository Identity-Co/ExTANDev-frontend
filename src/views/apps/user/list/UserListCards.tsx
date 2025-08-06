'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { UserDataType } from '@components/card-statistics/HorizontalWithSubtitle'
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

// Vars
const tempData: UserDataType[] = [
    {
      title: 'How Many Users',
      stats: 0,
      avatarIcon: 'ri-group-line',
      avatarColor: 'primary',
      trend: '',
      trendNumber: '',
      subtitle: 'Total User'
    },
    {
      title: 'Deactive',
      stats: 0,
      avatarIcon: 'ri-user-add-line',
      avatarColor: 'error',
      trend: '',
      trendNumber: '',
      subtitle: 'In Active Users'
    },
    {
      title: 'Active',
      stats: 0,
      avatarIcon: 'ri-user-follow-line',
      avatarColor: 'success',
      trend: '',
      trendNumber: '',
      subtitle: 'Active Users'
    }
  ]

const UserListCards = ({ users }: { users?: UsersType[] }) => {
  const [active, setActive] = useState(0)
  const [inactive, setInactive] = useState(0)
  const [total, setTotal] = useState(0)
  const [data, setData] = useState(tempData)

  useEffect(() => {
    const activeUsers = users?.filter(user => {
      if (user.status != 1) return false

      return true
    });
    
    setActive(activeUsers?.length ?? 0);
    
    const deactiveUsers = users?.filter(user => {
      if (user.status != 0) return false

      return true
    })
    
    setInactive(deactiveUsers?.length ?? 0);

    setTotal(users?.length ?? 0);
  }, [users]);

  useEffect(() => {
    setData([
      {
        title: 'How Many Users',
        stats: total,
        avatarIcon: 'ri-group-line',
        avatarColor: 'primary',
        trend: '',
        trendNumber: '',
        subtitle: 'Total User'
      },
      {
        title: 'Deactive',
        stats: inactive,
        avatarIcon: 'ri-user-add-line',
        avatarColor: 'error',
        trend: '',
        trendNumber: '',
        subtitle: 'In Active Users'
      },
      {
        title: 'Active',
        stats: active,
        avatarIcon: 'ri-user-follow-line',
        avatarColor: 'success',
        trend: '',
        trendNumber: '',
        subtitle: 'Active Users'
      }
    ]);

  },[active, inactive, total])

  return (
    <Grid container spacing={6}>
      {data.map((item, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
          <HorizontalWithSubtitle {...item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default UserListCards
