//Layout container
import master from 'src/layouts/master'

//Middleware
import auth from '@imagina/quser/_router/middlewares/auth'
import access from '@imagina/quser/_router/middlewares/access'

export default {
  places: {
    permission: 'iplaces.places.manage',
    activated: true,
    path: '/iplaces/places/index',
    name: 'qplace.admin.places.index',
    layout: require('@imagina/qplace/_layouts/admin/places/index').default,
    containerLayout: master,
    title: 'qplace.sidebar.adminPlaces',
    icon: 'fas fa-map-marked-alt',
    middleware: [auth,access]
  },

  placesCreate: {
    permission: 'iplaces.places.create',
    activated: true,
    path: '/iplaces/places/create',
    name: 'qplace.admin.places.create',
    layout: require('@imagina/qplace/_layouts/admin/places/form').default,
    containerLayout: master,
    title: 'qplace.sidebar.adminPlacesCreate',
    icon: 'fas fa-map-marked-alt',
    middleware: [auth,access]
  },

  placesUpdate: {
    permission: 'iplaces.places.edit',
    activated: true,
    path: '/iplaces/places/:id',
    name: 'qplace.admin.places.edit',
    layout: require('@imagina/qplace/_layouts/admin/places/form').default,
    containerLayout: master,
    title: 'qplace.sidebar.adminPlacesUpdate',
    icon: 'fas fa-map-marked-alt',
    middleware: [auth,access]
  },

  categories: {
    permission: 'iplaces.categories.manage',
    activated: true,
    path: '/iplaces/categories/index',
    name: 'qplace.admin.categories',
    layout: require('@imagina/qplace/_layouts/admin/categories/index').default,
    containerLayout: master,
    title: 'qplace.sidebar.adminCategories',
    icon: 'fas fa-layer-group',
    middleware: [auth,access]
  }
}
