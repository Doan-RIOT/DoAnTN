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
    backgroundColor: Colors.green
  },
  item: {
    flexWrap: "wrap",
    borderTopColor: Colors.gray3,
    borderTopWidth: 1,
    paddingVertical: 5,
  },
  associate : {
    ...ApplicationStyles.padding,
  },
  iconAssociate: {
    ...ApplicationStyles.marginHorizontal,
  }
})
