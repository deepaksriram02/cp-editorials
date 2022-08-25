import {useState, useEffect} from 'react'
import Axios from 'axios'
import Post from './Post'


import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

const HOMEURL=require('./Homeurl')




function Posts(props){

    const [allposts, setAllposts]=useState([])
    const [posts, setPosts]=useState([])
    const [search, setSearch]=useState('')


    const [loading, setLoading]=useState(false)

    useEffect(()=>{
        setLoading(true)
        Axios.get(`${HOMEURL}/posts`, {headers:{authorization:`Bearer ${props.token}`}})
        .then((response)=>{
            setAllposts(response.data)
            setPosts(response.data)
            setLoading(false)
        })    
        
    }, [])

    useEffect(()=>{
        setPosts(()=>{
            if(!search){
                return allposts
            }
            return allposts.filter(post=>{
                return post.title.includes(search)||(post.link && post.link.includes(search))
            })
        })
    }, [search, allposts])


    function findTime(createdat){
        // return '2 days ago'
        const d1=Date.parse(createdat)
        const d2=new Date()
        const diff=d2-d1;
        const seconds=diff/1000
        const minutes=seconds/60
        const hours=minutes/60
        const days=hours/24
        // console.log(seconds)
        if(Math.floor(days)>0){
            return `${Math.floor(days)} days ago`
        }
        else if(Math.floor(hours)>0){
            return `${Math.floor(hours)} hours ago`
        }
        else{
            return `${Math.floor(minutes)} minutes ago`
        }
    }

    function displayPosts(){
        if(posts.length===0){
            return <Container>no posts found</Container>
        }
        return posts.map((post)=>{
            return <Container key={post.id} >
                <Card className="text-center m-3 ">
                    <Card.Header>{post.username}</Card.Header>
                    <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>{post.rating>=0?`+${post.rating}`:post.rating}</Card.Text>
                        <Button variant="primary m-2" onClick={()=>{props.setPost(post)}}>view</Button>
                        {
                            props.username===post.username?
                            <Button variant="danger" onClick={()=>{

                                Axios.delete(`${HOMEURL}/posts/${post.id}`, {headers:{authorization:`Bearer ${props.    token}`}})
                                .then((response)=>{
                                    Axios.get(`${HOMEURL}/posts`,{headers:{authorization:`Bearer ${props.token}`}})
                                    .then((response)=>{
                                        setPosts(response.data)
                                    })
                                })
                            }}>delete</Button>:console.log('cannot delete')
                        }

                    </Card.Body>
                    <Card.Footer className="text-muted">{findTime(post.createdat)}</Card.Footer>
                </Card>
                
            </Container>
        })
    }

    if(loading){
        return <div>Loading....</div>
    }

    if(props.post){
        return <Post setPosts={setAllposts} post={props.post} setPost={props.setPost} username={props.username} token={props.token}/>
    }

    return (

        <div>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="search by title or problem link" value={search} onChange={(e)=>{
                        e.preventDefault()
                        setSearch(e.target.value)
                    }}></Form.Control>
                </Form.Group>
                
            </Form>
            {displayPosts()}
        </div>
    )
}

export default Posts