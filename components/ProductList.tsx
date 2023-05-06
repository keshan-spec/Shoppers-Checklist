import React, {useState } from 'react';
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { PList } from '../utils/types';

interface ProductCardProps {
    data: PList;
    onAdd?: (data: PList) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({onAdd, data: { name, image, supplier } }) => {
    if (!name) {
        return (
            <View style={styles.noResultContainer}>
                <Text style={styles.noResult}>No products found</Text>
                <Image source={require('../assets/no-results.jpg')} style={{ width: 200, height: 200 }} />
            </View>
        )
    }

    const onPress = () => {
        if (!onAdd) return;
        Alert.alert('Added to cart');
        onAdd({
            name,
            image: image,
            supplier
        });
    };
   
    return (
            <TouchableOpacity style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.supplier}>{supplier}</Text>
            </View>
            {onAdd && (
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={onPress}>
                    <FontAwesome name="plus" size={10} color="white" style={styles.buttonText} />
                </TouchableOpacity>
            </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    noResult: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    noResultContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginVertical: 8,
        margin: 10
    },
    imageContainer: {
        width: 80,
        height: 80,
        marginRight: 12,
    },
    image: {
        flex: 1,
        resizeMode: 'contain',
    },
    detailsContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    supplier: {
        fontSize: 14,
        color: '#666',
    },
    buttonContainer: {
        width: 80,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#007aff',
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ProductCard;
