<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>For all your FPL Analysing needs.</p>

    <h3>Messenger Chat Bot</h3>
    <a href="https://m.me/104837147545295" target="_blank" rel="noopener">
      <img
        border="0"
        alt="FPL Analyser logo"
        src="../assets/facebook_messenger.png"
        width="100"
        height="100"
      />
    </a>
    <h3>Essential Links</h3>
    <ul>
      <li>
        <a href="https://fantasy.premierleague.com/" target="_blank" rel="noopener">Official Fantasy Premier League</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
