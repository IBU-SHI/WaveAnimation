import React, {useEffect, useRef, useState} from 'react';
import {
  Canvas,
  Group,
  Line,
  matchFont,
  Rect,
  Skia,
  Text as SkiaText,
} from '@shopify/react-native-skia';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  GestureResponderEvent,
  Platform,
} from 'react-native';
import {
  hourData,
  weekData,
  monthData,
  Data,
  sixMonthData,
  yearData,
} from './data';
import Animated, {
  SlideInRight,
  useSharedValue,
  withTiming,
  FadingTransition,
  LinearTransition,
  Layout,
  SlideInLeft,
} from 'react-native-reanimated';
import {Dimensions} from 'react-native';
import * as d3 from 'd3';
import BarPath from './BarPath';
import XAxisText from './XAxisText';
import Legend from './Legend';
import YAxisText from './YAxisText';
import Tooltip from './Tooltip';

const {width, height} = Dimensions.get('window');
const tabs = ['D', 'W', 'M', '6M', 'Y']; // global constant

function BarGraph() {
  const [data, setData] = useState(hourData);
  const [noBarTab, setNoBarTab] = useState(24); // it is for no of hour,days,week,month as per tab value
  const [barWidth, setBarWidth] = useState(8); // width of bar and it will be dynamic in future
  const [currentData, setCurrentData] = useState(data.slice(0, 24)); //current week data ....more testing need
  const [yAxisData, setYAxisData] = useState(data.slice(0, 25)); //current week data ....more testing need
  const [startDuration, setStartDuration] = useState('');
  const [endDuration, setEndDuration] = useState('');
  const [selectTab, setSelectTab] = useState('D');

  const progess = useSharedValue<number>(0); // this is progress value use for animation
  const selectedValue = useSharedValue<number>(0); // this is selected value (for tool tip purpose in future)
  const tooltipValue = useSharedValue<number>(0); // this is tooltip value (for tool tip purpose in future)
  const dateValue = useSharedValue<string>(''); // this is date value (for tool tip purpose in future)
  const xTooltipValue = useSharedValue<number>(10); // this is tooltip x value (for tool tip purpose in future)
  const totalValue = currentData.reduce((acc, cur) => acc + cur.value, 0); // this will get total value of steps (we need avg steps in future)
  const averageValue = totalValue / currentData.length; //average value of current visible data

  const canvasHeight = height / 3; //this is height of canvas (height of container/paper where graph can be drawn) it can be customize
  const canvasWidth = width; //this is width of canvas (width of container/paper where graph can be drawn)

  const xAxisGrid = true;
  const yAxisGrid = false;
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
  var yMax = d3.max(weekData, (yDataPoint: Data) => yDataPoint.value)! * 1.2; // 20% more than max value for scaling
  const yDomain = [0, yMax]; // this is y axis label till maximum value in the data table

  const y = d3.scaleLinear().domain(yDomain).range(yRange); // this is line which made by connecting values of data

  // Scale for y-axis
  const yScale = d3
    .scaleLinear()
    .domain(yDomain) // Define the domain based on your data
    .range([graphHeight, 0]);

  useEffect(() => {
    progess.value = withTiming(1, {duration: 1000});
    selectedValue.value = withTiming(averageValue, {duration: 1000}); // here if we change duration to 1000 than animation will show ..at current condition no
  }, [progess, selectedValue, averageValue]);

  const scrollRef = useRef<ScrollView>(null); // this scroll view ref of horizontal graph

  const scrollToEnd = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({animated: false});
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

  const Tab = (
    <View style={styles.tabWrapper}>
      {tabs.map(tabOption => (
        <TouchableOpacity
          key={tabOption}
          style={[styles.tab, selectTab === tabOption && styles.selectTab]}
          onPress={() => setSelectTab(tabOption)}>
          <Text style={styles.tabText}>{tabOption}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
  interface TabSettings {
    data: Data[]; // Adjust the type based on your actual data type
    noBarTab: number;
    barWidth: number;
  }

  useEffect(() => {
    const tabSettings: Record<string, TabSettings> = {
      D: {data: hourData, noBarTab: 24, barWidth: 8},
      W: {data: weekData, noBarTab: 7, barWidth: 25},
      M: {data: monthData, noBarTab: 30, barWidth: 6},
      '6M': {data: sixMonthData, noBarTab: 24, barWidth: 8},
      Y: {data: yearData, noBarTab: 7, barWidth: 16},
    };

    const {data, noBarTab, barWidth} =
      tabSettings[selectTab] || tabSettings['D'];
    setData(data);
    setNoBarTab(noBarTab);
    setBarWidth(barWidth);
  }, [selectTab]);

  const touchHandler = (e: GestureResponderEvent) => {
    const touchX = e.nativeEvent.locationX;
    const touchY = e.nativeEvent.locationY;

    const index = Math.floor((touchX - barWidth / 2) / x.step());
    if (index > -1 && index < data.length + 1) {
      const {label, date, value} = data[data.length - index];
      if (
        graphWidth - touchX < x(date)! + barWidth &&
        graphWidth - touchX > x(date)! - barWidth * 1.5 &&
        touchY - barWidth > graphHeight - y(value)! &&
        touchY - barWidth < graphHeight
      ) {
        const xpos = ((index % 7) - 1) * x.step() + barWidth / 2;

        tooltipValue.value = withTiming(value, {duration: 1});
        dateValue.value = date;
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

        {Tab}

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
            {selectTab === 'D' && (
              <Animated.View entering={SlideInRight} exiting={SlideInLeft}>
                <Canvas
                  style={{
                    height: canvasHeight,
                    width: graphWidth,
                  }}
                  onTouchStart={touchHandler}>
                  {yAxisGrid &&
                    yScale.ticks(4).map((tick, index) => (
                      <Line
                        key={index}
                        p1={{x: 0, y: yScale(tick) + graphMargin / 2}} // Start of the line
                        p2={{x: graphWidth, y: yScale(tick) + graphMargin / 2}} // End of the line
                        color="gray" // Light gray for the grid lines
                        strokeWidth={0.5}
                      />
                    ))}

                  {hourData.map((dataPoint: Data, index) => (
                    <Group key={x(dataPoint.date)}>
                      <XAxisText
                        x={graphWidth - x(dataPoint.date)!} // here value is minus width becuase we need to scroll opposite direction
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
              </Animated.View>
            )}
            {selectTab === 'W' && (
              <Animated.View entering={SlideInRight.delay(200)}>
                <Canvas
                  style={{
                    height: canvasHeight,
                    width: graphWidth,
                  }}
                  onTouchStart={touchHandler}>
                  {yAxisGrid &&
                    yScale.ticks(4).map((tick, index) => (
                      <Line
                        key={index}
                        p1={{x: 0, y: yScale(tick) + graphMargin / 2}} // Start of the line
                        p2={{x: graphWidth, y: yScale(tick) + graphMargin / 2}} // End of the line
                        color="gray" // Light gray for the grid lines
                        strokeWidth={0.5}
                      />
                    ))}

                  {weekData.map((dataPoint: Data, index) => (
                    <Group key={x(dataPoint.date)}>
                      <XAxisText
                        x={graphWidth - x(dataPoint.date)!} // here value is minus width becuase we need to scroll opposite direction
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
              </Animated.View>
            )}
          </ScrollView>

          <Canvas style={{height: canvasHeight, width: yAxisWidth}}>
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
  sectionTitleContainer: {
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    //fontWeight: 'bold',
    color: 'black',
  },
  sectionText: {
    fontSize: 16,
    color: 'black',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  tabWrapper: {
    flexDirection: 'row',
    marginHorizontal: 16,
    padding: 2,
    gap: 4,
    borderRadius: 9,
    backgroundColor: '#7878801F',
    borderWidth: 0.5,
    borderColor: '#7878801F',
    marginVertical: 12,
  },
  tab: {
    borderColor: '#8E8E93',
    flex: 1,
    paddingVertical: 2,
  },
  selectTab: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 7,
    backgroundColor: 'white',
    flex: 1,
    shadowColor: 'grey',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 5,
  },
  tabText: {
    fontSize: 13,
    //fontWeight: 500,
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: 'center',
  },
});

export default BarGraph;
