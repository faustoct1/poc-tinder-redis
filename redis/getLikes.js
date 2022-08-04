const {execute} = require('./index')
exports.getLikes = async () => {
  return await execute(async (client)=>{
    const ids = await client.zRange('userslike_me', 0, -1)
    return ids && ids.length ? await client.mGet(ids) : []
  })
}
