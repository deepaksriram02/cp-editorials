import {useState, useEffect} from 'react'
import Axios from 'axios'

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import Form from 'react-bootstrap/Form';


const HOMEURL=require('./Homeurl')



function Create(props){

    const [title, setTitle]=useState('')
    const [content, setContent]=useState('')
    const [link, setLink]=useState('')
    const [codelink, setCodelink]=useState('')


    const [loading, setLoading]=useState(false)

    function submitAction(){
        if(!title || !content){
            return
        }
        const d=new Date()
        setLoading(true)
        Axios.post(`${HOMEURL}/create`, {title, content, username:props.username, link, codelink, createdat:d.toString()}, {headers:{authorization:`Bearer ${props.token}`}})
        .then((response)=>{
            setTitle('')
            setContent('')
            setLink('')
            setCodelink('')
            alert('Post created successfully')
            console.log(response)
            setLoading(false)
        })
    }

    if(loading){
        return <div>Loading....</div>
    }
    
    return (
        <div>

            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Title*</Form.Label>
                    <Form.Control type="text" value={title} placeholder="title" onChange={(e)=>{
                        e.preventDefault()
                        setTitle(e.target.value)
                    }}>
                    </Form.Control>
                </Form.Group>
                {/* added now */}
                <Form.Group className="mb-3">
                    <Form.Label>Problem link</Form.Label>
                    <Form.Control type="text" value={link} placeholder="link" onChange={(e)=>{
                        e.preventDefault()
                        setLink(e.target.value)
                    }}>
                    </Form.Control>
                </Form.Group>




                <Form.Group className="mb-3">
                    <Form.Label>Solution*</Form.Label>
                    <Form.Control as="textarea" rows={10} value={content} placeholder="content..." onChange={(e)=>{
                        e.preventDefault()
                        setContent(e.target.value)
                    }}>
                    </Form.Control>
                </Form.Group>

                {/* added now */}
                <Form.Group className="mb-3">
                    <Form.Label>Code Link</Form.Label>
                    <Form.Control type="text" value={codelink} placeholder="provide a link to the code if available" onChange={(e)=>{
                        e.preventDefault()
                        setCodelink(e.target.value)
                    }}>
                    </Form.Control>
                </Form.Group>


                <Form.Group className="mb-3">
                    <Button variant="warning m-2" onClick={submitAction}>submit</Button>
                </Form.Group>
            </Form>
        </div>
    )
}

export default Create