// AppContext.js
import { createContext, use, useContext, useEffect, useState } from 'react';

import nationalBoundary from './assets/ZA_2020.json';
import provinceBoundaries from './assets/Provinces_2020.json';
import districtBoundaries from './assets/Districts_2020.json';
import muniBoundaries from './assets/LocalMuni_2020.json';
import searchDataJson from './assets/search.json';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [nationalGeo, setNationalGeo] = useState(nationalBoundary);
    const [provincesGeo, setProvincesGeo] = useState(provinceBoundaries);
    const [districtsGeo, setDistrictsGeo] = useState(districtBoundaries);
    const [munisGeo, setMunisGeo] = useState(muniBoundaries);
    const [focus, setFocus] = useState({type: 'National', name: 'South Africa', code: 'ZA'});
    const [geo, setGeo] = useState(nationalGeo);
    const [searchData, setSearchData] = useState(searchDataJson);
    const koboEndpoint = 'process.env.KOBO_PROXY';
    const [corruptionTypes, setCorruptionTypes] = useState([]);
    const [corruptionTypesData, setCorruptionTypesData] = useState([]);
    const [servicesInvolved, setServicesInvolved] = useState([]);
    const [servicesInvolvedData, setServicesInvolvedData] = useState([]);
    const officialsInvolved = [
        { label: "Administratitve officials", value: "administrative_officials", cases: [] },
        { label: "Elected officials", value: "elected_officials", cases: [] }
    ];
    const [officialsInvolvedData, setOfficialsInvolvedData] = useState([]);


    const getChoices = async () => {
        const response = await fetch(`${koboEndpoint}/assets/aBqe4PvaNnmvNC2rBFNHeE/`);
        const form = await response.json();
    
        let survey = form.content.survey;
        let choices = form.content.choices;
    
        let corruptionType = survey.find(item => item.name === "Type_of_Corruption_Involved_S");
        let corruptionTypeChoices = choices.filter(choice => choice.list_name === corruptionType.select_from_list_name);
    
        let servicesInvolved = survey.find(item => item.name === "Type_of_Municipal_Service_Invo");
        let servicesInvolvedChoices = choices.filter(choice => choice.list_name === servicesInvolved.select_from_list_name);

      
    
        const newCorruptionTypesData = corruptionTypeChoices.map(choice => ({
            label: choice.label[0],
            value: choice.name,
            cases: []
        }));
    
        const newServicesInvolvedData = servicesInvolvedChoices.map(choice => ({
            label: choice.label[0],
            value: choice.name,
            cases: []
        }));
        

        
    
        setCorruptionTypes(corruptionTypeChoices);
        setServicesInvolved(servicesInvolvedChoices);
        setCorruptionTypesData(newCorruptionTypesData);
        setServicesInvolvedData(newServicesInvolvedData);
        
    };

    const groupCases = (field, data) => {
        const grouped = {};

        if (!data?.results || !Array.isArray(data.results)) {
            return grouped; 
        }
    
        data.results.forEach(entry => {
            const key = Object.keys(entry).find(k => k.endsWith(field));
            const groupField = entry[key] || 'unknown';
    
            if (!grouped[groupField]) {
                grouped[groupField] = [];
            }
            grouped[groupField].push(entry);
        });
    
        return grouped;
    };

    const getData = async () => {
        const response = await fetch(`${koboEndpoint}/assets/aBqe4PvaNnmvNC2rBFNHeE/data`);
        const data = await response.json();

        console.log(data);
    
        let type_of_corruption = groupCases('Type_of_Corruption_Involved_S', data);
        let services_involved = groupCases('Type_of_Municipal_Service_Invo', data);
    
        // Both queries:
        let admin_staff = groupCases('Were_any_administrative_staff_', data);
        let municipal_office = groupCases('Involvement_of_Municipal_Offic', data);
    
        setCorruptionTypesData(prev => prev.map(type => ({
            ...type,
            cases: type_of_corruption[type.value] || []
        })));
    
        setServicesInvolvedData(prev => prev.map(type => ({
            ...type,
            cases: services_involved[type.value] || []
        })));
    
        // Combine logic for officials
        setOfficialsInvolvedData([
            {
                ...officialsInvolved[0], 
                cases: (admin_staff['yes'] || [])
            },
            {
                ...officialsInvolved[1], 
                cases: (municipal_office['yes'] || [])
            }
        ]);
    };


    useEffect(() => {
        if (focus.type === 'National') {
            setGeo(nationalGeo);
        } else if(focus.type === 'Province') {
            const province = provincesGeo.features.find(province => province.properties.Code === focus.code);
            setGeo({"type":"FeatureCollection", "features": [province]});
        } else if(focus.type === 'District') {
            const district = districtsGeo.features.find(district => district.properties.Code === focus.code);
            setGeo({"type":"FeatureCollection", "features": [district]});
        } else if(focus.type === 'Municipality') {
            const muni = munisGeo.features.find(muni => muni.properties.Code === focus.code);
            setGeo({"type":"FeatureCollection", "features": [muni]});
        }
        getData();
    }, [focus]);

    useEffect(() => {

        const urlParams = new URLSearchParams(window.location.search);
        const geoCode = urlParams.get('geo');

        if (geoCode && geoCode !== focus.code) {

            const province = provincesGeo.features.find(province => province.properties.Code === geoCode);
            const district = districtsGeo.features.find(district => district.properties.Code === geoCode);
            const muni = munisGeo.features.find(muni => muni.properties.Code === geoCode);

            if (province) {
                setFocus({type: 'Province', name: province.properties.Province, code: geoCode});
            } else if (district) {
                setFocus({type: 'District', name: district.properties.District, code: geoCode});
            } else if (muni) {
                setFocus({type: 'Municipality', name: muni.properties.Municipality, code: geoCode});
            }

        }

        getChoices();        
        
    }, []);

    useEffect(() => {
        console.log(corruptionTypes);
    }, [corruptionTypes, servicesInvolved]);

    useEffect(() => {
        console.log(corruptionTypesData);
    }, [corruptionTypesData]);


    return (
        <AppContext.Provider value={
            { 
                koboEndpoint,
                nationalGeo,
                provincesGeo,
                districtsGeo,
                munisGeo,
                searchData,
                focus,
                setFocus,
                geo,
                corruptionTypes,
                servicesInvolved,
                officialsInvolved,
                corruptionTypesData,
                servicesInvolvedData,
                officialsInvolvedData
            }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
