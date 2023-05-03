import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView, Alert, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as cheerio from 'cheerio';

import ProductCard from './components/ProductList';
import ModernButton from './components/Button';
import SearchField from './components/Search';

const { height } = Dimensions.get('window');
export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [productList, setProductList] = useState<{name: string}[]>();

  const [barcode, setBarcode] = useState('');
  const [data, setData] = useState<[{name: string, image: string,}]>([{
    name: '',
    image: '',
  }]);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  useEffect(() => {
    if (scanned && barcode) {
        const URL = 'https://www.bestwaywholesale.co.uk/search?w='
        fetch(URL + barcode)
          .then((response) => response.text())
          .then((html) => {
            console.log(URL + barcode);
            const $ = cheerio.load(html);
            const productName = $('#shop-products li:nth-child(1) .prodname a').text().trim();

            const imageSrc = $('li div.prodimageinner img').attr('src');

            setData([{
              name: productName,
              image: imageSrc!,
            }]);

          })
          .catch((error) => console.log(error));
    }
  }, [scanned, barcode]);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setBarcode(data);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const onAdd = (name: string) => {
    setProductList([...productList!, { name }]);
  };

  const showProducts = () => {

    let plist = '';
    productList?.forEach((product) => {
      plist += product.name + '\n\n';
    });


    if (plist === '') {
      plist = 'Basket is empty';
    }

    Alert.alert(
      'Basket',
      plist,
      [
        {
          text: 'Clear Basket',
          onPress: () => setProductList([]),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: true },
    );
  };


  return (
      <View style={styles.maincontainer}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ width: '100%', height: '50%', backgroundColor: 'black', padding: 0, margin: 0 }}
        />
      <SearchField onSearch={setData} />
      <ScrollView style={{ height: '40%', backgroundColor: 'white' }}>
      {data.map((product, index) => (
        <ProductCard key={index} name={product.name} imageUri={product.image} onAdd={onAdd} />
      ))}
      </ScrollView>
      {scanned && <ModernButton title={'Scan Again'} onPress={() => setScanned(false)} />}
      <ModernButton title={'View Basket'} onPress={showProducts} />
    </View>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 0,
    margin: 0,
  },
});
