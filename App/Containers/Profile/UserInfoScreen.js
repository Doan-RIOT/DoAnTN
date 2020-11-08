import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes, { string } from 'prop-types';
import Toast, { DURATION } from 'react-native-easy-toast';
import { Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import RNRestart from 'react-native-restart';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { PERMISSIONS, requestMultiple, checkMultiple } from 'react-native-permissions';
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import {
  Button, Block,Text, BaseModal,
  Card, Header, Loading, CheckBox, TextCurrency, Input, Radio
} from "../../Components";
import UserActions from '../../Stores/User/Actions';
import CartActions from '../../Stores/Cart/Actions';
import { userService } from '../../Services/UserService';
import { strings } from '../../Locate/I18n';
import Style from './UserInfoScreenStyle';
import { Images, Colors } from '../../Theme';
import { resetUser, getCart } from '../../Utils/storage.helper';
import { Config } from '../../Config/index';
import { Screens } from '../../Utils/screens';
import { Constants } from '../../Utils/constants';
import { LoginManager } from 'react-native-fbsdk';

class UserInfoScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      isOpen: false,
      profile: null,
      errorCode: '',
      isVisible: false,
      errors: [],
      msgError: '',
    }
  }
  static getDerivedStateFromProps(nextProps, prevState){
    const { errorCode, navigation } = nextProps;
    let data = { errorCode, profile : navigation.state.params };
    return data;
  }

  componentDidMount = () => {
    this.requestPermission();
  };

  requestPermission = async() => {
    await requestMultiple(
      Platform.select({
        android: [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE],
        ios: [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY],
      }),
    );
  };

  checkPermission = async () => {
    let permissions = false;
    const status = await checkMultiple(
      Platform.select({
        android: [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE],
        ios: [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY],
      }),
    );
    if (Platform.OS === 'ios') {
      if (status['ios.permission.CAMERA'] === 'granted' && status['ios.permission.PHOTO_LIBRARY'] === 'granted') {
        permissions = true;
      }
    } else {
      if (status['android.permission.CAMERA'] === 'granted' && status['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
        permissions = true;
      }
    }
    return permissions;
  };

  showDatePicker = () => {
    this.setDatePickerVisibility(true);
  };

  hideDatePicker = () => {
    this.setDatePickerVisibility(false);
  };

  handleConfirm = birthDate => {
    this.hideDatePicker();
    let { profile } = this.state;
    profile.birthDate = moment(birthDate).format('DD/MM/YYYY');
    this.setState({
      profile,
    })
  };

  setDatePickerVisibility = isVisible => {
    this.setState({
      isVisible,
    })
  };

  selectImage = async () => {
    await this.requestPermission();
    const permissions = await this.checkPermission();
    if (permissions) {
      this.setState({
        isOpen: true,
      });
    }
  }

  renderBodyModal = () => {
    return (
      <Block row style={{ justifyContent: 'center' }}>
        <TouchableOpacity
          style={{marginVertical: 10}}
          onPress={() => this.openCamera()}
        >
          <Icon name="camera" size={40} color={Colors.green} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginVertical: 10, marginLeft: 10}}
          onPress={() => this.openPicker()}
        >
          <Icon name="folder-open" size={42} color={Colors.green} />
        </TouchableOpacity>
      </Block>
    );
  };

  renderFooterModal = () => {
    return (
      <Block flex={false} bottom style={{ alignItems: 'flex-end'}}>
        <Button
          pink2
          onPress={() => this.handleCloseModal()}
          style={{ width: '30%' }}
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
    })
  };

  openCamera = async () => {
    ImagePicker.openCamera({
      forceJpg: true,
      mediaType: 'photo',
    }).then(image => {
      this.handleCloseModal();
      if (image.path && image.mime) {
        const name = image.path.replace(/^.*[\\\/]/, '');
        let data = new FormData();
        data.append('files',{
          uri: image.path,
          name: name,
          type: image.mime
        });

        userService.uploadImage(data).then(response => {
          if (response.success) {
            let { profile } = this.state;
            const { data } = response;
            if (data.length > 0) {
              profile.avatar = data[0].uploadId;
              this.setState({
                profile,
              });
            }
          } else {
            this.refs.toastFailed.show(strings('UserInfo.msgUpdateAvatarFailed'), DURATION.LENGTH_LONG);
          }
        }).catch(error => this.refs.toastFailed.show(strings('UserInfo.msgUpdateAvatarFailed'), DURATION.LENGTH_LONG));
      }
    });
  };

  openPicker = async () => {
    ImagePicker.openPicker({
      forceJpg: true,
      mediaType: 'photo',
    }).then(image => {
      this.handleCloseModal();
      if (image.path && image.mime) {
        const name = image.path.replace(/^.*[\\\/]/, '');
        let data = new FormData();
        data.append('files',{
          uri: image.path,
          name: name,
          type: image.mime
        });

        userService.uploadImage(data).then(response => {
          if (response.success) {
            let { profile } = this.state;
            const { data } = response;
            if (data.length > 0) {
              profile.avatar = data[0].uploadId;
              this.setState({
                profile,
              });
            }
          } else {
            this.refs.toastFailed.show(strings('UserInfo.msgUpdateAvatarFailed'), DURATION.LENGTH_LONG);
          }
        }).catch(error => this.refs.toastFailed.show(strings('UserInfo.msgUpdateAvatarFailed'), DURATION.LENGTH_LONG));
      }
    });
  };

  defineDateTimePicker = birthDate => {
    const split = birthDate.split('/');
    return new Date(split[2], split[1] - 1, split[0]);
  };

  handleChange = (value, key) => {
    let { profile } = this.state;
    profile[key] = value;
    this.setState({
      profile,
    })
  }

  handleSave = () => {
    let { profile } = this.state;
    const { language, userActions, navigation } = this.props;
    let errors = [];
    let msgError = '';

    if (profile.lastName === '' || profile.lastName === null) {
      errors.push('lastName');
      msgError = strings('UserInfo.msgErrorRequiredName');
    } else if (profile.firstName === '' || profile.firstName === null) {
      errors.push('firstName');
      msgError = strings('UserInfo.msgErrorRequiredName');
    } else if (profile.phone === '' || profile.phone === null) {
      errors.push('phone');
      msgError = strings('UserInfo.msgErrorRequiredPhone');
    }

    this.setState({
      msgError,
      errors
    })

    if (errors.length === 0) {
      try {
        userService.updateProfile(profile, language).then(response => {
          if (response.success) {
            const { customerId } = response.data;
            this.refs.toastSuccess.show(strings('UserInfo.msgUpdateProfileSuccess'), DURATION.LENGTH_LONG);
            userActions.fetchProfile(customerId);
            navigation.navigate(Screens.PROFILE);
          } else {
            this.refs.toastFailed.show(strings('UserInfo.msgUpdateProfileFailed'), DURATION.LENGTH_LONG);
          }
        });
      } catch (error) {
        this.refs.toastFailed.show(strings('UserInfo.msgUpdateProfileFailed'), DURATION.LENGTH_LONG);
      }
    }
  }

  handleGetcart = async () => {
    const { cartActions } = this.props;
    const dataCart = await getCart('');
    if (dataCart !== null) {
      const dataCartParse = JSON.parse(dataCart);
      const { cart, total } =  dataCartParse;
      cartActions.setDataToCart(cart, total, '');
    } else {
      cartActions.setDataToCart({}, 0, '');
    }
  };

  handleLogout = () => {
    const { userActions } = this.props;
    userService.logOut().then(response => {
      if (response.success) {
        resetUser();
        userActions.resetUser();
        this.handleGetcart();
        LoginManager.logOut()
        RNRestart.Restart();
      }
    });
  };

  render() {
    const { navigation, userActions } = this.props;
    const {
      isVisible, profile, isOpen,
      errorCode, errors, msgError
    } = this.state;
    const dateTimePicker = profile && profile.birthDate ? this.defineDateTimePicker(profile.birthDate) : new Date();
    const hasErrors = (key) => (errors.includes(key) ? Style.hasErrors : null)
    const imageUrl = `${Config.IMAGE_URL}?uploadId=${profile.avatar ? profile.avatar : ''}&seq=1`;

    if ( errorCode === '401') {
      resetUser();
      userActions.resetUser();
      navigation.navigate(Screens.LOGIN);
    }
    return (
      <Block style={Style.view}>
        <Header 
          title={strings('Profile.headerTitle')}
          isShowBack
          navigation={navigation}
        />
        <ScrollView>
          <TouchableOpacity onPress={() => this.selectImage()}>
            <Image 
              source={profile.avatar ? { uri:  imageUrl} : Images.avatar}  
              style={Style.avatar} 
            />
            <Text style={Style.labelChange}>
              {strings('UserInfo.changeImage')}
            </Text>
          </TouchableOpacity>
          <Block flex={false} style={Style.container}>
            <Text error>{msgError}</Text>
            <Input
              label={strings('UserInfo.lastName')}
              error={hasErrors('lastName')}
              style={[Style.input, hasErrors('lastName')]}
              value={profile && profile.lastName ? profile.lastName : ''}
              onChangeText={text => this.handleChange(text, 'lastName')}
            />
            <Input
              label={strings('UserInfo.firstName')}
              error={hasErrors('firstName')}
              style={[Style.input, hasErrors('firstName')]}
              value={profile && profile.firstName ? profile.firstName : ''}
              onChangeText={text => this.handleChange(text, 'firstName')}
            />
            <Input
              label={strings('UserInfo.email')}
              error={hasErrors('email')}
              style={Style.input}
              value={profile && profile.email ? profile.email : ''}
              onChangeText={text => this.handleChange(text, 'email')}
            />
            <Input
              label={strings('UserInfo.phone')}
              error={hasErrors('phone')}
              style={[Style.input, hasErrors('phone')]}
              value={profile && profile.phone ? profile.phone : ''}
              number
              onChangeText={text => this.handleChange(text, 'phone')}
            />
            <TouchableOpacity onPress={() => this.showDatePicker()}>
              <Input
                label={`${strings('UserInfo.birthDate')}`}
                value={profile && profile.birthDate ? profile.birthDate : ''} 
                style={Style.input}
                onChangeText={text => this.handleChange(text, 'birthDate')}
                rightLabel={
                    <Icon
                      name="calendar"
                      style={Style.iconDateTime}
                      size={30}
                      onPress={() => this.showDatePicker()}
                    />
                }
                editable={false}
              />
            </TouchableOpacity>
            <Block row>
              <Block flex={false} style={{width: '30%'}}>
                <Radio
                  label={strings('UserInfo.male')}
                  value="0"
                  color={Colors.pink2}
                  styleTitle={Style.radio}
                  uncheckedColor={Colors.green}
                  checked={profile && profile.gender && profile.gender === '0'}
                  onPress={value => this.handleChange(value, 'gender')}
                />
              </Block>
              <Block flex={false}>
                <Radio
                  label={strings('UserInfo.female')}
                  value="1"
                  color={Colors.pink2}
                  styleTitle={Style.radio}
                  uncheckedColor={Colors.green}
                  checked={profile && profile.gender && profile.gender === '1'}
                  onPress={value => this.handleChange(value, 'gender')}
                />
              </Block>
            </Block>
            <Block flex={false} center style={{paddingTop: 20}}>
              <Button
                green
                onPress={() => this.handleSave()}
                style={Style.button}
              >
                <Text bold white center style={{ padding: 10 }}>
                  {strings('UserInfo.save')}
                </Text>
              </Button>
              <Button
                primary
                onPress={() => {navigation.navigate(Screens.CHANGE_PASSWORD_USER, {customerId: profile.customerId})}}
                style={Style.button}
              >
                <Text bold white center style={{ padding: 10 }}>
                  {strings('UserInfo.changePassword')}
                </Text>
              </Button>
              <Button
                error
                onPress={() => this.handleLogout()}
                style={Style.button}
              >
                <Text bold white center style={{ padding: 10 }}>
                  {strings('UserInfo.logout')}
                </Text>
              </Button>
            </Block>
          </Block>
        </ScrollView>
        {isVisible && (
          <DateTimePickerModal
            isVisible={isVisible}
            mode="date"
            onConfirm={this.handleConfirm}
            onCancel={this.hideDatePicker}
            date={dateTimePicker}
          />
        )}
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
          title={strings('UserInfo.chooseAvatar')}
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

UserInfoScreen.defaultProps = {};

UserInfoScreen.propTypes = {
  userActions: PropTypes.object,
  profile: PropTypes.object,
  errorCode: PropTypes.string,
  language: PropTypes.string,
  cartActions: PropTypes.object,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  language: state.user.language,
})

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  cartActions: bindActionCreators(CartActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserInfoScreen);

