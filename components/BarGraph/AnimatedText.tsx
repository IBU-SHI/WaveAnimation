import { Platform } from "react-native";
import { Canvas, Text, matchFont, Fill, Skia } from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
const fontStyle = {
    fontFamily,
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "bold",
};
const font = matchFont(fontStyle);
type Props = {
    selectedValue: SharedValue<number>
}
const AnimatedText = ({ selectedValue }: Props) => {

    const animatedText = useDerivedValue(() => {

        return `${Math.round(selectedValue.value)}`;
    });

    const fontSize = font.measureText(`${Math.round(selectedValue.value)}`);

    return (
        <Canvas style={{ height: fontStyle.fontSize, width: '20%' }}>
            <Text
                y={fontSize.height}
                text={animatedText}
                font={font}
            />
        </Canvas>
    );
};

export default AnimatedText