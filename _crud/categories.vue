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
          entityName: config("main.qplace.entityNames.category"),
          apiRoute: 'apiRoutes.qplace.categories',
          permission: 'iplaces.categories',
          extraFormFields: 'iplaces.crud-fields.categories',
          create: {
            title: this.$tr('iplaces.cms.newCategory'),
          },
          read: {
            columns: [
              {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: 'width: 50px'},
              {name: 'name', label: this.$tr('isite.cms.form.title'), field: 'title', align: 'rigth'},
              {name: 'slug', label: this.$tr('isite.cms.form.slug'), field: 'slug', align: 'left'},
              {
                name: 'parent', label: this.$tr('isite.cms.form.parent'), field: 'parent', align: 'left',
                format: val => val ? (val.title ? val.title : '-') : '-'
              },
              {
                name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
                format: val => val ? this.$trd(val) : '-',
              },
              {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
            ],
            requestParams: {include: 'parent,qrs'}
          },
          update: {
            title: this.$tr('iplaces.cms.updateCategory'),
            requestParams: {include: 'parent'}
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
            metaTitle: {
              value: '',
              type: 'input',
              isTranslatable: true,
              props: {
                label: this.$tr('isite.cms.form.metaTitle'),
              }
            },
            metaDescription: {
              value: '',
              type: 'input',
              isTranslatable: true,
              props : {
                label: this.$tr('isite.cms.form.metaDescription'),
                type: 'textarea',
                rows : 2
              }
            },
          },
          formRight: {
            masterRecord: {
              value: '0',
              isFakeField: true,
              type: 'select',
              props : {
                label: this.$tr('isite.cms.form.masterRecord'),
                options: [
                  {label: this.$tr('isite.cms.label.yes'), value: '1'},
                  {label: this.$tr('isite.cms.label.no'), value: '0'},
                ]
              }
            },
            parentId: {
              value: 0,
              type: 'select',
              props : {
                label: this.$tr('isite.cms.form.parent'),
                clearable: true,
                options: [
                  {label: this.$tr('isite.cms.label.disabled'), value: 0},
                ],
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qplace.categories',
                select: {label: 'title', id: 'id'},
                requestParams: {include: 'parent'}
              }
            },
            status: {
              value: '1',
              type: 'select',
              props : {
                label: `${this.$tr('isite.cms.form.status')}:`,
                options: [
                  {label: this.$tr('isite.cms.label.enabled'), value: '1'},
                  {label: this.$tr('isite.cms.label.disabled'), value: '0'},
                ],
              }
            },
            mediasSingle: {
              name: 'mediasSingle',
              value: {},
              type: 'media',
              props : {
                label: this.$tr('isite.cms.form.image'),
                zone: 'mainimage',
                entity: "Modules\\Iplaces\\Entities\\Category",
                entityId: null
              }
            },
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
