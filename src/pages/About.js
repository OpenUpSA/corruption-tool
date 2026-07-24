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
                    <h2>Ubiko</h2>
                    <p>In isiXhosa, the word ubiko comes from the verb root -bika, which means to report, announce, or bring news (often serious, official, or formal news).</p>
                    <p>When applied specifically to <strong>reporting corruption</strong>, <em>ubiko</em> carries deep cultural and civic weight:</p>
                    <ul>
                        <li><strong>Sounding the alarm:</strong> It functions as a formal whistle-blowing or disclosure mechanism. It is the official act of bringing a hidden wrong (like <em>urhwaphilizo</em> - corruption) to light before an authority or the public.</li>
                        <li><strong>A civic duty:</strong> Historically, <em>ukubika</em> is used when someone goes to the elders, leadership, or community structures to report a significant incident or threat. In modern anti-corruption work, using the term <em>ubiko</em> reframes whistle-blowing not as “snitching,” but as a responsible, necessary act of civic duty to protect collective resources.</li>
                    </ul>
                    <p>Essentially, <em>ubiko</em> is the bridge between witnessing malpractice and initiating accountability.</p>

                    <h2>About Ubiko</h2>
                    <ul>
                        <li>It is a citizen-focused digital platform designed to promote transparency, accountability, and active civic participation in local government.</li>
                        <li>It is developed under the Strengthening Against Corruption (SAAC) project and funded by the European Union.</li>
                        <li>It's implemented by Corruption Watch, Social Change Assistance Trust, and Transparency International.</li>
                        <li>Ubiko empowers residents to identify, understand, and anonymously report corruption-related issues affecting their communities.</li>
                        <li>Ubiko serves as a hub for civic education, offering practical resources to support community-based organisations (CBOs) and individuals in engaging meaningfully in local governance processes.</li>
                    </ul>
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