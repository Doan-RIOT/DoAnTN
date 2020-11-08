import { StyleSheet, Dimensions } from 'react-native';
import { Sizes, Colors, ApplicationStyles } from '../../Theme';

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
    input: {
        ...ApplicationStyles.input,
    },
    button: {
        width: '100%',
        marginVertical: 2,
      },
})