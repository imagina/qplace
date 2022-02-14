const pages = config('pages') // Get Pages from config

//Places
export default [
  {
    title: 'iplaces.cms.sidebar.adminGroup',
    icon: 'fas fa-map-marked-alt',
    children: [
      pages.qplace.places, // places setup
      pages.qplace.categories, // categories setup
    ]
  },
]
