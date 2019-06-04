// const eddsa = require("@/circomlib/src/eddsa.js");
const eddsa = require("../../circomlib/src/eddsa.js");
// const snarkjs = require("snarkjs");

module.exports = {
    
    generatePrvKey: function(){
        var seed = Math.random().toString().slice(2,66).padStart(64, '0');
        return seed;  
    },

    generatePubKey: function(seed){
        var prvKey = Buffer.from(seed.toString(), "hex");
        var pubKey = eddsa.prv2pub(prvKey);
        return pubKey; 
    }

}
