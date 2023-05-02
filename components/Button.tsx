import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

const ModernButton = ({ title, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007aff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        margin: 10,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ModernButton;
