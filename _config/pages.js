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
    name: 'app.iplaces.places.index',
    layout: require('@imagina/qplaces/_layouts/places/index').default,
    containerLayout: master,
    title: 'Places',
    icon: 'fas fa-map-marked-alt',
    middleware: [auth,access]
  },

  categories: {
    permission: 'iplaces.categories.manage',
    activated: true,
    path: '/iplaces/categories/index',
    name: 'app.iplaces.categories.index',
    layout: require('@imagina/qplaces/_layouts/categories/index').default,
    containerLayout: master,
    title: 'Categories',
    icon: 'fas fa-layer-group',
    middleware: [auth,access]
  },
  
  schedules: {
    permission: 'iplaces.schedules.manage',
    activated: true,
    path: '/iplaces/schedules/index',
    name: 'app.iplaces.schedules.index',
    layout: require('@imagina/qplaces/_layouts/schedules/index').default,
    containerLayout: master,
    title: 'Schedules',
    icon: 'fas fa-calendar-check',
    middleware: [auth,access]
  },
}
