import { filter } from 'lodash';
import { Button } from 'react-native';
import { StyleSheet, Dimensions } from 'react-native';
import { Sizes, Colors, ApplicationStyles } from '../../Theme';
const { height, width } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    header: {
        backgroundColor: Colors.green,
        height: 60,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: null,
    },
    buttonImplement: {
        backgroundColor: "#E8FFF1",
        height: height / 10,
        marginTop: 70,
        borderRadius: 10,
        alignItems: "center",
    },
    input: {
        fontSize:20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#D6D6D6",
        borderRadius: 5,
        marginTop: 5,
        backgroundColor: Colors.white,
    },
    location: {
        height: height / 3,
        backgroundColor: Colors.white,
        marginTop: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#D6D6D6",
    },
    requestSystem: {
        backgroundColor: Colors.white,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,
        borderWidth: 1,
        borderColor:"#D9D9D9"
    },
    itemRequestSystem: {
        justifyContent: 'space-between',
        marginBottom: 10
    },
    calendarInput: {
        height: 50, 
        borderRadius: 5,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: "#D6D6D6",
        justifyContent: 'space-between',
        paddingHorizontal:10,
        marginTop:5
    },
    summaryContent: {
        backgroundColor: Colors.white,
        borderRadius: 10,
        paddingVertical: 20,
        marginVertical:10,
        paddingHorizontal: 20,
        flexDirection: "column",
        shadowColor: "#00000029",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.25,
        elevation: 6,
    },
    summaryContentItem: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: 50,
        flexDirection: "row",
    },
    Title_summary: {
        marginLeft: 20,
        color: Colors.catalinaBlue
    },
    lineSummary: {
        borderColor: "#707070",
        borderWidth: 0.5,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
      },
      buttonImplement1: {
        height:60,
        width:60,
        justifyContent:"center",
        alignItems:"center",
        position: 'absolute',
        backgroundColor: "#21BA45",
        marginTop: height * 4 / 5,
        marginRight: 20,
        marginLeft: width * 4 / 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 30,
        shadowColor: "#00000059",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.25,
        elevation: 6,
    },
})