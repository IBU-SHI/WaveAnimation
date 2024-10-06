import { Platform, View } from 'react-native';
import { Canvas, RoundedRect, Text as SkiaText, matchFont } from '@shopify/react-native-skia';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';

const fontFamily = Platform.select({ ios: 'Helvetica', default: 'serif' });
const valueFontStyle = {
  fontFamily,
  fontSize: 16,
  fontStyle: 'normal',
  fontWeight: 500,
};
const dateFontStyle = {
  fontFamily,
  fontSize: 12,
  fontStyle: 'normal',
  fontWeight: 500,
};
const valueFont = matchFont(valueFontStyle);
const dateFont = matchFont(dateFontStyle);
type Props = {
  selectedValue: SharedValue<number>;
  dateValue: SharedValue<string>;
  showTooltip: boolean
  xTooltipValue: SharedValue<number>
  width:number
};
const Tooltip = ({ selectedValue, dateValue, showTooltip, xTooltipValue,width }: Props) => {
  const animatedText = useDerivedValue(
    () => ` ${Math.round(selectedValue.value)} steps`,
  );
  // Animated text for date value
  const animatedDateText = useDerivedValue(() => ` ${dateValue.value}`);

  const fontSize = valueFont.measureText(animatedText.value);
  return (
    <View style={{
      shadowColor: 'grey',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
      height: 55,
      marginHorizontal: 16,
    }}>
      {showTooltip &&
        <Canvas style={{ height: valueFontStyle.fontSize + 40, width:width}}>
          <RoundedRect x={xTooltipValue} y={0} width={120} height={valueFontStyle.fontSize + 34} r={12}
           color="grey" />
          <RoundedRect x={xTooltipValue} y={0} width={120} height={valueFontStyle.fontSize + 34} r={12}
            color="white" />
          <SkiaText
            x={xTooltipValue}
            y={fontSize.height + 6} text={animatedText} font={valueFont}
            color={'black'} />


          <SkiaText
            x={xTooltipValue}
            y={fontSize.height + 22}
            text={animatedDateText}
            font={dateFont}
            color={'#626C77'}
          />

        </Canvas>}
    </View>
  );
};

export default Tooltip;
