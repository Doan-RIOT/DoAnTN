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
  product: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  item: {
    flexWrap: "wrap",
    borderBottomColor: Colors.gray3,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  branchImage: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    resizeMode: 'cover',
    borderColor: Colors.gray,
    borderWidth: 0.5,
  },
})
