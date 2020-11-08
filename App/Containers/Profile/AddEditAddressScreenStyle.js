import { StyleSheet, Dimensions } from 'react-native';
import { Sizes, Colors, ApplicationStyles } from '../../Theme';
const { width, height } = Dimensions.get('window');

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
  button: {
    ...ApplicationStyles.marginHorizontal,
    marginTop: 30,
  },
  input: {
    ...ApplicationStyles.input,
  },
  pickerStyle: {
    width: width - (ApplicationStyles.marginHorizontal.marginHorizontal * 2),
    height: height / 2,
  },
  checkbox: {
    color: Colors.green
  },
  hasErrors: {
    borderBottomColor: Colors.error
  }
})
