const {createClient}  = require('redis')

const URL = 'redis://default:k2GI1SsHjPYt5EBNwPNftllCE8AcdIK6@redis-12093.c279.us-central1-1.gce.cloud.redislabs.com:12093'

exports.execute = async (callback) => {
  if(!callback) return null
  let client = null
  try{
    client = createClient({ url: URL })
    await client.connect()
    return await callback(client)
  }catch(e){
    console.log(e)
  }finally{
    if(client)client.quit()
  }
}
