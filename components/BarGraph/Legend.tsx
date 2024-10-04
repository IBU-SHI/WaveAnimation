import { Platform, View, Text, StyleSheet } from "react-native";
import { Canvas, Text as SkiaText, matchFont, } from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
const fontStyle = {
    fontFamily,
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: 500,
};
const font = matchFont(fontStyle);
type Props = {
    selectedValue: SharedValue<number>
    startDuration : string
     endDuration:string
}
const AnimatedText = ({ selectedValue, startDuration,endDuration }: Props) => {

    const animatedText = useDerivedValue(() =>  `${Math.round(selectedValue.value)}`);

    const fontSize = font.measureText(`${Math.round(selectedValue.value)}`);

    return (
        <View style={styles.legendWrapper} >
            <View style={{ flexDirection: "row", flex: 1, justifyContent: "flex-start" }}>
                <Canvas style={{ height: fontStyle.fontSize + 8, flex: 1}}>
                    <SkiaText
                        y={fontSize.height + 4}
                        text={animatedText}
                        font={font}
                    />

                </Canvas>
                <View style={{ height: fontStyle.fontSize + 8, flex: 6, flexDirection: "row", alignContent: "center", alignItems: "center", gap: 2 }}>
                    <Text style={{ fontSize: 20, fontWeight: 500 }}>steps</Text>
                    <Text style={{ fontSize: 14, fontWeight: 500, color: 'grey' }}>average daily</Text>
                </View>
            </View>

            <View style={{ paddingTop: 24 }}>
                <Text style={{ fontSize: 14, fontWeight: 500, color: 'grey' }}>{startDuration}-{endDuration}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    legendWrapper: {
        marginTop: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 4,
    },
})
export default AnimatedText