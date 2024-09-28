import React from 'react'
import { StyleSheet ,View,Text} from 'react-native'

function BarGraph() {
  return (
    <View style={styles.sectionTitleContainer}>
      <Text style={styles.sectionTitle}>Bar Graph</Text>
      <Text style={styles.sectionText}>Using Skia,D3 and Reanimated</Text>
    </View>
  )
}

const styles = StyleSheet.create({
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
})

export default BarGraph
