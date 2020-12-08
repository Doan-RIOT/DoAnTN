import { StyleSheet, Dimensions } from 'react-native'
import { Sizes, Colors, ApplicationStyles } from '../../Theme';
const { height, width } = Dimensions.get('window');
export default StyleSheet.create({
  view: {
    ...ApplicationStyles.backgroundView,
  },
  cartIcon: {
    color: Colors.white,
  },
  points: {
    color: Colors.green,
    fontSize: 30,
  },
  card: {
    width: '100%',
    height: 200
  },
  container: {
    borderRadius: 9,
    alignItems: 'center',
    // height: 450,
    flexDirection: 'column',
    marginVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#E4E4E4',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3, },
    shadowOpacity: 0.27,
    shadowRadius: 4.65, elevation: 6,
    paddingBottom:5
  },
  image: {
    height: height / 3,
    width: width - 20,
    resizeMode: 'stretch',
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9
  },
  summary: {
    opacity: 0.90,
    height: height / 4 + 40,
    width: width - 30,
    position: 'absolute',
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    marginTop: height / 3 - 100,
    backgroundColor: '#BEF4A3',
    paddingHorizontal: 5
  },
  timePlan: {
    marginTop: 10,
    paddingHorizontal:10,
    height: height / 13,
    borderColor: "#2AD16E",
    borderWidth: 1,
    alignSelf: "center"
  },
  progress: {

  },
  statistical: {
    paddingHorizontal:10,
    marginTop: 80,
  },
  header: {
    backgroundColor: "#0A9F9E",
    flexDirection: "row",
    height: 60,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
  },
  slidePhase: {
    position: "absolute",
    alignSelf: "center",
    width: "100%",
    top: height / 2 - 30,
  },
  renderItemSlidePhase: {
    paddingVertical: 10,
    width: 115,
    borderRadius: 10,
    shadowColor: "#00000029",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    elevation: 5,
  },
  line: {
    borderColor: "#707070",
    borderWidth: 0.5,
  },
})
