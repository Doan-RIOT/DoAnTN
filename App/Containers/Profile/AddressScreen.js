import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes, { string } from 'prop-types';
import Toast, { DURATION } from 'react-native-easy-toast';
import { TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Button, Block, Text, Header, BaseModal, Radio
} from "../../Components";
import UserActions from '../../Stores/User/Actions';
import { userService } from '../../Services/UserService';
import { strings } from '../../Locate/I18n';
import Style from './AddressScreenStyle';
import { Images, Colors } from '../../Theme';
import { resetUser } from '../../Utils/storage.helper';
import { Config } from '../../Config/index';
import { Screens } from '../../Utils/screens';
import { Constants } from '../../Utils/constants';

class AddressScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      address: [],
      isOpen: false,
      dataDelete: {},
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const { errorCode, address } = nextProps;
    let data = { errorCode, address };
    return data;
  }

  componentDidMount = () => {
    const { userActions, userId } = this.props;
    userActions.fetchLocation();
  };

  onRefresh = () => {
    const { userActions, userId } = this.props;
    userActions.fetchAddress(userId);
  };

  handleSetDefaultAddress = data => {
    const { userId, language, userActions } = this.props;
    data.customerId = userId;
    data.isDefault = 1;
    try {
      userService.updateAddress([data], language).then(response => {
        if (response.success) {
          this.refs.toastSuccess.show(strings('AddEditAddress.msgUpdateAddressSuccess'), DURATION.LENGTH_LONG);
          userActions.fetchAddress(userId);
        } else {
          this.refs.toastFailed.show(strings('AddEditAddress.msgUpdateAddressFailed'), DURATION.LENGTH_LONG);
        }
      });
    } catch (error) {
      this.refs.toastFailed.show(strings('AddEditAddress.msgUpdateAddressFailed'), DURATION.LENGTH_LONG);
    }
  }

  showConfirm = item => {
    const { userId } = this.props;
    const dataDelete = {
      customerId: userId,
      seq: item.seq
    };
    this.setState({
      dataDelete,
      isOpen: true,
    });
  }

  renderItem = (item, index) => {
    const { navigation } = this.props;
    return (
      <TouchableOpacity onPress={() => navigation.navigate(Screens.ADD_EDIT_ADDRESS, { isAdd: false, address: item })}>
        <Block style={Style.container} center row>
          <Block flex={false} style={{width: '90%'}}>
            <Text h3>
              <Text h3 gray>{strings('Address.name')}:</Text> {item.nameReceive ? item.nameReceive : ''}
            </Text>
            <Text h3>
              <Text h3 gray>{strings('UserInfo.phone')}:</Text> {item.phoneNumber ? item.phoneNumber : ''}
            </Text>
            <Text h3><Text h3 gray>{strings('Address.address')}:</Text> {`${item.city ? `${item.city}, ` : ''}${item.districts ? `${item.districts}, ` : ''}${item.wards ? `${item.wards}, ` : ''}${item.addressReceive ? item.addressReceive : ''}`}</Text>
            <Block row center space="between">
              {item.isDefault && item.isDefault === 1 ? (
                <Text h3 green>{strings('Address.addressDefault')}</Text>
              ) : (
                <TouchableOpacity
                  onPress={() => this.handleSetDefaultAddress(item)}
                  style={{paddingVertical: 5}}
                >
                  <Text h3 pink2 style={{textDecorationLine: 'underline'}}>{strings('Address.setAddressDefault')}</Text>
                </TouchableOpacity>
              )}
            </Block>
          </Block>
          <Block flex={false}>
            <Radio
              value={index}
              color={Colors.pink2}
              uncheckedColor={Colors.green}
              checked={item.isDefault && item.isDefault === 1 ? true : false}
              onPress={() => this.handleSetDefaultAddress(item)}
            />
            <TouchableOpacity
                onPress={() => this.showConfirm(item)}
                style={{padding: 10}}
              >
                <Icon name="trash" color={Colors.pink2} size={20} />
              </TouchableOpacity>
          </Block>
        </Block>
      </TouchableOpacity>
    )
  };

  renderBodyModal = () => {
    return (
      <Block>
        <Text center h2 error>{strings('Address.msgConfirmDelete')}</Text>
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
    const { language, userActions, userId } = this.props;
    const { dataDelete } = this.state
    try {
      userService.deleteAddress([dataDelete], language).then(response => {
        if (response.success) {
          this.refs.toastSuccess.show(strings('Address.msgDeleteAddressSuccess'), DURATION.LENGTH_LONG);
          userActions.fetchAddress(userId);
        } else {
          this.refs.toastFailed.show(strings('Address.msgDeleteAddressFailed'), DURATION.LENGTH_LONG);
        }
      });
    } catch (error) {
      this.refs.toastFailed.show(strings('Address.msgDeleteAddressFailed'), DURATION.LENGTH_LONG);
    }
    this.handleCloseModal();
  }

  handleCloseModal = () => {
    this.setState({
      isOpen: false,
      dataDelete: {},
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
    const { address, isOpen, refreshing } = this.state;
    return (
      <Block style={Style.view}>
        <Header 
          title={strings('Address.headerTitle')}
          isShowBack
          navigation={navigation}
        />
        <FlatList
          vertical
          scrollEnabled
          showsVerticalScrollIndicator={false}
          snapToAlignment="center"
          data={address}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({item, index}) => this.renderItem(item, index)}
          refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={refreshing}
              onRefresh={() => this.onRefresh()}
            />
          }
        />
        <Button
          green
          onPress={() => navigation.navigate(Screens.ADD_EDIT_ADDRESS, { isAdd: true })}
          style={Style.button}
        >
          <Text bold white center style={{ padding: 10 }}>
            {strings('Address.addAddress')}
          </Text>
        </Button>
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

AddressScreen.defaultProps = {};

AddressScreen.propTypes = {
  address: PropTypes.array,
  userActions: PropTypes.object,
  userId: PropTypes.string,
  language: PropTypes.string,
};

const mapStateToProps = (state) => ({
  address: state.user.address,
  userId: state.user.userId,
  language: state.user.language,
})

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddressScreen);

