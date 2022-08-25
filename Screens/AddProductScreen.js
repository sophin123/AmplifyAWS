import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, SafeAreaView} from 'react-native';

import {Auth, API, graphqlOperation} from 'aws-amplify';
import {createProduct} from '../src/graphql/mutations';

import t from 'tcomb-form-native';
import {Button} from 'react-native-elements';

const Form = t.form.Form;
const User = t.struct({
  name: t.String,
  price: t.Number,
  description: t.String,
});

export default function AddProductScreen({navigation}) {
  const [form, setForm] = useState(null);
  const [initialValue, setInitialValue] = useState({});

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
      const response = await API.graphql(
        graphqlOperation(createProduct, {
          input: {
            name: value.name,
            price: value.price.toFixed(2),
            description: value.description,
            userId: user.attributes.sub,
            userName: user.username,
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
