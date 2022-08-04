const {execute} = require('./index')
const {lookup} = require('./lookup')
exports.getUsers = async () => {
  const ids = await lookup('me',{ lat: 37.4418834, lon: -122.1430195 })
  const users = ids && ids.length ? await execute(async (client)=>{
    return await client.mGet(ids)
  }) : []
  return users && users.length ? users.map(u=>JSON.parse(u)) : []
}
