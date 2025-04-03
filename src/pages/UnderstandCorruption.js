import { React, use, useEffect, useState } from 'react';
import { useAppContext } from '../AppContext';

import { Container, Row, Col } from 'react-bootstrap';


function UnderstandCorruption() {

    const { koboEndpoint } = useAppContext();
    const [posts, setPosts] = useState([]);

    const getPosts = async () => {
        const response = await fetch(`${koboEndpoint}/assets/amvq455NyzA54THNne6k3a/data`);
        const data = await response.json();
        setPosts(data.results);
    };


    useEffect(() => {
        getPosts();
    }, []);

    useEffect(() => {
        console.log(posts);
    }, [posts]);

	return (
        <Container className="page-content-xl">
            <Row>
                <Col>
                    <h1>Understand Corruption</h1>
                </Col>
            </Row>
            <Row className="mt-5">
                {
                    posts.map((post, index) => (
                        <Col key={index} xs={12} md={6} lg={4}>
                            <div className="story-card">
                                <div className="story-card-image" style={{backgroundImage: `url(${post._attachments[0].download_url.replace('?format=json','')})`}}></div>
                                <div className="story-card-content">
                                    <h2>{post.Title}</h2>
                                    <p>{post.Excerpt}</p>
                                </div>
                            </div>
                        </Col>
                    ))
                }
            </Row>
        </Container>
	);
}

export default UnderstandCorruption;