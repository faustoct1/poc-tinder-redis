import 'bootstrap/dist/css/bootstrap.min.css'
import {useEffect,useState} from 'react'
import {Container,Row,Col,Alert,Card,Button} from 'react-bootstrap'
import './App.css';

const App = () => {
  const [loading,setLoading] = useState(true)
  const [isOn,setIsOn] = useState(false)
  const [users,setUsers] = useState(null)
  const [reactions,setReactions] = useState([])

  const initAsync = async () => {
    try{
      const response = await fetch('http://localhost:5000/start',{ 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      const json = await response.json()
      setIsOn(json.isOn)
      setUsers(json.users)
      setReactions([...json.reactions])
      setLoading(false)
    }catch(e){
      setIsOn(false)
      setUsers(null)
      setLoading(false)
    }
  }

  useEffect(()=>{
    initAsync()
    return ()=>{}
  },[])

  const dislike = async (e,user) => {
    e.stopPropagation()
    e.preventDefault()

    user.type='dislike'
    setReactions([...reactions,...[user]])

    users.splice(0,1)
    setUsers([...users])

    fetch(`http://localhost:5000/action/dislike/${user.id}`,{ 
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
  }

  const like = async (e,user) => {
    e.stopPropagation()
    e.preventDefault()

    user.type='like'
    setReactions([...reactions,...[user]])

    users.splice(0,1)
    setUsers([...users])

    fetch(`http://localhost:5000/action/like/${user.id}`,{ 
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
  }

  const clear = async (e) => {
    setLoading(true);
    (async () => {
      const response = await fetch('http://localhost:5000/clean',{ 
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      const json = await response.json()
      setIsOn(decodeURI(json.isOn))
      setUsers(json.users)
      setReactions([])
      setLoading(false)
    })()
  }

  const renderCards = () => {
    return (
      <div className="align-items-center justify-content-center" style={{display: 'flex', justifyContent: 'center'}}>
        {
          users && users.length>0 ? 
          <Card style={{ width: '100%', borderWidth:0 }}>
            <Card.Img variant="top" src={users[0].thumb} className="App-logo" style={{borderRadius:5,objectFit:'cover'}} />
            <Card.Body>
              <Card.Title>{users[0].name}</Card.Title>
              <Card.Text>
                {users[0].description}
              </Card.Text>
              <Card.Text>
                <Button variant="link" href={`http://www.twitter.com/${users[0].twitter}`} target="_blank">Visitar no twitter</Button>
              </Card.Text>
              <Row>
                <Col>
                  <Button variant="danger" style={{width:'100%'}} onClick={(e)=>{dislike(e,users[0])}}>Dislike</Button>
                </Col>
                <Col>
                  <Button variant="success" style={{width:'100%'}} onClick={(e)=>{like(e,users[0])}}>Like</Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          :
          (
            users && users.length==0 ? 
            <p style={{margin:10}}>
              Não há mais cards clique em <i><u><span onClick={(e)=>{clear(e)}}>Limpar REDIS</span></u></i> para começar novamente.
            </p>
            :
            null
          )
        } 
      </div>
    )
  }

  const renderReactions = () => {
    return (
      <div className="align-items-center justify-content-center">
        {
          reactions && reactions.map(u=>{
            return <div key={u.id}>{u.name} ({u.type})</div>
          })
        } 
      </div>
    )
  }

  return (
    <Container>
      <Row className="align-items-center justify-content-center">
        <Col xxl={6} xl={6} lg={8} md={8} sm={12} xs={12} className="align-items-center justify-content-center" style={{marginTop:50}}>
        <p>
          {
            loading ? 
            <Alert key={'warning'} variant={'warning'}>
              <b>Tinder</b> is loading...
            </Alert>
            :
            <Alert key={isOn ? 'primary' : 'danger'} variant={isOn ? 'primary' : 'danger'}>
              <b>Tinder</b> is {isOn ? 'ON' : 'OFF'}
              {isOn ? null : <div>Please start the server: <i>yarn server</i></div>}
            </Alert>
          }
          
        </p>
        {loading ? null : renderCards()}
        </Col>
      </Row>
      {
        loading ? null : 
        <Row className="align-items-center justify-content-center">
          <Col xxl={6} xl={6} lg={8} md={8} sm={12} xs={12} className="align-items-center justify-content-center" style={{marginTop:50}}>
            <div>
              <Button variant="link" onClick={(e)=>{clear(e)}} style={{borderWidth:1,borderColor:'blue',borderRadius:5}}>Limpar REDIS</Button>
            </div>       
          </Col>
        </Row>
      }
      {
        loading ? null : 
        <Row className="align-items-center justify-content-center">
          <Col xxl={6} xl={6} lg={8} md={8} sm={12} xs={12} className="align-items-center justify-content-center" style={{marginTop:10}}>
            {renderReactions()}
          </Col>
        </Row>
        
      }
    </Container>
    
  );
}

export default App;

