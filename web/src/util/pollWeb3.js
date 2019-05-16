import Web3 from 'web3'
import {store} from '../store/'

let pollWeb3 = async function (state) {
  let web3 = window.web3
  web3 = new Web3(web3.currentProvider)
  let accounts = await web3.eth.getAccounts()
  // console.log('account', accounts[0])

  setInterval(async () => {
    if (web3 && store.state.web3.web3Instance) {
      if (accounts !== store.state.web3.coinbase) {
        accounts = await web3.eth.getAccounts()
        web3.eth.getBalance(accounts[0], function (err, newBalance) {
          if (err) {
            console.log(err)
          } else {
            store.dispatch('pollWeb3', {
              coinbase: accounts[0],
              balance: parseInt(newBalance, 10)
            })
          }
        })
      } else {
        web3.eth.getBalance(store.state.web3.coinbase, (err, polledBalance) => {
          if (err) {
            console.log(err)
          } else if (parseInt(polledBalance, 10) !== store.state.web3.balance) {
            store.dispatch('pollWeb3', {
              coinbase: store.state.web3.coinbase,
              balance: polledBalance
            })
          }
        })
      }
    }
  }, 500)
}

export default pollWeb3