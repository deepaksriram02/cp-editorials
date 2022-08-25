import {useState, useEffect} from 'react';
import Login from './Login'
import About from './About'
import Posts from './Posts'
import Users from './Users'
import Create from './Create'
import MyNavbar from './MyNavbar'



import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';



import Axios from 'axios';


function App() {

  const [page, setPage]=useState('login')
  const [username, setUsername]=useState('')
  // const [password, setPassword]=useState('')
  const [post, setPost]=useState('')
  const [token, setToken]=useState('')


  if(page=='login'){
    return <Login setUsername={setUsername} setPage={setPage} setToken={setToken}/>
  }

  return (
    <div className="m-2">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>CP Editorials</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Signed in as: {username}
            </Navbar.Text>
            <Button variant="light" className="m-3" onClick={()=>{
              // setPassword('')
              setUsername('')
              setPage('login')
              setToken('')
            }}>log out</Button>
            
          </Navbar.Collapse>
        </Container>
      </Navbar>
  

      <MyNavbar page={page} setPage={setPage}/>
      

      <Container className="shadow-lg mt-3 ml-2 p-3">
      {page==='about'
        ? <About/>
        : page==='posts'
        ? <Posts username={username} post={post} setPost={setPost} token={token}/>
        : page==='users'
        ? <Users setPage={setPage} setPost={setPost} token={token}/>
        : page==='create'
        ? <Create username={username} token={token}/>
        : <div>invalid</div>
      }

      </Container>


    </div>
      
  );
}

export default App;
