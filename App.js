/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import Toast from 'react-native-toast-message';

import { SafeAreaView, StyleSheet, View } from 'react-native';

import Navigation from './src/navigation/index';
import { RootSiblingParent } from 'react-native-root-siblings';

const App = () => {
  return (
    <>
      <RootSiblingParent>
        <SafeAreaView style={style.root}>
          <View style={style.toast}>
            <Toast />
          </View>
          <Navigation />
        </SafeAreaView>
      </RootSiblingParent>
    </>
  );
};

const style = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FBFC',
  },
  toast: {
    zIndex: 99999,
  },
});

export default App;
