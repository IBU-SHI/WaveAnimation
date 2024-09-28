import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View>
            <TouchableOpacity
                onPress={() => navigation.navigate('Water Drop')}
                style={styles.button}>
                <Text style={styles.buttonText}>Water drop animation</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('Bar Graph')}
                style={styles.button}>
                <Text style={styles.buttonText}>Bar Graph</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    button: {
        backgroundColor: '#6495ED',
        marginTop: 16,
        padding: 12,
        marginHorizontal: 16,
        borderRadius: 8
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 700,
        color: 'white'
    }

})
export default HomeScreen;