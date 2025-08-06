// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import type { ButtonProps } from '@mui/material/Button'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import EditUserInfo from '@components/dialogs/edit-user-info'
import ConfirmationDialog from '@components/dialogs/confirmation-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import CustomAvatar from '@core/components/mui/Avatar'

// Vars
const userData = {
  firstName: 'Tim',
  lastName: 'Drisko',
  userName: '@shallamb',
  billingEmail: 'shallamb@gmail.com',
  status: 'Active',
  role: 'Exchanger',
  taxId: 'Tax-8894',
  contact: '(951) 239-6770',
  language: ['English'],
  country: 'France',
  useAsBillingAddress: true,
  dateCreated: '3/1/2025',
  lastLoginIP: '192.168.1.254',
  lastLoginDate: '3/12/2025 4:42 PM'
}

const UserDetails = () => {
  const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
    children,
    color,
    variant
  })

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div className='flex flex-col gap-6'>
            <div className='flex items-center justify-center flex-col gap-4'>
              <div className='flex flex-col items-center gap-4'>
                <CustomAvatar alt='user-profile' src='/images/avatars/1.png' variant='rounded' size={120} />
                <Typography variant='h5'>{`${userData.firstName} ${userData.lastName}`}</Typography>
              </div>
              <Chip label='Exchanger' color='primary' size='small' />
            </div>
            <div className='flex flex-wrap items-center justify-between gap-2'>
              <div>
                <div className='flex items-center gap-4 mb-5'>
                  <CustomAvatar variant='rounded' color='primary' skin='light'>
                    <i className='ri-home-office-line' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h5'>7</Typography>
                    <Typography>Open Exchanges</Typography>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <CustomAvatar variant='rounded' color='warning' className='shadow-xs'>
                    <i className='ri-money-dollar-circle-line' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h5'>$2,513,126.71</Typography>
                    <Typography>Money Received</Typography>
                  </div>
                </div>
              </div>
              <div>
                <div className='flex items-center gap-4 mb-5'>
                  <CustomAvatar variant='rounded' color='success' skin='light'>
                    <i className='ri-error-warning-line' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h5'>5</Typography>
                    <Typography>Missing Items</Typography>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <CustomAvatar variant='rounded' color='success' className='shadow-xs'>
                    <i className='ri-money-dollar-circle-line' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h5'>$462,581.22</Typography>
                    <Typography>Closed Not Wired</Typography>
                  </div>
                </div>
              </div>
            </div>
            <Typography color="success.dark" className='flex items-center'><i className='ri-notification-2-line' /> &nbsp; 1 Exchange Past Estiated Closed of Escrow</Typography>
          </div>
          <div>
            <Typography variant='h5'>Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-2'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Contact:
                </Typography>
                <Typography color='text.primary'>{userData.contact}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Email:
                </Typography>
                <Typography color='text.primary'>{userData.billingEmail}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Status
                </Typography>
                <Typography color='text.primary'>{userData.status}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Role:
                </Typography>
                <Typography color='text.primary'>{userData.role}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Date Created:
                </Typography>
                <Typography color='text.primary'>{userData.dateCreated}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Last Login:
                </Typography>
                <Typography color='text.primary'>{userData.lastLoginIP} on {userData.lastLoginDate}</Typography>
              </div>
            </div>
          </div>
          <div className='flex gap-4 justify-center'>
            <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Edit', 'primary', 'contained')}
              dialog={EditUserInfo}
              dialogProps={{ data: userData }}
            />
            <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Suspend', 'error', 'outlined')}
              dialog={ConfirmationDialog}
              dialogProps={{ type: 'suspend-account' }}
            />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default UserDetails
