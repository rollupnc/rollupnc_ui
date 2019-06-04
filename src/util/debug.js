const account = require('./getters/getAccount.js')

const privkey = account.generatePrvKey()
const pubkey = account.generatePubKey(privkey)

console.log(pubkey)