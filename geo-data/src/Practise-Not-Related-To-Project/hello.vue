<template>
<h1>Hello</h1>
<h1>email:{{ email }}</h1>
<h1> Name:{{ DataHistory().name }}</h1>
<h1>Get Name:{{ getName("PRABHUDEV").name }}</h1>
<h1>Get adress:{{ getName("PRABHUDEV").name }}, {{ getVillage().name }}, {{ getVillage().pincode }}</h1>
</template>

<script>
export default {
    name: "ExampleName",
    data() {
        return {
            email: "Prabhuedv@gmail.com",
        }
    },
    methods: {
        getName(name){
            return{
                name:name
            }
        },
        DataHistory() {
            return {
            name: "Prabhudev",
            adress:"Muttagi"
            }
        },
        getVillage(){
            return{
                name:"Hirehonnihalli",
                pincode:"580114"
            }
        }
    }
}
</script>

<style scoped>
h1{
    color:red;
    font-family:sans-serif;
    font-style:italic;
    font-size:1em
}
</style>
