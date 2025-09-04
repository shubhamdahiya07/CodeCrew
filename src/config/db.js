import pkg from 'pg';
const {Client} = pkg;

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "namaste_nodejs",
    password: "password",
    port: 5432
})

async function main (){
    try {
        await client.connect();
        console.log("Connected successfully to DB")
    } catch (error) {
        console.log("Connection unsuccessfull to DB ",error.message)
    }
}

main();

export default client;