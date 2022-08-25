import {useState, useEffect} from 'react'
import Axios from 'axios'

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';


import Navbar from 'react-bootstrap/Navbar';

const HOMEURL=require('./Homeurl')



function Post(props){

    const [liked, setLiked]=useState(0)
    const [plusbutton, setPlusbutton]=useState('secondary')
    const [minusbutton, setMinusbutton]=useState('secondary')

    const [comments, setComments]=useState([])
    const [commentTyped, setCommentTyped]=useState('')

    const [loading, setLoading]=useState(false)

    useEffect(()=>{
        setLoading(true)
        Axios.get(`${HOMEURL}/liked/${props.post.id}/${props.username}`,{headers:{authorization:`Bearer ${props.token}`}})
        .then((response)=>{
            if(response.data[0]){
                setLiked(response.data[0].act)
            }
            else{
                setLiked(0)
            }
            setLoading(false)
        })

        setLoading(true)
        Axios.get(`${HOMEURL}/comments/${props.post.id}`, {headers:{authorization:`Bearer ${props.token}`}})
        .then((response)=>{

            setComments(response.data)
            setLoading(false)
        })
    },[])

  
    useEffect(()=>{
        if(liked===1){
            setPlusbutton('success')
            setMinusbutton('secondary')
        }
        else if(liked===-1){
            setPlusbutton('secondary')
            setMinusbutton('danger')
        }
        else{
            setPlusbutton('secondary')
            setMinusbutton('secondary')
        }
        console.log(plusbutton)
    },[liked])
   
    function like(act){

        if(act===liked){
            act=0
        }

        return ()=>{

            setLoading(true)
            Axios.post(`${HOMEURL}/liked/${props.post.id}/${props.username}`, {act}, {headers:{authorization:`Bearer ${props.token}`}})
            .then((response)=>{
                console.log('inserted',response.data)
                Axios.get(`${HOMEURL}/post/${props.post.id}`, {headers:{authorization:`Bearer ${props.token}`}})
                .then((response)=>{
                    props.setPost(response.data[0])

                })
                .then(()=>{
                    Axios.get(`${HOMEURL}/posts`, {headers:{authorization:`Bearer ${props.token}`}})
                    .then((response)=>{
                        props.setPosts(response.data)
                        setLiked(act)
                        setLoading(false)
                    }) 
                })
                
            })

            return
            
            
        }

        
    }


    function displayComments(){

        return comments.map((comment)=>{
            return (<div key={comment.id}>
                <Card body className="m-2">

                    <span className="fw-bold">{comment.username}:    </span>{comment.content}


                </Card>
                
            </div>)
        })
    }

    function submit(){
        if(!commentTyped){
            return
        }

        setLoading(true)
        Axios.post(`${HOMEURL}/comments/${props.post.id}/${props.username}`, {content: commentTyped}, {headers:{authorization:`Bearer ${props.token}`}})
        .then((response)=>{
            Axios.get(`${HOMEURL}/comments/${props.post.id}`, {headers:{authorization:`Bearer ${props.token}`}})
            .then((response)=>{
                setComments(response.data)
                setCommentTyped('')
                setLoading(false)
            })
            
        })
    }

    if(loading){
        return <div>loading....</div>
    }

    return (
        <Container>
    
            <Button className="m-3" onClick={()=>{props.setPost('')}}>Go Back</Button>
            <Card  className="p-3">
                {/* <Card.Header>Featured</Card.Header> */}
                <Card.Body>
                    <Container className="text-center">
                        <Card.Title as="h2" className="mt-3">{props.post.title}</Card.Title>
                        <footer className="blockquote-footer m-2"><span className="h4">{props.post.username}</span></footer>
                    </Container>
                    <hr/>
                    {
                        props.post.link?
                        <Card.Text>
                            <span className="h5 m-3 mt-4">Problem link : </span><a href={props.post.link}>{props.post.link}</a>
                        </Card.Text>:console.log('no problem link')
                    }

                
                    <Card.Text>
                            
                        <span className="m-3 h5">Explanation:</span>
                        
                    </Card.Text>
                    <Container className="bg-light border p-3 m-3">
                            {props.post.content}
                    </Container>
                    {

                        props.post.codelink?
                            <Card.Text>
                               <span className="h4 m-3 mt-4">Code link : </span><a href={props.post.codelink}> {props.post.codelink}</a> 
                            </Card.Text>:console.log('no codelink')
                        
                    }
                    


                    <Container className="mt-4">
                        <Row>
                            <Col xs={1}><Button variant={plusbutton} onClick={like(1)}>+1</Button></Col>
                            <Col className="h2" xs={1}>{props.post.rating>=0?`+${props.post.rating}`:props.post.rating}</Col>
                            <Col xs={1}><Button variant={minusbutton} onClick={like(-1)}>-1</Button></Col>
                        </Row>
                        {/* <Button variant="primary">test</Button> */}
                    </Container>

                </Card.Body>
            </Card>
            

  

            <Navbar className="mt-4" bg="light">
                <Container>
                <Navbar.Brand >Comments</Navbar.Brand>
                </Container>
            </Navbar>

            <Form>
                <Form.Group className="m-3">
                    <Container>
                        <Row>
                            <Col>
                            <Form.Control type="text" value={commentTyped} placeholder="add a comment..." onChange={(e)=>{
                                e.preventDefault()
                                setCommentTyped(e.target.value)
                            }}>
                            </Form.Control>
                            </Col>
                            <Col><Button onClick={submit}>Add</Button></Col>
                        </Row>
                    </Container>
                </Form.Group>
                {/* added now */}
                
            </Form>
     
            {displayComments()}




        </Container>
    )
}

export default Post