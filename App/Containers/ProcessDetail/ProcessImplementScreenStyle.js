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
        backgroundColor: "#0A9F9E",
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
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#D6D6D6",
        borderRadius: 5,
        marginTop: 5,
        backgroundColor: Colors.white
    },
    location: {
        height: height / 3,
        backgroundColor: "#0A9F9E",
        marginTop: 10
    },
    requestSystem: {
        backgroundColor: Colors.white,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10
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
})