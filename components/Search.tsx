import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View } from 'react-native';
import * as cheerio from 'cheerio';

interface SearchFieldProps {
    onsearcg: () => void;
}

export default function SearchField({ onsearch }: SearchFieldProps) {
    const onsubmit = () => {
        // search for product
        fetch('https://www.bestwaywholesale.co.uk/search?w=')
            .then((response) => response.text())
            .then((html) => {
                const $ = cheerio.load(html);
                const productName = $('#shop-products li:nth-child(1) .prodname a').text().trim();

                const imageSrc = $('li div.prodimageinner img').attr('src');

                onsearch({
                    name: productName,
                    image: imageSrc!,
                });
            })
            .catch((error) => console.log(error));
    };


    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search"
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="web-search"
            />
            <TouchableOpacity style={styles.button} onPress={onsubmit}>
                <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    input: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});
