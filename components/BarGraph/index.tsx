import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@shopify/react-native-skia';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  GestureResponderEvent,
} from 'react-native';
import {
  hourData,
  weekData,
  monthData,
  Data,
  sixMonthData,
  yearData,
} from './data';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import * as d3 from 'd3';
import Legend from './Legend';
import YAxisText from './YAxisText';
import Tooltip from './Tooltip';
import Graph from './Graph';
import Segment from './Segment';

const { width, height } = Dimensions.get('window');
interface TabSettings {
  data: Data[]; // Adjust the type based on your actual data type
  noBarTab: number;
  barWidth: number;
}

function BarGraph() {
  const [data, setData] = useState(hourData);
  const [noBarTab, setNoBarTab] = useState(24); // it is for no of hour,days,week,month as per tab value
  const [barWidth, setBarWidth] = useState(8); // width of bar and it will be dynamic in future
  const [currentData, setCurrentData] = useState(data.slice(0, 24)); //current week data ....more testing need
  const [yAxisData, setYAxisData] = useState(data.slice(0, 25)); //current week data ....more testing need
  const [startDuration, setStartDuration] = useState('');
  const [endDuration, setEndDuration] = useState('');
  const [selectTab, setSelectTab] = useState('W');
  const [showTooltip, setShowTooltip] = useState(false)

  const scrollRef = useRef<ScrollView>(null); // this scroll view ref of horizontal graph

  const progess = useSharedValue<number>(0); // this is progress value use for animation
  const selectedValue = useSharedValue<number>(0); // this is selected value (for tool tip purpose in future)
  const tooltipValue = useSharedValue<number>(0); // this is tooltip value (for tool tip purpose in future)
  const dateValue = useSharedValue<string>(''); // this is date value (for tool tip purpose in future)
  const xTooltipValue = useSharedValue<number>(10); // this is tooltip x value (for tool tip purpose in future)
  
  const selectedBar = useSharedValue<string | null>(null);
  const totalValue = currentData.reduce((acc, cur) => acc + cur.value, 0); // this will get total value of steps (we need avg steps in future)
  const averageValue = totalValue / currentData.length; //average value of current visible data

  const canvasHeight = 200//height / 3; //this is height of canvas (height of container/paper where graph can be drawn) it can be customize
  const canvasWidth = width; //this is width of canvas (width of container/paper where graph can be drawn)

  const yAxisWidth = 30;

  const graphWidth = barWidth * data.length * 2 - yAxisWidth; //this is width of graph
  const graphMargin = 40; //this is bottom margin of graph
  const graphHeight = canvasHeight - graphMargin; //this is heigt of graph

  const totalBars = data.length;
  const totalBarWidth = totalBars * barWidth;
  const availableWidth = graphWidth - totalBarWidth;

  const barSpacing = availableWidth / (totalBars - 1); // Calculate the spacing between bars

  const xRange = [0, graphWidth]; //this is x axis range means scale length starting and ending
  const xDomain = data.map((dataPoint: Data) => dataPoint.date); //this is x axis label

  const x = d3.scalePoint().domain(xDomain).range(xRange).padding(1); //here using of D3 as per lenght of domain it divide the range
  // means range is 0 to 100 and domain is 5 is step would be 0,25,50,75,100
  // padding is space between bars

  const yRange = [0, graphHeight]; //this is y axis range means scale length starting and ending
  var yMax = d3.max(yAxisData, (yDataPoint: Data) => yDataPoint.value)! * 1.2; // 20% more than max value for scaling
  const yDomain = [0, yMax]; // this is y axis label till maximum value in the data table

  const y = d3.scaleLinear().domain(yDomain).range(yRange); // this is line which made by connecting values of data

  // Scale for y-axis
  const yScale = d3
    .scaleLinear()
    .domain(yDomain) // Define the domain based on your data
    .range([graphHeight, 0]);

  useEffect(() => {
    progess.value = withTiming(1, { duration: 1000 });
    selectedValue.value = withTiming(averageValue, { duration: 1000 }); // here if we change duration to 1000 than animation will show ..at current condition no
  }, [progess, selectedValue, averageValue]);

  useEffect(() => {
    setShowTooltip(false)
    const tabSettings: Record<string, TabSettings> = {
      D: { data: hourData, noBarTab: 24, barWidth: 8 },
      W: { data: weekData, noBarTab: 7, barWidth: 25 },
      M: { data: monthData, noBarTab: 30, barWidth: 6 },
      '6M': { data: sixMonthData, noBarTab: 24, barWidth: 8 },
      Y: { data: yearData, noBarTab: 12, barWidth: 16 },
    };

    const { data, noBarTab, barWidth } =
      tabSettings[selectTab] || tabSettings['D'];
    setData(data);
    setNoBarTab(noBarTab);
    setBarWidth(barWidth);
  }, [selectTab]);

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
      var start =
        data.length - Math.floor(currentPosition / barSpacingWithBarWidth); // Starting bar based on scroll
      var end =
        data.length -
        Math.ceil(
          (currentPosition +
            event.nativeEvent.layoutMeasurement.width -
            (barWidth + barSpacing * 1.5)) /
          barSpacingWithBarWidth,
        ); // Ending bar based on scroll + visible width
      if (start > 0 && end < data.length - noBarTab - 1) {
        start = start - 2;
        end = end - 1;
      } else {
        start = start - 1;
      }
      setStartDuration(data[end]?.date);
      setEndDuration(data[start]?.date);
      const currentVisibleItems = data.slice(end, start + 1);
      setCurrentData(currentVisibleItems);
      const totalValue = currentVisibleItems.reduce(
        (acc, cur) => acc + cur.value,
        0,
      ); // this will get total value of steps (we need avg steps in future)
      const averageValue = totalValue / currentVisibleItems.length;
      if (averageValue > 0) {
        const currentVisibleYAxis = data.slice(end, start + 2);
        setYAxisData(currentVisibleYAxis);
      }
    } else {
      setStartDuration(data[0]?.date);
      setEndDuration(data[noBarTab - 1]?.date);
      const currentVisibleItems = data.slice(0, noBarTab);
      setCurrentData(currentVisibleItems);
      const currentVisibleYAxis = data.slice(0, noBarTab + 1);
      setYAxisData(currentVisibleYAxis);
    }
  };

  const touchHandler = (e: GestureResponderEvent) => {
    const touchX = e.nativeEvent.locationX;
    const touchY = e.nativeEvent.locationY;

    const index = Math.floor((touchX - barWidth / 2) / x.step());
    if (index > -1 && index < data.length + 1) {
      const { label, date, value } = data[data.length - index];
      if (
        graphWidth - touchX < x(date)! + barWidth &&
        graphWidth - touchX > x(date)! - barWidth * 1.5 &&
        touchY - barWidth > graphHeight - y(value)! &&
        touchY - barWidth < graphHeight
      ) {
        const a = Math.round((x(date)!)/x.step())
        var b =noBarTab-a%noBarTab
        var xpos = b*x.step() - barWidth
        if(a===noBarTab){
        xpos=0
        }
        selectedBar.value = label;
        console.log(xpos,(noBarTab)*(barWidth))
        console.log(a)
        setShowTooltip(true)
        tooltipValue.value = value;
        xTooltipValue.value = xpos
        dateValue.value = date;
      }
      else {
        setShowTooltip(false)
        selectedBar.value = null;
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>Bar Graph</Text>
        <Text style={styles.sectionText}>Using Skia,D3 and Reanimated</Text>
      </View>

      <View style={styles.chartContainer}>

        <Legend
          selectedValue={selectedValue}
          startDuration={startDuration}
          endDuration={endDuration}
        />

        <Segment selectTab={selectTab} setSelectTab={setSelectTab} />
        <Tooltip
          selectedValue={tooltipValue}
          dateValue={dateValue}
          showTooltip={showTooltip}
          xTooltipValue={xTooltipValue} 
          width={graphWidth}/>
        <View style={styles.chart}>
          <ScrollView
            horizontal
            ref={scrollRef}
            onScroll={onScroll}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={data.length > noBarTab ? true : false}
            onContentSizeChange={scrollToEnd}
            contentContainerStyle={{
              flexDirection: 'row-reverse',
            }}>
            {
              selectTab === 'D' && (
                <Graph
                  barWidth={8}
                  canvasHeight={canvasHeight}
                  progress={progess}
                  data={hourData}
                  xGrid={false}
                  yGrid={false}
                  minBarValue={10}
                  touchHandler={touchHandler}
                  selectedBar={selectedBar}
                />
              )
            }
            {
              selectTab === 'W' && (
                <Graph
                  barWidth={25}
                  canvasHeight={canvasHeight}
                  progress={progess}
                  data={weekData}
                  xGrid={false}
                  yGrid={false}
                  minBarValue={10}
                  touchHandler={touchHandler}
                  selectedBar={selectedBar}
                />
              )
            }
            {
              selectTab === 'M' && (
                <Graph
                  barWidth={6}
                  canvasHeight={canvasHeight}
                  progress={progess}
                  data={monthData}
                  xGrid={false}
                  yGrid={false}
                  minBarValue={10}
                  touchHandler={touchHandler}
                  selectedBar={selectedBar}
                />
              )
            }
            {
              selectTab === '6M' && (
                <Graph
                  barWidth={8}
                  canvasHeight={canvasHeight}
                  progress={progess}
                  data={sixMonthData}
                  xGrid={false}
                  yGrid={false}
                  minBarValue={10}
                  touchHandler={touchHandler}
                  selectedBar={selectedBar}
                />
              )
            }
            {
              selectTab === 'Y' && (
                <Graph
                  barWidth={16}
                  canvasHeight={canvasHeight}
                  progress={progess}
                  data={yearData}
                  xGrid={false}
                  yGrid={false}
                  minBarValue={10}
                  touchHandler={touchHandler}
                  selectedBar={selectedBar}
                />
              )
            }
          </ScrollView>

          <Canvas style={{ height: canvasHeight-40, width: yAxisWidth }}>
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
                grid={false}
              />
            ))}
          </Canvas>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F7',
    marginHorizontal: 8,
  },
  chartContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderRadius: 40,
    marginTop: 10,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
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
});

export default BarGraph;
