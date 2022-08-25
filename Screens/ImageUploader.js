import React from 'react';
import {View, Text, StyleSheet, Image, Button} from 'react-native';

export default function ImageUploader({handleChoosePhoto, photo}) {
  return (
    <View style={styles.imageView}>
      {photo && <Image source={{uri: photo}} style={styles.photo} />}
      <Button
        style={styles.photoBtn}
        title="Choose Photo"
        onPress={handleChoosePhoto}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  imageView: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 15,
  },
  photo: {
    width: 200,
    height: 200,
  },
});
