import React from 'react'
import { Platform, StyleSheet } from 'react-native'
import { Text, matchFont,Line } from "@shopify/react-native-skia";

const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
const fontStyle = {
    fontFamily,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "bold",
};
const font = matchFont(fontStyle);
type Props = {
    x: number
    y: number
    text: string
    index: number
    height: number
    graphMargin:number
}
const XAxisText = ({ x, y, text,index,height,graphMargin }: Props) => {
    const fontSize = font.measureText(text);
    return (
        <>
            <Text x={x - fontSize.width / 2} y={y} color={'black'} text={text} font={font} />
            <Line
                key={index}
                p1={{ x: x!, y: graphMargin/2 }} // Start of the line
                p2={{ x: x!, y: height + (graphMargin/2) }} // End of the line
                color="gray" // Light gray for the grid lines
                strokeWidth={0.3}
            />
        </>
    )
}

const styles = StyleSheet.create({

})


export default XAxisText
