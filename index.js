const {createClient}  = require('redis')
const express         = require('express')
const bodyParser      = require('body-parser')
const path            = require('path')
const cors            = require('cors')
const app             = express()

const URL = 'redis://default:k2GI1SsHjPYt5EBNwPNftllCE8AcdIK6@redis-12093.c279.us-central1-1.gce.cloud.redislabs.com:12093'

const execute = async (callback) => {
  if(!callback) return null
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

const logErrors = (err, req, res, next) => {
  console.error(err.stack)
  next(err)
}

app.use(cors({origin:'*'}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

const setup = async (forceFlush) => {
  await execute(async (client)=>{
    const done = Boolean( await client.get('setup') )

    if(!done || forceFlush){
      await client.flushAll() //clear all database
      await client.set('setup','true')
    }

    //create users
    await Promise.all([
      client.set('me',JSON.stringify({id:'me',name:'Joker Nomade',twitter:'@jokernomade',description:'Criador do pirulito de carne',thumb:'https://pbs.twimg.com/profile_images/1542765692788809728/d7YbqPEE_400x400.jpg'})),
      client.set('1',JSON.stringify({id:'1',name:'Anitta',twitter:'@anitta',description:'Versions Of Me',thumb:'https://pbs.twimg.com/profile_images/1536394893303631872/fttYUYKU_400x400.jpg'})),
      client.set('2',JSON.stringify({id:'2',name:'Marina Ruy Barbosa',twitter:'@mariruybarbosa',description:'antes e depois da xereola (cancelada dia sim, dia sim)',thumb:'https://pbs.twimg.com/profile_images/1544795228292485122/GtN2onqg_400x400.jpg'})),
      client.set('3',JSON.stringify({id:'3',name:'Paolla Oliveira',twitter:'@paolla',description:null,thumb:'https://pbs.twimg.com/profile_images/1539672959291461634/Ab4OSRwp_400x400.jpg'})),
      client.set('4',JSON.stringify({id:'4',name:'Juliana Paes',twitter:'@julianapaes',description:'Atriz brasileira, defensora para a Prevenção e a Eliminação da Violência contra as Mulheres na @onumulheresbr e Embaixadora do Instituto Arara Azul',thumb:'https://pbs.twimg.com/profile_images/1520159366267260928/8vRBqqY5_400x400.jpg'})),
    ])
    //setup users location
    await Promise.all([
      client.geoAdd('feed',{latitude: -25.4372382, longitude: -49.2699727, member: '1'}),
      client.geoAdd('feed',{latitude: -23.5557714, longitude: -46.6395571, member: '2'}),
      client.geoAdd('feed',{latitude: -27.5948036, longitude: -48.5569286, member: '3'}),
      client.geoAdd('feed',{latitude: -12.9777334, longitude: -38.501648, member: '4'}),
    ])    
  })
}

const lookup = async (uid,coords) => {
  const key = `feed_${uid}`
  return await execute(async (client)=>{
    console.log(await client.geoSearchStore(key,'feed',{latitude:coords.lat,longitude:coords.lon},{radius: 50000, unit: 'km'}))
    console.log(await client.zDiffStore(key,[key,`usersmatch_${uid}`]))
    return await client.zRange(key, 0, -1)
  })
}

const getUsers = async (ids) => {
  return await execute(async (client)=>{
    return await client.mGet(ids)
  })
}

const init = async (res,force) => {
  await setup(!!force)
  const userIds = await lookup('me',{ lat: 37.4418834, lon: -122.1430195 })
  const users = userIds && userIds.length ? await getUsers(userIds) : []
  res.json({isOn:true, users:users.map(u=>JSON.parse(u))})
}

app.get('/start', async (req, res, next) => {
  init(res,false)
})

app.post('/clean', async (req, res, next) => {
  init(res,true)
})

app.post('/action/dislike/:id', async (req, res, next) => {
  const id = req.params.id
  const uid = 'me'
  await execute(async (client)=>{
    await client.zAdd(`usersmatch_${uid}`,{score:1, value:id},{INCR:true})
    await client.zAdd(`usersdislike_${uid}`,{score:1, value:id},{INCR:true})
  })
})

app.post('/action/like/:id', async (req, res, next) => {
  const id = req.params.id
  const uid = 'me'
  await execute(async (client)=>{
    await client.zAdd(`usersmatch_${uid}`,{score:1, value:id},{INCR:true})
    await client.zAdd(`userslike_${uid}`,{score:1, value:id},{INCR:true})
  })
})


app.use(express.static(path.join(__dirname, 'build')))
app.use(logErrors)

app.listen(5000,()=>{
  console.log('Your server is running')
})
