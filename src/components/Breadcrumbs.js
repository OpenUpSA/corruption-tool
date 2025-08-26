import { React, useState } from 'react';

import { useAppContext } from '../AppContext';

import { useNavigate } from 'react-router-dom';


function Breadcrumbs(props) {
    const { searchData, focus } = useAppContext();
    const navigate = useNavigate();

    const getBreadcrumbTrail = (focus, searchData) => {
        const trail = [{ name: "South Africa", code: "ZA" }];
    
        if (focus.type === "Province") {
            const province = searchData.provinces.find(p => p.code === focus.code);
            if (province) trail.push(province);
        } else if (focus.type === "Municipality") {
            const province = searchData.provinces.find(p => p.code === focus.province);
            const muni = province?.municipalities.find(m => m.code === focus.code);
            if (province && muni) trail.push(province, muni);
        }
    
        return trail;
    };

    const trail = getBreadcrumbTrail(focus, searchData);

    return (
        <>
        {
            props.page && props.page === 'home' ?
            
                <div className="home-breadcrumbs mt-3">
                    <div className="breadcrumbs">
                        <ul>
                        {trail.map((item, idx) => (
                            <li key={idx} onClick={() => navigate(`/?geo=${encodeURIComponent(item.code)}`)}>
                                {item.name}
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>
        
            :

            <div className="dashboard-breadcrumbs">
                <div className="breadcrumbs">
                    <ul>
                    {trail.map((item, idx) => (
                        <li key={idx} onClick={() => navigate(`/dashboard/?geo=${encodeURIComponent(item.code)}`)}>
                            <span>{item.name}</span>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
        }
        </>
    );
}

export default Breadcrumbs;
