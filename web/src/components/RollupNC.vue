<template>
    <div>
        <Withdraw/><br/><br/>
        <Metamask/><br>
        <EdDSA/>
    </div>

</template>

<script>
    import Metamask from '@/components/Metamask'
    import Withdraw from '@/components/Withdraw'
    import EdDSA from '@/components/EdDSA'
    export default {
        name: 'RollupNC',
        beforeCreate () {
            // console.log('registerWeb3 Action dispatched from RollupNC.vue')
            this.$store.dispatch('registerWeb3')
        },
        components: {
            'Withdraw': Withdraw,
            'Metamask': Metamask,
            'EdDSA': EdDSA
        }
    }
</script>

<style scoped>
</style>