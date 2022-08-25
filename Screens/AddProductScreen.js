// 'use strict';
import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
import {Storage} from 'aws-amplify';

import {Auth, API, graphqlOperation} from 'aws-amplify';
import {createProduct} from '../src/graphql/mutations';

import t from 'tcomb-form-native';
import {Button} from 'react-native-elements';
import ImageUploader from './ImageUploader';
import {launchImageLibrary} from 'react-native-image-picker';

// var launchImageLibrary = require('react-native-image-picker');
const Form = t.form.Form;
const User = t.struct({
  name: t.String,
  price: t.Number,
  description: t.String,
});

export default function AddProductScreen({navigation}) {
  const [form, setForm] = useState(null);
  const [initialValue, setInitialValue] = useState({});

  const [photo, setPhoto] = useState(null);

  const handleChoosePhoto = async () => {
    const product = await form.getValue();
    console.warn('image called');

    setInitialValue({
      name: product.name,
      price: product.price,
      description: product.description,
    });

    await launchImageLibrary({}, response => {
      response.assets.map(data => {
        const {uri} = data;
        setPhoto(uri);
      });
    });
  };

  const options = {
    auto: 'placeholders',
    fields: {
      description: {
        multiLine: true,
        stylesheet: {
          ...Form.stylesheet,
          textbox: {
            ...Form.stylesheet.textbox,
            normal: {
              ...Form.stylesheet.textbox.normal,
              height: 100,
              textAlignVertical: 'top',
            },
          },
        },
      },
    },
  };
  const handleSubmit = async () => {
    alert('Submitted');
    try {
      const value = await form.getValue();
      const user = await Auth.currentAuthenticatedUser();
      if (photo) {
        const response = await fetch(photo);
        const blob = await response.blob();
        await Storage.put(photo, blob, {
          contentType: 'image/jpeg',
        });
      }
      const response = await API.graphql(
        graphqlOperation(createProduct, {
          input: {
            name: value.name,
            price: value.price.toFixed(2),
            description: value.description,
            userId: user.attributes.sub,
            userName: user.username,
            image: photo,
          },
        }),
      );
      console.log('response \n', response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <SafeAreaView style={styles.addProductView}>
        <ScrollView>
          <Form
            ref={c => setForm(c)}
            value={initialValue}
            type={User}
            options={options}
          />
          <ImageUploader photo={photo} handleChoosePhoto={handleChoosePhoto} />
          <Button title="Save" onPress={handleSubmit} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  addProductView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 15,
    height: 'auto',
  },
});
