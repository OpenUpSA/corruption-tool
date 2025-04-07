import React from 'react';

import { useAppContext } from '../AppContext';

import Map from '../components/Map';
import Panel from '../components/Panel';
import Search from '../components/Search';
import Breadcrumbs from '../components/Breadcrumbs';


function Home() {

    const { choroplethCounts } = useAppContext();

	return (
        <>  
            <div className="map-container">
                <div style={{ height: '100%', width: '100%' }}>
                    <Map counts={choroplethCounts} />
                </div>
                <Panel />
                <Breadcrumbs page="home"/>
                <Search />
            </div>
        </>
	);
}

export default Home;