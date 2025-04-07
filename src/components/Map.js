import { React, useEffect, useState } from 'react';

import { useAppContext } from '../AppContext';

import { useNavigate } from 'react-router-dom';

import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import MarkerClusterGroup from "react-leaflet-cluster";

import 'leaflet/dist/leaflet.css';

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";



delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

function ZoomOnGeo({ geo }) {
    const map = useMap();

    useEffect(() => {
        if (geo && geo.features && geo.features.length > 0) {
            const layer = L.geoJSON(geo);
            map.fitBounds(layer.getBounds());
        }
    }, [geo, map]);

    return null;
}


function Map(props) {


    const navigate = useNavigate();

    const { geo, focus, setFocus, enrichFocus, searchData } = useAppContext();

    const getColor = (count) => {
        return count > 50 ? '#800026' :
            count > 20 ? '#BD0026' :
                count > 10 ? '#E31A1C' :
                    count > 5 ? '#FC4E2A' :
                        count > 0 ? '#FD8D3C' :
                            '#FFF';
    };



    useEffect(() => {

        
        

    }, [geo]);


    const onEachFeature = (feature, layer) => {
        const code = feature.properties.Code;
        const name = feature.properties.Name;
        const count = props.counts[code] || 0;

        layer.on({
            click: () => {

                
                let href = '/';
                if (window.location.pathname.includes('dashboard')) {
                    href = '/dashboard/';
                }

                navigate(`${href}?geo=${encodeURIComponent(code)}`);
            },
            mouseover: () => {
                layer.setStyle({
                    color: "#7a185a",
                    weight: 2.5,
                    fillOpacity: 0.3
                });
            },
            mouseout: () => {
                layer.setStyle({
                    color: "#7a185a",
                    weight: 2,
                    fillOpacity: 0.2
                });
            }
        });

        layer.bindTooltip(`${name} (${count})`, {
            sticky: true,
            direction: "top",
            opacity: 0.9
        });
    };

    return (
        <MapContainer center={[-28, 24]} zoom={6} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=GxDRx2e1Cv4bP3S2TagMahOlUHu18pbRoebPnoxPtyVI21wXrlxRXfWJCMwjggQY" />
            <GeoJSON
                key={geo.features[0].properties.Code + JSON.stringify(props.counts)} 
                data={geo}
                onEachFeature={onEachFeature}
                style={feature => {
                    const count = props.counts[feature.properties.Code] || 0;
                    return {
                        color: "#7a185a",
                        weight: 2,
                        fillColor: getColor(count),
                        fillOpacity: 0.2
                    };
                }}
            />
            <ZoomOnGeo geo={geo} />

        </MapContainer>
    );
}

export default Map;
