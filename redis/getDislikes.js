const {execute} = require('./index')
exports.getDislikes = async () => {
  return await execute(async (client)=>{
    const ids = await client.zRange('usersdislike_me', 0, -1)
    return ids && ids.length ? await client.mGet(ids) : []
  })
}
