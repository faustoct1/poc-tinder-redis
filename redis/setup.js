const {execute} = require('./index')

exports.setup = async (forceFlush) => {
  await execute(async (client)=>{
    const done = Boolean( await client.get('setup') )

    if(!done || forceFlush){
      await client.flushAll() //clear all database
      await client.set('setup','true')
    }

    //create users
    await Promise.all([
      client.set('me',JSON.stringify({id:'me',name:'Fausto Torres',twitter:'@faustoct1',description:'building apps..',thumb:'https://pbs.twimg.com/profile_images/1647953602957156352/d3R7d_0E_400x400.jpg'})),
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