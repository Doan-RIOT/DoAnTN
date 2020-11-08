import { StyleSheet, Dimensions } from 'react-native';
import { Sizes, Colors } from '../../Theme';
import { ApplicationStyles } from '../../Theme';
const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  view: {
    backgroundColor: Colors.black,
  },
  container: {
    ...ApplicationStyles.marginHorizontal,
    ...ApplicationStyles.marginTop10,
    ...ApplicationStyles.borderRadiusItem,
    ...ApplicationStyles.backgroundItem,
    ...ApplicationStyles.padding,
  },
  address: {
    ...ApplicationStyles.marginHorizontal,
    marginTop: 5,
  },
  input: {
    borderRadius: 12,
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    height: Sizes.base * 2.5,
  },
  searchIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    color: Colors.gray
  },
  cartIcon: {
    color: Colors.white,
  },
  pickerStyle: {
    maxHeight: height / 2,
  },
  itemCarousel: {
    width: '100%',
    height: height * 0.5
  },
  imageChild: {
    width: 80,
    height: 80,
    marginHorizontal: 5
  },

})
