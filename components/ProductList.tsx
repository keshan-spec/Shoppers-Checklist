import React from 'react';
import { View, Text, Image, StyleSheet, Button, Alert } from 'react-native';
import ModernButton from './Button';

interface ProductCardProps {
    name: string;
    imageUri: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, imageUri }) => {
    if (!name) {
        return (
            <View style={styles.container}>
                <Text>No product found</Text>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.image} />
            </View>
            <Text style={styles.name}>{name}</Text>
            <ModernButton title="Add to list" onPress={() => Alert.alert('Added to list')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '40%',
        backgroundColor: '#fff',
        padding: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    name: {
        fontWeight: 'bold',
        marginTop: 5,
    },
    imageContainer: {
        maxWidth: 250,
        maxHeight: 250,
        padding: 10,
    },

});

export default ProductCard;
