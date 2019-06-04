<template>
  <div class="metamask-info" align="left">
    <p>
      <strong>Metamask:</strong>
      {{ web3.isInjected }}
      <div v-if="!web3.isInjected"> (please turn off privacy mode)</div>
    </p>
    <p>
      <strong>Network:</strong>
      {{ web3.networkId }}
    </p>
    <p>
      <strong>Account:</strong>
      {{ web3.coinbase }}
    </p>
    <p>
      <strong>Balance:</strong>
      {{ web3.balance }}
    </p>
  </div>
</template>

<script>
export default {
  name: "Metamask",
  computed: {
    web3() {
      return this.$store.state.web3;
    }
  }
};
</script>
<style scoped>
.metamask-info {
  width: 100%;
  padding-left: 20%; 
  /* margin-left: -300px; */
}
</style>