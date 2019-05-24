const bigInt = require("big-integer");
const assert = require("assert");

module.exports = {

    writeUint32: function(h, val) {
        h.dataView.setUint32(h.offset, val, true);
        h.offset += 4;
    },
    
    
    writeBigInt: function(h, bi) {
        for (let i=0; i<8; i++) {
            bi = bigInt(bi)
            const v = bi.shiftRight(i*32).and(0xFFFFFFFF).toJSNumber();
            this.writeUint32(h, v);
        }
    },
    
    
    calculateBuffLen: function(witness) {
    
        let size = 0;
    
        // beta2, delta2
        size += witness.length * 32;
    
        return size;
    },
    
    buildWitness: function(witness){
        const buffLen = this.calculateBuffLen(witness);
    
        const buff = new ArrayBuffer(buffLen);
    
        const h = {
            dataView: new DataView(buff),
            offset: 0
        };
    
    
        // writeUint32(h, witness.length);
    
        for (let i=0; i<witness.length; i++) {
            this.writeBigInt(h, witness[i]);
        }

        assert.equal(h.offset, buffLen);

        var wstream = fs.createWriteStream('witness.bin');
        wstream.write(Buffer.from(buff));
        wstream.end();
    
    }
}

