const {execute} = require('./index')
exports.setDislike = async (id) => {
  const uid = 'me'
  await execute(async (client)=>{
    await client.zAdd(`usersmatch_${uid}`,{score:1, value:id},{INCR:true})
    await client.zAdd(`usersdislike_${uid}`,{score:1, value:id},{INCR:true})
  })
}
