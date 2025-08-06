'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import Typography from '@mui/material/Typography'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline from '@mui/lab/Timeline'
import type { TimelineProps } from '@mui/lab/Timeline'

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

const UserActivityTimeLine = () => {
  return (
    <Card>
      <CardHeader title='User Activity Timeline' />
      <CardContent>
        <Timeline>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='primary' />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                <Typography className='font-medium' color='text.primary'>
                  Fatemeh Pazouki | Trust
                </Typography>
                <Typography color='text.primary'>12 min ago</Typography>
              </div>
              <Typography className='mbe-2'>dSignature Requested: Approval of Wire Instructions & Disbursement Authorization</Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='success' />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                <Typography className='font-medium' color='text.primary'>
                  Kari Buysinger | Corporation
                </Typography>
                <Typography color='text.primary'>45 min ago</Typography>
              </div>
              <Typography className='mbe-2'>eMailed Multiple Request</Typography>
              <div className='flex items-center gap-2.5'>
                <div className='flex flex-col flex-wrap pl-12'>
                  <Typography>Drivers License</Typography>
                  <Typography>Organizational Document</Typography>
                  <Typography>Relinquished Property Contact</Typography>
                </div>
              </div>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='info' />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                <Typography className='font-medium' color='text.primary'>
                  Shangming Cherng | Individual
                </Typography>
                <Typography color='text.primary'>1 Day Ago</Typography>
              </div>
              <Typography className='mbe-2'>eMailed Single Request</Typography>
              <div className='flex items-center gap-2.5'>
                <div className='flex flex-col flex-wrap pl-12'>
                  <Typography>Drivers License</Typography>
                </div>
              </div>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </CardContent>
    </Card>
  )
}

export default UserActivityTimeLine
