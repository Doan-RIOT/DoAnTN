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
  input: {
    ...ApplicationStyles.input,
    height: Sizes.base * 2,
    paddingBottom: 3,
    fontSize: Sizes.caption
  },
  productImage: {
    width: 100,
    height: 100,
  },
  button: {
    width: 40,
    height: 40,
    borderColor: Colors.gray,
    borderWidth: 0.5,
    borderRadius: 0,
  },
  promotion: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 2,
  },
  promotionSelect: {
    borderColor: Colors.green,
    borderWidth: 1,
  },
  titlePromotion: {
    width: '30%'
  },
  contentPromotion: {
    width: '70%'
  }
})
