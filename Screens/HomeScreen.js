import React, {useEffect, useState} from 'react';
import {API} from 'aws-amplify';
import {SafeAreaView, StatusBar, TouchableOpacity} from 'react-native';

import {listProducts} from '../src/graphql/queries';
import ProductList from './ProductList';

export default function HomeScreen() {
  const [productsList, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  console.log('Home screen called');

  const fetchProducts = async () => {
    try {
      const products = await API.graphql({query: listProducts});
      if (products.data.listProducts) {
        setProducts(products.data.listProducts.items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        {productsList && (
          <ProductList
            productList={productsList}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
      </SafeAreaView>
    </>
  );
}
