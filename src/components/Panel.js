import { React, useEffect, useState } from 'react';
import { useAppContext } from '../AppContext';

import { Link } from 'react-router-dom';

import { Row, Col, Accordion } from 'react-bootstrap';


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLocationDot,
    faFile,
    faGear,
    faIdBadge
} from "@fortawesome/free-solid-svg-icons";


function Panel() {

    const { focus, corruptionTypesData, servicesInvolvedData, officialsInvolvedData  } = useAppContext();

    return (
        <div className="panel">
            <header>
                <Row>
                    <Col>
                        <Row>
                            <Col xs="auto">
                                <FontAwesomeIcon icon={faLocationDot} color='#7a185a'/>
                            </Col>
                            <Col>
                                {focus.name}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs="auto">
                        120
                    </Col>
                </Row>
            </header>
            <div className="panel-content">
                <Accordion defaultActiveKey={['0','1','2']} alwaysOpen>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            <Row>
                                <Col xs="auto">
                                    <FontAwesomeIcon icon={faFile} color='#7a185a'/>
                                </Col>
                                <Col>
                                    Corruption Type
                                </Col>
                            </Row>
                        </Accordion.Header>
                        <Accordion.Body>
                            {
                                corruptionTypesData.map((corruptionType, index) => (
                                    <Row key={index}>
                                        <Col>
                                            {corruptionType.label}
                                        </Col>
                                        <Col xs="auto">
                                            {corruptionType.cases.length}
                                        </Col>
                                    </Row>
                                ))
                            }


                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="1">
                        <Accordion.Header>
                            <Row>
                                <Col xs="auto">
                                    <FontAwesomeIcon icon={faGear} color='#7a185a'/>
                                </Col>
                                <Col>
                                    Services Involved
                                </Col>
                            </Row>
                        </Accordion.Header>
                        
                        <Accordion.Body>
                            {
                                servicesInvolvedData.map((service, index) => (
                                    <Row key={index}>
                                        <Col>
                                            {service.label}
                                        </Col>
                                        <Col xs="auto">
                                            {service.cases.length}
                                        </Col>
                                    </Row>
                                ))
                            }
                        </Accordion.Body>
                    </Accordion.Item>
                    
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>
                            <Row>
                                <Col xs="auto">
                                    <FontAwesomeIcon icon={faIdBadge} color='#7a185a'/>
                                </Col>
                                <Col>
                                    Officials Involved
                                </Col>
                            </Row>
                        </Accordion.Header>
                        <Accordion.Body>
                            {
                                officialsInvolvedData.map((official, index) => (
                                    <Row key={index}>
                                        <Col>
                                            {official.label}
                                        </Col>
                                        <Col xs="auto">
                                            {official.cases.length}
                                        </Col>
                                    </Row>
                                ))
                            }
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            
            </div>
            <footer>
                <Link to={`/dashboard?geo=${focus.code}`}>View details for {focus.name}</Link>
            </footer>
        </div>
    );
}

export default Panel;