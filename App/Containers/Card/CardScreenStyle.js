import { StyleSheet, Dimensions } from 'react-native'
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
  cartIcon: {
    color: Colors.white,
  },
  points: {
    color: Colors.green,
    fontSize: 30,
  },
  card: {
    width: '100%',
    height: 200
  }
})
