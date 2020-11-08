import { filter } from 'lodash';
import { StyleSheet, Dimensions } from 'react-native';
import { Sizes, Colors, ApplicationStyles } from '../../Theme';
const { height, width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 400;
const HEADER_MIN_HEIGHT = 220;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
export default StyleSheet.create({
  summaryProcess: {
    width: "100%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3, },
    shadowOpacity: 0.27,
    shadowRadius: 4.65, elevation: 6,
  },
  summaryContent: {
    backgroundColor: Colors.white,
    height: "90%",
    opacity: 0.87,
    borderRadius: 10,
    paddingVertical: "2%",
    paddingHorizontal: "5%",
    flexDirection: "column"
  },
  summaryContentItem: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: "20%",
    flexDirection: "row",
  },
  image: {
    height: 320,
    resizeMode: "cover",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: "5%",
    paddingBottom: "10%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3, },
    shadowOpacity: 0.27,
    shadowRadius: 4.65, elevation: 6,
  },
  line: {
    borderColor: "#707070",
    borderWidth: 0.5,
  },
  scrollView: {
    width: "100%",
    marginTop: HEADER_MIN_HEIGHT,
    paddingHorizontal: 20,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  bar: {
    marginTop: "6%",
    marginEnd: "5%",
    height: 32,
    alignItems: 'center',
    alignItems: 'flex-end'
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    height: HEADER_MAX_HEIGHT,
    resizeMode: "stretch"
  },
  filter: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3, },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  search: {
    width: "90%",
    backgroundColor: "#F6F6F6",
    opacity: 0.5,
    borderRadius: 20
  },
  Title_summary: {
    color: Colors.catalinaBlue,
    marginLeft: "5%"
  }

})