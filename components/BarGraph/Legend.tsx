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
    startDuration: string
    endDuration: string
}
const AnimatedText = ({ selectedValue, startDuration, endDuration }: Props) => {

    const animatedText = useDerivedValue(() => `${Math.round(selectedValue.value)} steps`);

    const fontSize = font.measureText(`${Math.round(selectedValue.value)}`);

    return (
        <View style={styles.legendWrapper} >
            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <Canvas style={{ height: fontStyle.fontSize + 4, flex: 0.4 }}>
                    <SkiaText
                        y={fontSize.height}
                        text={animatedText}
                        font={font}
                    />
                </Canvas>
                <Text style={{ fontSize: 14, fontWeight: 500, color: 'grey' }}>average daily</Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: 500, color: 'grey' }}>{startDuration}-{endDuration}</Text>
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