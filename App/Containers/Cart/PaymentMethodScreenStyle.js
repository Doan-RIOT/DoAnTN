import { StyleSheet, Dimensions } from 'react-native';
import { Sizes, Colors } from '../../Theme';
import { ApplicationStyles } from '../../Theme';
const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
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
  image: {
    width: 50,
    height: 20,
    resizeMode: 'center',
  }
})
