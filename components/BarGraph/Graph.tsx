import React from 'react';
import { Canvas, Group, Line } from '@shopify/react-native-skia';
import { Data } from './data';
import Animated, { Easing, FadeIn, FadeOut, SharedValue } from 'react-native-reanimated';
import * as d3 from 'd3';
import BarPath from './BarPath';
import XAxisText from './XAxisText';

type Props = {
    barWidth: number
    canvasHeight: number
    progress: SharedValue<number>
    data: any
    xGrid: boolean
    yGrid: boolean
    minBarValue?: number
    touchHandler: any
}

const Graph = ({ barWidth, canvasHeight, progress, data, xGrid = true,
    yGrid = true, minBarValue = 0, touchHandler }: Props) => {

    const yAxisWidth = 30;

    const graphWidth = barWidth * data.length * 2 - yAxisWidth; //this is width of graph
    const graphMargin = 40; //this is bottom margin of graph
    const graphHeight = canvasHeight - graphMargin; //this is heigt of graph

    const xRange = [0, graphWidth]; //this is x axis range means scale length starting and ending
    const xDomain = data.map((dataPoint: Data) => dataPoint.date); //this is x axis label

    const x = d3.scalePoint().domain(xDomain).range(xRange).padding(1); //here using of D3 as per lenght of domain it divide the range
    // means range is 0 to 100 and domain is 5 is step would be 0,25,50,75,100
    // padding is space between bars

    const yRange = [0, graphHeight]; //this is y axis range means scale length starting and ending
    var yMax = d3.max(data, (yDataPoint: Data) => yDataPoint.value)! * 1.2; // 20% more than max value for scaling
    const yDomain = [0, yMax]; // this is y axis label till maximum value in the data table

    const y = d3.scaleLinear().domain(yDomain).range(yRange); // this is line which made by connecting values of data

    // Scale for y-axis
    const yScale = d3
        .scaleLinear()
        .domain(yDomain) // Define the domain based on your data
        .range([graphHeight, 0]);
  
    return (

        <Animated.View
            entering={FadeIn.duration(700).easing(Easing.ease)}
            exiting={FadeOut}>
            <Canvas
                style={{
                    height: canvasHeight,
                    width: graphWidth,
                }}
                onTouchStart={touchHandler}
            >
                {yGrid &&
                    yScale.ticks(4).map((tick, index) => (
                        <Line
                            key={index}
                            p1={{ x: 0, y: yScale(tick) + graphMargin / 2 }} // Start of the line
                            p2={{ x: graphWidth, y: yScale(tick) + graphMargin / 2 }} // End of the line
                            color="gray" // Light gray for the grid lines
                            strokeWidth={0.5}
                        />
                    ))}

                {data.map((dataPoint: Data, _index: number) => {
                    var yValue = y(dataPoint.value)
                    if (minBarValue > 0) {
                        yValue = y(dataPoint.value) === 0 ? 10 : y(dataPoint.value)
                    }
                    return (
                      
                        <Group key={x(dataPoint.date)}>
                          <XAxisText
                            x={graphWidth - x(dataPoint.date)!} // here value is minus width becuase we need to scroll opposite direction
                            y={canvasHeight}
                            text={dataPoint.label}
                            index={_index}
                            height={graphHeight}
                            graphMargin={graphMargin}
                            barWidth={barWidth}
                            grid={xGrid}
                          />
                          <BarPath
                            x={graphWidth - x(dataPoint.date)!} // here value is minus width becuase we need to scroll opposite direction
                            y={yValue}
                            barWidth={barWidth}
                            barColor={'#7F82F5'}
                            graphHeight={graphHeight}
                            progress={progress}
                          />
                        </Group>
                      
                    );
                })
                }
            </Canvas>
        </Animated.View >

    )
}

export default Graph
