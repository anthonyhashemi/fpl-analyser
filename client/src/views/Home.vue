<template>
  <div class="home">
    <img alt="FPL Analyser logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to FPL Analyser"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  }
}
</script>
