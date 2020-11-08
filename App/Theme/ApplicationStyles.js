/**
 * This file defines the base application styles.
 *
 * Use it to define generic component styles (e.g. the default text styles, default button styles...).
 */
import Colors from './Colors'
import Sizes from './Sizes'
import { StyleSheet } from 'react-native';

export default {
  button: {
    backgroundColor: Colors.primary,
  },
  backgroundView: {
    backgroundColor: Colors.gray3,
  },
  backgroundItem: {
    backgroundColor: Colors.white,
  },
  padding: {
    padding: 10,
  },
  marginVertical : {
    marginVertical: 10,
  },
  marginHorizontal: {
    marginHorizontal: 10,
  },
  borderRadiusItem: {
    borderRadius: 10,
  },
  marginTop10: {
    marginTop: 10,
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: Colors.green,
    borderBottomWidth: StyleSheet.hairlineWidth,
    fontSize: Sizes.h3,
  },
}
