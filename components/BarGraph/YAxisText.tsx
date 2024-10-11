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
    width: number
    barSpacing: number
    graphMargin: number
    grid: boolean
}
const YAxisText = ({ x, y, text, index, width, barSpacing, graphMargin, grid=true }: Props) => {
    return (
        <>
            <Text x={x} y={y} color={'#626C77'} text={text} font={font} />
            {grid && <Line
                key={index}
                p1={{ x: 0, y: y + (graphMargin / 2) }} // Start of the line
                p2={{ x: width - barSpacing, y: y + (graphMargin / 2) }} // End of the line
                color="gray" // Light gray for the grid lines
                strokeWidth={0.3}
            />}
        </>

    )
}

const styles = StyleSheet.create({

})


export default YAxisText
