

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';


function Heading(){

    return (
    <Navbar bg="dark" variant="dark" className="m-3">
        <Container className="justify-content-center">
            <Navbar.Brand >CP Editorials</Navbar.Brand>
        </Container>
    </Navbar>
    )
}

export default Heading