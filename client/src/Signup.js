import {useState, useEffect} from 'react'
import Axios from 'axios'


import Heading from './Heading'


import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const HOMEURL=require('./Homeurl')




function Signup(props){

    const [name, setName]=useState('')
    const [username, setUsername]=useState('')
    const [password, setPassword]=useState('')

    const [loading, setLoading]=useState(false)
    
    
    function validate(){
        if(name==='' || username==='' || password===''){
            return
        }
        
        setLoading(true)
        Axios.post(`${HOMEURL}/signup`, {name, username, pword:password})
        .then((response)=>{
            console.log(response.data)
            if(response.data.userexists){
                alert('Username already exists')
            }
            else{
                alert('signup successful')
                props.setSignup(false)
            }
            setLoading(false)
            
        })
            
        
    }

    if(loading){
        return <div>Loading....</div>
    }

    return (

        <Container>
            <Heading/>
            <Row className="justify-content-center">
                <Col md={4}>
                    <Card  className="shadow-lg">
                        <Card.Header className="primary">SIGNUP</Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Control type="text" placeholder="Name" value={name} onChange={(e)=>{
                                        e.preventDefault()
                                        setName(e.target.value)
                                    }}></Form.Control>
                                </Form.Group>


                                <Form.Group className="mb-3">
                                    <Form.Control type="text" placeholder="Username" value={username} onChange={(e)=>{
                                        e.preventDefault()
                                        setUsername(e.target.value)
                                    }}>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Control type="password" placeholder="Password" value={password}onChange={(e)=>{
                                        e.preventDefault()
                                        setPassword(e.target.value)
                                    }}>
                                    </Form.Control>
                                </Form.Group>


                                <Form.Group className="mb-3">
                                    <Button variant="warning m-2" onClick={validate}>submit</Button>
                                    <Button variant="primary m-2" onClick={()=>{props.setSignup(false)}}>Back to login</Button>

                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>



        </Container>
   
    )
}

export default Signup