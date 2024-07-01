import {area, scaleLinear} from 'd3';
import {useEffect} from 'react';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {Canvas, Skia, Path} from '@shopify/react-native-skia';
import {ImageStyle, StyleProp, TextStyle, View, ViewStyle} from 'react-native';

type Props = {
  size: number;
  value: number;
  style?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
  waveColor?: string;
  waveLightColor?: string;
  waveLight?:boolean;
  animated?:boolean;
};

export const WaveProgress = ({size, value, style,waveColor='#141516',waveLightColor='#9398A1',waveLight=true,animated=true}: Props) => {
  const radius = size * 0.5; // radius

  const fillPercent = Math.max(0, Math.min(size, value)) / size; // percent of how much progress filled

  const waveCount = 2; // how many full waves will be seen in the circle
  const waveClipCount = waveCount + 4; // extra wave for translate x animation
  const waveLength = (radius * 6) / waveCount; // wave length base on wave count
  const waveClipWidth = waveLength * waveClipCount; // extra width for translate x animation
  const waveHeight = radius * 0.3; // wave height relative to the circle radius
  const waveHeightLight = radius * 0.1; // wave height of light relative to the circle radius

  // Data for building the clip wave area.
  // [number, number] represent point
  // we have 40 points per wave
  const data: Array<[number, number]> = [];
  for (let i = 0; i <= 40 * waveClipCount; i++) {
    data.push([i / (40 * waveClipCount), i / 40]);
  }

  const waveScaleX = scaleLinear().range([0, waveClipWidth]).domain([0, 1]); // interpolate value between 0 and 1 to value between 0 and waveClipWidth
  const waveScaleY = scaleLinear().range([0, waveHeight]).domain([0, 1]); // interpolate value between 0 and 1 to value between 0 and waveHeight
  const waveScaleYLight = scaleLinear()
    .range([0, waveHeightLight])
    .domain([0, 1]); // interpolate value between 0 and 1 to value between 0 and waveHeight for Light wave

  const clipArea = area()
    .x(function (d) {
      return waveScaleX(d[0]);
    })
    .y0(function (d) {
      return waveScaleY(Math.sin(d[1] * 2 * Math.PI));
    })
    .y1(function (_d) {
      return radius * 2 + waveHeight;
    });

  const clipSvgPath = clipArea(data); // convert data points as wave area and output as svg path string

  const clipAreaLight = area()
    .x(function (d) {
      return waveScaleX(d[0]);
    })
    .y0(function (d) {
      return waveScaleYLight(Math.sin(d[1] * 2 * Math.PI + 60)); //add 60 degree more for light wave
    })
    .y1(function (_d) {
      return radius * 2 + waveHeightLight;
    });

  const clipSvgPathLight = clipAreaLight(data); // convert data points as wave area and output as svg path string

  const translateXAnimated = useSharedValue(0); // animated value translate wave horizontally
  const translateYPercent = useSharedValue(0); // animated value translate wave vertically

  useEffect(() => {
    if (animated) {
      translateYPercent.value = withTiming(fillPercent, {
        duration: 1000,
      });
    }
  }, [fillPercent, animated]);

  useEffect(() => {
    if (animated) {
      translateXAnimated.value = withRepeat(
        withTiming(1, {
          duration: 5000,
          easing: Easing.linear,
        }),
        -1,
      );
    }
  }, [animated]);

  const clipPath = useDerivedValue(() => {
    if (!clipSvgPath) {
      return Skia.Path.Make(); // Return an empty path or handle this case as needed
    }
    // animated value for clip wave path
    const newClipPath = Skia.Path.MakeFromSVGString(clipSvgPath); // convert svg path string to skia format path
    const transformMatrix = Skia.Matrix(); // create Skia tranform matrix
    transformMatrix.translate(
      0 - waveLength * translateXAnimated.value, // translate left from start of the first wave to the length of first wave
      0 + (1 - translateYPercent.value) * radius * 2 - waveHeight, // translate y to position where lower point of the wave in the innerCircleHeight * fillPercent
      // since Y axis 0 is in the top, we do animation from 1 to (1 - fillPercent)
    );
    if (!newClipPath) {
      return Skia.Path.Make(); // Return an empty path or handle this case as needed
    }
    newClipPath.transform(transformMatrix); // apply transform matrix to our clip path
    return newClipPath;
  }, [translateXAnimated, translateYPercent]);

  const clipPathLight = useDerivedValue(() => {
    if (!clipSvgPathLight) {
      return Skia.Path.Make(); // Return an empty path or handle this case as needed
    }
    // animated value for clip wave path
    const newClipPathLight = Skia.Path.MakeFromSVGString(clipSvgPathLight); // convert svg path string to skia format path
    const transformMatrix = Skia.Matrix(); // create Skia tranform matrix
    transformMatrix.translate(
      0 - waveLength * translateXAnimated.value, // translate left from start of the first wave to the length of first wave
      0 + (1 - translateYPercent.value) * radius * 2 - waveHeight, // translate y to position where lower point of the wave in the innerCircleHeight * fillPercent
      // since Y axis 0 is in the top, we do animation from 1 to (1 - fillPercent)
    );
    if (!newClipPathLight) {
      return Skia.Path.Make(); // Return an empty path or handle this case as needed
    }
    newClipPathLight.transform(transformMatrix); // apply transform matrix to our clip path
    return newClipPathLight;
  }, [translateXAnimated, translateYPercent]);

  return (
    <View style={style}>
      <Canvas style={{width: size, height: size}}>
       {waveLight && <Path path={clipPathLight} color={waveLightColor} />}
        <Path path={clipPath} color={waveColor} />
      </Canvas>
    </View>
  );
};
