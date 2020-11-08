import { StyleSheet, Dimensions } from 'react-native';
import { Sizes, Colors, ApplicationStyles } from '../../Theme';

export default StyleSheet.create({
  header: {
    paddingHorizontal: Sizes.base * 2
  },
  view: {
    ...ApplicationStyles.backgroundView,
  },
  container: {
    ...ApplicationStyles.marginHorizontal,
    ...ApplicationStyles.marginTop10,
    ...ApplicationStyles.borderRadiusItem,
    ...ApplicationStyles.backgroundItem,
    ...ApplicationStyles.padding,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 70/ 2,
    borderWidth: 1,
    padding: 2,
    backgroundColor: Colors.green,
    ...ApplicationStyles.marginHorizontal,
    ...ApplicationStyles.marginTop10,
  },
  labelChange: {
    marginTop: 55,
    position: 'absolute',
    marginLeft: 20,
    color: Colors.white,
    fontSize: 12,
  },
  input: {
    ...ApplicationStyles.input,
  },
  iconDateTime: {
    position: 'absolute',
    marginTop: 20,
  },
  radio: {
    color: Colors.green
  },
  button: {
    width: '100%',
    marginVertical: 2,
  },
  hasErrors: {
    borderBottomColor: Colors.error
  }
})
