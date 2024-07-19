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
        return { name: 'dashboard' }
      } else if (userType == 2 && userRole != 'Invitado') {
        return { name: 'dashboard' }
      } else if (userType == 1 && userRole == 'Invitado') {
        return { name: 'home' }
      } else {
        return { name: 'login', query: to.query }
      }
    },
  },

  
]
export const routes = [
  //USER
  {
    path: '/home',
    name: 'home',
    meta: { action: 'index', subject: 'Home'},
    component: () => import('@/views/home/index.vue'),
  },

  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { action: 'index', subject: 'Dashboard'},
    component: () => import('@/views/dashboards/crm/CrmActiveProject.vue'),
  },

  {
    path: '/user/profile/:id',
    name: 'user-profile',
    meta: { action: 'index', subject: 'Profile'},
    component: () => import('@/pages/apps/user/view/[id].vue'),
    props: true
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
