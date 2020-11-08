import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Toast, { DURATION } from 'react-native-easy-toast';
import { TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Button, Block,Text, BaseModal,
  Card, Header, Loading, CheckBox, TextCurrency
} from "../../Components";
import { strings } from '../../Locate/I18n';
import Style from './ReasonReturnOrderScreenStyle';
import { Images, Colors } from '../../Theme'
import { Config } from '../../Config/index';
import { Screens } from '../../Utils/screens';
import { Constants } from '../../Utils/constants';
import UserActions from '../../Stores/User/Actions';
import { userService } from '../../Services/UserService';
import { join } from "lodash";
const { height } = Dimensions.get('window');

class ReasonReturnOrderScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            refreshing: false,
            orderId: null,
            listReason: ['reason1', 'reason2', 'reason3', 'reason4'],
            indexSelect: null,
            isOpen: false,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        const {errorCode, navigation} = nextProps;
        const { orderId } = navigation.state.params;
        let data = { errorCode, orderId };

        return data;
    }

    handleConfirm = () => {
        const { indexSelect } = this.state;
        if (indexSelect !== null) {
          this.setState({
            isOpen: true,
          })
        } else {
          this.refs.toastFailed.show(strings('ReasonReturnOrder.msgErrorRequiredReason'), DURATION.LENGTH_LONG);
        }
    };

    handleSaveModal = () => {
        const { language, userActions, userId, navigation } = this.props;
        const {orderId, listReason, indexSelect} = this.state;
        const remakeComment = strings(`ReasonReturnOrder.${listReason[indexSelect]}`);
        const data = {
        orderId,
        statusId: Constants.ORDER_RETURN,
        remakeComment,
        }
        this.handleCloseModal();
        try {
          userService.returnOrder(data, language).then(response => {
            if (response.success) {
              this.refs.toastSuccess.show(strings('DetailOrder.msgReturnOrderSuccess'), DURATION.LENGTH_LONG);
              userActions.fetchHistoriesOrder(userId);
              navigation.goBack();
              navigation.state.params.onRefresh();
            } else {
              this.refs.toastFailed.show(strings('DetailOrder.msgReturnOrderFailed'), DURATION.LENGTH_LONG);
            }
          });
        } catch (error) {
          this.refs.toastFailed.show(strings('DetailOrder.msgReturnOrderFailed'), DURATION.LENGTH_LONG);
        }   
    }

    renderBodyModal = () => {
        return (
          <Block>
            <Text center h2 error>{strings('DetailOrder.msgReturnOrder')}</Text>
          </Block>
        );
    };
    
    renderFooterModal = () => {
    return (
        <Block flex={false} bottom>
        <Button
            green
            onPress={() => {this.handleSaveModal()}}
        >
            <Text bold white center>
            {strings('Modal.ok')}
            </Text>
        </Button>
        <Button
            pink2
            onPress={() => this.handleCloseModal()}
        >
            <Text bold white center>
            {strings('Modal.cancel')}
            </Text>
        </Button>
        </Block>
    )
    };

    handleCloseModal = () => {
        this.setState({
          isOpen: false,
          isOpenReturnOrder: false,
          orderIdConfirm: null,
        })
    };

    render() {
        const { navigation } = this.props;
        const { listReason, indexSelect, isOpen } = this.state;
        let htmlListReason = [];
        if (listReason.length > 0) {
            listReason.forEach((item, index) => {
                let selected = indexSelect === index ? true : false;
                const htmlBranch = (
                    <TouchableOpacity 
                        style={[Style.reason, selected ? Style.reasonSelect : null]}
                        key={index}
                        onPress={() => this.setState({indexSelect : index})}>
                            <Text>{strings(`ReasonReturnOrder.${item}`)}</Text>
                    </TouchableOpacity>
                );
                htmlListReason.push(htmlBranch);
            })
        }
        return (
            <Block style={Style.view}>
                <Header
                    title={strings('ReasonReturnOrder.reasonReturnOrderTitle')}
                    isShowBack
                    navigation={navigation}
                    />
                <Block flex={false} style={{ height: height * 0.75 }}>
                    <ScrollView showsHorizontalScrollIndicator={false}>
                    <Block flex={false} style={Style.container}>
                        {htmlListReason}
                    </Block>
                    </ScrollView>
                    
                </Block>
                <Block style={{ position: 'absolute', left: 10, right: 10, bottom: 0 }}>
                    <Button
                    error
                    onPress={() => this.handleConfirm()}
                    >
                    <Text bold white center style={{ padding: 10 }}>
                        {strings('DetailOrder.returnOrder')}
                    </Text>
                    </Button>
                </Block>
                <Toast
                    ref="toastSuccess"
                    style={{backgroundColor: Colors.green}}
                    position='top'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                />
                <Toast
                    ref="toastFailed"
                    style={{backgroundColor: Colors.accent}}
                    position='top'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                />
                <BaseModal 
                    isOpen={isOpen}
                    bodyModal={this.renderBodyModal}
                    footerModal={this.renderFooterModal}
                    onCancel={this.handleCloseModal} 
                    useScrollView={true}
                />
            </Block>
        )
    }
}

ReasonReturnOrderScreen.defaultProps = {};

ReasonReturnOrderScreen.propTypes = {
  errorCode: PropTypes.string,
  userId: PropTypes.string,
  userActions: PropTypes.object,
};

const mapStateToProps = (state) => ({
  userId: state.user.userId,
})

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReasonReturnOrderScreen);
