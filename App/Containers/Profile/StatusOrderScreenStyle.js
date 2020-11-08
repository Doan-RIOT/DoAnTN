import { StyleSheet, Dimensions } from 'react-native';
import { Sizes, Colors, ApplicationStyles } from '../../Theme';

export default StyleSheet.create({
    view: {
        ...ApplicationStyles.backgroundItem,
    },
    container: {
        ...ApplicationStyles.marginHorizontal,
        ...ApplicationStyles.marginTop10,
        ...ApplicationStyles.borderRadiusItem,
        ...ApplicationStyles.backgroundItem,
        ...ApplicationStyles.padding,
    },
    containerNotData: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:'50%',
    },
    item: {
        borderBottomColor: Colors.gray3,
        borderBottomWidth: 1,
        paddingVertical: 10,
      }
});