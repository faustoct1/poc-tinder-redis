const {execute} = require('./index')

exports.lookup = async (uid,coords) => {
  const key = `feed_${uid}`
  return await execute(async (client)=>{
    await client.geoSearchStore(key,'feed',{latitude:coords.lat,longitude:coords.lon},{radius: 50000, unit: 'km'})
    await client.zDiffStore(key,[key,`usersmatch_${uid}`])
    return await client.zRange(key, 0, -1)
  })
}
