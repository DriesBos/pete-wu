<template>
  <div v-editable="story.content" class="page-Index">
    <section class="columns">
      <div class="columns-Column columns-ColumnPress">
        <div class="columns-Header columns-ColumnPress_Header">
          <p>Press</p>
          <p>filter</p>
        </div>
        <li
          v-for="(item, i) in press"
          :key="i"
          class="columns-Item columns-ColumnPress_Item"
        >
          <div class="columns-ColumnPress_Title">
            <h1>"{{ item.content.title }}"</h1>
          </div>
          <div class="columns-ColumnPress_Source">
            <p>{{ item.content.source }}</p>
          </div>
        </li>
      </div>
      <div class="columns-Column columns-ColumnWork scrollFast">
        <div class="columns-Header columns-ColumnWork_Header">
          <p>Work</p>
          <p>filter</p>
        </div>
        <li v-for="(item, i) in work" :key="i" class="columns-Item">
          <div class="columns-ColumnWork_Image">
            <img
              v-if="item.cover_image"
              v-lazy="transformImage(item.cover_image.filename, '1600x0')"
              :srcset="
                `${transformImage(item.cover_image.filename, '2880x0')} 2880w, 
              ${transformImage(item.cover_image.filename, '2560x0')} 2560w, 
              ${transformImage(item.cover_image.filename, '1920x0')} 1920w, 
              ${transformImage(item.cover_image.filename, '1680x0')} 1680w, 
              ${transformImage(item.cover_image.filename, '1280x0')} 1280w,
              ${transformImage(item.cover_image.filename, '1024x0')} 1024w, 
              ${transformImage(item.cover_image.filename, '768x0')} 768w`
              "
              sizes="100vw"
              class="lazy"
              :alt="item.cover_image.name || item.cover_image.title"
            />
          </div>
          <div class="columns-ColumnWork_Title">
            <h1>{{ item.content.title || item.name }}</h1>
          </div>
          <div class="columns-ColumnWork_Excerpt">
            <Markdown :input="item.content.excerpt" />
          </div>
        </li>
      </div>
      <div class="columns-Column columns-ColumnCalendar scrollSlow">
        <div class="columns-Header columns-ColumnCalendar_Header">
          <p>Calendar</p>
          <p>filter</p>
        </div>
        <ul class="">
          <li
            v-for="(item, i) in calendarList"
            :key="i"
            class="columns-Item columns-ColumnCalendar_Content"
          >
            <div class="columns-ColumnCalendar_Content_Date">
              <p>{{ item.content.date }}</p>
            </div>
            <div class="columns-ColumnCalendar_Content_Title">
              <p>{{ item.content.text || item.title }}</p>
            </div>
            <!-- <div class="columns-ColumnCalendar_Content_Location">
              <p>{{ item.content.location }}</p>
            </div> -->
          </li>
        </ul>
      </div>
    </section>
    <component
      :is="story.content.component | dashify"
      v-if="story.content.component"
      :key="story.content._uid"
      :blok="story.content"
    ></component>
  </div>
</template>

<script>
import { mapState } from "vuex"
import storyblokLivePreview from "@/mixins/storyblokLivePreview"
import onPageLoad from "@/mixins/onPageLoad"

export default {
  mixins: [storyblokLivePreview, onPageLoad],
  asyncData(context) {
    return context.app.$storyapi
      .get("cdn/stories/home", {
        version: process.env.NODE_ENV == "production" ? "published" : "draft"
      })
      .then(res => {
        return res.data
      })
      .catch(res => {
        if (!res.response) {
          console.error(res)
          context.error({
            statusCode: 404,
            message: "Failed to receive content form api"
          })
        } else {
          console.error(res.response.data)
          context.error({
            statusCode: res.response.status,
            message: res.response.data
          })
        }
      })
  },
  data() {
    return {
      story: { content: {} },
      calendarList: []
    }
  },
  head() {
    return {
      title: this.story.name + " — SITE TITLE"
    }
  },
  computed: {
    ...mapState({
      work: state => state.work.list,
      press: state => state.press.list,
      calendar: state => state.calendar.list
    })
  },
  mounted() {
    this.dateFormating()
    console.log("INDEX", this.story)
    console.log("INDEX WORK", this.work)
    console.log("INDEX PRESS", this.press)
    console.log("INDEX CALENDAR", this.calendar)
  },
  methods: {
    transformImage(image, option) {
      if (!image) return ""
      if (!option) return ""
      let imageService = "//img2.storyblok.com/"
      let pathOne = image.replace("https://a.storyblok.com", "")
      let pathTwo = pathOne.replace("//a.storyblok.com", "")
      return imageService + option + pathTwo
    },
    dateFormating() {
      var array = Array.from(this.calendar)
      array.forEach(el => {
        return (el.content.date = el.content.date
          .slice(0, 10)
          .replaceAll("-", "."))
      })
      this.calendarList = array
    }
  }
}
</script>
