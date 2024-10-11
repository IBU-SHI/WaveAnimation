import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const tabs = ['D', 'W', 'M', '6M', 'Y']; // global constant
type Props = {
  setSelectTab: any
  selectTab: any
}

const Segment = ({ setSelectTab, selectTab }: Props) => {
  const [activeSegment, setActiveSegment] = useState(selectTab);
  const translateX = useSharedValue(0);

  const handlePress = (tabOption: string, index: number) => {
    setSelectTab(tabOption)
    setActiveSegment(tabOption);
    translateX.value = withTiming(index * (width - 48) / 5, { duration: 200 });
  };

  // Use Reanimated's animated style for the sliding effect
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });
  return (
    <View style={styles.tabWrapper}>
      <Animated.View style={[styles.animatedButton, animatedStyle]}>
        <TouchableOpacity style={styles.selectTab}>
          <Text style={[styles.tabText, { color: 'white' }]
          }>{activeSegment}</Text>
        </TouchableOpacity>
      </Animated.View>

      {tabs.map((tabOption, index) => (
        <TouchableOpacity
          key={tabOption}
          style={styles.tab}
          onPress={() => handlePress(tabOption, index)}
        >
          <Text style={styles.tabText}>{tabOption}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabWrapper: {
    flexDirection: 'row',
    marginHorizontal: 16,
    padding: 2,
    gap: 4,
    borderRadius: 9,
    backgroundColor: '#7878801F',
    borderWidth: 0.5,
    borderColor: '#7878801F',
    marginVertical: 12,
  },
  selectTab: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 7,
    backgroundColor: 'white',
    flex: 1,
    shadowColor: 'grey',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tab: {
    borderColor: '#8E8E93',
    flex: 1,
    paddingVertical: 2,
  },
  animatedButton: {
    position: 'absolute',
    width: ((width - 48) / 5),
    padding: 3
  },
  tabText: {
    fontSize: 13,
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: 'center',
  },
});

export default Segment;