import { React, use, useEffect, useState } from 'react';
import { useAppContext } from '../AppContext';

import ReactMarkdown from 'react-markdown';

import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import { useNavigate, useLocation } from 'react-router-dom';


import { Container, Row, Col } from 'react-bootstrap';


function UnderstandCorruption() {

    const location = useLocation();

    const navigate = useNavigate();

    const { koboEndpoint } = useAppContext();
    const [posts, setPosts] = useState([]);
    const [currentPost, setCurrentPost] = useState(null);

    const getPosts = async () => {
        const response = await fetch(`${koboEndpoint}/assets/amvq455NyzA54THNne6k3a/data`);
        const data = await response.json();
        setPosts(data.results);
    };

    useEffect(() => {
        getPosts();
    }, []);


    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const postId = urlParams.get('p');
    
        if (postId && posts.length > 0) {
            const post = posts.find((post) => parseInt(post._id) === parseInt(postId));
            if (post) {
                setCurrentPost(post);
            }
        } else {
            setCurrentPost(null);
        }
    }, [location.search, posts]);

    useEffect(() => {
        console.log(posts);
    }, [posts]);

    useEffect(() => {
        console.log(currentPost);
    }, [currentPost]);

	return (
        <Container className="page-content-xl">
            {
                currentPost != null ? (
                    <Row className="mb-5">
                        <Col>
                            <h1>{currentPost.Title}</h1>
                            <p>{currentPost.Excerpt}</p>
                            <div className="story-card-image" style={{backgroundImage: `url(${koboEndpoint}/assets/amvq455NyzA54THNne6k3a/data/11/attachments/3/)`}}></div>
                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{currentPost.Content}</ReactMarkdown>
                        </Col>
                    </Row>
                )
            : (
                <>
                <Row>
                    <Col>
                        <h1>Understand Corruption</h1>
                    </Col>
                </Row>
                <Row className="mt-5">
                    {
                        posts.map((post, index) => (
                            <Col key={index} xs={12} md={6} lg={4}>
                                <div className="story-card" onClick={() => navigate(`/understand-corruption?p=${encodeURIComponent(post._id)}`)}>
                                    <div className="story-card-image" style={{backgroundImage: `url(${koboEndpoint}/assets/amvq455NyzA54THNne6k3a/data/11/attachments/3/)`}}></div>
                                    <div className="story-card-content">
                                        <h2 className="mb-4">{post.Title}</h2>
                                        <p>{post.Excerpt}</p>
                                    </div>
                                </div>
                            </Col>
                        ))
                    }
                </Row>
                </>
            )}
        </Container>
	);
}

export default UnderstandCorruption;