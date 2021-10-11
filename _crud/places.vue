<template></template>
<script>
export default {
  data() {
    return {
      crudId: this.$uid()
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qplace.entityNames.place"),
        apiRoute: 'apiRoutes.qplace.places',
        permission: 'iplaces.places',
        extraFormFields: 'iplaces.crud-fields.places',
        create: {
          title: this.$tr('qplace.layout.newPlace')
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
            {name: 'title', label: this.$tr('ui.form.title'), field: 'title', align: 'rigth'},
            {
              name: 'category', label: this.$tr('ui.form.category'), field: 'category', align: 'left',
              format: val => val ? val.title : '-'
            },
            {name: 'status', label: this.$tr('ui.form.status'), field: 'status', align: 'left'},
            {
              name: 'province', label: this.$tr('ui.form.department'), field: 'province', align: 'left',
              format: val => val ? val.name : '-'
            },
            {
              name: 'city', label: this.$tr('ui.form.city'), field: 'city', align: 'left',
              format: val => val ? val.name : '-'
            },
            {
              name: 'address', label: this.$tr('ui.form.address'), field: 'address', align: 'left',
              classes: 'ellipsis', style: 'max-width : 250px',
              format: val => val ? val.title : '-'
            },
            {
              name: 'created_at', label: this.$tr('ui.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {
              name: 'updated_at', label: this.$tr('ui.form.updatedAt'), field: 'updatedAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {name: 'actions', label: this.$tr('ui.form.actions'), align: 'left'},
          ],
          requestParams: {include: 'category,categories,province,city'}
        },
        update: {
          title: this.$tr('qplace.layout.updatePlace'),
          requestParams: {include: 'category,categories,province,city'}
        },
        delete: true,
        formLeft: {
          id: {value: ''},
          userId: {value: this.$store.state.quserAuth.userId},
          title: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('ui.form.title')}*`,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            }
          },
          slug: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('ui.form.slug')}*`,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            }
          },
          summary: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('ui.form.summary')}*`,
              type: 'textarea',
              rows: "3",
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            },
          },
          description: {
            value: '',
            type: 'html',
            isTranslatable: true,
            props: {
              label: `${this.$tr('ui.form.description')}*`,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            }
          },
          provinceId: {
            value: null,
            type: 'select',
            props: {
              label: this.$tr('ui.label.department') + '*',
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qlocations.provinces',
              select: {label: 'name', id: 'id'},
              requestParams: {filter: {country: 48}}//only Colombia country
            }
          },
          cityId: {
            value: null,
            type: 'select',
            props: {
              label: this.$tr('ui.form.city') + '*',
              readonly: (this.crudInfo.provinceId ? false : true),
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            },
            loadOptions: {
              apiRoute: this.crudInfo.provinceId ? 'apiRoutes.qlocations.cities' : false,
              select: {label: 'name', id: 'id'},
              requestParams: {filter: {province_id: this.crudInfo.provinceId}}//only Colombia country
            }
          },
          address: {
            value: null,
            type: 'positionMarkerMap',
            props: {
              label: this.$tr('ui.label.location'),
            }
          }
        },
        formRight: {
          rating: {
            value: 5,
            type: 'rating',
            props : {
              label : this.$tr('ui.label.rating')
            }
          },
          categoryId: {
            value: null,
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('@imagina/qplace/_crud/categories'),
              crudProps: {
                label: `${this.$tr('ui.form.category')}*`,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired')
                ],
              },
            },
          },
          categories: {
            value: [],
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('@imagina/qplace/_crud/categories'),
              crudProps: {
                label: this.$trp('ui.form.category'),
                multiple: true,
                useChips: true
              },
            },
          },
          status: {
            value: '1',
            type: 'select',
            props: {
              label: `${this.$tr('ui.form.status')}:`,
              options: [
                {label: this.$tr('ui.label.enabled'), value: '1'},
                {label: this.$tr('ui.label.disabled'), value: '0'},
              ],
            }
          },
          phone1: {
            value: null,
            type: 'input',
            isFakeField: true,
            props: {
              label: `${this.$tr('ui.form.phone')} 1`,
              mask: 'phone',
              unmaskedValue: true
            }
          },
          phone2: {
            value: null,
            type: 'input',
            isFakeField: true,
            props: {
              label: `${this.$tr('ui.form.phone')} 2`,
              mask: 'phone',
              unmaskedValue: true
            }
          },
          phone3: {
            value: null,
            type: 'input',
            isFakeField: true,
            props: {
              label: `${this.$tr('ui.form.phone')} 3`,
              mask: 'phone',
              unmaskedValue: true
            }
          },
          email: {
            value: null,
            type: 'input',
            isFakeField: true,
            props: {
              label: `${this.$tr('ui.form.email')}`,
              unmaskedValue: true
            }
          },
          schedules: {
            value: null,
            type: 'schedule',
            props: {
              //label: `${this.$tr('ui.label.schedules')}`,
            }
          },
          mediasSingle: {
            name: 'mediasSingle',
            value: {},
            type: 'media',
            props: {
              label: this.$tr('ui.form.image'),
              zone: 'mainimage',
              entity: "Modules\\Iplaces\\Entities\\Place",
              entityId: null
            }
          },
          mediasMulti: {
            value: {},
            type: 'media',
            props: {
              label: this.$tr('ui.form.gallery'),
              zone: 'gallery',
              entity: "Modules\\Iplaces\\Entities\\Place",
              entityId: null
            }
          }
        },
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
}
</script>
