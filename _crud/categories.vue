<template></template>
<script>
  //Component
  import crud from '@imagina/qcrud/_components/crud'

  export default {
    computed: {
      crudData() {
        return {
          apiRoute: 'apiRoutes.qplace.categories',
          permission: 'iplaces.categories',
          create: {
            title: this.$tr('qplace.layout.newCategory'),
          },
          read: {
            columns: [
              {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
              {name: 'name', label: this.$tr('ui.form.title'), field: 'title', align: 'rigth'},
              {name: 'slug', label: this.$tr('ui.form.slug'), field: 'slug', align: 'left'},
              {
                name: 'parent', label: this.$tr('ui.form.parent'), field: 'parent', align: 'left',
                format: val => val ? (val.title ? val.title : '-') : '-'
              },
              {
                name: 'created_at', label: this.$tr('ui.form.createdAt'), field: 'createdAt', align: 'left',
                format: val => val ? this.$trd(val) : '-',
              },
              {name: 'actions', label: this.$tr('ui.form.actions'), align: 'left'},
            ],
            requestParams: {include: 'parent'}
          },
          update: {
            title: this.$tr('qplace.layout.updateCategory'),
            requestParams: {include: 'parent'}
          },
          delete: true,
          formLeft: {
            id: {value: ''},
            userId: {value: this.$store.state.quserAuth.userId},
            title: {
              label: `${this.$tr('ui.form.title')}*`,
              value: '',
              type: 'text',
              isTranslatable: true,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            },
            slug: {
              label: `${this.$tr('ui.form.slug')}*`,
              value: '',
              type: 'text',
              isTranslatable: true,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            },
            description: {
              label: `${this.$tr('ui.form.description')}*`,
              value: '',
              type: 'html',
              isTranslatable: true,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            },
            metaTitle: {
              label: this.$tr('ui.form.metaTitle'),
              value: '',
              type: 'text',
              isTranslatable: true,
            },
            metaDescription: {
              label: this.$tr('ui.form.metaDescription'),
              value: '',
              type: 'textarea',
              isTranslatable: true,
            },
          },
          formRight: {
            masterRecord : {
              label: this.$tr('ui.form.masterRecord'),
              value: 0,
              isFakeField : true,
              type: 'select',
              options: [
                {label: this.$tr('ui.label.yes'), value: 1},
                {label: this.$tr('ui.label.no'), value: 0},
              ]
            },
            parentId: {
              label: this.$tr('ui.form.parent'),
              value: null,
              type: 'select',
              clearable: true,
              loadOptions: {
                apiRoute: 'apiRoutes.qplace.categories',
                select: {label: 'title', id: 'id'},
                requestParams: {include: 'parent'}
              }
            },
            status : {
              label: `${this.$tr('ui.form.status')}:`,
              value: '1',
              type: 'select',
              options: [
                {label: this.$tr('ui.label.enabled'), value: '1'},
                {label: this.$tr('ui.label.disabled'), value: '0'},
              ],
            },
            mediasSingle: {
              name: 'mediasSingle',
              label: this.$tr('ui.form.image'),
              value: {},
              type: 'media',
              zone: 'mainimage',
              entity: "Modules\\Iplace\\Entities\\Category",
              enitityId: null
            },
          },
        }
      }
    },
  }
</script>
