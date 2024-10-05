import {Platform} from 'react-native';
import {Canvas, Text as SkiaText, matchFont} from '@shopify/react-native-skia';
import { SharedValue, useDerivedValue} from 'react-native-reanimated';

const fontFamily = Platform.select({ios: 'Helvetica', default: 'serif'});
const fontStyle = {
  fontFamily,
  fontSize: 20,
  fontStyle: 'normal',
  fontWeight: 500,
};
const font = matchFont(fontStyle);
type Props = {
  selectedValue: SharedValue<number>;
  dateValue: SharedValue<string>;
};
const Tooltip = ({selectedValue, dateValue}: Props) => {
  const animatedText = useDerivedValue(
    () => `${Math.round(selectedValue.value)}`,
  );
 // Animated text for date value
 const animatedDateText = useDerivedValue(() => dateValue.value);

  const fontSize = font.measureText(`${Math.round(selectedValue.value)}`);

  return (
    <Canvas style={{height: fontStyle.fontSize + 8, width: 1000}}>
      <SkiaText 
      x={10}
      y={fontSize.height + 4} text={animatedText} font={font} />
      <SkiaText
        x={60}
        y={fontSize.height + 4}
        text={animatedDateText.value}
        font={font}
      />
    </Canvas>
  );
};

export default Tooltip;
