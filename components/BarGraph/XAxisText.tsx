import React from 'react'
import { Platform, StyleSheet } from 'react-native'
import { Text, matchFont, Line } from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue, withTiming } from 'react-native-reanimated';

const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
const fontStyle = {
    fontFamily,
    fontSize: 10,
    fontStyle: "normal",
    fontWeight: 500,
};
const font = matchFont(fontStyle);
type Props = {
    x: number
    y: number
    text: string
    index: number
    height: number
    graphMargin: number
    barWidth: number
    grid: boolean
    date:string
    selectBar:SharedValue<string | null>
}
const XAxisText = ({ x, y, text, index, height, graphMargin, barWidth, grid,date,selectBar }: Props) => {
    
   // const c = selectBar?.value===date?'black':'#626C77'
    const c = useDerivedValue(() => {
        if (selectBar.value === date) {
          return withTiming('#ff6346');
        } else if (selectBar.value === null) {
          return withTiming('#ff6346');
        } else {
          return withTiming('#d1d0c5');
        }
      });
    return (
        <>
            <Text x={x + barWidth / 2} y={10} color={c} text={text} font={font} />
            {grid && <Line
                key={index}
                p1={{ x: x! + 13, y: graphMargin / 2 }} // Start of the line
                p2={{ x: x! + 13, y: height + (graphMargin / 2) }} // End of the line
                color="gray" // Light gray for the grid lines
                strokeWidth={0.5}
            />
            }
        </>
    )
}

const styles = StyleSheet.create({

})


export default XAxisText
