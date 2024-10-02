import { Path, Skia } from '@shopify/react-native-skia'
import React from 'react'
import { StyleSheet } from 'react-native'
import { SharedValue, useDerivedValue } from 'react-native-reanimated'

type Props = {
    x: number | undefined
    y: number
    barWidth: number
    barColor: string
    graphHeight: number
    progress: SharedValue<number>
}
const BarPath = ({ x, y, barWidth, barColor, graphHeight, progress }: Props) => {

    const path = useDerivedValue(() => {
        const barPath = Skia.Path.Make();
        if(y===0){
            y=10
        }
        barPath.addRRect({
            rect: {
                x: x! - barWidth / 2, //this  initial x point (to make it center we subtract half width of bar)
                y: graphHeight+20, // this initial y point
                width: barWidth,
                height: y * -1 * progress.value, //inverted becuse 
            },
            rx: 5,
            ry: 5,
        });

        return barPath;
    });
    return (
        <Path path={path} color={barColor} />
    )
}

const styles = StyleSheet.create({

})

export default BarPath
