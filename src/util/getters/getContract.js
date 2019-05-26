import Web3 from 'web3'
import {address, ABI} from '../constants/rollupNCContract'

// let web3 = new Web3(window.web3.currentProvider)
// var getContract = new web3.eth.Contract(ABI, address)
// console.log('hi', getContract)

let getContract = new Promise(function (resolve, reject) {
    const options = {
        defaultBlock: "latest",
        transactionConfirmationBlocks: 1,
        transactionBlockTimeout: 5
    }
    let web3 = new Web3(window.web3.currentProvider, null, options)

    // console.log(web3)
    const rollupNCContractInstance = new web3.eth.Contract(ABI, address)
    // console.log('rollupNCContractInstance', rollupNCContractInstance)
    resolve(rollupNCContractInstance)
})

export default getContract
