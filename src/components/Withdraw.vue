<template>
 <div class='withdraw-info' v-on:click="toggleHidden">
     <h1 align="center"><strong>Withdraw</strong></h1>
     <b-container fluid v-if="!isHidden">
        <b-row class="my-1">
            <b-col sm="2">
            <label for="input-small">from_x:</label><br/>
            <label for="input-small">from_y:</label><br/>
            <label for="input-small">nonce:</label><br/>
            <label for="input-small">amount:</label><br/>
            <label for="input-small">token:</label><br/>
            <label for="input-small">recipient:</label><br/>
            <label for="input-small">txRoot:</label><br/>
            </b-col>
            <b-col sm="10">
            <b-form-input id="input-small" v-model="from_x" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="from_y" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="nonce" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="amount" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="token_type_from" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="recipient" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="txRoot" size="sm"></b-form-input>
            </b-col>
        </b-row>
    </b-container>
    <div class="withdraw-button" v-if="!isHidden" v-on:click="toggleHidden">
        <h5 v-on:click = "getProof"><strong>1. Get Merkle proof</strong></h5>
     </div>
     <div class="withdraw-button" v-if="!isHidden" v-on:click="toggleHidden">
        <h5 v-on:click = "clickWithdraw"><strong>2. Sign and submit</strong></h5>
     </div>
    <img class="center" v-if="pendingTx" id="loader" src="https://loading.io/spinners/lava-lamp/index.lava-lamp-preloader.gif">
    <div class="tx" v-if="withdrawTx" align = "left">
        <strong>Tx hash:</strong> <a :href ="'https://ropsten.etherscan.io/tx/' + withdrawTx" target="_blank" style="color:#4682b4">{{ withdrawTx }}</a>
    </div>
    <div v-if="withdrawEvent" align="left">
        <strong>From (EdDSA):</strong> {{ withdrawEvent.from[0] }}, {{ withdrawEvent.from[1] }} <br/>
        <strong>To (Ethereum):</strong> {{ withdrawEvent.recipient }} <br/>
        <strong>Amount:</strong> {{ withdrawEvent.amount }} <br/>
        <strong>Token type:</strong> {{ withdrawEvent.token_type }}
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
    .withdraw-info {
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
    .withdraw-info:hover{
        background-color:#FFDAB9;
        color:#444444;
        box-shadow:0px 0px #FFDAB9;
    }
    .withdraw-button {
        padding: 10px;
        /* display: inline-block; */
        text-align:center;
        border: 1px solid black;
        height: 50px;
        width: 300px;
        margin: 20px auto;
        background-color:#F5DEB3;
    }
    .withdraw-button:hover{
        background-color:#FFEBCD;
        color:#444444;
        box-shadow:0px 0px #FFEBCD;
    }
    .withdraw-button:active{
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
        name: 'Withdraw',
        mounted () {
            // console.log('dispatching getContractInstance')
            this.$store.dispatch('getContractInstance')
        },
        data () {
            return {
                isHidden: true,
                pendingTx: false,
                pendingEvent: false,
                withdrawEvent: null,
                withdrawTx: null,
                from_x: "5188413625993601883297433934250988745151922355819390722918528461123462745458",
                from_y: "12688531930957923993246507021135702202363596171614725698211865710242486568828",
                nonce: 0,
                amount: 500,
                token_type_from: 10,
                proof: [
                    "8342813455761320245860753246541064453130959347426759535493956280345855081934",
                    "13262889801219401015313652374233039919049275140584211861348878621716455310933"
                ],
                position: [1, 0],
                txRoot: "149126198147162084281232535967801344773039936115368629187002798446712412021",
                recipient: "0xC33Bdb8051D6d2002c0D80A1Dd23A1c9d9FC26E4",
                a: [
                    "0x096ed4c35159f0c371729082cc18d323135be5ae410fb4ba313595a666ed530c", 
                    "0x2995f1640c8d4da98cde2ef61af64b2927c95c2946455247877643cca3b39db6"],
                b: [
                    ["0x1adbee8bcfa45824a5ebe904176b4f161282fbea31ff5954c7e49466f38e295f", 
                    "0x249ba84b42ab6c8d0bf91b9d9f77069ba1c16f8d446eab203480c82819cea03d"],
                    ["0x085780756487e6ed337d5a7cb362afaec168bd762df5ce93342894e1ca6dcdea", 
                    "0x16deb6ed5cfe8c6457a9e5bd041fd8fc3e63efe88011a6252bea3e048f1b5737"]],
                c: [
                    "0x0486ae4189391ac3e03d03585fc4091ffea326e1f22bebac56883c586a1b6e82", 
                    "0x034c0ae8bd353e82c697d227a8b2c7ae405a28dc9f4f3bd7a23f96947b71e400"]
            }
        },

        methods: {
            clickWithdraw ()  {
                this.withdrawTx = null
                this.withdrawEvent = null
                this.pendingEvent = true
                this.pendingTx = true

                this.$store.state.contractInstance().methods.withdraw(
                    [this.from_x, this.from_y], 
                    [this.nonce, this.amount, this.token_type_from], 
                    [this.position, this.proof], this.txRoot, this.recipient,
                    this.a, this.b, this.c).send(
                    {
                        // gas: 300000,
                        from: this.$store.state.web3.coinbase
                    }, 
                    (err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            this.pendingTx = false
                            this.withdrawTx = result
                            this.$store.state.contractInstance().events.Withdraw( 
                                {fromBlock: 0, toBlock: 'latest'}, (error, event) => {}
                            )
                            .on('data', (event) => {
                                this.withdrawEvent = event['returnValues']
                                console.log(this.withdrawEvent)
                                this.pendingEvent = true
                            })
                            .on('error', console.error)
                        }
                    })
            },

            getProof () {

            },

            toggleHidden (){
                this.isHidden = !this.isHidden
            }
        }
    }

</script>

