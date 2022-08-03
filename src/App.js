import 'bootstrap/dist/css/bootstrap.min.css'
import {useEffect,useState} from 'react'
import {Container,Row,Col,Alert,Card,Button} from 'react-bootstrap'
import './App.css';

const App = () => {
  const [isOn,setIsOn] = useState(false)
  const [users,setUsers] = useState(null)

  const initAsync = async () => {
    const response = await fetch('http://localhost:5000/setup',{ 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const json = await response.json()
    setIsOn(decodeURI(json.isOn))
    setUsers(json.users)
  }

  useEffect(()=>{
    initAsync()
    return ()=>{}
  },[])

  const dislike = async (e,user) => {
    e.stopPropagation()
    e.preventDefault()
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

  return (
    <Container>
      <Row className="align-items-center justify-content-center">
        <Col xxl={6} xl={6} lg={8} md={8} sm={12} xs={12} className="align-items-center justify-content-center">
        <p>
          <Alert key={isOn ? 'primary' : 'danger'} variant={isOn ? 'primary' : 'danger'}>
            <b>Tinder</b> is {isOn ? 'ON' : 'OFF'}
          </Alert>
        </p>
        <div class="align-items-center justify-content-center" style={{display: 'flex', justifyContent: 'center'}}>
          {
            users && users.length>0 ? 
            <Card style={{ width: '100%' }}>
              <Card.Img variant="top" src={users[0].thumb} className="App-logo" style={{borderRadius:5,objectFit:'cover'}} />
              <Card.Body>
                <Card.Title>{users[0].name}</Card.Title>
                <Card.Text>
                  {users[0].description}
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
            null
          }        
        </div>
        </Col>
      </Row>
    </Container>
    
  );
}

export default App;

//<img src={} className="App-logo center" alt="logo" style={{borderRadius:5}} /> : null
