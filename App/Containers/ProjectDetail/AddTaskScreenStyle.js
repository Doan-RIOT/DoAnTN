import { StyleSheet, Dimensions } from 'react-native';
import { Sizes, Colors, ApplicationStyles } from '../../Theme';

export default StyleSheet.create({
  header: {
    paddingHorizontal: Sizes.base * 2
  },
  view: {
    justifyContent: 'center',
    flex:1
  },
  container: {
    ...ApplicationStyles.marginHorizontal,
    marginTop:60,
    ...ApplicationStyles.borderRadiusItem,
    ...ApplicationStyles.backgroundItem,
    ...ApplicationStyles.padding,
    opacity: 0.7
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100/ 2,
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
