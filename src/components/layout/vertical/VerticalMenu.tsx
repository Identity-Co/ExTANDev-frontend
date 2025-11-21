import React from 'react';

// Next Imports
import { usePathname } from 'next/navigation'

// MUI Imports
// import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports SubMenu, MenuSection
import { Menu, MenuItem, SubMenu } from '@menu/vertical-menu'

// import { GenerateVerticalMenu } from '@components/GenerateMenu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

import { useNavigationStore } from '@/libs/navigation-store'

// Menu Data Imports
// import menuData from '@/data/navigation/verticalMenuData'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({  scrollMenu }: Props) => {
  const setLoading = useNavigationStore((s) => s.setLoading)
  const pathname = usePathname()

  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  const showPageLoadr = (event?: React.MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url && pathname != url) {
      setLoading(true)
    }
  }

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 10 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem
          href='/admin/dashboards/'
          onClick={e => showPageLoadr(e as unknown as React.MouseEvent<HTMLLIElement>, '/admin/dashboard/')}
          exactMatch={false}
          activeUrl='/admin/dashboards'
          icon={<i className='ri-home-smile-line' />}
        >
          Dashboard
        </MenuItem>

        <MenuItem
          href='/admin/users/'
          onClick={e => showPageLoadr(e as unknown as React.MouseEvent<HTMLLIElement>, '/admin/users/')}
          exactMatch={false}
          activeUrl='/admin/users'
          icon={<i className='ri-user-line' />}
        >
          Users
        </MenuItem>

        <MenuItem
          href='/admin/banner-sliders/'
          onClick={e => showPageLoadr(e as unknown as React.MouseEvent<HTMLLIElement>, '/admin/banner-sliders/')}
          exactMatch={false}
          activeUrl='/admin/banner-sliders'
          icon={<i className='ri-triangular-flag-line' />}
        >
          Banners/Sliders
        </MenuItem>

        <MenuItem 
          href='/admin/page_list/' 
          onClick={e => showPageLoadr(e as unknown as React.MouseEvent<HTMLLIElement>, '/admin/page_list/')}
          icon={<i className='ri-article-line' />}
        >
          Pages
        </MenuItem>

        <MenuItem
          href='/admin/destination/'
          onClick={e => showPageLoadr(e as unknown as React.MouseEvent<HTMLLIElement>, '/admin/destimation/')}
          exactMatch={false}
          activeUrl='/admin/destination'
          icon={<i className='ri-map-pin-line' />}
        >
          Manage Destinations 
        </MenuItem>

        <MenuItem 
          href='/admin/adventure-guide/' 
          onClick={e => showPageLoadr(e as unknown as React.MouseEvent<HTMLLIElement>, '/admin/adventure-guide/')}
          exactMatch={false}
          activeUrl='/admin/adventure-guide/'
          icon={<i className='ri-news-line' />}
        >
          Adventure Guide
        </MenuItem>

        <MenuItem 
          href='/admin/custom-categories/' 
          onClick={e => showPageLoadr(e as unknown as React.MouseEvent<HTMLLIElement>, '/admin/custom-categories/')}
          exactMatch={false}
          activeUrl='/admin/custom-categories/'
          icon={<i className='ri-menu-search-line' />}
        >
          Tour Custom Categories
        </MenuItem>


        {/*<SubMenu
          label='Pages'
          icon={<i className='ri-vip-diamond-line' />}
        >
            <MenuItem href='/admin/page/add' onClick={e => showPageLoadr(e as unknown as React.MouseEvent<HTMLLIElement>, '/admin/page/add')}>Add New Page</MenuItem>*/}
          {/*<MenuItem href='/admin/cms_home/' onClick={e => showPageLoadr(e as unknown as React.MouseEvent<HTMLLIElement>, '/admin/cms_home/')}>Homepage</MenuItem>
          <MenuItem href='/admin/page/contact-us' onClick={e => showPageLoadr(e as unknown as React.MouseEvent<HTMLLIElement>, '/admin/page/contact-us')}>Contact Us</MenuItem>
          <MenuItem href='/admin/page/privacy-policy' onClick={e => showPageLoadr(e as unknown as React.MouseEvent<HTMLLIElement>, '/admin/page/privacy-policy')}>Privacy Policy</MenuItem>
          <MenuItem href='/admin/page/terms-of-use' onClick={e => showPageLoadr(e as unknown as React.MouseEvent<HTMLLIElement>, '/admin/page/terms-of-use')}>Terms of Use</MenuItem>
          <MenuItem href='/admin/page/real-estate' onClick={e => showPageLoadr(e as unknown as React.MouseEvent<HTMLLIElement>, '/admin/page/real-estate')}>Real Estate Opportunities</MenuItem>*/}
        {/*</SubMenu>*/}

        {/*<MenuItem
          href='/admin/adventure/'
          onClick={e => showPageLoadr(e as unknown as React.MouseEvent<HTMLLIElement>, '/admin/adventure/')}
          exactMatch={false}
          activeUrl='/admin/adventure'
          icon={<i className='ri-flight-takeoff-line' />}
        >
          Adventure Management 
        </MenuItem>

        <MenuItem
          href='/admin/travel/'
          onClick={e => showPageLoadr(e as unknown as React.MouseEvent<HTMLLIElement>, '/admin/travel/')}
          exactMatch={false}
          activeUrl='/admin/travel'
          icon={<i className='ri-road-map-line' />}
        >
          Travel Management 
        </MenuItem>

        <MenuItem
          href='/admin/field-notes/'
          onClick={e => showPageLoadr(e as unknown as React.MouseEvent<HTMLLIElement>, '/admin/field-notes/')}
          exactMatch={false}
          activeUrl='/admin/field-notes'
          icon={<i className='ri-sticky-note-line' />}
        >
          Manage Field Notes
        </MenuItem>*/}

        <MenuItem
          href='/admin/contact-enquiries/'
          onClick={e => showPageLoadr(e as unknown as React.MouseEvent<HTMLLIElement>, '/admin/contact-enquiries/')}
          exactMatch={false}
          activeUrl='/admin/contact-enquiries'
          icon={<i className='ri-survey-line' />}
        >
          Contact Enquiries
        </MenuItem>

        <MenuItem
          href='/admin/reviews/'
          onClick={e => showPageLoadr(e as unknown as React.MouseEvent<HTMLLIElement>, '/admin/reviews/')}
          exactMatch={false}
          activeUrl='/admin/reviews'
          icon={<i className='ri-star-smile-line' />}
        >
          Reviews
        </MenuItem>

        <SubMenu
          label='Comments'
          icon={<i className='ri-discuss-line' />}
        >
          <MenuItem href='/admin/comments/'>All Comments</MenuItem>
          <MenuItem href='/admin/comments/reported/'>Reported Comments</MenuItem>
        </SubMenu>

        <MenuItem
          href='/admin/reports/'
          onClick={e => showPageLoadr(e as unknown as React.MouseEvent<HTMLLIElement>, '/admin/reports/')}
          exactMatch={false}
          activeUrl='/admin/reports'
          icon={<i className='ri-file-chart-line' />}
        >
          Reports
        </MenuItem>

        <MenuItem
          href='/admin/royalty-settings/'
          onClick={e => showPageLoadr(e as unknown as React.MouseEvent<HTMLLIElement>, '/admin/royalty-settings/')}
          exactMatch={false}
          activeUrl='/admin/royalty-settings'
          icon={<i className='ri-money-dollar-circle-line' />}
        >
          Royalty Settings
        </MenuItem>

        <MenuItem
          href='/admin/general-settings/'
          onClick={e => showPageLoadr(e as unknown as React.MouseEvent<HTMLLIElement>, '/admin/general-settings/')}
          exactMatch={false}
          activeUrl='/admin/general-settings'
          icon={<i className='ri-settings-5-line' />}
        >
          General Site Settings
        </MenuItem>

        {/*<SubMenu
          label='dashboards'
          icon={<i className='ri-home-smile-line' />}
          suffix={<Chip label='5' size='small' color='error' />}
        >
          <MenuItem href='/dashboards/crm'>crm</MenuItem>
          <MenuItem href='/dashboards/analytics'>analytics</MenuItem>
          <MenuItem href='/dashboards/ecommerce'>eCommerce</MenuItem>
          <MenuItem href='/dashboards/academy'>academy</MenuItem>
          <MenuItem href='/dashboards/logistics'>logistics</MenuItem>
        </SubMenu>
        <SubMenu label='frontPages' icon={<i className='ri-file-copy-line' />}>
          <MenuItem href='/front-pages/landing-page' target='_blank'>
            landing
          </MenuItem>
          <MenuItem href='/front-pages/pricing' target='_blank'>
            pricing
          </MenuItem>
          <MenuItem href='/front-pages/payment' target='_blank'>
            payment
          </MenuItem>
          <MenuItem href='/front-pages/checkout' target='_blank'>
            checkout
          </MenuItem>
          <MenuItem href='/front-pages/help-center' target='_blank'>
            helpCenter
          </MenuItem>
        </SubMenu>
        <MenuSection label='appsPages'>
          <SubMenu label='eCommerce' icon={<i className='ri-shopping-bag-3-line' />}>
            <MenuItem href='/apps/ecommerce/dashboard'>dashboard</MenuItem>
            <SubMenu label='products'>
              <MenuItem href='/apps/ecommerce/products/list'>list</MenuItem>
              <MenuItem href='/apps/ecommerce/products/add'>add</MenuItem>
              <MenuItem href='/apps/ecommerce/products/category'>
                category
              </MenuItem>
            </SubMenu>
            <SubMenu label='orders'>
              <MenuItem href='/apps/ecommerce/orders/list'>list</MenuItem>
              <MenuItem
                href='/apps/ecommerce/orders/details/5434'
                exactMatch={false}
                activeUrl='/apps/ecommerce/orders/details'
              >
                details
              </MenuItem>
            </SubMenu>
            <SubMenu label='customers'>
              <MenuItem href='/apps/ecommerce/customers/list'>list</MenuItem>
              <MenuItem
                href='/apps/ecommerce/customers/details/879861'
                exactMatch={false}
                activeUrl='/apps/ecommerce/customers/details'
              >
                details
              </MenuItem>
            </SubMenu>
            <MenuItem href='/apps/ecommerce/manage-reviews'>
              manageReviews
            </MenuItem>
            <MenuItem href='/apps/ecommerce/referrals'>referrals</MenuItem>
            <MenuItem href='/apps/ecommerce/settings'>settings</MenuItem>
          </SubMenu>
          <SubMenu label='academy' icon={<i className='ri-graduation-cap-line' />}>
            <MenuItem href='/apps/academy/dashboard'>dashboard</MenuItem>
            <MenuItem href='/apps/academy/my-courses'>myCourses</MenuItem>
            <MenuItem href='/apps/academy/course-details'>
              courseDetails
            </MenuItem>
          </SubMenu>
          <SubMenu label='logistics' icon={<i className='ri-car-line' />}>
            <MenuItem href='/apps/logistics/dashboard'>dashboard</MenuItem>
            <MenuItem href='/apps/logistics/fleet'>fleet</MenuItem>
          </SubMenu>
          <MenuItem
            href='/apps/email'
            exactMatch={false}
            activeUrl='/apps/email'
            icon={<i className='ri-mail-open-line' />}
          >
            email
          </MenuItem>
          <MenuItem href='/apps/chat' icon={<i className='ri-wechat-line' />}>
            chat
          </MenuItem>
          <MenuItem href='/apps/calendar' icon={<i className='ri-calendar-line' />}>
            calendar
          </MenuItem>
          <MenuItem href='/apps/kanban' icon={<i className='ri-drag-drop-line' />}>
            kanban
          </MenuItem>
          <SubMenu label='invoice' icon={<i className='ri-bill-line' />}>
            <MenuItem href='/apps/invoice/list'>list</MenuItem>
            <MenuItem
              href='/apps/invoice/preview/4987'
              exactMatch={false}
              activeUrl='/apps/invoice/preview'
            >
              preview
            </MenuItem>
            <MenuItem href='/apps/invoice/edit/4987' exactMatch={false} activeUrl='/apps/invoice/edit'>
              edit
            </MenuItem>
            <MenuItem href='/apps/invoice/add'>add</MenuItem>
          </SubMenu>
          <SubMenu label='user' icon={<i className='ri-user-line' />}>
            <MenuItem href='/apps/user/list'>list</MenuItem>
            <MenuItem href='/apps/user/view'>view</MenuItem>
          </SubMenu>
          <SubMenu label='rolesPermissions' icon={<i className='ri-lock-2-line' />}>
            <MenuItem href='/apps/roles'>roles</MenuItem>
            <MenuItem href='/apps/permissions'>permissions</MenuItem>
          </SubMenu>
          <SubMenu label='pages' icon={<i className='ri-layout-left-line' />}>
            <MenuItem href='/pages/user-profile'>userProfile</MenuItem>
            <MenuItem href='/pages/account-settings'>accountSettings</MenuItem>
            <MenuItem href='/pages/faq'>faq</MenuItem>
            <MenuItem href='/pages/pricing'>pricing</MenuItem>
            <SubMenu label='miscellaneous'>
              <MenuItem href='/pages/misc/coming-soon' target='_blank'>
                comingSoon
              </MenuItem>
              <MenuItem href='/pages/misc/under-maintenance' target='_blank'>
                underMaintenance
              </MenuItem>
              <MenuItem href='/pages/misc/404-not-found' target='_blank'>
                pageNotFound404
              </MenuItem>
              <MenuItem href='/pages/misc/401-not-authorized' target='_blank'>
                notAuthorized401
              </MenuItem>
            </SubMenu>
          </SubMenu>
          <SubMenu label='authPages' icon={<i className='ri-shield-keyhole-line' />}>
            <SubMenu label='login'>
              <MenuItem href='/pages/auth/login-v1' target='_blank'>
                loginV1
              </MenuItem>
              <MenuItem href='/pages/auth/login-v2' target='_blank'>
                loginV2
              </MenuItem>
            </SubMenu>
            <SubMenu label='register'>
              <MenuItem href='/pages/auth/register-v1' target='_blank'>
                registerV1
              </MenuItem>
              <MenuItem href='/pages/auth/register-v2' target='_blank'>
                registerV2
              </MenuItem>
              <MenuItem href='/pages/auth/register-multi-steps' target='_blank'>
                registerMultiSteps
              </MenuItem>
            </SubMenu>
            <SubMenu label='verifyEmail'>
              <MenuItem href='/pages/auth/verify-email-v1' target='_blank'>
                verifyEmailV1
              </MenuItem>
              <MenuItem href='/pages/auth/verify-email-v2' target='_blank'>
                verifyEmailV2
              </MenuItem>
            </SubMenu>
            <SubMenu label='forgotPassword'>
              <MenuItem href='/pages/auth/forgot-password-v1' target='_blank'>
                forgotPasswordV1
              </MenuItem>
              <MenuItem href='/pages/auth/forgot-password-v2' target='_blank'>
                forgotPasswordV2
              </MenuItem>
            </SubMenu>
            <SubMenu label='resetPassword'>
              <MenuItem href='/pages/auth/reset-password-v1' target='_blank'>
                resetPasswordV1
              </MenuItem>
              <MenuItem href='/pages/auth/reset-password-v2' target='_blank'>
                resetPasswordV2
              </MenuItem>
            </SubMenu>
            <SubMenu label='twoSteps'>
              <MenuItem href='/pages/auth/two-steps-v1' target='_blank'>
                twoStepsV1
              </MenuItem>
              <MenuItem href='/pages/auth/two-steps-v2' target='_blank'>
                twoStepsV2
              </MenuItem>
            </SubMenu>
          </SubMenu>
          <SubMenu label='wizardExamples' icon={<i className='ri-git-commit-line' />}>
            <MenuItem href='/pages/wizard-examples/checkout'>checkout</MenuItem>
            <MenuItem href='/pages/wizard-examples/property-listing'>
              propertyListing
            </MenuItem>
            <MenuItem href='/pages/wizard-examples/create-deal'>
              createDeal
            </MenuItem>
          </SubMenu>
          <MenuItem href='/pages/dialog-examples' icon={<i className='ri-tv-2-line' />}>
            dialogExamples
          </MenuItem>
          <SubMenu label='widgetExamples' icon={<i className='ri-bar-chart-box-line' />}>
            <MenuItem href='/pages/widget-examples/basic'>basic</MenuItem>
            <MenuItem href='/pages/widget-examples/advanced'>advanced</MenuItem>
            <MenuItem href='/pages/widget-examples/statistics'>
              statistics
            </MenuItem>
            <MenuItem href='/pages/widget-examples/charts'>charts</MenuItem>
            <MenuItem href='/pages/widget-examples/gamification'>
              gamification
            </MenuItem>
            <MenuItem href='/pages/widget-examples/actions'>actions</MenuItem>
          </SubMenu>
        </MenuSection>
        <MenuSection label='formsAndTables'>
          <MenuItem href='/forms/form-layouts' icon={<i className='ri-layout-4-line' />}>
            formLayouts
          </MenuItem>
          <MenuItem href='/forms/form-validation' icon={<i className='ri-checkbox-multiple-line' />}>
            formValidation
          </MenuItem>
          <MenuItem href='/forms/form-wizard' icon={<i className='ri-git-commit-line' />}>
            formWizard
          </MenuItem>
          <MenuItem href='/react-table' icon={<i className='ri-table-alt-line' />}>
            reactTable
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/form-elements`}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
            icon={<i className='ri-radio-button-line' />}
          >
            formELements
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/mui-table`}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
            icon={<i className='ri-table-2' />}
          >
            muiTables
          </MenuItem>
        </MenuSection>
        <MenuSection label='chartsMisc'>
          <SubMenu label='charts' icon={<i className='ri-bar-chart-2-line' />}>
            <MenuItem href='/charts/apex-charts'>apex</MenuItem>
            <MenuItem href='/charts/recharts'>recharts</MenuItem>
          </SubMenu>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/foundation`}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
            icon={<i className='ri-pantone-line' />}
          >
            foundation
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components`}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
            icon={<i className='ri-toggle-line' />}
          >
            components
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/menu-examples/overview`}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
            icon={<i className='ri-menu-search-line' />}
          >
            menuExamples
          </MenuItem>
          <MenuItem
            href='https://themeselection.com/support'
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
            icon={<i className='ri-lifebuoy-line' />}
          >
            raiseSupport
          </MenuItem>
          <MenuItem
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}`}
            suffix={<i className='ri-external-link-line text-xl' />}
            target='_blank'
            icon={<i className='ri-book-line' />}
          >
            documentation
          </MenuItem>
          <SubMenu label='others' icon={<i className='ri-more-line' />}>
            <MenuItem suffix={<Chip label='New' size='small' color='info' />}>
              itemWithBadge
            </MenuItem>
            <MenuItem
              href='https://themeselection.com'
              target='_blank'
              suffix={<i className='ri-external-link-line text-xl' />}
            >
              externalLink
            </MenuItem>
            <SubMenu label='menuLevels'>
              <MenuItem>menuLevel2</MenuItem>
              <SubMenu label='menuLevel2'>
                <MenuItem>menuLevel3</MenuItem>
                <MenuItem>menuLevel3</MenuItem>
              </SubMenu>
            </SubMenu>
            <MenuItem disabled>disabledMenu</MenuItem>
          </SubMenu>
        </MenuSection>*/}
      </Menu>
      {/* <Menu
        popoutMenuOffset={{ mainAxis: 10 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <GenerateVerticalMenu menuData={menuData(dictionary)} />
      </Menu> */}
    </ScrollWrapper>
  )
}

export default VerticalMenu
