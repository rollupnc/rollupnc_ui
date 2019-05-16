<template>
    <div>
        <Withdraw/><br/><br/>
        <Metamask/>
    </div>

</template>

<script>
    import Metamask from '@/components/Metamask'
    import Withdraw from '@/components/Withdraw'
    export default {
        name: 'RollupNC',
        beforeCreate () {
            // console.log('registerWeb3 Action dispatched from RollupNC.vue')
            this.$store.dispatch('registerWeb3')
        },
        components: {
            'Withdraw': Withdraw,
            'Metamask': Metamask
        }
    }
</script>

<style scoped>
</style>