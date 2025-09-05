import { Fragment, React, use, useEffect, useState } from 'react';
import { useAppContext } from '../AppContext';

import ReactMarkdown from 'react-markdown';

import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import { useNavigate, useLocation } from 'react-router-dom';


import { Container, Row, Col } from 'react-bootstrap'; 



function orderPostsBy(posts, key) {
    return posts.sort((a, b) => {
        if (a[key] == null && b[key] == null) return 0;
        if (a[key] == null) return 1;
        if (b[key] == null) return -1;
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
    });
}

function groupPostsBy(posts, key) {
    posts = orderPostsBy(posts, 'Enter_the_number_you_ppear_in_its_section');
    posts = posts.reduce((result, post) => {
        (result[post[key] || ""] = result[post[key] || ""] || []).push(post);
        result[post[key] || ""] = result[post[key] || ""];
        return result;
    }, {});

    // Arrange posts keys so "" always comes first if it exists
    if (posts[""]) {
        const orderedPosts = { "": posts[""] };
        Object.keys(posts).forEach(k => {
            if (k !== "") {
                orderedPosts[k] = posts[k];
            }
        });
        return orderedPosts;
    }

    return posts;
}

function getPost(posts, id) {
    for (const category in posts) {
        const post = posts[category].find(p => p._id == id);
        if (post) return post;
    }
    return null;
}

function UnderstandCorruption() {

    const location = useLocation();

    const navigate = useNavigate();

    const { koboEndpoint, isLocal } = useAppContext();
    const [posts, setPosts] = useState({});
    const [currentPost, setCurrentPost] = useState(null);


    const getPosts = async () => {
        const response = await fetch(`${koboEndpoint}/api/v2/assets/amvq455NyzA54THNne6k3a/data`.replace(isLocal ? '' : '/api/v2', ''));
        const data = await response.json();
        setPosts(groupPostsBy(data.results || [], "Please_select_the_na_this_post_to_appear"));
    };

    useEffect(() => {
        getPosts();
    }, []);


    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const postId = urlParams.get('p');

        if (postId) {
            const post = getPost(posts, postId);
            
            if (post) {
                setCurrentPost(post);
            }
        } else {
            setCurrentPost(null);
        }
    }, [location.search, posts]);


	return (
        <Container className="page-content-xl">
            {
                currentPost != null ? (
                    <Row className="mb-5">
                        <Col>
                            <h1>{currentPost.Title}</h1>
                            <p>{currentPost.Excerpt}</p>
                            <div className="story-card-image" style={{backgroundImage: `url(${currentPost._attachments && currentPost._attachments[0] ? currentPost._attachments[0].download_url.replace("https://kf-kbt.openup.org.za", koboEndpoint).replace(isLocal?'' : '/api/v2', '').split('?')[0] : ''})`}}></div>
                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{currentPost.Content}</ReactMarkdown>
                        </Col>
                    </Row>
                ) : (
                <>
                <Row className="mb-4">
                    <Col>
                        <h1>Understand Corruption</h1>
                    </Col>
                </Row>
                {
                    Object.keys(posts).map((category, _index) => (
                        <Fragment key={`cat-row-${_index}`}>
                        {category !== "" ? <h2 key={`cat-head-${_index}`} className="my-4">{category}</h2> : null}
                        <Row >
                            {posts[category].map((post, index) => (
                                <Col key={post._id} xs={12} md={6} lg={4} className="mb-4">
                                    <div className="story-card" onClick={() => navigate(`/understand-corruption?p=${encodeURIComponent(post._id)}`)}>
                                        <div className="story-card-image" style={{backgroundImage: `url(${post._attachments && post._attachments[0] ? post._attachments[0].download_url.replace("https://kf-kbt.openup.org.za", koboEndpoint).replace(isLocal?'' : '/api/v2', '').split('?')[0] : ''})`}}></div>
                                        <div className="story-card-content">
                                            <h2 className="mb-4">{post.Title}</h2>
                                            <p>{post.Excerpt}</p>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                        </Fragment>
                    ))
                }
                </>
                )
            }
        </Container>
	);
}

export default UnderstandCorruption;