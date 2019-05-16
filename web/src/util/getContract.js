import Web3 from 'web3'
import {address, ABI} from './constants/rollupNCContract'

let web3 = new Web3(window.web3.currentProvider)
var getContract = new web3.eth.Contract(ABI, address)
console.log(getContract)

// let getContract = new Promise(function (resolve, reject) {
//     let web3 = new Web3(window.web3.currentProvider)
//     let rollupNCContractInstance = new web3.eth.Contract(ABI, address)
//     console.log('rollupNCContractInstance', rollupNCContractInstance)
//     resolve(rollupNCContractInstance)
// })

export default getContract