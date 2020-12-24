<template>
  <div v-editable="story.content" class="page-Index">
    <section class="columns">
      <ul class="columns-Column columns-ColumnPress">
        <li>
          <p>Press</p>
          <p>filter</p>
        </li>
        <li v-for="(item, i) in press" :key="i">
          <component
            :is="blok.component | dashify"
            v-for="blok in item.content.body"
            :key="blok._uid"
            :blok="blok"
          ></component>
        </li>
      </ul>
      <ul class="columns-Column columns-ColumnWork scrollFast">
        <li>
          <p>Work</p>
          <p>filter</p>
        </li>
        <li v-for="(item, i) in work" :key="i">
          <component
            :is="blok.component | dashify"
            v-for="blok in item.content.body"
            :key="blok._uid"
            :blok="blok"
          ></component>
        </li>
      </ul>
      <div class="columns-Column columns-ColumnCalendar scrollSlow">
        <div class="columns-Header">
          <p>Calendar</p>
          <p>filter</p>
        </div>
        <ul class="">
          <li
            v-for="(item, i) in calendarList"
            :key="i"
            class="columns-ColumnCalendar_Content"
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
