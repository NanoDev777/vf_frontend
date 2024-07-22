export default [
  { heading: 'Módulos' },
  {
    title: 'Pacientes',
    icon: { icon: 'tabler-user-check' },
    to: 'patient-listing',
    action: 'index',
    subject: 'Patient'
  },
  {
    title: 'Mis Pacientes',
    icon: { icon: 'tabler-user-check' },
    to: 'patient-listing',
    action: 'index',
    subject: 'MyPatient'
  },
  {
    title: 'Mis Consultas',
    icon: { icon: 'tabler-address-book' },
    to: 'patient-listing',
    action: 'index',
    subject: 'MyQueries'
  },
  {
    title: 'Mis Tratamientos',
    icon: { icon: 'tabler-calendar-month' },
    to: 'patient-listing',
    action: 'index',
    subject: 'Mytreatments'
  },
  {
    title: 'Clientes',
    icon: { icon: 'tabler-users-group' },
    to: 'people-listing',
    action: 'index',
    subject: 'People'
  },
  {
    title: 'Terapistas',
    icon: { icon: 'tabler-empathize' },
    to: 'therapist-listing',
    action: 'index',
    subject: 'Therapist'
  },
  {
    title: 'Roles y Permisos',
    icon: { icon: 'tabler-lock' },
    to: 'apps-calendar',
    action: 'index',
    subject: 'Calendar'
  },
  {
    title: 'Usuarios',
    icon: { icon: 'tabler-user-circle' },
    to: 'apps-calendar',
    action: 'index',
    subject: 'Calendar'
  },
]
