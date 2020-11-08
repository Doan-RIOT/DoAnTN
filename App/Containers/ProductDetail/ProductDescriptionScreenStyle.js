import { StyleSheet, Dimensions } from 'react-native';
import { Sizes, Colors, ApplicationStyles } from '../../Theme';
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
    hasErrors: {
        borderBottomColor: Colors.error
    },
    itemCarousel: {
      width: '100%',
      height: width * 0.7
    },
})