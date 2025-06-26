import { React, useEffect, useState } from 'react';

import { Container, Row, Col } from 'react-bootstrap';

import logoStrip from '../assets/img/Logo_Strip.png';

function About() {
    return (
        <Container className="page-content-xl">
            <Row>
                <Col>
                    <h1>About the Local Government Anti-Corruption Digital Tool</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>The Local Government Anti-Corruption Digital Tool (DTT) is a citizen-focused platform designed to promote transparency, accountability, and active civic participation in local government. Developed under the Strengthening Against Corruption (SAAC) project—funded by the European Union and implemented by Corruption Watch, Social Change Assistance Trust, and Transparency International—the tool empowers residents to identify, understand, and anonymously report corruption-related issues affecting their communities.</p>
                    <p>Responding to the real challenges of municipal governance, the DTT provides easy access to information on public services, municipal budgets, service delivery performance, and the roles and responsibilities of local officials. Its user-friendly interface guides citizens in recognizing red flags of corruption and offers secure, anonymous channels for reporting misconduct—helping to protect whistleblowers and promote accountability.</p>
                    <p>In addition, the DTT serves as a hub for civic education, offering practical resources to support community-based organizations (CBOs) and individuals in engaging meaningfully in local governance processes.</p>

                </Col>
            </Row>
            <Row>
                <Col>
                    <img
                        src={logoStrip}
                        style={{ display: 'block', margin: '2rem auto', maxWidth: '100%', height: 'auto' }}
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default About;