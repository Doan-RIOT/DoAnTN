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
import Style from './CancelOrderScreenStyle';
import { Images, Colors } from '../../Theme'
import { Config } from '../../Config/index';
import { Screens } from '../../Utils/screens';
import { Constants } from '../../Utils/constants';
import UserActions from '../../Stores/User/Actions';
import { userService } from '../../Services/UserService';
const { height } = Dimensions.get('window');

class CancelOrderScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      orderId: null,
      listReason: ['reason1', 'reason2', 'reason3', 'reason4'],
      indexSelect: null,
      isOpen: false,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const { errorCode, navigation } = nextProps;
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
      this.refs.toastFailed.show(strings('CancelOrder.msgErrorRequiredReason'), DURATION.LENGTH_LONG);
    }
  };

  renderBodyModal = () => {
    return (
      <Block>
        <Text center h2 error>{strings('CancelOrder.msgConfirmCancel')}</Text>
      </Block>
    );
  };

  renderFooterModal = () => {
    return (
      <Block flex={false} bottom>
        <Button
          green
          onPress={() => this.handleSaveModal()}
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

  handleSaveModal = () => {
    const { indexSelect, orderId, listReason } = this.state;
    const { userActions, userId, navigation } = this.props;
    const remakeComment = strings(`CancelOrder.${listReason[indexSelect]}`);
    const dataCancel = {
      orderId,
      statusId: 'ORDER_CANCELLED',
      remakeComment,
    }
    this.handleCloseModal();
    try {
      userService.updateOrders([dataCancel]).then(response => {
        if (response.success) {
          this.refs.toastSuccess.show(strings('CancelOrder.msgCancelOrderSuccess'), DURATION.LENGTH_LONG);
          userActions.fetchHistoriesOrder(userId);
          setTimeout(function(){
            navigation.goBack();
            navigation.state.params.onRefresh();
          }, 1000);
        } else {
          this.refs.toastFailed.show(strings('CancelOrder.msgCancelOrderFailed'), DURATION.LENGTH_LONG);
        }
      });
    } catch (error) {
      this.refs.toastFailed.show(strings('CancelOrder.msgCancelOrderFailed'), DURATION.LENGTH_LONG);
    }
  }

  handleCloseModal = () => {
    this.setState({
      isOpen: false,
      indexSelect: null,
    })
  };

  render() {
    // const { loading, userActions, navigation } = this.props;
    // // const { listOrder, refreshing, errorCode, isOpen } = this.state;
    // if ( errorCode === '401') {
    //   this.handleVisibleModal(false);
    //   resetUser();
    //   userActions.resetUser();
    //   navigation.navigate(Screens.WELCOME);
    // }
    const { navigation } = this.props;
    const { listReason, indexSelect, isOpen } = this.state;
    let htmlListReason = [];
    if (listReason.length > 0) {
      listReason.forEach((item, index) => {
        const selected = indexSelect === index ? true : false;
        const htmlBranch = (
          <TouchableOpacity
            style={[Style.reason, selected ? Style.reasonSelect : null]}
            key={index}
            onPress={() => this.setState({
              indexSelect: index,
            })}
          >
            <Text>{strings(`CancelOrder.${item}`)}</Text>
          </TouchableOpacity>
        );

        htmlListReason.push(htmlBranch);
      })
    };

    return (
      <Block style={Style.view}>
        <Header 
          title={strings('CancelOrder.headerTitle')}
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
              pink2
              onPress={() => this.handleConfirm()}
            >
              <Text bold white center style={{ padding: 10 }}>
                {strings('DetailOrder.cancelOrder')}
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
    );
  }
}

CancelOrderScreen.defaultProps = {};

CancelOrderScreen.propTypes = {
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
)(CancelOrderScreen);
