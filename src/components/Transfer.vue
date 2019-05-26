<template>
 <div class='transfer-info' v-on:click="toggleHidden">
     <h1 align="center"><strong>Transfer</strong></h1>
     <b-container fluid v-if="!isHidden">
        <b-row class="my-1">
            <b-col sm="2">
            <label for="input-small">from_x:</label><br/>
            <label for="input-small">from_y:</label><br/>
            <label for="input-small">to_x:</label><br/>
            <label for="input-small">to_y:</label><br/>
            <label for="input-small">amount:</label><br/>
            <label for="input-small">token:</label><br/>

            </b-col>
            <b-col sm="10">
            <b-form-input id="input-small" v-model="from_x" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="from_y" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="to_x" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="to_y" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="amount" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="token_type_from" size="sm"></b-form-input>

            </b-col>
        </b-row>
    </b-container>
    <div class="transfer-button" v-if="!isHidden" v-on:click="toggleHidden">
        <h5 v-on:click = "signTransfer"><strong>1. Sign transaction</strong></h5>
     </div>
     <b-container fluid v-if="pendingSign">
        <b-row class="my-1">
            <b-col sm="2">
            <label for="input-small">R8:</label><br/>
            <label for="input-small">S:</label><br/>
            </b-col>
            <b-col sm="10">
            <b-form-input id="input-small" v-model="signature.R8" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="signature.S" size="sm"></b-form-input>
            </b-col>
        </b-row>
    </b-container>
     <div class="transfer-button" v-if="!isHidden" v-on:click="toggleHidden">
        <h5 v-on:click = "clickTransfer"><strong>2. Submit to RollupNC</strong></h5>
     </div>
    <img class="center" v-if="pendingTx" id="loader" src="https://loading.io/spinners/lava-lamp/index.lava-lamp-preloader.gif">
    <div v-if="transferEvent" align="left">
        {{ transferEvent }}
    </div>

 </div>
</template>

<style scoped>
    .center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
    }
    .transfer-info {
        margin-top: 20px;
        margin-left: auto;
        margin-right: auto;
        padding: 20px;
        /* display: inline-block; */
        text-align:left;
        border: 1px solid black;
        background-color:#FFFAFA; 
        width: 60%;
        /* padding-left: 10%;  */
        white-space: wrap;
        /* width: 100%;                   IE6 needs any width */
        overflow: hidden;              /* "overflow" value must be different from  visible"*/ 
        -o-text-overflow: ellipsis;    /* Opera < 11*/
        text-overflow:    ellipsis; 
    }
    .transfer-info:hover{
        background-color:#FFDAB9;
        color:#444444;
        box-shadow:0px 0px #FFDAB9;
    }
    .transfer-button {
        padding: 10px;
        /* display: inline-block; */
        text-align:center;
        border: 1px solid black;
        height: 50px;
        width: 300px;
        margin: 20px auto;
        background-color:#F5DEB3;
    }
    .transfer-button:hover{
        background-color:#FFEBCD;
        color:#444444;
        box-shadow:0px 0px #FFEBCD;
    }
    .transfer-button:active{
        opacity: 0.7;
    }
    #loader {
        width:150px;
    }
    *{
        color: #444444;
    }
</style>


<script>
    var transferHelper = require('@/util/helpers/transferHelper.js')

    export default {
        name: 'Transfer',
        mounted () {
            // console.log('dispatching getContractInstance')
            // this.$store.dispatch('getContractInstance')
        },
        data () {
            return {
                isHidden: true,
                pendingTx: false,
                pendingSign: false,
                sentTx: false,
                transferEvent: null,
                from_x: "5188413625993601883297433934250988745151922355819390722918528461123462745458",
                from_y: "12688531930957923993246507021135702202363596171614725698211865710242486568828",
                to_x: "5188413625993601883297433934250988745151922355819390722918528461123462745458",
                to_y: "12688531930957923993246507021135702202363596171614725698211865710242486568828",
                amount: 500,
                token_type_from: 10,
                signature: null,
                privkey: Buffer.from("2".padStart(64,'0'), "hex"),
            }
        },

        methods: {
            signTransfer () {
                this.pendingSign = true
                this.signature = transferHelper.signTransfer(
                    this.from_x, 
                    this.from_y, 
                    this.to_x, 
                    this.to_y, 
                    this.amount, 
                    this.token_type_from, 
                    this.privkey
                )
            },

            clickTransfer ()  {
                this.transferEvent = null
                this.pendingTx = true

                transferHelper.sendTransfer(
                    this.from_x, 
                    this.from_y, 
                    this.to_x, 
                    this.to_y, 
                    this.amount, 
                    this.token_type_from, 
                    this.signature
                )        
                .then(result => {
                    this.transferEvent = 'SUCCESS'
                    this.pendingTx = false
                    this.sentTx = true
                }, error => {
                    this.transferEvent = error
                    this.pendingTx = false
                })
            },

            toggleHidden (){
                this.isHidden = !this.isHidden
            }
        }
    }

</script>

