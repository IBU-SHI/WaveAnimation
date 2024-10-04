import React, { useEffect, useRef, useState } from 'react'
import { Canvas, Group, Line } from '@shopify/react-native-skia';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import { hourData, weekData, Data } from './data';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import * as d3 from 'd3';
import BarPath from './BarPath';
import XAxisText from './XAxisText';
import AnimatedText from './Legend';
import YAxisText from './YAxisText';

const width = Dimensions.get('window').width; // this is width of screen
const height = Dimensions.get('window').height; // this is width of screen

function BarGraph() {

  const [data, setData] = useState(hourData)
  const [noBarTab, setNoBarTab] = useState(24) // it is for no of hour,days,week,month as per tab value
  const [barWidth, setBarWidth] = useState(8) // width of bar and it will be dynamic in future
  const [currentData, setCurrentData] = useState(data.slice(0, 7)) //current week data ....more testing need
  const [yAxisData, setYAxisData] = useState(data.slice(0, 8)) //current week data ....more testing need
  const [dateRange, setDateRange] = useState('')
  const [selectTab, setSelectTab] = useState('D')

  const progess = useSharedValue<number>(0); // this is progress value use for animation
  const selectedValue = useSharedValue<number>(0); // this is selected value (for tool tip purpose in future)
  const totalValue = currentData.reduce((acc, cur) => acc + cur.value, 0) // this will get total value of steps (we need avg steps in future)

  const canvasHeight = (height / 3); //this is height of canvas (height of container/paper where graph can be drawn) it can be customize
  const canvasWidth = width; //this is width of canvas (width of container/paper where graph can be drawn)

  const xAxisGrid = false
  const yAxisGrid = false
  const yAxisWidth = 30

  const graphWidth = barWidth * data.length * 2 - yAxisWidth;//this is width of graph
  const graphMargin = 40  //this is bottom margin of graph
  const graphHeight = canvasHeight - graphMargin  //this is heigt of graph

  const totalBars = data.length;
  const totalBarWidth = totalBars * barWidth;
  const availableWidth = graphWidth - totalBarWidth;

  const barSpacing = availableWidth / (totalBars - 1);// Calculate the spacing between bars

  const xRange = [0, graphWidth] //this is x axis range means scale length starting and ending
  const xDomain = data.map((dataPoint: Data) => dataPoint.date) //this is x axis label 

  const x = d3.scalePoint().domain(xDomain).range(xRange).padding(1) //here using of D3 as per lenght of domain it divide the range 
  // means range is 0 to 100 and domain is 5 is step would be 0,25,50,75,100
  // padding is space between bars

  const yRange = [0, graphHeight] //this is y axis range means scale length starting and ending
  var yMax = d3.max(yAxisData, (yDataPoint: Data) => yDataPoint.value)! * 1.2; // 20% more than max value for scaling
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
    const currentPosition = event.nativeEvent.contentOffset.x; // Current scroll position

    const contentWidth = event.nativeEvent.contentSize.width; // Total width of the scrollable content
    const layoutWidth = event.nativeEvent.layoutMeasurement.width; // Width of the visible area
    const barSpacingWithBarWidth = barWidth + barSpacing; // Total width of one bar with its spacing

    // Calculate the maximum scrollable position (max scroll)
    const maxScroll = contentWidth - layoutWidth;
    if (currentPosition < maxScroll) {
      // Calculate the visible start and end indices
      var start = data.length - Math.floor(currentPosition / (barSpacingWithBarWidth)); // Starting bar based on scroll
      var end = data.length - Math.ceil((currentPosition +
        event.nativeEvent.layoutMeasurement.width - ((barWidth + (barSpacing * 1.5)))) / (barSpacingWithBarWidth)); // Ending bar based on scroll + visible width
      if (start > 0 && end < data.length - noBarTab - 1) {
        start = start - 2
        end = end - 1
      }
      else {
        start = start - 1

      }
      setDateRange(data[end]?.date + ' - ' + data[start]?.date)
      const currentVisibleItems = data.slice(end, start + 1);
      setCurrentData(currentVisibleItems);
      const currentVisibleYAxis = data.slice(end, start + 2);
      setYAxisData(currentVisibleYAxis);
    }
    else {

      setDateRange(data[0]?.date + ' - ' + data[noBarTab - 1]?.date)
      const currentVisibleItems = data.slice(0, noBarTab);
      setCurrentData(currentVisibleItems);
      const currentVisibleYAxis = data.slice(0, noBarTab + 1);
      setYAxisData(currentVisibleYAxis);
    }
  };

  const handleSnapToBar = (event: any) => {
    const currentPosition = event.nativeEvent.contentOffset.x; // Current scroll position
    const barSpacingWithBarWidth = barWidth + barSpacing; // Total width of one bar with its spacing

    // Calculate which bar is closest based on the current scroll position
    const nearestBarIndex = Math.round(currentPosition / barSpacingWithBarWidth);

    // Scroll to the nearest bar
    const snapToPosition = nearestBarIndex * barSpacingWithBarWidth;

    scrollRef.current?.scrollTo({
      x: snapToPosition,
      animated: true,
    });
  };

  const tab = (
    <View style={styles.tabWrapper}>

      <TouchableOpacity style={[styles.tab, selectTab === 'D' && styles.selectTab]}
        onPress={() => { setSelectTab('D') }}>
        <Text style={styles.tabText}>D</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.tab, selectTab === 'W' && styles.selectTab]}
        onPress={() => { setSelectTab('W') }}><Text style={styles.tabText}>W</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.tab, selectTab === 'M' && styles.selectTab]}
        onPress={() => { setSelectTab('M') }}>
        <Text style={styles.tabText}>M</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.tab, selectTab === '6M' && styles.selectTab]}
        onPress={() => { setSelectTab('6M') }}>
        <Text style={styles.tabText}>6M</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.tab, selectTab === 'Y' && styles.selectTab]}
        onPress={() => { setSelectTab('Y') }}>
        <Text style={styles.tabText}>Y</Text>
      </TouchableOpacity>

    </View>
  )

  useEffect(() => {
    if (selectTab === 'D') {
      setData(hourData)
      setNoBarTab(24) // 24 hour per day
      setBarWidth(8)
    }
    else {
      setData(weekData)
      setNoBarTab(7) // 7 days per week
      setBarWidth(26)
    }
  }, [selectTab])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>Bar Graph</Text>
        <Text style={styles.sectionText}>Using Skia,D3 and Reanimated</Text>
      </View>

      <View style={{ backgroundColor: 'white', paddingVertical: 10, borderRadius: 16, marginTop: 10 }}>

        <AnimatedText selectedValue={selectedValue} duration={dateRange} />

        {tab}

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
            onMomentumScrollEnd={(event) => handleSnapToBar(event)}
          >
            <Canvas
              style={{
                height: canvasHeight,
                width: graphWidth,
              }}
            >
              {yAxisGrid && yScale.ticks(4).map((tick, index) => (
                <>
                  <Line
                    key={index}
                    p1={{ x: 0, y: yScale(tick) + graphMargin / 2 }} // Start of the line
                    p2={{ x: graphWidth, y: yScale(tick) + graphMargin / 2 }} // End of the line
                    color="gray" // Light gray for the grid lines
                    strokeWidth={0.5}
                  />
                </>
              ))}

              {data.map((dataPoint: Data, index) => (
                <Group key={x(dataPoint.date)}>

                  <XAxisText
                    x={(graphWidth - x(dataPoint.date)!)} // here value is minus width becuase we need to scroll opposite direction
                    y={canvasHeight}
                    text={dataPoint.label}
                    index={index}
                    height={graphHeight}
                    graphMargin={graphMargin}
                    barWidth={barWidth}
                    grid={xAxisGrid}
                  />
                  <BarPath
                    x={graphWidth - x(dataPoint.date)!} // here value is minus width becuase we need to scroll opposite direction
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
          <Canvas style={{ height: canvasHeight, width: yAxisWidth }}>
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
                grid={yAxisGrid}
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
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingBottom: 6
  },
  tabWrapper: {
    flexDirection: 'row',
    marginHorizontal: 16,
    padding: 2,
    gap: 4,
    borderRadius: 9,
    backgroundColor: '#7878801F',
    borderWidth:0.5,
    borderColor:'#7878801F',
    marginVertical: 12
  },
  tab: {
   // borderRightWidth: 0.5,
    borderColor: '#8E8E93',
    flex: 1,
    paddingVertical: 2
  },
  selectTab: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 7,
    backgroundColor: 'white',
    flex: 1,
    shadowColor: 'grey',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 5,
  },
  tabText: {
    fontSize: 13,
    fontWeight: 500,
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: 'center'
  }


})

export default BarGraph
