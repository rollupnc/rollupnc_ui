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
const {unstringifyBigInts} = require("@/util/stringifybigint.js");

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

    generateCall: function(p){
        proof =  unstringifyBigInts(p);
        function p256(n) {
            let nstr = n.toString(16);
            while (nstr.length < 64) nstr = "0"+nstr;
            nstr = "0x" + nstr;
            return nstr;
        }
        const call = {
            a: [p256(proof['pi_a'][0]), p256(proof["pi_a"][1])],
            b: [[p256(proof["pi_b"][0][1]), p256(proof["pi_b"][0][0])],[
                p256(proof["pi_b"][1][1]), p256(proof["pi_b"][1][0])]],
            c: [p256(proof["pi_c"][0]), p256(proof["pi_c"][1])]
        }
        return call
    },

    calculateWitness: function(cirDef, inputs){
        circuit = new snarkjs.Circuit(cirDef);
        witness = circuit.calculateWitness(inputs);
        witnessBin = buildWitness.buildWitness(witness)
        return witnessBin
    }

}