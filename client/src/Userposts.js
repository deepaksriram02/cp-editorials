import {useState, useEffect} from 'react'
import Axios from 'axios'


import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

const HOMEURL=require('./Homeurl')



function Userposts(props){
    

    const [posts, setPosts]=useState([])

    const [loading, setLoading]=useState(false)

  

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
            return <Container>This user has no posts</Container>
        }


        return posts.map((post)=>{
            return <Container key={post.id} >
                <Card className="text-center m-3 ">
                    <Card.Header>{post.username}</Card.Header>
                    <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>{post.rating>=0?`+${post.rating}`:post.rating}</Card.Text>
                        <Button variant="primary" onClick={()=>{
                            props.setPost(post)
                            props.setPage('posts')
                        }}>view</Button>
                        
                    </Card.Body>
                    <Card.Footer className="text-muted">{findTime(post.createdat)}</Card.Footer>
                </Card>
       
            </Container>
        })
    }

    useEffect(()=>{
        setLoading(true)
        Axios.get(`${HOMEURL}/posts/${props.user}`, {headers:{authorization:`Bearer ${props.token}`}})
        .then((response)=>{
            setPosts(response.data)
            setLoading(false)
        })
    }, [])


    if(loading){
        return <div>Loading....</div>
    }

    
    return (
        <Container>
            <Button className="m-3" onClick={()=>{props.setUser('')}}>go back</Button>

            {displayPosts()}
        </Container>
    )
}

export default Userposts