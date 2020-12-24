<template>
  <header class="header">
    <div class="header-Logo">
      <h1>Pete Wu</h1>
    </div>
    <nav class="header-Nav">
      <ul>
        <nuxt-link to="/" tag="li">Home</nuxt-link>
        <nuxt-link to="/blog" tag="li">Blog</nuxt-link>
        <nuxt-link to="/about" tag="li">About</nuxt-link>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: "TheNavigation"
}
</script>

<style lang="sass">
.header
  position: fixed
  left: 0
  top: 0
  right: 0
  display: flex
  justify-content: space-between
  color: white
  &-Logo
    padding: 1rem
  &-Nav
    ul
      display: flex
      justify-content: flex-end
      li
        padding: 1rem .5rem
        cursor: pointer
      li:last-child
        padding-right: 1rem
    .nuxt-link-exact-active
      text-decoration: underline
</style>
