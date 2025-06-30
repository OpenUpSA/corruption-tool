import React, { useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

import Map from '../components/Map';
import Panel from '../components/Panel';
import Search from '../components/Search';
import Breadcrumbs from '../components/Breadcrumbs';


function Home() {
    const { choroplethCounts } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (!params.has('geo')) {
            params.set('geo', 'EC');
            navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
        }
    }, [location.search, navigate]);

    return (
        <>
            <div className="map-container">
                <div style={{ height: '100%', width: '100%' }}>
                    <Map counts={choroplethCounts} />
                </div>
                <Panel />
                <Breadcrumbs page="home" />
                <Search />
            </div>
        </>
    );
}

export default Home;