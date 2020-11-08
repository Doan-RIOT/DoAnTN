import { StyleSheet, Dimensions } from 'react-native';
import { Sizes, Colors } from '../../Theme';
import { ApplicationStyles } from '../../Theme';
const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  back: { 
    position: 'absolute',
    top: 40,
    left: '5%',
    zIndex: 99999}
})
