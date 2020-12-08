import { StyleSheet, Dimensions } from 'react-native';
import { Sizes, Colors, ApplicationStyles } from '../../Theme';
const { height, width } = Dimensions.get('window');
export default StyleSheet.create({
    itemCarousel: {
        width: width -5,
        height: 220
    },
    carousel: {
        // backgroundColor: Colors.white,
        marginTop: height / 15,
        borderRadius: 10,
        height: 220
    },
    container: {
        flexDirection: "column",
        backgroundColor: "#F1F1F1"
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
    bar: {
        height: height / 2,
        marginBottom: 10,
    },
    backGroundImage: {
        height: height / 2,
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
        top: height / 2 - 70,
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
    questions: {
        marginBottom: 10,
        borderRadius: 10,
        marginTop: 10,
        paddingHorizontal: "4%",
        backgroundColor: Colors.white,
        marginHorizontal: 5,
        paddingVertical: 10,
        shadowColor: "#00000029",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.25,
        elevation: 6,
    },
    line: {
        marginTop: 10,
        borderColor: "#000000",
        borderWidth: 0.5,
    },
    statistical: {
        marginHorizontal: 5,
        flexDirection: "column",
        marginTop: 10
    },
    summaryProcess: {
        height: height * 2 / 5,
        width: "100%",
        borderRadius: 10,
    },
    summaryContent: {
        backgroundColor: Colors.white,
        borderRadius: 10,
        paddingVertical: "2%",
        paddingHorizontal: "5%",
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
        height: "20%",
        flexDirection: "row",
    },
    Title_summary: {
        marginLeft: "5%",
        color: Colors.catalinaBlue
    },
    lineSummary: {
        borderColor: "#707070",
        borderWidth: 0.5,
    },
    chart: {
        backgroundColor: "#E7F8FD",
        marginTop: 25,
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: "100%",
        borderRadius: 10,
        shadowColor: "#00000029",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.25,
        elevation: 6,
    },
    renderContent: {
        marginHorizontal: 5,
        flexDirection: "column",
    },
    ItemEstimatesProcess: {
        flexDirection: "column",
    },
    estimatesPhase: {
        backgroundColor: Colors.white,
        marginBottom: 20,
        borderRadius: 10,
        shadowColor: "#00000029",
        shadowOffset: {
            width: 0,
            height: 39,
        },
        shadowOpacity: 0.25,
        elevation: 6,
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    ItemEstimatesPhase: {
        flexDirection: "row",
        backgroundColor: "#E7F8FD",
        borderRadius: 10,
        paddingVertical: 20,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    totalCostOfPhase: {
        backgroundColor: "#26C165",
        marginVertical: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
        shadowColor: "#00000029",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.25,
        elevation: 6,
    },
    task: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: "#E7F8FD",
        marginLeft: 10,
        borderRadius: 10,
        paddingHorizontal: 10,
        flexDirection: 'column',
    },
    dot: {
        backgroundColor: "#26C165",
        width: 15,
        height: 15,
        borderRadius: 10
    },
    line: {
        borderColor: "#707070",
        borderWidth: 0.5,
    },
})
