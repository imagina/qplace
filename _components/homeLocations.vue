<template>
  <div v-if="category && Object.keys(category).length > 0">
    <div class="home-locations" :style="'background: url('+category.mainImage.path+')'">
      <div class="q-container text-white relative-position q-py-xl">
        <div class="bg-primary text-white text-h4 absolute q-px-md q-py-md location-title">
          {{ category.title }}
        </div>
        <div class="row q-py-xl">
          <div class="col-12 col-md-6 q-py-xl place-content" v-for="(place,i) in places"
               :key="i" @click="$helper.map(place.address.address)">
            <div class="row gutter-sm">
              <div class="col-2 col-sm-4 text-right">
                <q-icon name="location_on" size="4em"/>
              </div>
              <div class="col-10 col-sm-8">
                <p class="text-h5">{{ place.title }}</p>
                <p>{{ place.address.address }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "homeLocations",
    data() {
      return {
        places: [],
        category: {},
        ubication: [],
        loading: true,
        openedDialog: false,
        currentUbicationId: 1,
      }
    },
    props: {
      slug: {
        default: null
      }
    },
    beforeRouteLeave(to, from, next) {
      // closing modal details if is opened
      if (!this.openedDialog) {
        next()
      } else {
        this.openedDialog = false
        next(false)
      }
    },

    mounted: function () {
      this.$nextTick(function () {
        this.getPlaces();
      })
    },
    methods: {
      async getPlaces() {
        this.loading = true;
        let params2 = {
          params: {
            filter: {
              field: 'slug'
            }
          }
        }
        await this.$crud.show('apiRoutes.qplace.categories', this.slug, params2).then(response => {
          this.category = response.data
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
        this.loading = true
        let params = {
          params: {
            include: 'schedules',
            filter: {
              categories: this.category.id
            }
          }
        }
        await this.$crud.index('apiRoutes.qplace.places', params).then(response => {
          this.places = response.data;
          this.loading = false;
        }).catch(error => {
          this.loading = false
        })
      },
      gotoTel: function (tel) {
        window.location.href = "tel:" + tel;
      }
    }
  }
</script>

<style lang="stylus">
  .location-title
    top -30px
    left 0

  .place-content
    cursor pointer
    background-color rgba(0, 0, 0, .7)

  .home-locations
    min-height 310px
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
</style>
