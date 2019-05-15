<template>
  <div>
    <top-bar></top-bar>

    <div class="mobile-sub-header">ETH Balance</div>  
    <div class="card">
      <div class="main-info">
        ETH <div class="right">{{ ethBalance }}</div>
      </div>
    </div>

    <div class="card" v-if="!depositing && !exiting">
      <button class="btn btn-half btn-small" :disabled="ethBalance === '0'" v-on:click="startDeposit()"><font-awesome-icon icon="arrow-down" /> Deposit <font-awesome-icon icon="arrow-down" /></button>
      <button class="btn btn-half btn-small" :disabled="balances.length === 0" v-on:click="startExit()"><font-awesome-icon icon="arrow-up" /> Withdraw <font-awesome-icon icon="arrow-up" /></button>
    </div>

    <div class="card" v-if="depositing && !working">
      <input name="amount" type="text" class="send-input" v-model="amount" />
      <div class="send-btn-container">
        <button class="btn btn-half btn-small" v-on:click="deposit()"><font-awesome-icon icon="arrow-down" /> Send <font-awesome-icon icon="arrow-down" /></button>
        <button class="btn btn-half btn-small" v-on:click="cancel()">Cancel</button>
      </div>
    </div>

    <div class="card" v-if="exiting && !working">
      <input name="amount" type="text" class="send-input" v-model="amount" />
      <div class="send-btn-container">
        <button class="btn btn-half btn-small" v-on:click="exit()"><font-awesome-icon icon="arrow-up" /> Send <font-awesome-icon icon="arrow-up" /></button>
        <button class="btn btn-half btn-small" v-on:click="cancel()">Cancel</button>
      </div>
    </div>

    <div class="card text-center" v-if="working">
      sending transaction... <font-awesome-icon icon="spinner" spin />
    </div>

    <div class="mobile-sub-header">Plasma Balances</div>
    <div class="card text-center" v-if="balances.length === 0">
      You don't have any tokens!
    </div>
    <div class="balances">
      <div class="card" v-for="item in balances" :key="item.token">
        <div class="main-info">
          {{ item.token }} <div class="right">{{ item.balance }}</div>
        </div>
      </div>
    </div>

    <div v-if="exits.length > 0">
      <div class="mobile-sub-header">Pending Withdrawals</div>
      <div class="exits">
        <div class="card" v-for="exit in exits" :key="exit.id">
          <div class="main-info">
            {{ exit.end.sub(exit.start).toString(10) }} {{ exit.tokenName }} <div class="right">{{ exit.timeLeft }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card bottom">
      <div class="margin-bottom-sm">
        <router-link tag="button" class="btn btn-half" to="/send" :disabled="balances.length === 0">Send</router-link>
        <router-link tag="button" class="btn btn-half" to="/receive">Receive</router-link>
      </div>
      <div class="margin-bottom-sm">
        <button class="btn btn-half" v-clipboard:copy="account.privateKey" v-clipboard:success="onPkCopy">Copy Key</button>
        <router-link tag="button" class="btn btn-half" to="/burn">Burn Key</router-link>
      </div>
      <div>
        <router-link tag="button" class="btn btn-whole" to="/settings">Settings</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import client from '../services/client-service'
import clientData from '../services/client-data-service'

export default {
  name: 'Wallet',
  data () {
    return {
      clientData: clientData,
      amount: '',
      depositing: false,
      exiting: false,
      working: false,
      toasting: false
    }
  },
  computed: {
    account () {
      return clientData.account
    },
    ethBalance () {
      return clientData.ethBalance.toString(10)
    },
    balances () {
      return clientData.balances
    },
    exits () {
      return clientData.exits
    }
  },
  methods: {
    startDeposit () {
      this.depositing = true
    },
    startExit () {
      this.exiting = true
    },
    cancel () {
      this.depositing = false
      this.exiting = false
    },
    async deposit () {
      this.working = true
      try {
        await client.plasma.deposit(0, this.amount, this.account.address)
      } finally {
        this.working = false
        this.cancel()
      }
    },
    async exit () {
      this.working = true
      try {
        await client.plasma.startExit(this.account.address, 0, this.amount)
      } finally {
        this.working = false
        this.cancel()
      }
    },
    onPkCopy () {
      // Hack to prevent displaying duplicate toasts.
      if (this.toasting) return
      this.toasting = true

      this.$toasted.show('Copied to clipboard!', {
        position: 'bottom-center',
        duration: 1000,
        singleton: true,
        onComplete: () => {
          this.toasting = false
        }
      })
    }
  }
}
</script>
