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
    <div class="withdraw-button" v-if="!isHidden">
        <h5 v-on:click = "getProof"><strong>1. Get Merkle proof</strong></h5>
     </div>
     <div class="withdraw-button" v-if="!isHidden">
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
                    "0x0d3772db6cc4d2b1a4025d700206c1fd0d04123c57b225514d495ceac2d003e8", 
                    "0x059fa3f88b05a429eafbdce88c356d98f8c56649236166b59beb38758e195844"
                ],
                b: [
                    ["0x10814e3178070cdc64fb425339ae573904f89a2d9415574786ef8567dda2c35a", 
                    "0x1c278bf0eb57839134205593e38022badd9d3886097232457630879365d351cf"],
                    ["0x1db5070c455a7e70d46bc924dc9a83eb0d5b714bed13c0fab773e4385376cac6", 
                    "0x12e5683544ef3d8448e6fc7932d19b61160a94eac76c0b59b983caffe1cfbcea"]
                ],
                c: [
                    "0x08da1d82340d24e7482d330290a7a72b38bbda66334f9acf0257e38e9ff2b01a", 
                    "0x0b288814628f4e9b4c1b3bcf736f88fdc31b6c50705d5d49a21d38fbc071b775"
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
                    [this.from_x, this.from_y], this.amount, this.token_type_from, 
                    this.proof, this.position, this.txRoot, this.recipient,
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

