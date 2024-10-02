import { Canvas, Group, Line } from '@shopify/react-native-skia';
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from 'react-native'
import { data, Data } from './data';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import * as d3 from 'd3';
import BarPath from './BarPath';
import XAxisText from './XAxisText';
import AnimatedText from './AnimatedText';
import YAxisText from './YAxisText';

const width = Dimensions.get('window').width; // this is width of screen
const height = Dimensions.get('window').height; // this is width of screen

function BarGraph() {

  const [currentData, setCurrentData] = useState(data) //current week data ....more testing need

  const progess = useSharedValue<number>(0); // this is progress value use for animation
  const selectedValue = useSharedValue<number>(0); // this is selected value (for tool tip purpose in future)
  const totalValue = currentData.reduce((acc, cur) => acc + cur.value, 0) // this will get total value of steps (we need avg steps in future)

  const canvasHeight = (height / 3); //this is height of canvas (height of container/paper where graph can be drawn) it can be customize
  const canvasWidth = width; //this is width of canvas (width of container/paper where graph can be drawn)

  const barWidth = 26 // width of bar and it will be dynamic in future
  const yAxisWidth = 30
  const graphWidth = barWidth * data.length * 2 - yAxisWidth;//this is width of graph
  const graphMargin = 40  //this is bottom margin of graph
  const graphHeight = (height / 3) - graphMargin  //this is heigt of graph

  const totalBars = data.length;
  const totalBarWidth = totalBars * barWidth;
  const availableWidth = graphWidth - totalBarWidth;

  const barSpacing = availableWidth / (totalBars - 1);// Calculate the spacing between bars

  const xRange = [0, graphWidth] //this is x axis range means scale length starting and ending
  const xDomain = data.map((dataPoint: Data) => dataPoint.label) //this is x axis label 

  const x = d3.scalePoint().domain(xDomain).range(xRange).padding(1) //here using of D3 as per lenght of domain it divide the range 
  // means range is 0 to 100 and domain is 5 is step would be 0,25,50,75,100
  // padding is space between bars

  const yRange = [0, graphHeight] //this is y axis range means scale length starting and ending
  var yMax = d3.max(currentData, (yDataPoint: Data) => yDataPoint.value)! * 1.2; // 20% more than max value for scaling
  const yDomain = [0, yMax]; // this is y axis label till maximum value in the data table

  const y = d3.scaleLinear().domain(yDomain).range(yRange) // this is line which made by connecting values of data 

  // Scale for y-axis
  const yScale = d3.scaleLinear()
    .domain(yDomain) // Define the domain based on your data
    .range([graphHeight, 0]);

  useEffect(() => {
    progess.value = withTiming(1, { duration: 1000 })
    selectedValue.value = withTiming(totalValue, { duration: 1000 }) // here if we change duration to 1000 than animation will show ..at current condition no
  }, [progess, selectedValue, totalValue])


  const scrollRef = useRef<ScrollView>(null); // this scroll view ref of horizontal graph

  const scrollToEnd = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: false });
    }
  };

  const onScroll = (event: any) => {
    var contentOffsetX = event.nativeEvent.contentOffset.x;

    // Calculate the start index based on contentOffsetX and the width of each bar
    const currentIndex = Math.floor(((canvasWidth - (barWidth + barSpacing)) - (contentOffsetX)) / (barWidth + barSpacing));
    const startIndex = currentIndex + 1

    // Calculate how many bars are visible within the canvasWidth
    const visibleBarsCount = Math.ceil(canvasWidth / (barWidth + barSpacing));

    // End index is just the start index + number of visible bars
    const endIndex = startIndex + visibleBarsCount;

    // // Get the visible items
    const currentVisibleItems = data.slice(startIndex, endIndex);
    setCurrentData(currentVisibleItems);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>Bar Graph</Text>
        <Text style={styles.sectionText}>Using Skia,D3 and Reanimated</Text>
      </View>

      <View style={{ backgroundColor: 'white', paddingVertical: 10, borderRadius: 16, marginTop: 10 }}>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, marginHorizontal: 16, marginVertical: 8, paddingVertical: 12, borderWidth: 0.4 }}>
          <AnimatedText selectedValue={selectedValue} />
          <Text style={{ fontSize: 20 }}>steps</Text>
          <Text style={{ fontSize: 14 }}>average daily</Text>
        </View>

        <View style={styles.chartRow}>

          <ScrollView
            horizontal
            ref={scrollRef}
            onScroll={onScroll}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={data.length > 7 ? true : false}
            onContentSizeChange={scrollToEnd}
            contentContainerStyle={{
              flexDirection: 'row-reverse',
            }}
          >
            <Canvas
              style={{
                height: canvasHeight,
                width: graphWidth,
              }}
            >
              {yScale.ticks(4).map((tick, index) => (
                <>
                  <Line
                    key={index}
                    p1={{ x: 0, y: yScale(tick) + graphMargin/2 }} // Start of the line
                    p2={{ x: graphWidth, y: yScale(tick) + graphMargin/2 }} // End of the line
                    color="gray" // Light gray for the grid lines
                    strokeWidth={0.3}
                  />
                </>
              ))}

              {data.map((dataPoint: Data, index) => (
                <Group key={index}>

                  <XAxisText
                    x={(graphWidth - x(dataPoint.label)!)} // here value is minus width becuase we need to scroll opposite direction
                    y={canvasHeight}
                    text={dataPoint.label}
                    index={index}
                    height={graphHeight}
                    graphMargin={graphMargin}
                  />
                  <BarPath
                    x={graphWidth - x(dataPoint.label)!} // here value is minus width becuase we need to scroll opposite direction
                    y={y(dataPoint.value)}
                    barWidth={barWidth}
                    barColor={'#7F82F5'}
                    graphHeight={graphHeight}
                    progress={progess}
                  />

                </Group>
              ))}

            </Canvas>
          </ScrollView>

          {/* Y Axis labels */}
          <Canvas style={{ height: canvasHeight, width: yAxisWidth}}>
            {yScale.ticks(4).map((tick, index) => (
              <YAxisText
                key={index}
                x={0}
                y={yScale(tick)}
                text={`${tick}`}
                index={index}
                width={yAxisWidth}
                barSpacing={barSpacing}
                graphMargin={graphMargin}
              />
            ))}
          </Canvas>
        </View>
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebecde',
    marginHorizontal: 8
  },
  sectionTitleContainer: {
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  sectionText: {
    fontSize: 16,
    color: 'black',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 6
  },
})

export default BarGraph
