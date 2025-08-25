import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import nationalBoundary from './assets/ZA_2020.json';
import provinceBoundaries from './assets/Provinces_2020.json';
import muniBoundaries from './assets/MuniDistricts.json';
import searchDataJson from './assets/search3.json';
import {getKoboEndpoint} from './utils';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const isLocal = process.env.LOCAL === '1';
    const koboEndpoint = getKoboEndpoint(window.location, process.env.KOBO_PROXY, isLocal);
    const [municipalityProperties, setMunicipalityProperties] = useState(null);
    const [nationalGeo, setNationalGeo] = useState(nationalBoundary);
    const [provincesGeo, setProvincesGeo] = useState(provinceBoundaries);
    const [munisGeo, setMunisGeo] = useState(muniBoundaries);
    const [focus, setFocus] = useState({type: 'National', name: 'South Africa', code: 'ZA'});
    const [geo, setGeo] = useState(munisGeo);
    const [searchData, setSearchData] = useState(searchDataJson);
    const [allData, setAllData] = useState([]);
    const [corruptionTypes, setCorruptionTypes] = useState([]);
    const [corruptionTypesData, setCorruptionTypesData] = useState([]);
    const [servicesInvolved, setServicesInvolved] = useState([]);
    const [servicesInvolvedData, setServicesInvolvedData] = useState([]);
    const [officialsInvolvedData, setOfficialsInvolvedData] = useState([
        { label: "Administratitve officials", value: "administrative_officials", cases: [] },
        { label: "Elected officials", value: "elected_officials", cases: [] }
    ]);
    const [hadEvidenceData, setHadEvidenceData] = useState([]);
    const [formMeta, setFormMeta] = useState(null);
    const [choroplethCounts, setChoroplethCounts] = useState({});

    const location = useLocation();

    const getChoices = async () => {
        const response = await fetch(`${koboEndpoint}/api/v2/assets/aBqe4PvaNnmvNC2rBFNHeE/`.replace(isLocal ? '' : '/api/v2', ''));
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
    
        if (!data || !Array.isArray(data)) {
            return grouped; 
        }
    
        data.forEach(entry => {
            const key = Object.keys(entry).find(k => k.endsWith(field));
            const rawValue = entry[key] || 'unknown';
            const values = rawValue.split(' ').map(v => v.trim());
    
            values.forEach(val => {
                if (!grouped[val]) {
                    grouped[val] = [];
                }
                grouped[val].push(entry);
            });
        });
    
        return grouped;
    };

    const getData = async () => {
        let query = '';

    
        if (focus.type !== 'National') {

            const provinceCode = focus.province; 
            const muniCode = focus.municipality;

            
            if(formMeta) { 

                if (focus.type === 'Municipality') {

                    let muni_field = "Municipality_Name";

                    if(focus.province == "EC") {
                        muni_field = "Municipality_Name_Eastern_Cape";
                    } else if(focus.province == "FS") {
                        muni_field = "Municipality_Name_Free_State";
                    } else if(focus.province == "GT") {
                        muni_field = "Municipality_Name_Gauteng";
                    } else if(focus.province == "KZN") {
                        muni_field = "Municipality_Name_KwaZulu_Natal";
                    } else if(focus.province == "LP") {
                        muni_field = "Municipality_Name_Limpopo";
                    } else if(focus.province == "MP") {
                        muni_field = "Municipality_Name_Mpumalanga";
                    } else if(focus.province == "NC") {
                        muni_field = "Municipality_Name_Northern_Cape";
                    } else if(focus.province == "NW") {
                        muni_field = "Municipality_Name_North_West";
                    } else if(focus.province == "WC") {
                        muni_field = "Municipality_Name_Western_Cape";
                    }

                    const municipalityField = formMeta.survey.find(q => q.$xpath && q.$xpath.includes(muni_field));

                    if (municipalityField) {
                        query = `?query={"${municipalityField.$xpath}":"${focus.code}"}`;
                    }

                } else if (focus.type === 'Province') {
                    const provinceField = formMeta.survey.find(q => q.name == "Province_Name");
                    query=`?query={"${provinceField.$xpath}":"${focus.province}"}`;
                } else {
                    query = '';
                }
            }
        }

        const response = await fetch(`${koboEndpoint}/api/v2/assets/aBqe4PvaNnmvNC2rBFNHeE/data${query}`.replace(isLocal ? '' : '/api/v2', ''));
        const data = await response.json();
    
        const filtered = data.results;

        let type_of_corruption = groupCases('Type_of_Corruption_Involved_S', filtered);
        let services_involved = groupCases('Type_of_Municipal_Service_Invo', filtered);
        let admin_staff = groupCases('Were_any_administrative_staff_', filtered);
        let municipal_office = groupCases('Involvement_of_Municipal_Offic', filtered);
        let had_evidence = groupCases('Do_you_have_any_evidence_suppo', filtered);
    
        setCorruptionTypesData(prev => prev.map(type => ({
            ...type,
            cases: type_of_corruption[type.value] || []
        })));
    
        setServicesInvolvedData(prev => prev.map(type => ({
            ...type,
            cases: services_involved[type.value] || []
        })));
    
        setOfficialsInvolvedData([
            {
                ...officialsInvolvedData[0], 
                cases: (admin_staff['yes'] || [])
            },
            {
                ...officialsInvolvedData[1], 
                cases: (municipal_office['yes'] || [])
            }
        ]);

        setHadEvidenceData([
            {
                label: "Yes",
                value: "yes",
                cases: (had_evidence['yes'] || [])
            },
            {
                label: "No",
                value: "no",
                cases: (had_evidence['no'] || [])
            }
        ]);

        setAllData(filtered);

    };

    const getMuniProperties = (muni) => {
        if (!municipalityProperties) return {};
        const muniProps = municipalityProperties.find((muniProp) => {
            // get property that starts with Municipality_Name
            const propertyKey = Object.keys(muniProp).find(key => key.startsWith("Municipality_Name"));
            return muniProp[propertyKey] === muni.code;
        }) || {};
        let image = muniProps._attachments && muniProps._attachments.length > 0 ? muniProps._attachments[0].download_url.split('?')[0] : null;
        if (image){
            image = image.replace('https://kf-kbt.openup.org.za', koboEndpoint);
            if (!isLocal){
                image = image.replace('/api/v2', '');
            }
        }
        return {
            detail: muniProps.Municipality_Detail,
            image: image,
            image_alt: muniProps.Image_Attribution_reffrence,
            link_to_webpage: muniProps.Link_to_Webpage,
        }
    };

    const getMuniData = async () => {
        if (municipalityProperties !== null) return [municipalityProperties, false];
        const response = await fetch(`${koboEndpoint}/api/v2/assets/acp7tJne4mmsMxgtbhXMNL/data/`.replace(isLocal ? '' : '/api/v2', ''));
        const data = await response.json() || { results: [] };
        return [data.results, true];
    };

    const enrichFocus = (code, searchData) => {
        let result = { code, type: 'National', name: 'South Africa' };
    
        for (const province of searchData.provinces) {
            if (province.code === code) {
                return { ...result, type: 'Province', name: province.name, province: province.code };
            }
            for (const muni of province.municipalities) {
                if (muni.code === code) {
                    const properties = getMuniProperties(muni);
                    return { 
                        ...result, 
                        type: 'Municipality', 
                        name: muni.name, 
                        province: province.code,
                        parent: muni.parent, 
                        municipality: muni.code,
                        properties
                    };
                }
            }
        }
        return result;
    };

    const handleSuspectedGeoCodeChange = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const geoCode = urlParams.get('geo');
        if (geoCode && geoCode !== focus.code) {
            const enriched = enrichFocus(geoCode, searchData);
            setFocus(enriched);
        }
    };

    useEffect(() => {
        

        let newGeo = null;
    
        if (focus.type === 'National') {
            newGeo = provincesGeo;
        } else if (focus.type === 'Province') {
            // use searchData to get muni codes for this province
            const province = searchData.provinces.find(p => p.code === focus.code);
            const muniCodes = province?.municipalities?.map(m => m.code) || [];
    
            const munis = munisGeo.features.filter(
                m => muniCodes.includes(m.properties.Code)
            );
    
            newGeo = { type: "FeatureCollection", features: munis };
        } else if (focus.type === 'Municipality') {
            const muni = munisGeo.features.find(m => m.properties.Code === focus.code);
            newGeo = { type: "FeatureCollection", features: [muni] };
        }
    
        if (newGeo) {
            setGeo(newGeo);
        }
    }, [focus]);


    useEffect(() => {
        const fetchFormMeta = async () => {
            const response = await fetch(`${koboEndpoint}/api/v2/assets/aBqe4PvaNnmvNC2rBFNHeE/`.replace(isLocal ? '' : '/api/v2', ''));
            const data = await response.json();
            setFormMeta(data.content);
        };
        getMuniData().then(([data, updated]) => {
            if (updated) {
                setMunicipalityProperties(data);
            } else {
                handleSuspectedGeoCodeChange();
            }
        });

        fetchFormMeta();
        getChoices(); 
    
    }, [location.search]);

    useEffect(() => {
        if (!municipalityProperties) return;
        handleSuspectedGeoCodeChange();
    }, [municipalityProperties]);

    useEffect(() => {
        if (formMeta && focus) {
            getData();
        }
    }, [formMeta]);

    useEffect(() => {

        if (!formMeta) return;
    
        const newCounts = {};
    
        allData.forEach(entry => {
            const provinceKey = Object.keys(entry).find(k => k.endsWith("Province_Name"));
            const province = entry[provinceKey];
    
            if (province) {
                newCounts[province] = (newCounts[province] || 0) + 1;
            }
    
            let muni_field = "Municipality_Name";
    
            if (province === "EC") muni_field = "Municipality_Name_Eastern_Cape";
            else if (province === "FS") muni_field = "Municipality_Name_Free_State";
            else if (province === "GT") muni_field = "Municipality_Name_Gauteng";
            else if (province === "KZN") muni_field = "Municipality_Name_KwaZulu_Natal";
            else if (province === "LP") muni_field = "Municipality_Name_Limpopo";
            else if (province === "MP") muni_field = "Municipality_Name_Mpumalanga";
            else if (province === "NC") muni_field = "Municipality_Name_Northern_Cape";
            else if (province === "NW") muni_field = "Municipality_Name_North_West";
            else if (province === "WC") muni_field = "Municipality_Name_Western_Cape";
    
            const muniKey = Object.keys(entry).find(k => k.endsWith(muni_field));
            const muni = entry[muniKey];
    
            if (muni) {
                newCounts[muni] = (newCounts[muni] || 0) + 1;
            }
        });
    
        setChoroplethCounts(newCounts);
    }, [allData, formMeta]);





    return (
        <AppContext.Provider value={
            { 
                koboEndpoint,
                nationalGeo,
                provincesGeo,
                munisGeo,
                searchData,
                focus,
                setFocus,
                enrichFocus,
                geo,
                corruptionTypes,
                servicesInvolved,
                corruptionTypesData,
                servicesInvolvedData,
                officialsInvolvedData,
                hadEvidenceData,
                allData,
                choroplethCounts,
                isLocal
            }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
