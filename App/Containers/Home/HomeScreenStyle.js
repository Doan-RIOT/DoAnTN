import { StyleSheet, Dimensions } from 'react-native';
import { Sizes, Colors, ApplicationStyles } from '../../Theme';
const { height, width } = Dimensions.get('window');
const SCREEN_WIDTH = Dimensions.get("window").width;
const rectDimensions = SCREEN_WIDTH * 0.60;
const rectBorderWidth = SCREEN_WIDTH * 0.005;
const scanBarWidth = SCREEN_WIDTH * 0.60; 
const scanBarHeight = SCREEN_WIDTH * 0.0045;
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
    marginVertical: 5,
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
    height: 150
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
    top: 170,
    ...ApplicationStyles.borderRadiusItem,
    ...ApplicationStyles.padding,
    maxHeight: height / 2,
  },
  brand: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.3 / 2,
    resizeMode: 'cover',
    borderColor: Colors.gray,
    borderWidth: 0.5,
    justifyContent: 'center',
  },
  backgroundTypeSort: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'gray',
    zIndex: 99,
    opacity: 0.5
  },
  touchOut: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
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
  pickerStyle: {
    width: width - (ApplicationStyles.marginHorizontal.marginHorizontal * 2),
    height: height / 2,
    borderBottomColor:'transparent',
    borderWidth: 0
  },
  buttonTouchable: {
    padding: 16,
    backgroundColor: Colors.green,
    borderRadius:10,
    height: "10%",
    width: "30%",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonTextStyle: {
    color: Colors.white,
  },
  centerText: {
    flex: 1,
    fontSize: 30,
    padding: 32,
    color: Colors.white,
    marginBottom:20
  },
  rectangleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  rectangle: {
    height: rectDimensions,
    width: rectDimensions,
    borderWidth: rectBorderWidth,
    borderColor: Colors.red,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  topOverlay: {
    height: "20%",
    width: SCREEN_WIDTH,
    backgroundColor: Colors.overlay,
    justifyContent: "center",
    alignItems: "center"
  },
  bottomOverlay: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: Colors.overlay,
    paddingBottom: SCREEN_WIDTH * 0.25
  },
  leftAndRightOverlay: {
    height: SCREEN_WIDTH * 0.60,
    width: SCREEN_WIDTH,
    backgroundColor: Colors.overlay
  },
  scanBar: {
    width: scanBarWidth,
    height: scanBarHeight,
    backgroundColor: Colors.white
  },
  titleAccount: {
    width: '30%'
  },
  contentAccount: {
    width: '70%'
  },
})
