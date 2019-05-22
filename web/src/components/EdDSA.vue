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
  width: 100%;
  padding-left: 20%; 
  /* margin-left: -300px; */
  white-space: wrap;
  /* width: 100%;                   IE6 needs any width */
  /* overflow: hidden;              /* "overflow" value must be different from  visible"*/ 
  /* -o-text-overflow: ellipsis;    Opera < 11 */
  /* text-overflow:    ellipsis;   */
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
