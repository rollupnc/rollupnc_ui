<template>
 <div class='transfer-info'>
     <h1 align="center"><strong>Transfer</strong></h1><br/>
     <b-container fluid>
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
    <br/>
     <div class="transfer-button">
        <h5 v-on:click = "clickTransfer"><strong>Submit</strong></h5>
     </div>
    <img class="center" v-if="pendingTx" id="loader" src="https://loading.io/spinners/lava-lamp/index.lava-lamp-preloader.gif"><br/><br/>
    <div class="tx" v-if="transferTx" align = "left">
        <strong>Tx hash:</strong> <a :href ="'https://ropsten.etherscan.io/tx/' + transferTx" target="_blank" style="color:#4682b4">{{ transferTx }}</a>
    </div>
    <div v-if="transferEvent" align="left">
        <strong>From (EdDSA):</strong> {{ transferEvent.from[0] }}, {{ transferEvent.from[1] }} <br/>
        <strong>Amount:</strong> {{ transferEvent.amount }} <br/>
        <strong>Token type:</strong> {{ transferEvent.token_type }}
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
        margin-left: 15%;
        padding: 20px;
        /* display: inline-block; */
        text-align:left;
        border: 1px solid black;
        background-color:#FFFAFA; 
        width: 70%;
        /* padding-left: 10%;  */
        white-space: wrap;
        /* width: 100%;                   IE6 needs any width */
        overflow: hidden;              /* "overflow" value must be different from  visible"*/ 
        -o-text-overflow: ellipsis;    /* Opera < 11*/
        text-overflow:    ellipsis; 
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
    export default {
        name: 'Transfer',
        mounted () {
            // console.log('dispatching getContractInstance')
            this.$store.dispatch('getContractInstance')
        },
        data () {
            return {
                pendingTx: false,
                pendingEvent: false,
                transferEvent: null,
                transferTx: null,
                from_x: "5188413625993601883297433934250988745151922355819390722918528461123462745458",
                from_y: "12688531930957923993246507021135702202363596171614725698211865710242486568828",
                to_x: "5188413625993601883297433934250988745151922355819390722918528461123462745458",
                to_y: "12688531930957923993246507021135702202363596171614725698211865710242486568828",
                amount: 500,
                token_type_from: 10
            }
        },

        methods: {
            clickTransfer ()  {
                this.transferTx = null
                this.transferEvent = null
                this.pendingEvent = true
                this.pendingTx = true

                // this.$store.state.contractInstance().methods.deposit(
                //     [this.from_x, this.from_y], this.amount, this.token_type_from)
                //     .send(
                //     {
                //         // gas: 300000,
                //         from: this.$store.state.web3.coinbase
                //     }, 
                //     (err, result) => {
                //         if (err) {
                //             console.log(err)
                //         } else {
                //             this.pendingTx = false
                //             this.depositTx = result
                //             this.$store.state.contractInstance().events.Deposit( 
                //                 {fromBlock: 0, toBlock: 'latest'}, (error, event) => {}
                //             )
                //             .on('data', (event) => {
                //                 this.depositEvent = event['returnValues']
                //                 console.log(this.depositEvent)
                //                 this.pendingEvent = true
                //             })
                //             .on('error', console.error)
                //         }
                //     })
            }
        }
    }

</script>

