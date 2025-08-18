import { React, useRef, useEffect, useState } from 'react';
import { useAppContext } from '../AppContext';

import { Container, Overlay, OverlayTrigger, Tooltip, Image, Row, Col, Dropdown, Table } from 'react-bootstrap';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown, faShareAlt, faGlobe } from "@fortawesome/free-solid-svg-icons";


import { ParentSize } from '@visx/responsive';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Bar } from '@visx/shape';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { LinePath } from '@visx/shape';
import { defaultStyles, useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { localPoint } from '@visx/event';

import { timeDay, timeDays } from 'd3-time';
import { group } from 'd3-array';
import { timeFormat } from 'd3-time-format';


import Breadcrumbs from '../components/Breadcrumbs';

import Map from '../components/Map';


function Dashboard() {

    const { focus, allData, corruptionTypesData, servicesInvolvedData, officialsInvolvedData } = useAppContext();
    const [filteredData, setFilteredData] = useState(allData);
    const [corruptionTypesDataDash, setCorruptionTypesDataDash] = useState(corruptionTypesData);
    const [servicesInvolvedDataDash, setServicesInvolvedDataDash] = useState(servicesInvolvedData);
    const [officialsInvolvedDataDash, setOfficialsInvolvedDataDash] = useState(officialsInvolvedData);
    const [hadEvidenceDataDash, setHadEvidenceDataDash] = useState([]);

    const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } = useTooltip();
    const { containerRef, TooltipInPortal } = useTooltipInPortal();

    const [period, setPeriod] = useState(30);

    const [choroplethCounts, setChoroplethCounts] = useState({});

    const endDate = new Date();
    const startDate = period ? timeDay.offset(endDate, -period) : timeDay.offset(endDate, -1000); 
    const allDays = timeDays(startDate, endDate);

    const countsByDay = group(
        filteredData,
        d => timeDay.floor(new Date(d._submission_time)).toISOString().split('T')[0]
      );
      
      const dailyCounts = allDays.map(date => {
        const dateStr = date.toISOString().split('T')[0];
        const items = countsByDay.get(dateStr) || [];
        return {
          date,
          cases: items.length,
        };
      });
      
      dailyCounts.forEach((d, i, arr) => {
        const window = arr.slice(Math.max(0, i - 6), i + 1);
        d.avg = window.reduce((sum, x) => sum + x.cases, 0) / window.length;
      });
 
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };

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


   

    useEffect(() => {

        let tempData = allData.filter(d => {
            const date = new Date(d._submission_time);
            return !period || date >= startDate;
        });

        let type_of_corruption = groupCases('Type_of_Corruption_Involved_S', tempData);
        let services_involved = groupCases('Type_of_Municipal_Service_Invo', tempData);
        let admin_staff = groupCases('Were_any_administrative_staff_', tempData);
        let municipal_office = groupCases('Involvement_of_Municipal_Offic', tempData);
        let had_evidence = groupCases('Do_you_have_any_evidence_suppo', tempData);

        setFilteredData(tempData);
    
        setCorruptionTypesDataDash(prev => prev.map(type => ({
            ...type,
            cases: type_of_corruption[type.value] || []
        })));

        setServicesInvolvedDataDash(prev => prev.map(service => ({
            ...service,
            cases: services_involved[service.value] || []
        })));

        setOfficialsInvolvedDataDash([
            {
                ...officialsInvolvedDataDash[0], 
                cases: (admin_staff['yes'] || [])
            },
            {
                ...officialsInvolvedDataDash[1], 
                cases: (municipal_office['yes'] || [])
            }
        ]);

        setHadEvidenceDataDash([
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

       
    }, [allData, period, focus]);

   

   
    useEffect(() => {
    
        const newCounts = {};
    
        filteredData.forEach(entry => {
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
        
    }, [filteredData]);

    useEffect(() => {
        console.log("Had evidence data: ", hadEvidenceDataDash);
            
    }, [hadEvidenceDataDash]);

    const [show, showShareTooltip] = useState(false);
    const target = useRef(null);



    const renderWebTooltip = (props) => (
        <Tooltip id="web-icon-tooltip" {...props}>
        Go to municipality site
        </Tooltip>
    );

    const renderShareTooltip = (props) => (
        <Tooltip id="share-icon-tooltip" {...props}>
        Copied
        </Tooltip>
    );

    const copyWebLinktoClipboard = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(focus.properties.link_to_webpage || "");
        showShareTooltip(true);
        setTimeout(() => showShareTooltip(false), 2000);
    };


    return (
        <>
            <div style={{ height: '50vh', width: '100%' }}>
                <Map counts={choroplethCounts} />
            </div>

            <Container>
                {focus.type === "Municipality"?
                <>
                    <Row className="mt-5">
                        <Col xs={12} md={7} lg={8}>
                            <h1>{focus.name}</h1>
                            <div className="mb-3 d-flex align-items-center justify-content-between">
                                <Breadcrumbs page="dashboard" />
                                <div className="d-flex flex-row align-items-center">  
                                    {focus.properties.link_to_webpage? (
                                        <>  
                                            <FontAwesomeIcon icon={faShareAlt} ref={target} onClick={copyWebLinktoClipboard} className="me-2 fs-5 cursor-pointer" />
                                            <Overlay target={target.current} show={show} placement="top">
                                                {({
                                                placement: _placement,
                                                arrowProps: _arrowProps,
                                                show: _show,
                                                popper: _popper,
                                                hasDoneInitialMeasure: _hasDoneInitialMeasure,
                                                ...props
                                                }) => (
                                                <div
                                                    {...props}
                                                    style={{
                                                    position: 'absolute',
                                                    backgroundColor: '#000',
                                                    padding: '4px 10px',
                                                    color: 'white',
                                                    borderRadius: 3,
                                                    ...props.style,
                                                    }}
                                                >
                                                    Copied!
                                                </div>
                                                )}
                                            </Overlay>
                                            <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={renderWebTooltip}>
                                                <a href={focus.properties.link_to_webpage || "#"} target="_blank" rel="noopener noreferrer" className="cursor-pointer text-dark"><FontAwesomeIcon icon={faGlobe} className="me-2 fs-5 cursor-pointer" /></a>
                                            </OverlayTrigger>
                                        </>
                                    ): null}
                                </div>
                            </div>
                            <p>{focus.properties.detail || ""}</p>
                        </Col>
                        <Col xs={12} md={5} lg={4}>
                            <Image src={focus.properties.image} 
                                alt={focus.properties.image_alt || ""} className='rounded' fluid />
                        </Col>
                    </Row>
                </>
                :
                <>
                    <h1 className="mt-5">{focus.name}</h1>
                    <Breadcrumbs page="dashboard" />
                </>
                }

                <Row className="my-3">
                        <Col xs={12} md={6}>
                            <Dropdown className="dropdown-select">
                                <Dropdown.Toggle variant="light-grey">
                                    <Row>
                                        <Col>All corruption types</Col>
                                        <Col xs="auto"><FontAwesomeIcon icon={faSortDown} /></Col>
                                    </Row>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => console.log('hey')}>Loading...</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        
                        <Col className="pt-3 pt-md-0">
                            <Dropdown className="dropdown-select">
                                <Dropdown.Toggle variant="light-grey">
                                    <Row>
                                        <Col>{period ? `Last ${period} days` : "All time"}</Col>
                                        <Col xs="auto"><FontAwesomeIcon icon={faSortDown} /></Col>
                                    </Row>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => setPeriod(7)}>Last 7 days</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setPeriod(30)}>Last 30 days</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setPeriod(90)}>Last 3 months</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setPeriod(180)}>Last 6 months</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setPeriod(365)}>Last year</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setPeriod(null)}>All time</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>


                <section className="dashboard-section dashboard-section-reported-cases mt-5">
                    <h2>Overview of reported cases</h2>
                    

                    <Row className="mt-4">
                        <Col xs={12} md={4}>
                            <div className="dashboard-stat">
                                <h3>Reported cases</h3>
                                <Row>
                                    <Col>
                                        <span className="dashboard-stat-number">
                                            {filteredData.length}
                                        </span>
                                    </Col>
                                    <Col>
                                        {/* <SparklinesLine
                                        stroke="#4285f4"
                                        fill="none"
                                        data={[20,50,10,22]}
                                        height={30}
                                        width={100}
                                    /> */}
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        
                        <Col xs={12} md={4}>
                            <div className="dashboard-stat">
                                <h3>Involved an official</h3>
                                <Row>
                                    <Col>
                                        <span className="dashboard-stat-number">
                                            {officialsInvolvedDataDash[0].cases.length + officialsInvolvedDataDash[1].cases.length}
                                        </span>
                                    </Col>
                                    <Col>
                                        

                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col xs={12} md={4}>
                            <div className="dashboard-stat">
                                <h3>Had evidence</h3>
                                <Row>
                                    <Col>
                                        <span className="dashboard-stat-number">
                                            {hadEvidenceDataDash[0]?.cases.length}
                                        </span>
                                    </Col>
                                    <Col>

                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>


                    <ParentSize>
                        {({ width, height }) => {
                            const chartHeight = height || 300;

                            const xScale = scaleTime({
                                domain: [Math.min(...dailyCounts.map(d => d.date)), Math.max(...dailyCounts.map(d => d.date))],
                                range: [margin.left, width - margin.right],
                            });

                            const maxCases = Math.max(...dailyCounts.map(d => d.cases));
                            const yMax = Math.ceil(maxCases); 

                            const yScale = scaleLinear({
                                domain: [0, yMax],
                                range: [chartHeight - margin.bottom, margin.top],
                            });

                            return (
                                <div ref={containerRef} style={{ position: 'relative' }}>
                                    <svg width={width} height={chartHeight}>
                                        <Group>
                                            {dailyCounts.map((d, i) => (
                                                <Bar
                                                    key={i}
                                                    x={xScale(d.date) - 0.5} // thin bar
                                                    y={yScale(d.cases)}
                                                    width={1} // very thin bars
                                                    height={yScale(0) - yScale(d.cases)}
                                                    fill="rgba(66,133,244,0.3)"
                                                    onMouseMove={e => {
                                                        const coords = localPoint(e);
                                                        showTooltip({ tooltipData: d, tooltipLeft: coords.x, tooltipTop: coords.y });
                                                    }}
                                                    onMouseLeave={hideTooltip}
                                                />
                                            ))}

                                            <LinePath
                                                data={dailyCounts}
                                                x={d => xScale(d.date)}
                                                y={d => yScale(d.avg)}
                                                stroke="#4285f4"
                                                strokeWidth={2}
                                                curve={null}
                                            />
                                        </Group>
                                        <Group>
                                            {yScale.ticks(yMax).map((tick, i) => (
                                                <line
                                                key={i}
                                                x1={margin.left}
                                                x2={width - margin.right}
                                                y1={yScale(tick)}
                                                y2={yScale(tick)}
                                                stroke="#e0e0e0"
                                                strokeWidth={1}
                                                />
                                            ))}
                                        </Group>
                                        <AxisBottom 
                                            top={chartHeight - margin.bottom}
                                            scale={xScale}
                                            tickFormat={timeFormat('%a %d')}
                                        />
                                        <AxisLeft 
                                            left={margin.left}
                                            scale={yScale}
                                            tickFormat={d => d.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            numTicks={yMax}
                                            hideAxisLine={true}   // hides the vertical line
                                            hideTicks={true}      
                                        />
                                    </svg>

                                    {tooltipData && (
                                        <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={{ ...defaultStyles, backgroundColor: 'white', color: 'black' }}>
                                            <div><strong>{tooltipData.date.toDateString()}</strong></div>
                                            <div>Cases: {tooltipData.cases.toLocaleString()}</div>
                                            <div>7 day avg: {tooltipData.avg.toLocaleString()}</div>
                                        </TooltipInPortal>
                                    )}
                                </div>
                            );
                        }}
                    </ParentSize>

                    <div className="chart-legend">
                        <div className="chart-legend-item">
                            <div className="chart-legend-bar"></div>
                            <span>New cases</span>
                        </div>
                        <div className="chart-legend-item">
                            <div className="chart-legend-line"></div>
                            <span>7 day average</span>
                        </div>
                    </div>


                </section>

                <section className="dashboard-section dashboard-section-types-of-cases mt-5">
                    <h2>Types of cases reported</h2>

                    <Table hover>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th style={{ width: "50%" }}>Type</th>
                                <th>Cases <span className="d-none d-md-inline">reported</span></th>
                                <th>% <span className="d-none d-md-inline">of total cases reported</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                corruptionTypesDataDash?.slice().sort((a, b) => b.cases.length - a.cases.length).map((corruptionType, index) => (
                                    <tr key={corruptionType + index.toString()}>
                                        <td>
                                            {index + 1}
                                        </td>
                                        <td>
                                            {corruptionType.label == "Other (Please specify)" ? "Other" : corruptionType.label}
                                        </td>
                                        <td>
                                            {corruptionType.cases.length}
                                        </td>
                                        <td>
                                            {(!isNaN(corruptionType.cases.length / filteredData.length) ? corruptionType.cases.length / filteredData.length : 0 * 100).toFixed(2)}%   
                                        </td>
                                       
                                    </tr>
                                ))

                            }
                        </tbody>
                    </Table>


                </section>

                <section className="dashboard-section dashboard-section-services-involved mt-5">
                    <h2>Services involved in reporting cases</h2>

                    

                    <Table hover>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th style={{ width: "50%" }}>Type</th>
                                <th>Cases <span className="d-none d-md-inline">reported</span></th>
                                <th>% <span className="d-none d-md-inline">of total cases reported</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                servicesInvolvedDataDash.slice().sort((a, b) => b.cases.length - a.cases.length).map((serviceInvolved, index) => (
                                    <tr key={serviceInvolved + index.toString()}>
                                        <td>
                                            {index + 1}
                                        </td>
                                        <td>
                                            {serviceInvolved.label == "Other (Please specify)" ? "Other" : serviceInvolved.label}
                                        </td>
                                        <td>
                                            {serviceInvolved.cases.length}
                                        </td>
                                        <td>
                                            {(serviceInvolved.cases.length / allData.length * 100).toFixed(2)}%
                                        </td>
                                       
                                    </tr>
                                ))

                            }
                        </tbody>
                    </Table>

                </section>

                {/* <section className="dashboard-section dashboard-section-comparison mt-5">
                <h2>How does this municipality compare</h2>

                <Row className="my-3">
                    <Col>
                        <Dropdown className="dropdown-select">
                            <Dropdown.Toggle variant="light-grey">
                                <Row>
                                    <Col>All corruption types</Col>
                                    <Col xs="auto"><FontAwesomeIcon icon={faSortDown} /></Col>
                                </Row>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => console.log('hey')}>All parties</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col>
                        <Dropdown className="dropdown-select">
                            <Dropdown.Toggle variant="light-grey">
                                <Row>
                                    <Col>All reported sources</Col>
                                    <Col xs="auto"><FontAwesomeIcon icon={faSortDown} /></Col>
                                </Row>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => console.log('hey')}>All parties</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col>
                        <Dropdown className="dropdown-select">
                            <Dropdown.Toggle variant="light-grey">
                                <Row>
                                    <Col>All time</Col>
                                    <Col xs="auto"><FontAwesomeIcon icon={faSortDown} /></Col>
                                </Row>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => console.log('hey')}>All parties</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>

                <Table hover>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name of municipality</th>
                            <th>Province</th>
                            <th>Cases reported</th>
                            <th>vs. avg.</th>
                            <th>Involved and official</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Municipality 1</td>
                            <td>Province 1</td>
                            <td>120</td>
                            <td>10%</td>
                            <td>20%</td>
                        </tr>
                    </tbody>
                </Table>


            </section> */}



            </Container>
        </>
    );
}

export default Dashboard;