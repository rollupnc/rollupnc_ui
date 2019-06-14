<template>
 <div class='deposit-info' v-on:click="toggleHidden">
     <h1 align="center"><strong>Deposit</strong></h1>
     <b-container fluid v-if="!isHidden" v-on:click="toggleHidden">
        <b-row class="my-1">
            <b-col sm="2">
            <label for="input-small">from_x:</label><br/>
            <label for="input-small">from_y:</label><br/>
            <label for="input-small">amount:</label><br/>
            <label for="input-small">token:</label><br/>
            </b-col>
            <b-col sm="10">
            <b-form-input id="input-small" v-model="from_x" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="from_y" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="amount" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="token_type_from" size="sm"></b-form-input>
            </b-col>
        </b-row>
    </b-container>
     <div class="deposit-button" v-if="!isHidden" v-on:click="toggleHidden">
        <h5 v-on:click = "clickDeposit()"><strong>Submit</strong></h5>
     </div>
    <img class="center" v-if="pendingTx" id="loader" src="https://loading.io/spinners/lava-lamp/index.lava-lamp-preloader.gif">
    <div class="tx" v-if="depositTx" align = "left">
        <strong>Tx hash:</strong> <a :href ="'https://ropsten.etherscan.io/tx/' + depositTx" target="_blank" style="color:#4682b4">{{ depositTx }}</a>
    </div>
    <div v-if="depositEvent" align="left">
        <strong>From (EdDSA):</strong> {{ depositEvent.from[0] }}, {{ depositEvent.from[1] }} <br/>
        <strong>Amount:</strong> {{ depositEvent.amount }} <br/>
        <strong>Token type:</strong> {{ depositEvent.token_type }}
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
    .deposit-info {
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
    .deposit-info:hover{
        background-color:#FFDAB9;
        color:#444444;
        box-shadow:0px 0px #FFDAB9;
    }
    .deposit-button {
        padding: 10px;
        /* display: inline-block; */
        text-align:center;
        border: 1px solid black;
        height: 50px;
        width: 300px;
        margin: 20px auto;
        background-color:#F5DEB3;
    }
    .deposit-button:hover{
        background-color:#FFEBCD;
        color:#444444;
        box-shadow:0px 0px #FFEBCD;
    }
    .deposit-button:active{
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
        name: 'Deposit',
        mounted () {
            // console.log('dispatching getContractInstance')
            this.$store.dispatch('getContractInstance')
        },
        data () {
            return {
                isHidden: true,
                pendingTx: false,
                pendingEvent: false,
                depositEvent: null,
                depositTx: null,
                from_x: "5188413625993601883297433934250988745151922355819390722918528461123462745458",
                from_y: "12688531930957923993246507021135702202363596171614725698211865710242486568828",
                amount: 500,
                token_type_from: 1
            }
        },

        methods: {
            clickDeposit ()  {
                this.depositTx = null
                this.depositEvent = null
                this.pendingEvent = true
                this.pendingTx = true

                this.$store.state.contractInstance().methods.deposit(
                    [this.from_x, this.from_y],
                    this.amount, this.token_type_from).send(
                    {
                        // gas: 300000,
                        from: this.$store.state.web3.coinbase,
                        value: this.amount
                    }, 
                    (err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            this.pendingTx = false
                            this.depositTx = result
                            this.$store.state.contractInstance().events.Withdraw( 
                                {fromBlock: 0, toBlock: 'latest'}, (error, event) => {}
                            )
                            .on('data', (event) => {
                                this.depositEvent = event['returnValues']
                                console.log(this.depositEvent)
                                this.pendingEvent = true
                            })
                            .on('error', console.error)
                        }
                    })
            },

            toggleHidden (){
                this.isHidden = !this.isHidden
            }
        }
    }

</script>

