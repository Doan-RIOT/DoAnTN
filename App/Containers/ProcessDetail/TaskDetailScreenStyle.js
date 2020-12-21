import { StyleSheet, Dimensions } from 'react-native';
import { Sizes, Colors, ApplicationStyles } from '../../Theme';
const { height, width } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        marginHorizontal: 5,
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
    ItemEstimatesPhase: {
        backgroundColor: "#E7F8FD",
        borderRadius: 10,
        paddingVertical: 20,
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    ItemSLDDD: {
        backgroundColor: "#E7F8FD",
        borderRadius: 10,
        paddingVertical: 20,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    dot: {
        backgroundColor: "#26C165",
        width: 15,
        height: 15,
        borderRadius: 10
    },
    line: {
        borderColor: Colors.white,
        borderWidth: 0.5,
    },
    estimatesTime: {
        marginHorizontal: 10,
        height: height / 5,
        marginTop: 30,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: null,
    },
    taskContent: {
        backgroundColor: Colors.white,
        marginTop: height / 5 ,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    input: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#D6D6D6",
        borderRadius: 5,
        marginTop: 5,
        backgroundColor: Colors.white
    },
    input1: {
        borderRadius: 10,
        borderWidth: 0,
        borderColor: Colors.gray2,
        borderWidth: 1,
        fontSize: 20,
        color:Colors.catalinaBlue,
      },
      buttonImplement: {
        height: 60,
        width: 60,
        justifyContent: "center",
        alignItems: "center",
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
