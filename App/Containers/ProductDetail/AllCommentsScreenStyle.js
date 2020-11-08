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
  }
})
