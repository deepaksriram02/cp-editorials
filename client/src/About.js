import {useState, useEffect} from 'react'
import Axios from 'axios'

import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';



const HOMEURL=require('./Homeurl')



function About(props){

    return (
        <Container>
            {/* Content about the website goes here. */}
            <ListGroup variant="flush">
                <ListGroup.Item>This is a platform for coders to share their solutions to problems from various coding websites and also 
                find solutions to problems they might be stuck with.</ListGroup.Item>
                <ListGroup.Item>Problems can be searched based on the title or by pasting the link to the problem.</ListGroup.Item>
                <ListGroup.Item>Posts can be liked or disliked.</ListGroup.Item>
                <ListGroup.Item>Posts are rated based on the number of likes and dislikes they have and 
            are ranked in the order of rating.</ListGroup.Item>
                <ListGroup.Item>Viewers of a post can also add comments to suggest their feedback</ListGroup.Item>
                <ListGroup.Item>There is a leaderboard for users who are ranked based on their contribution.</ListGroup.Item>
                <ListGroup.Item>Happy Coding :)</ListGroup.Item>
            </ListGroup>



           
            
        </Container>
    )
}

export default About