/*

1. user fills in from_x, from_y, nonce, amount, token_type, txRoot, recipient
2. server gets position, proof
3. user signs M = hash([nonce, recipient]) 
    -> SNARK input.json is {Ax, Ay, R8x, R8y, S, M}
4. pass input.json to SNARK circuit, calculatewitness -> witness.json -> witness.bin
5. websnark generates proof (a, b, c) using witness.bin and (existing) proving_key.bin
6. send withdraw([from_x, from_y], [nonce, amount, token_type], [position, proof], 
    txRoot, recipient, a, b, c)

*/

const snarkjs = require("snarkjs");
const eddsa = require("@/circomlib/src/eddsa.js");
const mimcjs = require("@/circomlib/src/mimc7.js");
const bigInt = snarkjs.bigInt;
const buildWitness = require("./buildwitness")
// const stringifyBigInts = require("../circomlib/src/stringifybigint.js");

module.exports = {

    signWithdrawMessage: function(nonce, recipient, pubKey, prvKey){
        var M = mimcjs.multiHash([nonce, bigInt(recipient)])
        var signature = eddsa.signMiMC(prvKey, M);
        const inputs = {
            Ax: pubKey[0].toString(),
            Ay: pubKey[1].toString(),
            R8x: signature.R8[0].toString(),
            R8y: signature.R8[1].toString(),
            S: signature.S.toString(),
            M: M.toString()
        }
        return inputs
    },

    generateProof: function(witness, provingKey){
        console.log('witness', witness)
        console.log('provingKey', provingKey)
        var proof
        window.genZKSnarkProof(witness, provingKey).then((p)=> {
            proof = JSON.stringify(p, null, 1);
        });
        return proof
    },

    calculateWitness: function(cirDef, inputs){
        circuit = new snarkjs.Circuit(cirDef);
        witness = circuit.calculateWitness(inputs);
        witnessBin = buildWitness.buildWitness(witness)
        return witnessBin
    }

}