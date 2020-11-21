import { filter } from 'lodash';
import { StyleSheet, Dimensions } from 'react-native';
import { Sizes, Colors, ApplicationStyles } from '../../Theme';
const { height, width } = Dimensions.get('window');
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
    height: height / 2,
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
    paddingHorizontal: 20,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    height: height / 2,
    paddingHorizontal: 20,
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
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    height: height / 2,
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
  },
  containBackground: {
    position: 'absolute',
    top: 0,
    zIndex: 99
  },
  blackContain: {
    opacity: 0.45,
    width,
    height: height
  },
  ProcessFilterContent: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    height: 600,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10,
    paddingHorizontal: 17,
  },
  input: {
    borderColor: "#26C165",
    fontSize: 20
  }
})