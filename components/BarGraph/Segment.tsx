import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = {
  setSelectTab: any
  selectTab: any
}

const Segment = ({ setSelectTab, selectTab }: Props) => {
  const tabs = ['D', 'W', 'M', '6M', 'Y']; // global constant

  return (
    <View style={styles.tabWrapper}>
      {tabs.map(tabOption => (
        <TouchableOpacity
          key={tabOption}
          style={[styles.tab, selectTab === tabOption && styles.selectTab]}
          onPress={() => setSelectTab(tabOption)}>
          <Text style={styles.tabText}>{tabOption}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

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
  tab: {
    borderColor: '#8E8E93',
    flex: 1,
    paddingVertical: 2,
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
  tabText: {
    fontSize: 13,
   // fontWeight: 500,
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: 'center',
  },
});

export default Segment
