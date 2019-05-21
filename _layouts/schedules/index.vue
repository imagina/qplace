<template>
  <div id="placesIndex"
       class="q-layout-page row justify-center layout-padding">
    
    <div class="text_title text-blue-9 col-12 q-title text-right">
      <span>Schedules</span>
    
    </div>
    
    <div class="col-12">
      
      
      <q-table
        :loading="loading"
        :data="dataTable"
        :columns="columns"
        :pagination.sync="pagination"
        
        row-key="filename"
        color="primary"
        @request="getData"
      >
        
        <!--= Full Page =-->
        <template slot="top-right" slot-scope="props">
          <div class="row justify-end items-center full-width">
            <q-btn
              flat round dense
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="props.toggleFullscreen"
            />
            
            <q-btn color="primary"
                   icon="fas fa-sync"
                   @click="getData({pagination:pagination,search:filter.search},true)"
            ></q-btn>
          </div>
        </template>
        
        <template slot="top-left" slot-scope="props">
          <q-search
            hide-underline
            clearable
            color="secondary"
            v-model="filter.search"
          />
        
        </template>
        <!--= Actions =-->
        <q-td slot="body-cell-actions"
              slot-scope="props" :props="props">
          
          <q-btn icon="fas fa-pen" color="positive" round size="xs" class="q-mx-xs"
                 @click="showEditOrCreateSchedule(props.row)" v-if="$auth.hasAccess('iplaces.places.edit')"/>
          <q-btn icon="far fa-trash-alt" color="negative" size="xs" class="q-mx-xs" round
                 @click="dialogDeleteSchedule.handler(props.row.id)" v-if="$auth.hasAccess('iplaces.places.destroy')"/>
        </q-td>
      
      </q-table>
    </div>
    <q-modal v-model="modalSchedule"
             v-if="scheduleToEdit"
             id="sliderModalEdit"
             :content-css="{minWidth: '80vw', minHeight: '80vh'}">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-btn
            flat
            round
            dense
            v-close-overlay
            @click="getData({pagination:pagination,search:filter.search},true)"
            icon="keyboard_arrow_left"
          />
          <q-toolbar-title v-if="!scheduleToEdit.id">New Schedule</q-toolbar-title>
          <q-toolbar-title v-else>Update Schedule ID: {{scheduleToEdit.id}}</q-toolbar-title>
          
        </q-toolbar>
        
        
        <div class="row gutter-sm layout-padding">
          <div class="col-12">
            <locales  ref="localeComponent" v-model="locale" @validate="$v.$touch()"></locales>
          </div>
          
          
          <div class="col-12" v-if="locale.success">
            <q-field
              :error="$v.locale.formTemplate.title.$error"
              error-label="This field is required"
            >
              <q-input :float-label="'Title ('+locale.language+')'" type="text" v-model="locale.formTemplate.title"/>
            </q-field>
            <div class="row " v-for="(range,index) in locale.formTemplate.options" :key="index" >
          
                 <span class="q-subheading q-mt-md full-width">Range {{index+1}}</span>
             <div class="col-12">
               <div class="row gutter-sm text-center items-center">
                 <div class="col-12 col-md-5">
                   <q-datetime float-label="from" v-model="range.from" type="time" format="hh:mm a" />
                 </div>
    
                 <div class="col-12 col-md-5">
                   <q-datetime float-label="to" v-model="range.to" type="time" format="hh:mm a" />
                 </div>
    
                 <div class="col-12 col-md-2">
                   <q-btn icon="fas fa-trash-alt" color="negative" round size="xs" @click="deleteRange(index)"/>
                 </div>
  
               </div>

             </div>
             

            </div>
            
            <div class="row justify-end q-my-sm">
              <q-btn icon="add" color="positive" round size="xs" @click="addRange()">
                <q-tooltip :offset="[5,5]">
                  Add range
                </q-tooltip>
              </q-btn>
            </div>
            
          </div>
          
        
          <div class="col-12 text-center">
            <q-btn color="primary" label="Save" @click="updateOrCreateSchedule();"/>
          </div>
        
        </div>
      </q-modal-layout>
    </q-modal>
    
    <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="$auth.hasAccess('iplaces.places.create')">
      <q-btn round color="positive" icon="add" @click="showEditOrCreateSchedule(false)"/>
    </q-page-sticky>
  </div>
</template>
<script>
  
  /*Plugins*/
  import {alert} from '@imagina/qhelper/_plugins/alert'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {required} from 'vuelidate/lib/validators'
  import { uid } from 'quasar'
  
  /*Components*/
  import mediaForm from '@imagina/qmedia/_components/form'
  import locales from '@imagina/qsite/_components/locales'
  import recursiveList from 'src/components/master/recursiveListSelect'
  
  /*Services*/
  import placesService from '@imagina/qplaces/_services/index'
  
  export default {
    props: {},
    components: {
      mediaForm,
      locales,
      Treeselect,
      recursiveList
    },
  
    validations() {
      return this.getObjectValidation()
    },
    
    watch: {},
    mounted() {
      this.$nextTick(function () {
        this.getData({pagination: this.pagination, search: this.filter.search});
      })
    },
    data() {
      return {
        mediaKey: uid(),
        modalSchedule: false,
     
        locale: {
          fields: {
            id:'',
            options: [
              {
                
                from: '',
                to: ''
              }
            ],
          },
          fieldsTranslatable: {
            title: '',

          },
          validations: {
            title: {required}
          }
        },
        scheduleToEdit: {},
        dataTable: [],
        pagination: {
          page: 1,
          rowsPerPage: 15,
          rowsNumber: 1
        },
        scheduleToEdit: {},
        loading: false,
        filter: {
          search: ''
        },
        dialogDeleteSchedule: {
          handler: (id) => {
            this.$q.dialog({
              title: 'Confirm',
              ok: 'Delete',
              message: 'you are sure to eliminate this schedule?',
              cancel: 'Cancel'
            }).then(() => {
              this.deleteSchedule(id)
            }).catch(() => {
            })
          }
        },
        columns: [
          {
            name: 'title', label: 'Title',
            field: 'title',
            align: 'center',
            sortable: true,
            style: 'width: 40%'
          },
          {
            name: 'createdAt', label: 'Created At', field: 'createdAt',
            format: val => val ? this.$d(this.$moment(val, 'YYYY-MM-DD HH:mm').toDate(), 'short', this.$q.i18n.lang) : '-',
            align: 'left', sortable: true
          },
          {
            name: 'actions', label: 'actions', align: 'center'
          },
        
        ],
      }
    },
    methods: {
      async getData({pagination, search}, refresh = false) {
        
        this.loading = true
        // clear storage cache
        if (refresh)
          this.$helper.clearCache('apiRoutes.places.schedules')
        
        let params = {
          params: {
            filter: {
              search: this.filter.search,
              allTranslations: true
            },
            page: pagination.page,
            take: pagination.rowsPerPage,
          },
          refresh: refresh
        }
        
        // index all media by params
        placesService.crud.index('apiRoutes.places.schedules', params).then(response => {
          this.dataTable = response.data
          
          this.pagination.rowsPerPage = response.meta.page.perPage;
          this.pagination.page = response.meta.page.currentPage;
          this.pagination.rowsNumber = response.meta.page.lastPage;
          
          this.loading = false
        })
        
      },
  
      //Return object to validations
      getObjectValidation() {
        let response = {}
        if (this.locale && this.locale.formValidations)
          response = {locale: this.locale.formValidations}
        return response
      },
      
      showEditOrCreateSchedule(schedule) {
        this.$v.$reset()//Reset validations
        
        if (schedule) {
          this.scheduleToEdit = schedule
          this.locale.form = schedule
          
        } else {
          
          this.locale.form = this.scheduleToEdit = {
            title: '',
            options: [
              {
                from: '',
                to: ''
              }
            ],
          }
          
        }
        this.mediaKey = uid()
        this.modalSchedule = true
        
      },
      updateOrCreateSchedule() {
        this.loading = true;
        let data = JSON.parse(JSON.stringify(this.locale.form))
        let configName = 'apiRoutes.places.schedules'
        
        this.$refs.localeComponent.vTouch();
  
  
        if (!this.$v.$error) {
          this.loading = true
          if (data.id) {
            placesService.crud.update(configName, data.id, data).then(response => {
              alert.success('Place updated', 'top')
              this.getData({pagination: this.pagination, search: this.filter.search}, true);
            }).catch(error => {
              alert.error('Place not updated', 'bottom', false, 2500)
              this.loading = false;
            })
          } else {
            placesService.crud.create(configName, data).then(response => {
              alert.success('Place created', 'top')
              this.getData({pagination: this.pagination, search: this.filter.search}, true);
            }).catch(error => {
              alert.error('Place not created', 'bottom', false, 2500)
              this.loading = false;
            })
          }
          this.modalSchedule = false
        }
      },
  
      deleteSchedule(id){
        this.loading = true;
        let configName = 'apiRoutes.places.schedules'
        placesService.crud.delete(configName, id).then(response => {
          alert.success('Place deleted', 'top')
          this.getData({pagination: this.pagination, search: this.filter.search}, true);
        }).catch(error => {
          alert.error('Place not deleted', 'bottom', false, 2500)
          this.loading = false;
        })
      },
  
      addRange(){
        this.locale.formTemplate.options.push({
          
          from: '',
          to: ''
        })
      },
  
      deleteRange(index){
        this.locale.formTemplate.options.splice(index,1)
      }
      
      
    }
    
  }
</script>
<style lang="stylus">
  @import "~variables";
</style>