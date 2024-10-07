import React from 'react'
import { Platform, StyleSheet } from 'react-native'
import { Text, matchFont, Line } from "@shopify/react-native-skia";

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
}
const XAxisText = ({ x, y, text, index, height, graphMargin, barWidth, grid }: Props) => {
    return (
        <>
            <Text x={x + barWidth / 2} y={y-2} color={'#626C77'} text={text} font={font} />
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