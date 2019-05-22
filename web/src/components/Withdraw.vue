<template>
 <div class='withdraw-info' v-on:click="toggleHidden">
     <h1 align="center"><strong>Withdraw</strong></h1>
     <b-container fluid v-if="!isHidden">
        <b-row class="my-1">
            <b-col sm="2">
            <label for="input-small">from_x:</label><br/>
            <label for="input-small">from_y:</label><br/>
            <label for="input-small">amount:</label><br/>
            <label for="input-small">token:</label><br/>
            <label for="input-small">txRoot:</label><br/>
            </b-col>
            <b-col sm="10">
            <b-form-input id="input-small" v-model="from_x" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="from_y" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="amount" size="sm"></b-form-input>
            <b-form-input id="input-small" v-model="token_type_from" size="sm"></b-form-input>
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
                    "0x24da287f055f2e76488ff77064decffa83e13ed4e4ad2ee44d4a1be6a7322b41", 
                    "0x2669b601920c8a11cb9c1020c7c0aac55ca0d9e3737164acc831b6986dba302d"
                ],
                b: [
                    ["0x07b4e64317b68ff3cf82d9c3211a6abe1933f212e44d5d5405c4823c44da77b3", 
                    "0x0a38f9bcda6de56ac1bf09d93f2909946e773fa7de8f759f8594bc6786cfda32"],
                    ["0x177019cb641cb8575f9c6ef2b865d60d3437384f13bd311c69fa292da8f08ef1", 
                    "0x1c404343b258e15d3f41b6959ea68edd0959ca62faa9a5cfbcc6667295c6644d"]
                ],
                c: [
                    "0x12ba49b6986c922dbaf6f2cf3275419f01609efef6ec556ae1a2a0fae044741e", 
                    "0x139ea53ae557c85f1d62e34fab0065b74309db7c3b28f14542c0b7e37a0da9c5"
                ]
            }
        },

        methods: {
            clickWithdraw ()  {
                this.withdrawTx = null
                this.withdrawEvent = null
                this.pendingEvent = true
                this.pendingTx = true

                this.$store.state.contractInstance().methods.withdraw(
                    [this.from_x, this.from_y], [0,0], 
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

