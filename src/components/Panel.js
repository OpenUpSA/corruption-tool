import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { Link } from 'react-router-dom';
import { Row, Col, Accordion } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faLocationDot,
	faFile,
	faGear,
	faIdBadge,
	faChevronUp,
	faChevronDown
} from "@fortawesome/free-solid-svg-icons";

function Panel() {
	const { focus, corruptionTypesData, servicesInvolvedData, officialsInvolvedData, allData } = useAppContext();
	const [open, setOpen] = useState(false);

	return (
		<div className={`panel panel-drawer ${open ? 'open' : 'closed'}`}>
			<div className="panel-toggle" onClick={() => setOpen(!open)}>
				<FontAwesomeIcon color="#fff" icon={open ? faChevronDown : faChevronUp} />
			</div>

			<header>
				<Row>
					<Col>
						<Row>
							<Col xs="auto">
								<FontAwesomeIcon icon={faLocationDot} color='#7a185a' />
							</Col>
							<Col>
								<strong>{focus.name.length > 20 ? focus.name.slice(0, 20) + '…' : focus.name}</strong>
							</Col>
						</Row>
					</Col>
					<Col xs="auto">
						<strong>{allData.length}</strong>
					</Col>
				</Row>
			</header>

			<div className="panel-content">
				<Accordion defaultActiveKey={['0', '1', '2']} alwaysOpen>
					{/* Corruption Types */}
					<Accordion.Item eventKey="0">
						<Accordion.Header>
							<Row className="w-100">
								<Col xs="auto">
									<FontAwesomeIcon icon={faFile} color='#7a185a' />
								</Col>
								<Col>
									Corruption Type
								</Col>
							</Row>
						</Accordion.Header>
						<Accordion.Body>
							{corruptionTypesData.map((corruptionType, index) => (
								<Row key={index} className="panel-row">
									<Col>
										{corruptionType.label === "Other (Please specify)" ? "Other" : corruptionType.label}
									</Col>
									<Col xs="auto">
										{corruptionType.cases.length === 0 ? '-' : corruptionType.cases.length}
									</Col>
								</Row>
							))}
						</Accordion.Body>
					</Accordion.Item>

					{/* Services Involved */}
					<Accordion.Item eventKey="1">
						<Accordion.Header>
							<Row className="w-100">
								<Col xs="auto">
									<FontAwesomeIcon icon={faGear} color='#7a185a' />
								</Col>
								<Col>
									Services Involved
								</Col>
							</Row>
						</Accordion.Header>
						<Accordion.Body>
							{servicesInvolvedData.map((service, index) => (
								<Row key={index} className="panel-row">
									<Col>
										{service.label === "Other (Please specify)" ? "Other" : service.label}
									</Col>
									<Col xs="auto">
										{service.cases.length === 0 ? '-' : service.cases.length}
									</Col>
								</Row>
							))}
						</Accordion.Body>
					</Accordion.Item>

					{/* Officials Involved */}
					<Accordion.Item eventKey="2">
						<Accordion.Header>
							<Row className="w-100">
								<Col xs="auto">
									<FontAwesomeIcon icon={faIdBadge} color='#7a185a' />
								</Col>
								<Col>
									Officials Involved
								</Col>
							</Row>
						</Accordion.Header>
						<Accordion.Body>
							{officialsInvolvedData.map((official, index) => (
								<Row key={index} className="panel-row">
									<Col>{official.label}</Col>
									<Col xs="auto">
										{official.cases.length === 0 ? '-' : official.cases.length}
									</Col>
								</Row>
							))}
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</div>

			<footer className="mt-3">
				<Link to={`/dashboard?geo=${focus.code}`}>
					View details for {focus.name.length > 20 ? focus.name.slice(0, 20) + '…' : focus.name}
				</Link>
			</footer>
		</div>
	);
}

export default Panel;
