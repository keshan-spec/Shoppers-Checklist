import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Dimensions } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as cheerio from 'cheerio';

import ProductCard from './components/ProductList';
import ModernButton from './components/Button';
import SearchField from './components/Search';

const { height } = Dimensions.get('window');
export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);

  const [barcode, setBarcode] = useState('');
  const [data, setData] = useState({
    name: '',
    image: '',
  });

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

            setData({
              name: productName,
              image: imageSrc!,
            });

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

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ width: '100%', height: '60%', backgroundColor: 'black', padding: 0, margin: 0 }}
      />
      {data && <ProductCard imageUri={data.image} name={data.name} />}
      {(scanned && data.name == '' )&& <SearchField onsearch={setData} />}
      {scanned && <ModernButton title={'Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: 0,
    margin: 0,
  },
});
