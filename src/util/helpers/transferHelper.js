const axios = require('axios')
const {server} = require('../constants/server')
const eddsa = require("@/circomlib/src/eddsa.js");
const mimcjs = require("@/circomlib/src/mimc7.js");

module.exports = {

    signTransfer: function(from_x, from_y, to_x, to_y, amount, token_type, prvKey){
        var M = mimcjs.multiHash([
            from_x.toString(), 
            from_y.toString(), 
            to_x.toString(), 
            to_y.toString(), 
            amount, 
            token_type])
        var signature = eddsa.signMiMC(prvKey, M);
        return {
            R8: signature.R8,
            S: signature.S
        }
    },

    sendTransfer: function(from_x, from_y, to_x, to_y, amount, token_type, signature){
        var input = {
            "fromX": from_x.toString(),
            "fromY": from_y.toString(),
            "toX": to_x.toString(),
            "toY": to_y.toString(),
            "amount": amount,
            "tokenType": token_type,
            "signature":{
                "R8": signature.R8[0].toString() + ',' + signature.R8[1].toString(),
                "S": signature.S.toString()
            }
        }
        return axios({
            method: "POST",
            "url": server.url + "/submitTx",
            "data": input,
            "headers": {
                "content-type": "application/json",
                "postman-token": "6a5d7f6b-2189-4b7b-81c8-dd62067217a4",
                "cache-control": "no-cache"
            }
        })
    }

}
