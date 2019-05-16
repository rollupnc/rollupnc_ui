<template>
  <div id="app">
    <img src="./assets/logo.png" height = "300px">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family:  "Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
button {
    font-family : inherit;
    font-size: 1em;
}
</style>
