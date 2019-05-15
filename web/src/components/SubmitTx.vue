<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <font size = "+3">submit transactions</font>
                    </div><br/><br/>
    
                    <div class="card-body">
                        <form @submit="formSubmit">
                        <strong> ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎ fromX: </strong>
                        <input type="text" class="form-control" v-model="fromX"><br/><br/>
                        <strong> ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎ fromY: </strong>
                        <input type="text" class="form-control" v-model="fromY"><br/><br/>
                        <strong> ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎ toX: </strong>
                        <input type="text" class="form-control" v-model="toX"><br/><br/>
                        <strong> ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎ toY: </strong>
                        <input type="text" class="form-control" v-model="toY"><br/><br/>
                        <strong> ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎  ‏‏‎ amt: </strong>
                        <input type="text" class="form-control" v-model="amount"><br/><br/>
                        <strong> ‏‏‎ token type: </strong>
                        <input type="text" class="form-control" v-model="tokenType"><br/><br/>
                        <strong>signature R: </strong>
                        <input type="text" class="form-control" v-model="R8"><br/><br/>
                        <strong>signature S: </strong>
                        <input type="text" class="form-control" v-model="S"><br/><br/>
    
                        <button class="btn btn-success">Submit</button><br/><br/>
                        </form>
                        <strong>Output:</strong>
                        <pre>
                        {{output}}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
     
<script>
    export default {
        mounted() {
            console.log('Component mounted.')
        },
        data() {
            return {
              fromX: '5686635804472582232015924858874568287077998278299757444567424097636989354076',
              fromY: '5686635804472582232015924858874568287077998278299757444567424097636989354076',
              toX: '5188413625993601883297433934250988745151922355819390722918528461123462745458',
              toY: '12688531930957923993246507021135702202363596171614725698211865710242486568828',
              amount: '500',
              tokenType: '10',
              R8: '16983338799297102739311784762032344870039222281986241143318530383875079624912,17974713114491039907234265242193070110554943394288196512948620624137364193552',
              S: '1343828434385488942743107335063404632386867645513272609057729341930827645964',
              output: ''
            };
        },
        methods: {
            formSubmit(e) {
                e.preventDefault();
                let currentObj = this;
                this.axios.post('http://localhost:3000/submitTx', {
                    fromX: this.fromX,
                    fromY: this.fromY,
                    toX: this.toX,
                    toY: this.toY,
                    amount: this.amount,
                    tokenType: this.tokenType,
                    signature: {
                        R8: this.R8,
                        S: this.S
                    }
                })
                .then(function (response) {
                    currentObj.output = response.data;
                })
                .catch(function (error) {
                    currentObj.output = error;
                });
            }
        }
    }
</script>