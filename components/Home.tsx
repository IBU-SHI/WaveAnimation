import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View style={{flex:1,gap:8}}>
            <TouchableOpacity
                onPress={() => navigation.navigate('Water Drop')}
                style={[styles.button,{marginTop:16}]}>
                <Text style={styles.buttonText}>Water drop animation</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('Bar Graph')}
                style={[styles.button,{backgroundColor:'red'}]}>
                <Text style={styles.buttonText}>Bar Graph</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    button: {
        backgroundColor: '#6495ED',
        padding: 12,
        marginHorizontal: 16,
        borderRadius: 8
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white'
    }

})
export default HomeScreen;