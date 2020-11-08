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
  cartIcon: {
    color: Colors.white,
  },
  pickerStyle: {
    maxHeight: height / 2,
  },
  itemCarousel: {
    width: '100%',
    height: width * 0.7
  },
  imageChild: {
    width: 80,
    height: 80,
    marginHorizontal: 5
  },
  textPromotion: {
    borderColor: Colors.accent,
    borderWidth: 1,
    borderRadius: 5,
    padding: 4,
    marginVertical: 3,
    alignSelf: 'flex-start'
  },
  button: {
    minWidth: 40,
    height: 40,
    borderColor: Colors.gray,
    borderWidth: 0.5,
    borderRadius: 0
  },
  progress: {
    marginHorizontal: 5
  },
  comment: {
    paddingVertical: 5,
    borderBottomColor: Colors.gray,
    borderBottomWidth: 0.2,
  },
  writeComment: {
    paddingVertical: 10,
    borderColor: Colors.green,
    borderWidth: 1,
    marginVertical: 10,
  },
  imageComments: {
    width: 50,
    height: 50,
    marginVertical: 5
  },
  imageCommentsContainer : {
    marginTop: 5,
    borderBottomWidth: 0.5,
    paddingVertical: 5,
    borderColor: Colors.gray
  },
  titlePromotion: {
    width: '30%'
  },
  contentPromotion: {
    width: '70%'
  },
  buttonBuyNow: {
    minWidth: 80,
    height: 35,
    borderColor: Colors.gray,
    borderWidth: 0.5,
    borderRadius: 5,
    backgroundColor:Colors.red,
    marginLeft:10
  }
})
