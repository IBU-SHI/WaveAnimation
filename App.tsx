import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Wave from './components/Wave/Wave';

function App(): React.JSX.Element {
  return (
    <View style={styles.sectionContainer}>
      <Wave />
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>Water Drop Wave Animation</Text>
        <Text style={styles.sectionText}>Using Skia, Reanimated</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitleContainer: {
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  sectionText: {
    fontSize: 16,
    color: 'black',
  },
});

export default App;
