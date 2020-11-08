import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Toast, { DURATION } from 'react-native-easy-toast';
import { Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Button, Block,Text, BaseModal,
  Card, Header, Loading, CheckBox, TextCurrency
} from "../../Components";
import { strings } from '../../Locate/I18n';
import Style from './DetailOrderScreenStyle';
import { Images, Colors } from '../../Theme'
import { resetUser } from '../../Utils/storage.helper';
import { Config } from '../../Config/index';
import { Screens } from '../../Utils/screens';
import { Constants } from '../../Utils/constants';
import UserActions from '../../Stores/User/Actions';
import { userService } from '../../Services/UserService';

class DetailOrderScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      order: {},
      errorCode: '',
      isEditing: false,
      isOpen: false,
      orderIdConfirm: null,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const { errorCode, navigation } = nextProps;
    const { isEditing } = prevState;
    const { order } = navigation.state.params;
    let data = { errorCode };
    if (!isEditing) data.order = order;

    return data;
  }

  renderItemOrderBranch = (items, branchName, orderStatusId, branchId) => {
    let htmlItems = [];
    const { navigation } = this.props;
    items.forEach((item, index) => {
      const { imageUrl, productName, salePrice, orderNumber, productId, productCode } = item;
      const htmlItem = (
        <Block key={productId}>
          <Block row>
            <Block flex={false} style={{ width: '30%' }}>
              <Image 
                source={{ uri: `${Config.IMAGE_URL}${imageUrl}` }}
                style={Style.productImage}
              />
            </Block>
            <Block flex={false} style={{ width: '70%', paddingHorizontal: 10 }}>
              <Text bold h3>{productName}</Text>
              <Text h3 gray>{`${strings('ProductDetail.provider')}: ${branchName ? branchName : ''}`}</Text>
              <Text h3 gray>{`${strings('ProductDetail.productCode')}: ${productCode ? productCode : ''}`}</Text>
              <Text h3><TextCurrency h3 bold pink2 value={salePrice} /> <Text bold pink2 h3>đ</Text> x {orderNumber}</Text>
            </Block>
          </Block>
          {orderStatusId && orderStatusId === 'ORDER_COMPLETED' ? (
            <Block>
              <Block>
                <Button
                  green
                  onPress={
                    () => navigation.navigate(Screens.WRITE_COMMENTS, { product: item, isFromDetailsOrder: true, branchId })
                  }
                >
                  <Text bold white center style={{ padding: 10 }}>
                    {strings('DetailOrder.writeComment')}
                  </Text>
                </Button>
              </Block>
              
              <Block>
                  <Button
                    error
                    onPress={() => navigation.navigate(Screens.REASON_RETURN_ORDER, { orderId: item.id, 'onRefresh': this.onRefresh})}
                  >
                    <Text bold white center style={{ padding: 10 }}>
                      {strings('DetailOrder.returnOrder')}
                    </Text>
                  </Button>
              </Block>
            </Block>
          ) : null}
        </Block>
      )
      htmlItems.push(htmlItem);
    });

    return (
      <Block flex={false}>
        {htmlItems}
      </Block>
    );
  }

  renderOrderBranch = orderBranch => {
    const {
      branchName, items, branchId, orderStatusString,
      estimatedShipDate, orderId, orderStatusId
    } = orderBranch;
    const { navigation } = this.props;
    return (
      <Block key={branchId} style={{ marginBottom: 20}}>
        {items.length > 0 ? (
          <>
            <Text h3 bold>
              {`${strings('ListOrder.Order')}: #${orderId ? orderId : '' }`}
            </Text>
            <Text h3 green bold>{branchName}</Text>
            {this.renderItemOrderBranch(items, branchName, orderStatusId, branchId)}
            <Text h3 gray>
              {`${strings('ListOrder.statusOrder')}: `}
              <Text h3 color={orderStatusId && orderStatusId === 'ORDER_CANCELLED' ? Colors.pink2 : Colors.green}>
                {orderStatusString ? orderStatusString : ''}
              </Text>
            </Text>
            <Text h3 gray>
              {`${strings('Cart.estimationDate')}: `}
              <Text h3 gray>
                {estimatedShipDate ? estimatedShipDate : ''}
              </Text>
            </Text>
            {orderStatusId && (orderStatusId === 'ORDER_CREATED' || orderStatusId === 'ORDER_APPROVED' || orderStatusId === 'ORDER_CONFIRM' || orderStatusId === 'ORDER_PROCESSING') ? (
              <Block>
                <Button
                  pink2
                  onPress={() => navigation.navigate(Screens.CANCEL_ORDER, { orderId, 'onRefresh': this.onRefresh })}
                >
                  <Text bold white center style={{ padding: 10 }}>
                    {strings('DetailOrder.cancelOrder')}
                  </Text>
                </Button>
              </Block>
            ) : null}
            {orderStatusId && orderStatusId === 'ORDER_SENT' ? (
              <Block>
                <Button
                  green
                  onPress={() => this.handleConfirm(orderId)}
                >
                  <Text bold white center style={{ padding: 10 }}>
                    {strings('DetailOrder.confirmOrder')}
                  </Text>
                </Button>
              </Block>
            ) : null}
          </>
        ) : null}
      </Block>
    )
  }

  renderProductsOrder = () => {
    const { order } = this.state;
    const { orderForBranch } = order;
    let htmlProductsOrder = [];
    if (orderForBranch && orderForBranch.length > 0) {
      for (let index = 0; index < orderForBranch.length; index +=1) {
        const orderBranch = orderForBranch[index];
        const htmlOderBranch = this.renderOrderBranch(orderBranch);
        htmlProductsOrder.push(htmlOderBranch);
      }
    }
    
    return htmlProductsOrder;
  }

  onRefresh = () => {
    this.setState({
      isEditing: true,
    })
    const { language } = this.props;
    const { order } = this.state;
    const { id } = order;
    userService.fetchDetailsHistoryOrder(id, language).then(response => {
      if (response.success) {
        const data  = response.data && data !== null ? response.data : {};
        this.setState({
          order: data,
        })
      }
    }).catch(error => {});
  };

  handleConfirm = orderId => {
    this.setState({
      isOpen: true,
      orderIdConfirm: orderId
    })
  };

  renderBodyModal = () => {
    return (
      <Block>
        <Text center h2 error>{strings('DetailOrder.msgConfirmOrder')}</Text>
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

  handleSaveModal = () => {
    const { orderIdConfirm } = this.state;
    const { userActions, userId } = this.props;
    const dataCancel = {
      orderId: orderIdConfirm,
      statusId: 'ORDER_COMPLETED',
    }
    this.handleCloseModal();
    try {
      userService.updateOrders([dataCancel]).then(response => {
        if (response.success) {
          this.refs.toastSuccess.show(strings('DetailOrder.msgConfirmOrderSuccess'), DURATION.LENGTH_LONG);
          this.onRefresh();
          userActions.fetchHistoriesOrder(userId);
        } else {
          this.refs.toastFailed.show(strings('DetailOrder.msgConfirmOrderFailed'), DURATION.LENGTH_LONG);
        }
      });
    } catch (error) {
      this.refs.toastFailed.show(strings('DetailOrder.msgConfirmOrderFailed'), DURATION.LENGTH_LONG);
    }
  }

  handleCloseModal = () => {
    this.setState({
      isOpen: false,
      orderIdConfirm: null,
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
    const { refreshing, order, isOpen, isOpenReturnOrder } = this.state;
    const { receiverName, receiverPhone, receiveAddr } = order;

    return (
      <Block style={Style.view}>
        <Header 
          title={strings('DetailOrder.detailOrder')}
          isShowBack
          navigation={navigation}
        />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => this.onRefresh()}
            />
          }
        >
          <Block style={Style.container}>
            <Block style={Style.item}>
              <Text h3 bold>
                {`${strings('ListOrder.Order')}: #${order.id ? order.id : '' }`}
              </Text>
              <Text h3 gray>
                {`${strings('ListOrder.timeOrder')}: `}
                <Text h3 gray>
                  {order.orderDate ? order.orderDate : ''}
                </Text>
              </Text>
              <Text h3 gray>
                {`${strings('ListOrder.statusOrder')}: `}
                <Text h3 color={order.orderStatusId && order.orderStatusId === 'ORDER_CANCELLED' ? Colors.pink2 : Colors.green}>
                  {order.orderStatusString ? order.orderStatusString : ''}
                </Text>
              </Text>
            </Block>
            <Block style={Style.item}>
              <Text h3 bold>
                {strings('Cart.addressReceiver')}
              </Text>
              <Text h3 gray>
                {`${receiverName ? receiverName : ''}${receiverPhone ? ` - ${receiverPhone}`: ''}`}
              </Text>
              <Text h3 gray>
                {receiveAddr ? receiveAddr : ''}
              </Text>
            </Block>
            <Block style={Style.item}>
              {this.renderProductsOrder()}
            </Block>
            <Block style={Style.item} row>
              <Block flex={false} style={{width: '40%'}}>
                <Text h3 gray>{`${strings('Cart.tempPrice')}:`}</Text>
                <Text h3 gray>{`${strings('Cart.subTract')}:`}</Text>
                <Text h3 gray>{`${strings('DetailOrder.usePoint')}:`}</Text>
                <Text h3 gray>
                  {`${strings('Cart.shipPrice')}:`}
                </Text>
              </Block>
              <Block style={{width: '60%'}}>
                <Text h3 right><TextCurrency h3 value={order.tempPrice ? order.tempPrice : 0}/> đ</Text>
                <Text h3 right><TextCurrency h3 value={order.subTract ? order.subTract : 0}/> đ</Text>
                <Text h3 right>{`${order.pointToPay ? order.pointToPay : 0} ${strings('Cart.msgNowPointsRight')}`}</Text>
                <Text h3 right><TextCurrency h3 value={order.shipmentPrice ? order.shipmentPrice : 0}/> đ</Text>
              </Block>
            </Block>
            <Block style={[Style.item, {borderBottomWidth: 0}]} row>
              <Block flex={false} style={{width: '40%'}}>
                <Text h3 gray>{`${strings('Cart.sum')}:`}</Text>
              </Block>
              <Block flex={false} style={{width: '60%'}}>
                <Text h3 pink2 right><TextCurrency h3 pink2 value={order.finishPrice ? order.finishPrice : 0}/> đ</Text>
              </Block>
            </Block>
            {order.orderStatusId && (order.orderStatusId === 'ORDER_CREATED' || order.orderStatusId === 'ORDER_APPROVED' || order.orderStatusId === 'ORDER_CONFIRM' || order.orderStatusId === 'ORDER_PROCESSING') ? (
              <Block>
                <Button
                  pink2
                  onPress={() => navigation.navigate(Screens.CANCEL_ORDER, { orderId: order.id, 'onRefresh': this.onRefresh})}
                >
                  <Text bold white center style={{ padding: 10 }}>
                    {strings('DetailOrder.cancelOrder')}
                  </Text>
                </Button>
              </Block>
            ) : null}
            {order.orderStatusId && order.orderStatusId === 'ORDER_SENT' ? (
              <Block>
                <Button
                  green
                  onPress={() => this.handleConfirm(order.id)}
                >
                  <Text bold white center style={{ padding: 10 }}>
                    {strings('DetailOrder.confirmOrder')}
                  </Text>
                </Button>
              </Block>
            ) : null}
             {order.orderStatusId && order.orderStatusId === 'ORDER_COMPLETED' ? (
              <Block>
                  <Button
                    error
                    onPress={() => navigation.navigate(Screens.REASON_RETURN_ORDER, { orderId: order.id, 'onRefresh': this.onRefresh})}
                  >
                    <Text bold white center style={{ padding: 10 }}>
                      {strings('DetailOrder.returnOrder')}
                    </Text>
                  </Button>
              </Block>
            ) : null}
          </Block>
        </ScrollView>
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

DetailOrderScreen.defaultProps = {};

DetailOrderScreen.propTypes = {
  userActions: PropTypes.object,
  errorCode: PropTypes.string,
  language: PropTypes.string,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  language: state.user.language,
})

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DetailOrderScreen);
