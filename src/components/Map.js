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


function Map() {

    const [markers, setMarkers] = useState([]);
    const navigate = useNavigate();

    const { geo } = useAppContext();

    // const markers = [
    //     { lat: -33.9249, lng: 18.4241, label: "Cape Town" },
    //     { lat: -25.7461, lng: 28.1881, label: "Pretoria" },
    //     { lat: -29.0852, lng: 26.1596, label: "Bloemfontein" },
    //     { lat: -26.2041, lng: 28.0473, label: "Johannesburg" },
    //     { lat: -24.6581, lng: 25.9128, label: "Gaborone" },
    // ];

    useEffect(() => {

        
        

    }, [geo]);


    const onEachFeature = (feature, layer) => {
        layer.on({
            click: () => {
                
                const geoCode = geo.features[0].properties.Code;
                navigate(`/dashboard?geo=${encodeURIComponent(geoCode)}`);

            }
        });
    };

    return (
        <MapContainer center={[-28, 24]} zoom={6} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=GxDRx2e1Cv4bP3S2TagMahOlUHu18pbRoebPnoxPtyVI21wXrlxRXfWJCMwjggQY"/>
            <GeoJSON 
                data={geo}
                onEachFeature={onEachFeature}
                key={geo.features[0].properties.Code} 
                style={{
                    color: "#7a185a",
                    weight: 1,
                    fillColor: "transparent",
                    fillOpacity: 0.2
                }}
            />
            <ZoomOnGeo geo={geo}  />
            <MarkerClusterGroup>
                {markers.map((marker, index) => (
                    <Marker key={index} position={[marker.lat, marker.lng]}>
                        <Popup>{marker.label}</Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    );
}

export default Map;
