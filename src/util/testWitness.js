const cirDef = require('./constants/circuit.json')
const {buildWitness} = require('./buildwitness.js')
const snarkjs = require('snarkjs')
const fetch = require('node-fetch')

var witness_correct
var witness_computed

const from_x = "5188413625993601883297433934250988745151922355819390722918528461123462745458"
const from_y = "12688531930957923993246507021135702202363596171614725698211865710242486568828"
const nonce = 0
const amount = 500
const recipient = "0xC33Bdb8051D6d2002c0D80A1Dd23A1c9d9FC26E4"
const privkey = Buffer.from("2".padStart(64,'0'), "hex")


function loadWitness () {
    console.log('loading witness.bin from github')
    fetch("http://raw.githubusercontent.com/therealyingtong/rollupnc_ui/master/src/assets/witness.bin")
    .then( (response) => {
        return response.arrayBuffer();
    }).then( (b) => {
        witness_correct = b;
        console.log('correct witness', witness_correct)
        return b
    })
}

function calculateWitness(cirDef, inputs){
    circuit = new snarkjs.Circuit(cirDef);
    witness = circuit.calculateWitness(inputs);
    witnessBin = buildWitness(witness)
    return witnessBin
}

// compare ArrayBuffers
function arrayBuffersAreEqual(a, b) {
    return dataViewsAreEqual(new DataView(a), new DataView(b));
}
    
// compare DataViews
function dataViewsAreEqual(a, b) {
if (a.byteLength !== b.byteLength) return false;
for (let i=0; i < a.byteLength; i++) {
    if (a.getUint8(i) !== b.getUint8(i)) return false;
}
return true;
}

const snarkInputs = {"Ax":"5188413625993601883297433934250988745151922355819390722918528461123462745458","Ay":"12688531930957923993246507021135702202363596171614725698211865710242486568828","R8x":"11459298562454496338649670845404833534798114763805488568181093022343162412432","R8y":"1484307201893804134915444248937497223785545326866083443503026932719437983204","S":"869435779960466843075984388050010598953685128296046475751398382291815104858","M":"19127630463328723927961105968831675671634629440692613399060610273802859921632"}
witness_computed = calculateWitness(cirDef, snarkInputs)
setTimeout(
    function(){
        loadWitness()
        console.log('computed witness', witness_computed)
    }, 
5000);
setTimeout(
    function(){
        console.log(arrayBuffersAreEqual(witness_computed, witness_correct))
    },
10000)




