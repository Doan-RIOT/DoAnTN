import { StyleSheet, Dimensions } from 'react-native';
import { Sizes, Colors, ApplicationStyles } from '../../Theme';
const { height, width } = Dimensions.get('window');
export default StyleSheet.create({
  header: {
    paddingHorizontal: Sizes.base * 2
  },
  view: {
    ...ApplicationStyles.backgroundView,
  },
  container: {
    marginHorizontal: 10,
    marginTop: height / 4,
    borderRadius: 10,
    backgroundColor: Colors.white,
    padding: 10,
    opacity: 0.7
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    borderWidth: 1,
    padding: 2,
    backgroundColor: Colors.green,
    position: "absolute",
    marginTop: height / 6,
  },
  logInOut: {
    marginTop: height / 4,
  },
  item: {
    flexWrap: "wrap",
    borderTopColor: Colors.gray3,
    borderTopWidth: 1,
    paddingVertical: 5,
  },
  associate: {
    ...ApplicationStyles.padding,
  },
  iconAssociate: {
    ...ApplicationStyles.marginHorizontal,
  }
})
