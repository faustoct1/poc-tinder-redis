const {execute} = require('./index')
exports.setLike = async (id) => {
  const uid = 'me'
  await execute(async (client)=>{
    await client.zAdd(`usersmatch_${uid}`,{score:1, value:id},{INCR:true})
    await client.zAdd(`userslike_${uid}`,{score:1, value:id},{INCR:true})
  })
}
