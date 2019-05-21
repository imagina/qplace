<template>
  <div id="placesIndex"
       class="q-layout-page row justify-center layout-padding">
    
    <div class="text_title text-blue-9 col-12 q-title text-right">
      <span>Places</span>
    
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
                 @click="showEditOrCreatePlace(props.row)" v-if="$auth.hasAccess('iplaces.places.edit')"/>
          <q-btn icon="far fa-trash-alt" color="negative" size="xs" class="q-mx-xs" round
                 @click="dialogDeletePlace.handler(props.row.id)" v-if="$auth.hasAccess('iplaces.places.destroy')"/>
        </q-td>
      
      </q-table>
    </div>
    <q-modal v-model="modalPlace"
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
          <q-toolbar-title v-if="!placeToEdit.id">New Place</q-toolbar-title>
          <q-toolbar-title v-else>Update Place ID: {{placeToEdit.id}}</q-toolbar-title>
        
        </q-toolbar>
        
        
        <div class="row gutter-sm layout-padding">
          <div class="col-12">
            <locales ref="localeComponent" v-model="locale" @validate="$v.$touch()"></locales>
          </div>
          
          
          <div class="col-12 col-md-8" v-if="locale.success">
            <q-field
              :error="$v.locale.formTemplate.title.$error"
              error-label="This field is required"
            >
              <q-input :float-label="'Title ('+locale.language+')'" type="text" v-model="locale.formTemplate.title"/>
            </q-field>
            <q-field
              :error="$v.locale.formTemplate.description.$error"
              error-label="This field is required"
            >
              <q-input :float-label="'Slug ('+locale.language+')'" type="text" v-model="locale.formTemplate.slug"/>
            </q-field>
            
            <q-field
              :error="$v.locale.formTemplate.summary.$error"
              error-label="This field is required"
            >
              <q-input :float-label="'Summary ('+locale.language+')'" type="textarea"
                       v-model="locale.formTemplate.summary" rows="3"/>
            </q-field>
            
            <div class="q-caption q-my-sm text-grey">{{'Description ('+locale.language+')'}}</div>
            <q-field>
              <q-editor v-model="locale.formTemplate.description"/>
            </q-field>
            
            <media-form
              entity="Modules\Iplaces\Entities\Place"
              :entity-id="placeToEdit.id ? placeToEdit.id : ''"
              v-model="locale.formTemplate.mediasSingle"
              label="Main Image"
              zone="slideimage"
              :key="mediaKey"
            />
          </div>
          
          <div class="col-12 col-md-4" v-if="locale.success">
        
            <q-field>
              <q-input color="primary" v-model="locale.formTemplate.address.address" placeholder="Type at least 3 characters">
                <q-autocomplete
                  @search="searchAddress"
                  :min-characters="3"
                  @selected="selectAddress"
                />
              </q-input>
            </q-field>
  
            <div id="mapCanvas" style="width:100%; height:300px"></div>
            <q-field>
              <q-input float-label="Phone 1" type="number" v-model="locale.formTemplate.options.phone1"/>
            </q-field>
            
            <q-field>
              <q-input float-label="Phone 2" type="number" v-model="locale.formTemplate.options.phone2"/>
            </q-field>
            
            <q-field>
              <q-input float-label="Phone 3" type="number" v-model="locale.formTemplate.options.phone3"/>
            </q-field>
            
            <!--Category-->
            <div class="q-caption q-my-sm text-grey">Category</div>
            <treeselect
              :clearable="false"
              :append-to-body="true"
              :options="options.categories"
              value-consists-of="BRANCH_PRIORITY"
              v-model="locale.formTemplate.categoryId"
              placeholder=""
            />
            <q-progress indeterminate color="primary" v-if="loadingCategories"/>
            <!--Categories-->
            <div class="q-caption q-my-sm text-grey">Categories</div>
            <recursive-list v-model="locale.formTemplate.categories"
                            :items="options.categories"/>
            
            <!--Schedules-->
            <div class="q-caption q-my-sm text-grey">Schedules</div>
            <recursive-list v-model="locale.formTemplate.schedules"
                            :items="options.schedules"/>
            
            <q-progress indeterminate color="primary" v-if="loadingCategories"/>
          
          </div>
          
          <div class="col-12 text-center">
            <q-btn color="primary" label="Save" @click="updateOrCreatePlace();"/>
          </div>
        
        </div>
      </q-modal-layout>
    </q-modal>
    
    <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="$auth.hasAccess('iplaces.places.create')">
      <q-btn round color="positive" icon="add" @click="showEditOrCreatePlace(false)"/>
    </q-page-sticky>
  </div>
</template>
<script>
  
  /*Plugins*/
  import {alert} from '@imagina/qhelper/_plugins/alert'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {required} from 'vuelidate/lib/validators'
  import {uid} from 'quasar'
  import {gmaps} from '@imagina/qplaces/_plugins/gmaps'
  
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
    
    watch: {
      modalPlace(val){
        if(val){
          setTimeout(() => {
            this.initializeMap()
          },500)
          
        }
      }
    },
    mounted() {
      this.$nextTick(function () {
        gmaps.initializeGoogleApi()
     
        this.getData({pagination: this.pagination, search: this.filter.search});
      })
    },
    data() {
      return {
        geocoder: '',
        autocomplete: '',
        map: '',
        marker: '',
        mediaKey: uid(),
        modalPlace: false,
        loadingCategories: false,
        loadingSchedules: false,
        options: {
          categories: [],
          schedules: [],
        },
        locale: {
          fields: {
            id: '',
            address: {
              address:'',
              latitude:'',
              longitude:''
            },
            cityId: 0,
            zoneId: 0,
            serviceId: 0,
            provinceId: 0,
            rangeId: 0,
            siteId: 0,
            gama: 0,
            quantityPerson: 0,
            weather: 0,
            housing: 0,
            transport: 0,
            rating: 3,
            validated: 0,
            order: 0,
            userId: this.$store.state.auth.userId,
            mediasSingle: {},
            options: {
              phone1: '',
              phone2: '',
              phone3: '',
            },
            categoryId: 0,
            categories: [],
            schedules: []
          },
          fieldsTranslatable: {
            title: '',
            slug: '',
            description: '',
            summary: '',
            metaTitle: '',
            metaKeywords: '',
            metaDescription: ''
          },
          validations: {
            title: {required},
            description: {required},
            summary: {required}
          }
        },
        placeToEdit: {},
        dataTable: [],
        pagination: {
          page: 1,
          rowsPerPage: 15,
          rowsNumber: 1
        },
        placeToEdit: {},
        loading: false,
        filter: {
          search: ''
        },
        dialogDeletePlace: {
          handler: (id) => {
            this.$q.dialog({
              title: 'Confirm',
              ok: 'Delete',
              message: 'Are you sure to eliminate this place?',
              cancel: 'Cancel'
            }).then(() => {
              this.deletePlace(id)
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
          this.$helper.clearCache('apiRoutes.places.places')
        
        let params = {
          params: {
            filter: {
              search: this.filter.search,
              allTranslations: true
            },
            include: 'category,schedules',
            page: pagination.page,
            take: pagination.rowsPerPage,
          },
          refresh: refresh
        }
        
        // index all media by params
        placesService.crud.index('apiRoutes.places.places', params).then(response => {
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
      convertRelationsToFront(object, relation) {
        let result = [];
        
        object[relation].forEach((category, index) => {
          result[index] = category.id
        })
        object[relation] = result
      },
      showEditOrCreatePlace(place) {
        this.$v.$reset()//Reset validations
        this.getCategories()//Get categories
        this.getSchedules()//Get schedules
        
        if (place) {
          this.convertRelationsToFront(place, 'categories')
          this.convertRelationsToFront(place, 'schedules')
          this.placeToEdit = place
          this.locale.form = place
          
        } else {
          
          this.locale.form = this.placeToEdit = {
            title: '',
            slug: '',
            summary: '',
            description: '',
            address:  {
              address:'',
              latitude:'',
              longitude:''
            },
            options: {
              phone1: '',
              phone2: '',
              phone3: '',
            },
            categoryId: null,
            categories: [],
            schedules: [],
            mediasSingle: {}
          }
          
        }
  
        
        this.mediaKey = uid()
        this.modalPlace = true
        
      },
      updateOrCreatePlace() {
        this.loading = true;
        let data = JSON.parse(JSON.stringify(this.locale.form))
        let configName = 'apiRoutes.places.places'
        
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
          this.modalPlace = false
        }
      },
      
      deletePlace(id) {
        this.loading = true;
        let configName = 'apiRoutes.places.places'
        placesService.crud.delete(configName, id).then(response => {
          alert.success('Place deleted', 'top')
          this.getData({pagination: this.pagination, search: this.filter.search}, true);
        }).catch(error => {
          alert.error('Place not deleted', 'bottom', false, 2500)
          this.loading = false;
        })
      },
      
      //Get place categories
      getCategories() {
        
        this.loadingCategories = true
        let configName = 'apiRoutes.places.categories'
        let params = {//Params to request
          refresh: true,
          params: {include: 'parent'},
        }
        //Request
        placesService.crud.index(configName, params).then(response => {
          this.options.categories = this.$helper.array.tree(response.data)
          
          if (response.data.length)
            this.locale.fields.categoryId = response.data[0].id
          
          this.loadingCategories = false
        }).catch(error => {
          this.$helper.alert.error('Failed: ' + error, 'bottom')
          this.loadingCategories = false
        })
        
      },
      
      //Get place categories
      getSchedules() {
        
        this.loadingSchedules = true
        let configName = 'apiRoutes.places.schedules'
        let params = {//Params to request
          refresh: true,
          params: {},
        }
        //Request
        placesService.crud.index(configName, params).then(response => {
          this.options.schedules = this.$helper.array.tree(response.data)
          
          this.loadingSchedules = false
        }).catch(error => {
          this.$helper.alert.error('Failed: ' + error, 'bottom')
          this.loadingSchedules = false
        })
        
      },
      
      initializeMap() {
        
        //MAP
        var latitude = this.locale.formTemplate.address.latitude;
        var longitude = this.locale.formTemplate.address.longitude;
        var OLD = new google.maps.LatLng(latitude, longitude);
        var options = {
          zoom: 16,
          center: OLD,
          mapTypeId: google.maps.MapTypeId.ROADMAP,// ROADMAP | SATELLITE | HYBRID | TERRAIN
        };
        
        this.map = new google.maps.Map(document.getElementById("mapCanvas"), options);
        
        //GEOCODER
        this.geocoder = new google.maps.Geocoder();
  
        this.marker = new google.maps.Marker({
          map: this.map,
          draggable: true,
          position: OLD
        });
  
        //Add a listener to the marker for reverse geocoding
        google.maps.event.addListener(this.marker, 'drag',  () => {
          console.warn("drag marker")
          this.geocoder.geocode({'latLng': this.marker.getPosition()}, (results, status) => {
            console.warn(results)
            if (status == google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                this.locale.formTemplate.address = {
                  "address": results[0].formatted_address,
                  "longitude": results[0].geometry.location.lng(),
                  "latitude": results[0].geometry.location.lat()
                };
              }
            }
          });
        });
      },
  
      searchAddress(terms, done) {
        let result = []
        this.geocoder.geocode({'address': terms}, (results, status) => {
         console.warn(results)
          results.forEach(address => {
            result.push({
              label: address.formatted_address,
              value: address.formatted_address,
              latitude: address.geometry.location.lat(),
              longitude: address.geometry.location.lng()
            })
          })
          done( result )
        });
      },
      selectAddress(item, keyboard){
  
        var location = new google.maps.LatLng(item.latitude, item.longitude);
        this.marker.setPosition(location);
        this.map.setCenter(location);
        this.locale.formTemplate.address = {
          "address": item.value,
          "longitude": item.longitude,
          "latitude": item.latitude
        };
      }
    }
    
  }
</script>
<style lang="stylus">
  @import "~variables";
</style>