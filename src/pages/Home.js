import React from 'react';

import Map from '../components/Map';
import Panel from '../components/Panel';
import Search from '../components/Search';
import Breadcrumbs from '../components/Breadcrumbs';


function Home() {
	return (
        <>  
            <div className="map-container">
                <div style={{ height: '100%', width: '100%' }}>
                    <Map />
                </div>
                <Panel />
                <Breadcrumbs page="home"/>
                <Search />
            </div>
        </>
	);
}

export default Home;