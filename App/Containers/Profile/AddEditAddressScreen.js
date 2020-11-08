import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes, { string } from 'prop-types';
import Toast, { DURATION } from 'react-native-easy-toast';
import { ScrollView } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Button, Block, Text,
  Header, Input, Picker, CheckBox
} from "../../Components";
import UserActions from '../../Stores/User/Actions';
import { userService } from '../../Services/UserService';
import { strings } from '../../Locate/I18n';
import Style from './AddEditAddressScreenStyle';
import { Colors, Sizes } from '../../Theme';
import { resetUser } from '../../Utils/storage.helper';
import { Config } from '../../Config/index';
import { Screens } from '../../Utils/screens';
import { Constants } from '../../Utils/constants';

class AddEditAddressScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      address: {},
      isAdd: false,
      location: [],
      cities: [],
      selectedCity: '',
      districts: [],
      selectedDistrict: '',
      wards: [],
      selectedWards: '',
      isEditing: false,
      errors: [],
      msgError: '',
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const { errorCode, navigation, location } = nextProps;
    const { isEditing } = prevState;
    const { isAdd, address } = navigation.state.params;
    let data = {
      errorCode,
      isAdd,
      location,
    };

    if (location.length > 0) {
      const cities = location.map(item => { return { id: item.id, value: item.name }});
      data.cities = cities;
      let dataCitySelected = {};
      if (!isEditing) {
        data.address = address ? JSON.parse(JSON.stringify(address)) : {};
        if (isAdd) {
          data.selectedCity = cities[0].value;
          dataCitySelected = location[0];
        } else {
          dataCitySelected = location.filter(item => item.name === address.city)[0];
          data.selectedCity = dataCitySelected.name;
        }
        const { districts } = dataCitySelected;
        const dataDistricts = districts.map(item => { return { id: item.id, value: item.name }});
        data.districts = dataDistricts;
        let dataDistrictSelected = {};
        if (isAdd) {
          data.selectedDistrict = dataDistricts[0].value;
          dataDistrictSelected = districts[0];
        } else {
          dataDistrictSelected = districts.filter(item => item.name === address.districts)[0];
          data.selectedDistrict = dataDistrictSelected.name;
        }

        const { wards } = dataDistrictSelected;
        const dataWards = wards.map(item => { return { id: item.id, value: item.name }});
        data.wards = dataWards;
        if (isAdd) {
          data.selectedWards = dataWards[0].value;
        } else {
          const dataWardsSelected = wards.filter(item => item.name === address.wards)[0];
          data.selectedWards = dataWardsSelected.name;
        }
      }
    }
    
    return data;
  }

  componentDidMount = () => {};

  handleChangeCity = (value, index) => {
    const { location } = this.state;
    const dataSelectedCity = location[index];
    const { districts } = dataSelectedCity;
    const dataDistricts = districts.map(item => { return { id: item.id, value: item.name }});
    const dataDistrictSelected = districts[0];
    const { wards } = dataDistrictSelected;
    const dataWards = wards.map(item => { return { id: item.id, value: item.name }});

    this.setState({
      isEditing: true,
      selectedCity: value,
      districts: dataDistricts,
      selectedDistrict: dataDistricts[0].value,
      wards: dataWards,
      selectedWards: dataWards[0].value,
    });
  };

  handleChangeDistrict = (value, index) => {
    const { location, selectedCity } = this.state;
    const dataSelectedCity = location.filter(item => item.name === selectedCity)[0];
    const { districts } = dataSelectedCity;
    const dataDistrictSelected = districts[index];
    const { wards } = dataDistrictSelected;
    
    const dataWards = wards.map(item => { return { id: item.id, value: item.name }});

    this.setState({
      isEditing: true,
      selectedDistrict: value,
      wards: dataWards,
      selectedWards: dataWards[0].value,
    });
  };

  handleChange = (key, value) => {
    let { address } = this.state;
    address[key] = value;
    this.setState({
      isEditing: true,
      address,
    })
  }

  handleSave = () => {
    let {
      address, isAdd, selectedCity,
      selectedDistrict, selectedWards,
    } = this.state;
    let errors = [];
    let msgError = '';
    const { userId, language, userActions, navigation } = this.props;
    const { nameReceive, phoneNumber, addressReceive } = address;
    if (!nameReceive || nameReceive.trim() === '') {
      errors.push('nameReceive');
      msgError = strings('AddEditAddress.msgErrorRequiredName');
    } else if (!phoneNumber || phoneNumber.trim() === '') {
      errors.push('phoneNumber');
      msgError = strings('AddEditAddress.msgErrorPhone');
    } else if (!addressReceive || addressReceive.trim() === '') {
      errors.push('addressReceive');
      msgError = strings('AddEditAddress.msgErrorAddress');
    }

    this.setState({
      errors,
      msgError,
    })

    if (errors.length === 0) {
      let data = address;
      data.customerId = userId;
      if (isAdd) {
        data.seq = 0;
      }
      data.city = selectedCity;
      data.districts = selectedDistrict;
      data.wards = selectedWards;
      try {
        userService.updateAddress([data], language).then(response => {
          if (response.success) {
            this.refs.toastSuccess.show(
              isAdd ? strings('AddEditAddress.msgAddAddressSuccess') 
                    : strings('AddEditAddress.msgUpdateAddressSuccess'), DURATION.LENGTH_LONG);
            userActions.fetchAddress(userId);
            navigation.goBack();
          } else {
            this.refs.toastFailed.show(
              isAdd ? strings('AddEditAddress.msgAddAddressFailed') 
                    : strings('AddEditAddress.msgUpdateAddressFailed'), DURATION.LENGTH_LONG);
          }
        });
      } catch (error) {
        this.refs.toastFailed.show(
          isAdd ? strings('AddEditAddress.msgAddAddressFailed') 
                : strings('AddEditAddress.msgUpdateAddressFailed'), DURATION.LENGTH_LONG);
      }
    }
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
    const {
      address, isAdd, cities, errors,
      districts, wards, selectedCity,
      selectedDistrict, selectedWards, msgError
    } = this.state;
    const hasErrors = (key) => (errors.includes(key) ? Style.hasErrors : null)

    return (
      <Block style={Style.view}>
        <Header 
          title={isAdd ? strings('AddEditAddress.headerAdd') : strings('Address.address')}
          isShowBack
          navigation={navigation}
        />
        <ScrollView>
          <Block flex={false} style={Style.container}>
            <Text error>{msgError}</Text>
            <Input
              label={strings('Address.name')}
              error={hasErrors('nameReceive')}
              style={[Style.input, hasErrors('nameReceive')]}
              value={address.nameReceive ? address.nameReceive : ''}
              onChangeText={text => this.handleChange('nameReceive', text)}
            />
            <Input
              label={strings('UserInfo.phone')}
              error={hasErrors('phoneNumber')}
              style={[Style.input, hasErrors('phoneNumber')]}
              value={address.phoneNumber ? address.phoneNumber : ''}
              number
              onChangeText={text => this.handleChange('phoneNumber', text)}
            />
            <Picker
              selectedValue={selectedCity}
              label={strings('AddEditAddress.provinceCity')} 
              onChange={(value, index) => this.handleChangeCity(value, index)}
              data={cities}
              fontSize={Sizes.h3}
              labelFontSize={Sizes.font}
              baseColor={Colors.green}
              pickerStyle={Style.pickerStyle}
            />
            <Picker
              selectedValue={selectedDistrict}
              label={strings('AddEditAddress.district')}
              onChange={(value, index) => this.handleChangeDistrict(value, index)}
              data={districts}
              fontSize={Sizes.h3}
              labelFontSize={Sizes.font}
              baseColor={Colors.green}
              pickerStyle={Style.pickerStyle}
            />
            <Picker
              selectedValue={selectedWards}
              label={strings('AddEditAddress.ward')} 
              onChange={value => this.setState({selectedWards: value})}
              data={wards}
              fontSize={Sizes.h3}
              labelFontSize={Sizes.font}
              baseColor={Colors.green}
              pickerStyle={Style.pickerStyle}
            />
            <Input
              label={strings('AddEditAddress.address')}
              value={address.addressReceive ? address.addressReceive : ''}
              error={hasErrors('addressReceive')}
              style={[Style.input, hasErrors('addressReceive'), { height: 100 }]}
              multiline
              onChangeText={text => this.handleChange('addressReceive', text)}
              placeholder={strings('AddEditAddress.placeholderAddress')}
            />
            <CheckBox
              label={strings('Address.setAddressDefault')}
              checked={address.isDefault && address.isDefault === 1 ? true : false}
              color={Colors.pink2}
              styleTitle={Style.checkbox}
              uncheckedColor={Colors.green}
              onPress={checked => this.handleChange('isDefault', checked ? 1 : 0)}
            />
          </Block>
          <Button
            green
            onPress={() => this.handleSave()}
            style={Style.button}
          >
            <Text bold white center style={{ padding: 10 }}>
              {isAdd ? strings('Address.addAddress') : strings('AddEditAddress.save')}
            </Text>
          </Button>
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
      </Block>
    );
  }
}

AddEditAddressScreen.defaultProps = {};

AddEditAddressScreen.propTypes = {
  userActions: PropTypes.object,
  location: PropTypes.array,
  userActions: PropTypes.object,
  userId: PropTypes.string,
  language: PropTypes.string,
};

const mapStateToProps = (state) => ({
  location: state.user.location,
  userId: state.user.userId,
  language: state.user.language,
})

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddEditAddressScreen);
