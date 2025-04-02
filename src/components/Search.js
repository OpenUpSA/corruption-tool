import { React, useState } from 'react';

import { useAppContext } from '../AppContext';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from 'react-router-dom';


function Search() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const { searchData, setFocus, enrichFocus, focus } = useAppContext();
    const navigate = useNavigate();

    

    const handleSearch = (term) => {
        if (term.length <= 3) {
            setSearchResults([]);
            return;
        }

        const results = [];

        searchData.provinces.forEach(province => {
            if (province.name.toLowerCase().includes(term.toLowerCase())) {
                results.push({ type: 'Province', name: province.name, code: province.code });
            }
            province.municipalities.forEach(muni => {
                if (muni.name.toLowerCase().includes(term.toLowerCase())) {
                    results.push({ type: 'Municipality', name: muni.name, code: muni.code });
                }
            });
            
        });

        setSearchResults(results);
    };

    

    const updateFocusArea = (result) => {
        const enriched = enrichFocus(result.code, searchData);
        navigate(`/?geo=${encodeURIComponent(result.code)}`);
        setSearchTerm('');
        setSearchResults([]);
    }

   

    return (
        <div className="search-box">
            <input
                type="text"
                className="search-bar"
                placeholder="Search for a province, district or municipality..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearch(e.target.value);
                }}
            />
            <div className="search-icon">
                <FontAwesomeIcon icon={faSearch} />
            </div>

            {searchResults.length > 0 && (
                <div className="search-results">
                    <ul>
                        {searchResults.map((result, idx) => (
                            <li key={idx} onClick={() => updateFocusArea(result)}>
                                <strong>{result.type}:</strong> {result.name} ({result.code})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Search;
