import React from 'react';

import { Container, Row, Col, Navbar, Nav, Button } from 'react-bootstrap';

import { Link } from 'react-router-dom';



import corruptionWatchLogo from '../assets/corruption-watch.png';


function Header() {

    return (
        <Navbar expand="lg" className="bg-primary">
            <Container fluid>
                <Row className="w-100 align-items-center">
                    <Col xs="auto" className="d-flex align-items-center">
                        <Link to="/"><img src={corruptionWatchLogo} alt="Corruption Watch" style={{ width: "100px" }} /></Link>
                    </Col>
                    <Col>
                        <Nav className="me-auto my-2 my-lg-0">
                            <Link to="/"><div>Map</div></Link>
                            <Link to="/understand-corruption"><div>Understand corruption</div></Link>
                            <Link to="/dashboard"><div>Dashboard</div></Link>
                            <Link to="/about"><div>About this tool</div></Link>
                        </Nav>
                    </Col>
                    <Col xs="auto" className="ms-auto d-flex align-items-center">
                        <Button variant="dark"><Link to="/report" className="text-white text-decoration-none">Report corruption</Link></Button>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    );
}

export default Header;