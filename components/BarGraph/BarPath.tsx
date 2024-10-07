import { Path, Skia } from '@shopify/react-native-skia'
import React from 'react'
import { StyleSheet } from 'react-native'
import { SharedValue, useDerivedValue, withTiming } from 'react-native-reanimated'

type Props = {
    x: number | undefined
    y: number
    barWidth: number
    barColor: string
    graphHeight: number
    progress: SharedValue<number>
    date:string
    selectBar:SharedValue<string | null>
}
const BarPath = ({ x, y, barWidth, barColor, graphHeight, progress,selectBar,date }: Props) => {

     // const c = selectBar?.value===date?'black':'#626C77'
     const c = useDerivedValue(() => {
        if (selectBar.value === date) {
          return withTiming(barColor);
        } else if (selectBar.value === null) {
          return withTiming(barColor);
        } else {
          return withTiming('#7F82F526');
        }
      });
    const path = useDerivedValue(() => {
        const barPath = Skia.Path.Make();
        barPath.addRRect({
            rect: {
                x: x! + barWidth / 2, //this  initial x point (to make it center we subtract half width of bar)
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
        <Path path={path} color={c} />
    )
}

const styles = StyleSheet.create({

})

export default BarPath
