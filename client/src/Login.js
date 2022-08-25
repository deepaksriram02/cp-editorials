import {useState, useEffect} from 'react'
import Axios from 'axios'
import HOMEURL from './Homeurl'
import Signup from './Signup'
import Heading from './Heading'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function Login(props){
    
    const [username, setUsername]=useState('')
    const [password, setPassword]=useState('')
    const [signup, setSignup]=useState(false)

    const [loading, setLoading]=useState(false)

    function validate(){
      
        if(!username || !password){
            return
        }
        setLoading(true)
        Axios.post(`${HOMEURL}/login`, {username, pword:password}, {headers:{autho:'hello'}})
        .then((response)=>{


            if(response.data.nouser){
                alert('Login failed, please try again')
            
            }
            else{

                props.setUsername(username)
                props.setPage('about')
                props.setToken(response.data.accessToken)
                console.log('Successful login')

            }
            setLoading(false)
        })
    }

    if(loading){
        return <div>Loading....</div>
    }

    if(signup===true){
        return <Signup setSignup={setSignup}/>
    }

    return (

        
        <Container>

            <Heading/>
            <Row className="justify-content-center">
                <Col md={4}>
                    <Card  className="shadow-lg">
                        <Card.Header className="primary">LOGIN</Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Control type="text" placeholder="Username" value={username} onChange={(e)=>{
                                        e.preventDefault()
                                        setUsername(e.target.value)
                                    }}></Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control type="password" placeholder="Password" value={password}onChange={(e)=>{
                                        e.preventDefault()
                                        setPassword(e.target.value)
                                    }}>

                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Button variant="warning m-2" onClick={validate}>Login</Button>
                                    <Button variant="primary m-2" onClick={()=>{setSignup(true)}}>Signup</Button>

                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>



        </Container>
        



    )
}

export default Login