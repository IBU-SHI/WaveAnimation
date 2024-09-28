import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WaveProgress } from './WaveProgress';

export const Wave = () => {
  const value = 120;
  const size = 180;
  const percentage = (value / size) * 100;

  return (
  <View>
    <View style={styles().sectionTitleContainer}>
      <Text style={styles().sectionTitle}>Water Drop Wave Animation</Text>
      <Text style={styles().sectionText}>Using Skia, Reanimated</Text>
    </View>
    <View style={styles(size).viewAddImg}>
      <View style={{ alignItems: 'center' }}>
        {percentage >= 96 ? (
          <View style={styles(size).waveViewAfter90Per} />
        ) : (
          <WaveProgress
            size={size}
            value={value}
            style={styles(size).waveBall}
            waveColor="#1B65DE"
            waveLightColor="#76A3F8"
            animated={true}
          />
        )}
      </View>
      <View style={styles(size).waveView} />
      <View style={styles(size).viewTextComp}>
        <Text style={styles(size).textsetwater}>{percentage.toFixed()}%</Text>
        <Text style={styles(size).textConsumption}>Consumption</Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text style={styles(size).textInfo}>Size:- {size}</Text>
        <Text style={styles(size).textInfo}>Value:- {value}</Text>
        <Text style={styles(size).textInfo}>WaveColorLight:- {"#1B65DE"}</Text>
        <Text style={styles(size).textInfo}>WaveColor:- {"#76A3F8"}</Text>
        <Text style={styles(size).textInfo}>Need config RTL</Text>

      </View>

    </View>
  </View>
  );
};

const styles = (size: number = 0) =>
  StyleSheet.create({
    waveBall: {
      alignSelf: 'center',
      aspectRatio: 1,
      borderColor: '#1B65F3',
      borderRadius: size / 2,
      borderWidth: 0,
      height: size,
      overflow: 'hidden',
      position: 'absolute',
      width: size,
    },
    waveView: {
      aspectRatio: 1,
      borderBottomLeftRadius: size / 2,
      borderBottomRightRadius: size / 2,
      borderColor: '#E3ECFD',
      borderTopRightRadius: size / 2,
      borderWidth: 2,
      height: size,
      overflow: 'hidden',
      //transform: [{ rotateZ: I18nManager.isRTL ? '-45deg' : '45deg' }],
      transform: [{ rotateZ: '45deg' }],
      width: size,
    },
    waveViewAfter90Per: {
      aspectRatio: 1,
      backgroundColor: '#1B65F3',
      borderBottomLeftRadius: size / 2,
      borderBottomRightRadius: size / 2,
      borderColor: '#1B65F3',
      borderTopRightRadius: size / 2,
      borderWidth: 1,
      height: size,
      overflow: 'hidden',
      position: 'absolute',
      //transform: [{ rotateZ: I18nManager.isRTL ? '-45deg' : '45deg' }],
      transform: [{ rotateZ: '45deg' }],
      width: size,
    },
    viewAddImg: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
      marginTop: 100,
    },
    viewTextComp: {
      alignSelf: 'center',
      position: 'absolute',
      top: 50,
    },
    textConsumption: {
      alignSelf: 'center',
      color: '#9398A1',
      top: 10,
    },
    textsetwater: {
      alignSelf: 'center',
      color: '#000000',
      top: 10,
      fontSize: 24,
      fontWeight: '700',
    },
    textInfo: {
      alignSelf: 'center',
      color: '#000000',
      top: 10,
      fontSize: 14,
      fontWeight: '700',
    },
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
export default Wave;
