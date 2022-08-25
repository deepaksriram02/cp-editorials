import {useState, useEffect} from 'react'
import Axios from 'axios'

import Userposts from './Userposts'

import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
const HOMEURL=require('./Homeurl')



function Users(props){

    
    const [userlist, setUserlist]=useState([])
    const [username, setUsername]=useState('')

    const [loading, setLoading]=useState(false)
    function displayUsers(){
        return userlist.map((user, index)=>{
            return(
                <tr key={user.username} style={{cursor:'pointer'}} onClick={()=>{
                        setUsername(user.username)
                    }}>
                    <td>{index+1}</td>
                    <td >{user.username}</td>
                    <td>{user.name}</td>
                    <td>{user.contribution}</td>
                </tr>

            )
        })
    }

    useEffect(()=>{
        setLoading(true)
        Axios.get(`${HOMEURL}/users`, {headers:{authorization:`Bearer ${props.token}`}})
        .then((response)=>{
            setUserlist(()=>{
                return response.data.map((user)=>{
                    return {username:user.username, contribution:user.contribution, name:user.name}
                })
            })
            setLoading(false)
        })
    }, [])

    if(loading){
        return <div>Loading....</div>
    }

    if(username){
        return <Userposts setUser={setUsername} user={username} setPage={props.setPage} setPost={props.setPost} token={props.token}/>
    }

    return (
        <div>
            <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Username</th>
          <th>Name</th>
          <th>Contribution</th>
        </tr>

        
      </thead>
      <tbody>
        {displayUsers()}
      </tbody>
    </Table>

        </div>
    )
}

export default Users