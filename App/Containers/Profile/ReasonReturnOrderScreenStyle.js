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
  reason: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 2,
    backgroundColor: Colors.green2
  },
  reasonSelect: {
    borderColor: Colors.pink2,
    borderWidth: 1,
  },
})
