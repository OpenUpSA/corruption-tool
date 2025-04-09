import React, { useState } from 'react';
import { Container, Navbar, Nav, Button, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import corruptionWatchLogo from '../assets/corruption-watch.png';

function Header() {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<>
			<Navbar bg="primary" variant="dark" className="d-flex justify-content-between">
				<Container fluid className="d-flex align-items-center justify-content-between">
					<Navbar.Brand as={Link} to="/">
						<img src={corruptionWatchLogo} alt="Corruption Watch" style={{ width: "100px" }} />
					</Navbar.Brand>

					{/* Hamburger button only on small screens */}
					<Button variant="dark" className="d-lg-none" onClick={handleShow}>
						☰
					</Button>

					
					<Nav className="d-none d-lg-flex me-auto">
						<Nav.Link as={Link} to="/"><div className="menu-item-inner">Map</div></Nav.Link>
						<Nav.Link as={Link} to="/understand-corruption"><div className="menu-item-inner">Understand corruption</div></Nav.Link>
						<Nav.Link as={Link} to="/dashboard"><div className="menu-item-inner">Dashboard</div></Nav.Link>
						<Nav.Link as={Link} to="/about"><div className="menu-item-inner">About this tool</div></Nav.Link>
					</Nav>

					<Button variant="dark" as={Link} to="/report" className="text-white d-none d-lg-block">
						Report corruption
					</Button>
				</Container>
			</Navbar>

			{/* Offcanvas for mobile menu */}
			<Offcanvas show={show} onHide={handleClose} placement="end" className="bg-primary text-white">
				<Offcanvas.Header closeButton closeVariant="white">
					<Offcanvas.Title></Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					<Nav className="flex-column">
						<Nav.Link as={Link} to="/" onClick={handleClose}>Map</Nav.Link>
						<Nav.Link as={Link} to="/understand-corruption" onClick={handleClose}>Understand corruption</Nav.Link>
						<Nav.Link as={Link} to="/dashboard" onClick={handleClose}>Dashboard</Nav.Link>
						<Nav.Link as={Link} to="/about" onClick={handleClose}>About this tool</Nav.Link>
						<Button as={Link} to="/report" onClick={handleClose} className="mt-3" variant="dark">
							Report corruption
						</Button>
					</Nav>
				</Offcanvas.Body>
			</Offcanvas>
		</>
	);
}

export default Header;
