const emailRouteComponent = () => import('@/pages/apps/email/index.vue')

// 👉 Redirects
export const redirects = [
  // ℹ️ We are redirecting to different pages based on role.
  // NOTE: Role is just for UI purposes. ACL is based on abilities.
  {
    path: '/',
    name: 'index',
    redirect: to => {
      // TODO: Get type from backend
      const userData = useCookie('userData')
      const userType = userData.value?.type
      const userRole = userData.value?.role
      if (userType == 1 && userRole != 'Invitado'){
        return { name: 'dashboards-crm' }
      } else if (userType == 2 && userRole != 'Invitado') {
        return { name: 'dashboards-crm' }
      } else if (userType == 1 && userRole == 'Invitado') {
        return { name: 'access-control' }
      } else {
        return { name: 'login', query: to.query }
      }
    },
  },
  {
    path: '/pages/user-profile',
    name: 'pages-user-profile',
    redirect: () => ({ name: 'pages-user-profile-tab', params: { tab: 'profile' } }),
  },
  {
    path: '/pages/account-settings',
    name: 'pages-account-settings',
    redirect: () => ({ name: 'pages-account-settings-tab', params: { tab: 'account' } }),
  },
]
export const routes = [
  // Email filter
  {
    path: '/apps/email/filter/:filter',
    name: 'apps-email-filter',
    component: emailRouteComponent,
    meta: {
      navActiveLink: 'apps-email',
      layoutWrapperClasses: 'layout-content-height-fixed',
    },
  },

  // Email label
  {
    path: '/apps/email/label/:label',
    name: 'apps-email-label',
    component: emailRouteComponent,
    meta: {
      // contentClass: 'email-application',
      navActiveLink: 'apps-email',
      layoutWrapperClasses: 'layout-content-height-fixed',
    },
  },
  {
    path: '/dashboards/logistics',
    name: 'dashboards-logistics',
    component: () => import('@/pages/apps/logistics/dashboard.vue'),
  },
  {
    path: '/dashboards/academy',
    name: 'dashboards-academy',
    component: () => import('@/pages/apps/academy/dashboard.vue'),
  },
  {
    path: '/apps/ecommerce/dashboard',
    name: 'apps-ecommerce-dashboard',
    component: () => import('@/pages/dashboards/ecommerce.vue'),
  },

  //ERP
  {
    path: '/patient/listing',
    name: 'patient-listing',
    meta: { action: 'index', subject: 'Patient'},
    component: () => import('@/views/patient/listing/index.vue'),
  },

  {
    path: '/patient/detail/:id',
    name: 'patient-detail',
    meta: { action: 'detail', subject: 'Patient'},
    component: () => import('@/views/patient/detail/index.vue'),
    props: true
  },
  {
    path: '/people/listing',
    name: 'people-listing',
    meta: { action: 'index', subject: 'People'},
    component: () => import('@/views/people/listing/index.vue'),
  },
  {
    path: '/people/detail/:id',
    name: 'people-detail',
    meta: { action: 'detail', subject: 'People'},
    component: () => import('@/views/people/detail/index.vue'),
    props: true
  },
  {
    path: '/therapist/listing',
    name: 'therapist-listing',
    meta: { action: 'index', subject: 'Therapist'},
    component: () => import('@/views/therapist/listing/index.vue'),
  },
  {
    path: '/therapist/detail/:id',
    name: 'therapist-detail',
    meta: { action: 'detail', subject: 'Therapist'},
    component: () => import('@/views/therapist/detail/index.vue'),
    props: true
  }
]
