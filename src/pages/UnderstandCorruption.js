import { React, useEffect, useState } from 'react';
import { useAppContext } from '../AppContext';

import { Container, Row, Col } from 'react-bootstrap';


function UnderstandCorruption() {

    const { koboEndpoint } = useAppContext();

    const getPosts = async () => {
        const response = await fetch(`${koboEndpoint}/assets/amvq455NyzA54THNne6k3a/data`);
        const data = await response.json();
        console.log(data);
    };


    useEffect(() => {
        getPosts();
    }, []);

	return (
        <Container>
            <Row>
                <Col>
                    <h1>Understand Corruption</h1>
                </Col>
            </Row>
        </Container>
	);
}

export default UnderstandCorruption;