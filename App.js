import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {withAuthenticator} from 'aws-amplify-react-native';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './Screens/HomeScreen';
import AddProductScreen from './Screens/AddProductScreen';
// import Icon from 'react-native-vector-icons/Ionicons';

import {Auth} from 'aws-amplify';
import {Button} from 'react-native-elements';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({navigation}) => ({
            title: 'Home',

            headerRight: () => {
              return (
                <TouchableOpacity
                  style={{padding: 5}}
                  onPress={() => navigation.navigate('AddProduct')}>
                  <Text>➕ </Text>
                </TouchableOpacity>
              );
            },
            headerLeft: () => {
              return (
                <View style={styles.logOut}>
                  <Button
                    title="⤴ "
                    onPress={() => Auth.signOut()}
                    type="clear"
                  />
                </View>
              );
            },
          })}
        />
        <Stack.Screen name="AddProduct" component={AddProductScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logOut: {
    padding: 4,
  },
});

export default withAuthenticator(App);
