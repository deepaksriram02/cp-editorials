

import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';


const HOMEURL=require('./Homeurl')


function MyNavbar(props){

    return (
        <Container>
            <Nav className="mt-3" fill variant="pills" defaultActiveKey="about" activeKey={props.page}>
                <Nav.Item className="m-2">
                    <Nav.Link  onClick={()=>{props.setPage('about')}} style={{border:'0.1rem solid black'}} eventKey="about">About</Nav.Link>
                </Nav.Item>
                <Nav.Item className="m-2">
                    <Nav.Link onClick={()=>{props.setPage('posts')}} style={{border:'0.1rem solid black'}} eventKey="posts">Posts</Nav.Link>
                </Nav.Item>
                <Nav.Item className="m-2">
                    <Nav.Link onClick={()=>{props.setPage('users')}} style={{border:'0.1rem solid black'}} eventKey="users">Users</Nav.Link>
                </Nav.Item>
                <Nav.Item className="m-2">
                    <Nav.Link  onClick={()=>{props.setPage('create')}} style={{border:'0.1rem solid black'}} eventKey="create">Contribute</Nav.Link>
                </Nav.Item>
            </Nav>
            
        </Container>
    )
}

export default MyNavbar