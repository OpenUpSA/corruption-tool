import { React, useEffect, useState } from 'react';
import { useAppContext } from '../AppContext';

import { Container, Row, Col, Dropdown, Table } from 'react-bootstrap';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";

import { SparklinesLine } from "@lueton/react-sparklines";

import { ParentSize } from '@visx/responsive';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Bar } from '@visx/shape';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { LinePath } from '@visx/shape';
import { Tooltip, defaultStyles, useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { localPoint } from '@visx/event';

import Map from '../components/Map';


function Dashboard() {

    const { focus, koboEndpoint, provincesGeo, districtsGeo, munisGeo, setFocus } = useAppContext();

    const[data, setData] = useState([]);

    
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
   
    const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } = useTooltip();
    const { containerRef, TooltipInPortal } = useTooltipInPortal();

    const getData = async () => {
        const response = await fetch(`${koboEndpoint}/assets/aBqe4PvaNnmvNC2rBFNHeE/data`);
        const allData = await response.json();

        console.log(allData);

        setData(Array.from({ length: 100 }, (_, i) => ({
            date: new Date(2020, 0, i * 3),
            cases: Math.floor(Math.random() * 200000),
            avg: Math.floor(Math.random() * 150000)
        })))
    };


    useEffect(() => {
       getData();
    }, [focus]);

	return (
        <>
        <div style={{ height: '50vh', width: '100%' }}>
            <Map />
        </div>

        <Container>
            <h1 className="mt-5">{focus.name}</h1>

            <Row>
                <Col>
                </Col>
                <Col>
                </Col>
            </Row>

            <section className="dashboard-section dashboard-section-reported-cases mt-5">
                <h2>Overview of reported cases</h2>
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

                <Row className="mt-4">
                    <Col>
                        <div className="dashboard-stat">
                            <h3>Reported cases</h3>
                            <Row>
                                <Col>
                                    <span className="dashboard-stat-number">120</span>
                                </Col>
                                <Col>
                                    <SparklinesLine
                                        stroke="#4285f4"
                                        fill="none"
                                        data={[20,50,10,22]}
                                        height={30}
                                        width={100}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col>
                        <div className="dashboard-stat">
                            <h3>Cases rejected</h3>
                            <Row>
                                <Col>
                                    <span className="dashboard-stat-number">120</span>
                                </Col>
                                <Col>
                                    <SparklinesLine
                                        stroke="#4285f4"
                                        fill="none"
                                        data={[20,50,10,22]}
                                        height={30}
                                        width={100}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col>
                        <div className="dashboard-stat">
                            <h3>Involved an official</h3>
                            <Row>
                                <Col>
                                    <span className="dashboard-stat-number">120</span>
                                </Col>
                                <Col>
                                    <SparklinesLine
                                        stroke="#4285f4"
                                        fill="none"
                                        data={[20,50,10,22]}
                                        height={30}
                                        width={100}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col>
                        <div className="dashboard-stat">
                            <h3>Had evidence</h3>
                            <Row>
                                <Col>
                                    <span className="dashboard-stat-number">120</span>
                                </Col>
                                <Col>
                                    <SparklinesLine
                                        stroke="#4285f4"
                                        fill="none"
                                        data={[20,50,10,22]}
                                        height={30}
                                        width={100}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>


                <ParentSize>
                    {({ width, height }) => {
                        const chartHeight = height || 300;

                        const xScale = scaleTime({
                            domain: [Math.min(...data.map(d => d.date)), Math.max(...data.map(d => d.date))],
                            range: [margin.left, width - margin.right],
                        });

                        const yScale = scaleLinear({
                            domain: [0, Math.max(...data.map(d => d.cases)) * 1.1],
                            range: [chartHeight - margin.bottom, margin.top],
                        });

                        return (
                        <div ref={containerRef} style={{ position: 'relative' }}>
                            <svg width={width} height={chartHeight}>
                            <Group>
                                {data.map((d, i) => (
                                <Bar
                                    key={i}
                                    x={xScale(d.date) - 2}
                                    y={yScale(d.cases)}
                                    width={4}
                                    height={yScale(0) - yScale(d.cases)}
                                    fill="#b3d4fc"
                                    onMouseMove={e => {
                                        const coords = localPoint(e);
                                        showTooltip({ tooltipData: d, tooltipLeft: coords.x, tooltipTop: coords.y });
                                    }}
                                    onMouseLeave={hideTooltip}
                                />
                                ))}
                                <LinePath
                                    data={data}
                                    x={d => xScale(d.date)}
                                    y={d => yScale(d.avg)}
                                    stroke="#1f77b4"
                                    strokeWidth={2}
                                />
                            </Group>
                            <AxisBottom top={chartHeight - margin.bottom} scale={xScale} />
                            <AxisLeft left={margin.left} scale={yScale} />
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


            </section>

            <section className="dashboard-section dashboard-section-types-of-cases mt-5">
                <h2>Types of cases reported</h2>

                <Row className="my-3">
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
                            <th>Type</th>
                            <th>Cases reported</th>
                            <th>% of total cases reported</th>
                            <th>vs. avg.</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Corruption type 1</td>
                            <td>120</td>
                            <td>20%</td>
                            <td>10%</td>
                        </tr>
                    </tbody>
                </Table>


            </section>

            <section className="dashboard-section dashboard-section-services-involved mt-5">
                <h2>Services involved in reporting cases</h2>

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
                            <th>Type</th>
                            <th>Cases reported</th>
                            <th>% of total cases reported</th>
                            <th>vs. avg.</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Corruption type 1</td>
                            <td>120</td>
                            <td>20%</td>
                            <td>10%</td>
                        </tr>
                    </tbody>
                </Table>
                
            </section>

            <section className="dashboard-section dashboard-section-comparison mt-5">
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


            </section>



        </Container>
        </>
	);
}

export default Dashboard;