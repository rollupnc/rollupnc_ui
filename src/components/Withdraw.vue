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
        <h5 v-on:click = "getMerkleProof"><strong>1. Get Merkle proof</strong></h5>
     </div>
     <div class="withdraw-button" v-if="!isHidden" v-on:click="toggleHidden">
        <h5 v-on:click = "getSnarkProof"><strong>2. EdDSA sign</strong></h5>
     </div>
     {{ p }}
    <b-container fluid v-if="pendingSign" v-on:click="toggleHidden">
        <b-row class="my-1">
            <b-col sm="2">
            <label for="input-small">a:</label><br/>
            <label for="input-small">b:</label><br/>
            <label for="input-small">c:</label><br/>
            </b-col>
            <b-col sm="10">
            <b-form-input id="input-small" placeholder="calculating..." v-model="a"  size="sm"></b-form-input>
            <b-form-input id="input-small" placeholder="calculating..." v-model="b" size="sm"></b-form-input>
            <b-form-input id="input-small" placeholder="calculating..." v-model="c" size="sm"></b-form-input>
            </b-col>
        </b-row>
    </b-container>
    <div class="withdraw-button" v-if="!isHidden" v-on:click="toggleHidden">
        <h5 v-on:click = "clickWithdraw"><strong>3. Submit to contract</strong></h5>
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
    var websnark = require('@/util/websnark.js')
    var withdrawSNARK = require('@/util/withdrawSNARK.js')
    const circuit = require('@/util/constants/circuit.json')
    const axios = require('axios')

    export default {
        name: 'Withdraw',
        mounted () {
            // console.log('dispatching getContractInstance')
            this.$store.dispatch('getContractInstance')
            this.loadProvingKey()
        },
        data () {
            return {
                isHidden: true,
                pendingTx: false,
                pendingSign: false,
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
                    "0x0e5efd8a44293b095bbdbb9a8287441d8b5b2c6dedfaa207f577172f46312410", 
                    "0x2521380fdcd0c73c89f2a59d225f7f4466ae42d672df378db313ed4208a3d4ab"],
                b: [
                    ["0x073775ec222b693ef64383882a159f273e898ddd5196897a1ba490311c59436e", 
                    "0x118fd15a8551104fd41fe2aa62f34abee48b1ceb6726be1010c01a31001ef067"],
                    ["0x1ec9f5676da318675a843282edc160af47fcdcebb790f7522daf5898ad8de76f", 
                    "0x1696d6058c0522472b8b78f2c9a9355173df714f7b062f1206c3f129d717dc34"]],
                c: [
                    "0x185a6e0a2cbe5a05e41a6dfc94358f31668eea7e393693d65219072bc3a0225d", 
                    "0x1abb9477cc7e04faeebf409331d554738161775ce07364e275830f0d517285de"],
                provingKey: null,
                witness: null,
                privkey: Buffer.from("2".padStart(64,'0'), "hex"),
                p: null
            }
        },

        methods: {
            loadProvingKey () {
                fetch("http://raw.githubusercontent.com/therealyingtong/rollupnc_ui/master/src/assets/proving_key.bin")
                .then( (response) => {
                    return response.arrayBuffer();
                }).then( (b) => {
                    this.provingKey = b;
                })
            },

            getSnarkProof ()  {
                this.withdrawTx = null
                this.withdrawEvent = null
                this.pendingEvent = true
                this.pendingTx = false
                this.pendingSign = true

                var snarkInputs = withdrawSNARK.signWithdrawMessage(
                    this.nonce, this.recipient, [this.from_x, this.from_y], this.privkey
                )
                console.log(snarkInputs)

                this.witness = withdrawSNARK.calculateWitness(circuit, snarkInputs)
                window.genZKSnarkProof(this.witness, this.provingKey).then((p)=> {
                    this.p = p
                    console.log(p)
                    var call = withdrawSNARK.generateCall(p)
                    console.log("call", call)
                    this.a = call.a
                    this.b = call.b
                    this.c = call.c                
                })
            },

            clickWithdraw () {
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

            getMerkleProof () {

            },

            toggleHidden (){
                this.isHidden = !this.isHidden
            },

            
        }
    }

</script>

