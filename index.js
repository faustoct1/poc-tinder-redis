const express         = require('express')
const bodyParser      = require('body-parser')
const path            = require('path')
const cors            = require('cors')
const app             = express()

const {setup} = require('./redis/setup')
const {getUsers} = require('./redis/getUsers')
const {getDislikes} = require('./redis/getDislikes')
const {getLikes} = require('./redis/getLikes')
const {setDislike} = require('./redis/setDislike')
const {setLike} = require('./redis/setLike')

const logErrors = (err, req, res, next) => {
  console.error(err.stack)
  next(err)
}

app.use(cors({origin:'*'}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

const init = async (res,force) => {
  await setup(!!force)
  const dislikes = await getDislikes()
  const likes = await getLikes()
  const users = await getUsers()
  res.json({
    isOn:true, 
    users:users, 
    reactions: [
      ...likes.map(u=>{
        u = JSON.parse(u)
        u.type='like';
        return u
      }),
      ...dislikes.map(u=>{
        u = JSON.parse(u)
        u.type='dislike';
        return u
      })
    ].sort()
  })
}

app.get('/start', async (req, res, next) => {
  init(res,false)
})

app.post('/clean', async (req, res, next) => {
  init(res,true)
})

app.post('/action/dislike/:id', async (req, res, next) => {
  const id = req.params.id
  setDislike(id)
})

app.post('/action/like/:id', async (req, res, next) => {
  const id = req.params.id
  setLike(id)
})


app.use(express.static(path.join(__dirname, 'build')))
app.use(logErrors)

app.listen(5000,()=>{
  console.log('Your server is running')
})
