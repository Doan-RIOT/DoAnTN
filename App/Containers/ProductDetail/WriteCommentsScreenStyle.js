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
  imageProduct: {
    width: 100,
    height: 100,
    marginRight: 10
  },
  input: {
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: Colors.gray,
    fontSize: Sizes.h3,
    textAlignVertical: 'top'
  },
  imageComments: {
    width: 100,
    height: 100,
  },
  writeComment: {
    paddingVertical: 10,
    borderColor: Colors.green,
    borderWidth: 1,
    marginVertical: 10,
  },
  iconDeleteImage: {
    position: 'absolute',
    top: -5, right: -5,
    padding: 4, width: 20, height: 20,
    borderRadius: 15,
    backgroundColor: Colors.pink2 
  },
  btnOnSave: {
    height:35,
    width:65,
    justifyContent:'center', 
    alignItems:'center', 
    borderRadius:5,
    borderColor: Colors.green4,
    borderWidth:0.3
  },
})
