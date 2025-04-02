import { React, useEffect, useState } from 'react';

import { Container, Row, Col } from 'react-bootstrap';

function About() {
	return (
        <Container className="page-content-xl">
            <Row>
                <Col>
                    <h1>About this tool</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vehicula mauris elit, vel vestibulum leo sagittis quis. Cras dui tortor, hendrerit sit amet dictum ut, pretium et dui. Donec ac cursus justo. Etiam placerat nulla ac egestas vulputate. Aliquam pellentesque varius tellus eu scelerisque. Vivamus sed luctus sem, sit amet gravida nunc. Vivamus at ultrices libero. Quisque ultrices hendrerit diam vel rhoncus. Ut vitae nisi convallis, ornare sem a, iaculis enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce facilisis sem sed egestas consectetur. Ut vitae ipsum convallis, porttitor nulla vel, dignissim est. Donec gravida felis quam, eu faucibus velit iaculis vel. Quisque tempus orci id auctor mattis. Quisque faucibus, justo at pretium gravida, ipsum justo eleifend justo, in dictum enim ligula at lectus.</p>
                </Col>
            </Row>
        </Container>
	);
}

export default About;