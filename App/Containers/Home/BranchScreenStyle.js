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
    resizeMode: 'cover',
    borderColor: Colors.gray,
    borderWidth: 0.5,
  },
  productImage: {
    width: '100%',
    height: width * 0.4,
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
  input: {
    ...ApplicationStyles.input,
  },
  buttonSelectBranch: {
    backgroundColor: "#E8F5E9",
    borderRadius:5, 
    padding:3, 
    justifyContent:'center', 
    flexDirection:'row',
    borderWidth:0.5,
    borderColor:'#C8E6C9', 
  },
  buttonAddNumber: {
    minWidth: 25,
    height: 30,
    borderColor: Colors.gray,
    borderWidth: 0.5,
    borderRadius: 0
  },
  buttonBuyNow: {
    minWidth: 105,
    height: 35,
    borderColor: Colors.gray,
    borderWidth: 0.5,
    borderRadius: 5,
    backgroundColor:Colors.red,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    borderColor: Colors.green,
    borderWidth: 0.5
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    alignItems: 'center',
    backgroundColor: 'black',
    justifyContent: 'center'
  }
})
