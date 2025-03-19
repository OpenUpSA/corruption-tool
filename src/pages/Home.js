import React from 'react';

import Map from '../components/Map';
import Panel from '../components/Panel';
import Search from '../components/Search';


function Home() {
	return (
        <>
            <div style={{ height: '100vh', width: '100%' }}>
                <Map />
            </div>
            <Panel />
            <Search />
        </>
	);
}

export default Home;