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
    path: '/patients/listing',
    name: 'patients-listing',
    meta: { action: 'index', subject: 'Patients'},
    component: () => import('@/views/patients/listing/index.vue'),
  },
  {
    path: '/my-patients/listing',
    name: 'my-patients-listing',
    meta: { action: 'index', subject: 'MyPatients'},
    component: () => import('@/views/patients/guest/index.vue'),
  },
  {
    path: '/queries/listing',
    name: 'queries-listing',
    meta: { action: 'index', subject: 'Queries'},
    component: () => import('@/views/queries/listing/index.vue'),
  },
  {
    path: '/my-queries/listing',
    name: 'my-queries-listing',
    meta: { action: 'index', subject: 'MyQueries'},
    component: () => import('@/views/queries/guest/index.vue'),
  },
  {
    path: '/treatments/listing',
    name: 'treatments-listing',
    meta: { action: 'index', subject: 'Treatments'},
    component: () => import('@/views/treatments/listing/index.vue'),
  },
  {
    path: '/my-treatments/listing',
    name: 'my-treatments-listing',
    meta: { action: 'index', subject: 'MyTreatments'},
    component: () => import('@/views/treatments/guest/index.vue'),
  },
  {
    path: '/patients/detail/:id',
    name: 'patient-detail',
    meta: { action: 'detail', subject: 'Patients'},
    component: () => import('@/views/patients/detail/index.vue'),
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
    path: '/therapists/listing',
    name: 'therapists-listing',
    meta: { action: 'index', subject: 'Therapists'},
    component: () => import('@/views/therapists/listing/index.vue'),
  },
  {
    path: '/therapists/detail/:id',
    name: 'therapist-detail',
    meta: { action: 'detail', subject: 'Therapists'},
    component: () => import('@/views/therapists/detail/index.vue'),
    props: true
  }
]
