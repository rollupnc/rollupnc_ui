<template>
  <div class="eddsa-info" align="left">
        <strong>EdDSA pubkey: </strong> <br/>
        x: {{ pubkey.split(',')[0] }} <br/>
        y: {{ pubkey.split(',')[1] }} <br/><br/>
        <button @click="newWallet">Generate EdDSA wallet</button>
        <button v-on:click="showPrivkey">Show EdDSA private key</button>        

    </div>
    
</template>

<style scoped>
.eddsa-info {
  padding-left: 42%; 
  margin-left: -300px;
}
</style>

<script>
    var getAccount = require('@/util/getAccount.js')
    export default{
        name: 'EdDSA',
        data () {
          return {
            pubkey: '',
            privkey: ''
          }
        },
        mounted () {
          if (localStorage.getItem('pubkey')) {
            this.pubkey = localStorage.getItem('pubkey')
            this.privkey = localStorage.getItem('privkey')
          }
        },
        methods: {
          newWallet() {
            this.privkey = getAccount.generatePrvKey()
            this.pubkey = getAccount.generatePubKey(this.privkey).toString()
            localStorage.setItem('privkey', this.privkey)
            localStorage.setItem('pubkey', this.pubkey.toString())
          },
          showPrivkey() {
            alert(localStorage.privkey)
          }
        }
    }
</script>
