<template>
    <div>
        <Metamask/><br/>
        <EdDSA/><br/>
        <Deposit/><br/>
        <Transfer/><br/>
        <Withdraw/><br/><br/>
    </div>

</template>

<script>
    import Metamask from '@/components/Metamask'
    import Deposit from '@/components/Deposit'
    import Transfer from '@/components/Transfer'
    import Withdraw from '@/components/Withdraw'
    import EdDSA from '@/components/EdDSA'
    export default {
        name: 'RollupNC',
        beforeCreate () {
            // console.log('registerWeb3 Action dispatched from RollupNC.vue')
            this.$store.dispatch('registerWeb3')
        },
        components: {
            'Metamask': Metamask,
            'EdDSA': EdDSA,
            'Deposit': Deposit,
            'Transfer': Transfer,
            'Withdraw': Withdraw
        }
    }
</script>

<style scoped>
</style>