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
          title: this.$tr('iplaces.cms.newPlace')
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'},
            {name: 'title', label: this.$tr('isite.cms.form.title'), field: 'title', align: 'rigth'},
            {
              name: 'category', label: this.$tr('isite.cms.form.category'), field: 'category', align: 'left',
              format: val => val ? val.title : '-'
            },
            {name: 'status', label: this.$tr('isite.cms.form.status'), field: 'status', align: 'left'},
            {
              name: 'province', label: this.$tr('isite.cms.form.department'), field: 'province', align: 'left',
              format: val => val ? val.name : '-'
            },
            {
              name: 'city', label: this.$tr('isite.cms.form.city'), field: 'city', align: 'left',
              format: val => val ? val.name : '-'
            },
            {
              name: 'address', label: this.$tr('isite.cms.form.address'), field: 'address', align: 'left',
              classes: 'ellipsis', style: 'max-width : 250px',
              format: val => val ? val.title : '-'
            },
            {
              name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {
              name: 'updated_at', label: this.$tr('isite.cms.form.updatedAt'), field: 'updatedAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
          ],
          requestParams: {include: 'category,categories,province,city,qrs'}
        },
        update: {
          title: this.$tr('iplaces.cms.updatePlace'),
          requestParams: {include: 'category,categories,province,city,schedule.workTimes'}
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
              label: `${this.$tr('isite.cms.form.title')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
          slug: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.slug')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
          summary: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.summary')}*`,
              type: 'textarea',
              rows: "3",
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
          },
          description: {
            value: '',
            type: 'html',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.description')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            }
          },
          provinceId: {
            value: null,
            type: 'select',
            props: {
              label: this.$tr('isite.cms.label.department'),
              clearable: true
              // rules: [
              //   val => !!val || this.$tr('isite.cms.message.fieldRequired')
              // ],
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qlocations.provinces',
              select: {label: 'name', id: 'id'},
              requestParams: {},
              filterByQuery: true
            }
          },
          cityId: {
            value: null,
            type: 'select',
            props: {
              label: this.$tr('isite.cms.form.city'),
              readonly: (this.crudInfo.provinceId ? false : true),
              clearable: true
              // rules: [
              //   val => !!val || this.$tr('isite.cms.message.fieldRequired')
              // ],
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
              label: this.$tr('isite.cms.label.location'),
            }
          }
        },
        formRight: {
          rating: {
            value: 5,
            type: 'rating',
            props: {
              label: this.$tr('isite.cms.label.rating')
            }
          },
          categoryId: {
            value: null,
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('modules/qplace/_crud/categories'),
              crudProps: {
                label: `${this.$tr('isite.cms.form.category')}*`,
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
              },
            },
          },
          categories: {
            value: [],
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('modules/qplace/_crud/categories'),
              crudProps: {
                label: this.$trp('isite.cms.form.category'),
                multiple: true,
                useChips: true
              },
            },
          },
          status: {
            value: '1',
            type: 'select',
            props: {
              label: `${this.$tr('isite.cms.form.status')}:`,
              options: [
                {label: this.$tr('isite.cms.label.enabled'), value: '1'},
                {label: this.$tr('isite.cms.label.disabled'), value: '0'},
              ],
            }
          },
          sortOrder: {
            value: null,
            type: 'input',
            required: true,
            props: {
              label: `${this.$tr('isite.cms.label.order')}*`,
              type: 'number'
            }
          },
          tags: {
            value: [],
            type: 'select',
            props: {
              label: this.$trp('isite.cms.form.tag'),
              useInput: true,
              useChips: true,
              multiple: true,
              hideDropdownIcon: true,
              inputDebounce: "0",
              newValueMode: "add-unique"
            }
          },
          phone1: {
            value: null,
            type: 'input',
            isFakeField: true,
            props: {
              label: `${this.$tr('isite.cms.form.phone')} 1`,
              mask: 'phone',
              unmaskedValue: true
            }
          },
          phone2: {
            value: null,
            type: 'input',
            isFakeField: true,
            props: {
              label: `${this.$tr('isite.cms.form.phone')} 2`,
              mask: 'phone',
              unmaskedValue: true
            }
          },
          phone3: {
            value: null,
            type: 'input',
            isFakeField: true,
            props: {
              label: `${this.$tr('isite.cms.form.phone')} 3`,
              mask: 'phone',
              unmaskedValue: true
            }
          },
          email: {
            value: null,
            type: 'input',
            isFakeField: true,
            props: {
              label: `${this.$tr('isite.cms.form.email')}`,
              unmaskedValue: true
            }
          },
          schedule: {
            value: null,
            type: 'schedulable',
            props: {
              //label: `${this.$tr('isite.cms.label.schedules')}`,
            }
          },
          mediasSingle: {
            name: 'mediasSingle',
            value: {},
            type: 'media',
            props: {
              label: this.$tr('isite.cms.form.image'),
              zone: 'mainimage',
              entity: "Modules\\Iplaces\\Entities\\Place",
              entityId: null
            }
          },
          mediasMulti: {
            value: {},
            type: 'media',
            props: {
              label: this.$tr('isite.cms.form.gallery'),
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
