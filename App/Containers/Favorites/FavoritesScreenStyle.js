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
  address: {
    ...ApplicationStyles.marginHorizontal,
    marginTop: 5,
  },
  search: {
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
    height: 150,
  },
  sortType: {
    position: 'absolute', 
    zIndex: 99999,
    width: width,
    shadowColor: Colors.gray, 
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: Colors.white,
    ...ApplicationStyles.borderRadiusItem,
    ...ApplicationStyles.padding,
    maxHeight: height / 2,
  },
  branch: {
    width: width * 0.42,
    height: width * 0.42,
  },
  backgroundTypeSort: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'gray',
    zIndex: 99,
    opacity: 0.5,
  },
  touchOut: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  branchImage: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
  },
  productImage: {
    width: width * 0.42,
    height: width * 0.42,
  },
  button: {
    width: 30,
    height: 30,
    marginTop: 0,
    marginBottom: 5,
  },
  itemBranch: {
    padding: 10,
    borderBottomColor: Colors.gray3,
    borderBottomWidth: 0.5,
  },
  categories: {
    backgroundColor: Colors.green2,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5
  },
  categoriesSelect: {
    borderColor: Colors.green,
    borderWidth: 1,
  },
  categoryImage: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
    borderColor: Colors.green,
    borderWidth: 0.5
  },
  input: {
    ...ApplicationStyles.input,
  },
})
