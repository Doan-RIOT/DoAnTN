import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Toast, { DURATION } from 'react-native-easy-toast';
import { TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Button, Block,Text, BaseModal,
  Card, Header, Loading, CheckBox, TextCurrency
} from "../../Components";
import { strings } from '../../Locate/I18n';
import Style from './ListOrderScreenStyle';
import { Images, Colors } from '../../Theme';
import { resetUser } from '../../Utils/storage.helper';
import { Config } from '../../Config/index';
import { Screens } from '../../Utils/screens';
import { Constants } from '../../Utils/constants';
import UserActions from '../../Stores/User/Actions';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import StatusOrderScreen from './StatusOrderScreen';
class ListOrderScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      historiesOrder: [],
      waitForConfirmOrder: [],
      confirmOrder: [],
      canncelOrder: [],
      deliveryOrder: [],
      deliveredOrder: [],
      returnOrder: [],
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const { errorCode, historiesOrder } = nextProps;
    let data = { errorCode, historiesOrder };
    data.waitForConfirmOrder = historiesOrder.filter(item => item.orderStatusId === Constants.ORDER_CREATED);
    data.confirmOrder = historiesOrder.filter(item => item.orderStatusId === Constants.ORDER_CONFIRM);
    data.deliveryOrder = historiesOrder.filter(item =>item.orderStatusId === Constants.ORDER_SENT);
    data.deliveredOrder = historiesOrder.filter(item => item.orderStatusId === Constants.ORDER_COMPLETED);
    data.canncelOrder = historiesOrder.filter(item=> item.orderStatusId === Constants.ORDER_CANCELLED);
    data.returnOrder = historiesOrder.filter(item => item.orderStatusId === Constants.ORDER_RETURN);
    return data;
  }

  onRefresh = () => {
    const { userActions, userId } = this.props;
    userActions.fetchHistoriesOrder(userId);
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
    const { refreshing, waitForConfirmOrder, confirmOrder, canncelOrder, deliveryOrder, deliveredOrder, returnOrder } = this.state;
    return (
      <Block style={Style.view}>
        <Header 
          title={strings('ListOrder.headerTitle')}
          isShowBack
          navigation={navigation}
        />
          <ScrollableTabView
              style={{ marginTop: 5, flex:1}}
              initialPage={0}
              tabBarActiveTextColor={Colors.green}
              tabBarUnderlineStyle={{backgroundColor:Colors.green, height:2}}
              tabBarTextStyle={{fontSize:13}}
              renderTabBar={() => <ScrollableTabBar />}
          >
            <StatusOrderScreen 
              tabLabel={strings('ListOrder.waitForConfirmOrder')} 
              props={this.props} 
              statusOrder={waitForConfirmOrder}
              refreshing={refreshing}
              onRefresh={this.onRefresh}/>
            <StatusOrderScreen 
              tabLabel={strings('ListOrder.confirmOrder')} 
              props={this.props}
              statusOrder={confirmOrder}
              refreshing={refreshing}
              onRefresh={this.onRefresh}/>
            <StatusOrderScreen 
              tabLabel={strings('ListOrder.deliveryOrder')} 
              props={this.props}
              refreshing={refreshing}
              statusOrder={deliveryOrder}
              onRefresh={this.onRefresh}/>
            <StatusOrderScreen 
              tabLabel={strings('ListOrder.deliveredOrder')} 
              props={this.props}
              statusOrder={deliveredOrder}
              refreshing={refreshing}
              onRefresh={this.onRefresh}/>
            <StatusOrderScreen 
              tabLabel={strings('ListOrder.canncelOrder')} 
              props={this.props}
              statusOrder={canncelOrder}
              refreshing={refreshing}
              onRefresh={this.onRefresh}/>
            <StatusOrderScreen 
              tabLabel={strings('ListOrder.returnOrder')} 
              props={this.props}
              statusOrder={returnOrder}
              refreshing={refreshing}
              onRefresh={this.onRefresh}/>
          </ScrollableTabView>
      </Block>
    );
  }
}

ListOrderScreen.defaultProps = {};

ListOrderScreen.propTypes = {
  errorCode: PropTypes.string,
  userId: PropTypes.string,
  historiesOrder: PropTypes.array,
  userActions: PropTypes.object,
};

const mapStateToProps = (state) => ({
  historiesOrder: state.user.historiesOrder,
  userId: state.user.userId,
  language: state.user.language,
  errorCode: state.user.errorCode,
})

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListOrderScreen);

