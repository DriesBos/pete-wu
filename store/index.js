export const state = () => ({
  cacheVersion: ""
})

export const mutations = {
  setCacheVersion(state, version) {
    state.cacheVersion = version
  }
}

export const actions = {
  loadCacheVersion({ commit }) {
    return this.$storyapi.get(`cdn/spaces/me`).then(res => {
      commit("setCacheVersion", res.data.space.version)
    })
  }
}

export default {
  actions: {
    async nuxtServerInit({ commit }, { app }) {
      let getWork = await app.$storyapi.get("cdn/stories", {
        version: process.env.NODE_ENV === "production" ? "published" : "draft",
        starts_with: "work/"
      })
      let work = getWork.data.stories.map(bp => {
        return {
          id: bp.slug,
          content: bp.content
        }
      })
      commit("work/update", work)

      let getPress = await app.$storyapi.get("cdn/stories", {
        version: process.env.NODE_ENV === "production" ? "published" : "draft",
        starts_with: "press/"
      })
      let press = getPress.data.stories.map(bp => {
        return {
          id: bp.slug,
          content: bp.content
        }
      })
      commit("press/update", press)

      let getCalendar = await app.$storyapi.get("cdn/stories", {
        version: process.env.NODE_ENV === "production" ? "published" : "draft",
        starts_with: "calendar/"
      })
      let calendar = getCalendar.data.stories.map(bp => {
        return {
          id: bp.slug,
          title: bp.name,
          content: bp.content
        }
      })
      commit("calendar/update", calendar)
    }
  }
}
