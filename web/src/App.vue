<template>
  <div id="app">
    <img alt="rollup logo" src="./assets/logo.png" height = "300px">
    <SubmitTx msg="Rollup Non-custodial"/>
  </div>
</template>

<script>
import SubmitTx from './components/SubmitTx.vue'

export default {
  name: 'app',
  components: {
    SubmitTx
  },
  created () {
    document.title = "rollupNC";
  }
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
