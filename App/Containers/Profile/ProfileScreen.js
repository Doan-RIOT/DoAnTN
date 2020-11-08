import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Toast, { DURATION } from 'react-native-easy-toast';
import { Image, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Button, Block,Text, BaseModal,
  Card, Header, Loading, CheckBox, Cart,
} from "../../Components";
import UserActions from '../../Stores/User/Actions';
import { strings } from '../../Locate/I18n';
import Style from './ProfileScreenStyle';
import { Images, Colors } from '../../Theme';
import { getToken, resetUser } from '../../Utils/storage.helper';
import { Config } from '../../Config/index';
import { Screens } from '../../Utils/screens';
import { Constants } from '../../Utils/constants';
import { ScrollView } from "react-native-gesture-handler";

class ProfileScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errorCode: '',
      profile: {},
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const { errorCode } = nextProps;
    let data = { errorCode };
    return data;
  }

  componentDidMount = () => {
    this.didFocusListener = this.props.navigation.addListener(
      'didFocus',
      () => {
        const { profile } = this.props;
        if (profile) {
          this.setState({
            profile,
          })
        }
      }
    );
  };

  componentWillUnmount = () => {
    this.didFocusListener.remove();
  };

  renderInfo = () => {
    const { profile } = this.state;
    const { navigation, userId } = this.props;
    const imageUrl = `${Config.IMAGE_URL}?uploadId=${profile.avatar ? profile.avatar : ''}&seq=1`;
    return (
      <TouchableOpacity
        onPress={() => this.handleNavigateUserInfo()}
        disabled={!userId || userId && userId === ''}
      >
        <Block flex={false} center row style={Style.container}>
          <Image 
            source={profile.avatar ? { uri:  imageUrl} : Images.avatar}  
            style={Style.avatar} 
          />
          <Block style={{marginLeft: 10}}>
            {userId && userId !== '' ? (
              <Block flex={false}>
                {profile && (profile.lastName || profile.email || profile.phone) ? (
                  <>
                    <Text h3>
                      {`${profile && profile.lastName ? profile.lastName : ''} ${profile && profile.firstName ? profile.firstName : ''}`}
                    </Text>
                    {profile && profile.email ? (
                      <Text h3>{profile.email}</Text>
                    ): null}
                    {profile && profile.phone ?(
                      <Text h3>{profile.phone}</Text>
                    ): null}
                  </>
                ): (
                  <Text>{strings('Profile.msgUpdateProfile')}</Text>
                )}
              </Block>
            ) : (
              <Block row center>
                <TouchableOpacity onPress={() => navigation.navigate(Screens.LOGIN)}>
                  <Text green h3>{strings('Login.login')}</Text>
                </TouchableOpacity>
                <Text h3 green>/</Text>
                <TouchableOpacity onPress={() => navigation.navigate(Screens.SIGNUP)}>
                  <Text green h3>{strings('Login.signUp')}</Text>
                </TouchableOpacity>
              </Block>
            )}
          </Block>
        </Block>
      </TouchableOpacity>
    );
  };
  
  renderContent = () => {
    const { navigation } = this.props;
    return (
      <>
        <TouchableOpacity onPress={() => navigation.navigate(Screens.PROMOTION)}>
          <Block flex={false} center row style={Style.container}>
            <Text h3 bold >{strings('Profile.yourPromotion')}</Text>
          </Block>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate(Screens.ADDRESS)}>
          <Block flex={false} center row style={Style.container}>
            <Text h3 bold >{strings('Profile.listAddress')}</Text>
          </Block>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate(Screens.LIST_ORDER)}>
          <Block flex={false} center row style={Style.container}>
            <Text h3 bold >{strings('Profile.listOrder')}</Text>
          </Block>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => navigation.navigate(Screens.LIST_ORDER)}>
          <Block flex={false} center row style={Style.container}>
            <Text h3 bold >{strings('Profile.notification')}</Text>
          </Block>
        </TouchableOpacity> */}
      </>
    )
  };

  handleNavigateUserInfo = () => {
    const { navigation } = this.props;
    const { profile } = this.state;
    const data  = JSON.parse(JSON.stringify(profile));
    navigation.navigate(Screens.USER_INFO, data)
  };

  render() {
    const { userActions, navigation, loading } = this.props;
    const { errorCode, profile } = this.state;
    if (errorCode === '401') {
      resetUser();
      userActions.resetUser();
      navigation.navigate(Screens.LOGIN);
    }

    return (
      <Block style={Style.view}>
        <Header
          title={strings('Profile.headerTitle')}
          rightIcon={<Cart navigation={navigation} />}
        />
        {this.renderInfo()}
        <ScrollView>
          {Object.entries(profile).length !== 0 ? (
          this.renderContent()
          ) : null}
        </ScrollView>
        {/* <Block flex={false} row style={Style.associate}>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://www.facebook.com/')}
            style={Style.iconAssociate}
          >
            <Icon name="facebook-square" size={40} color="#4267B2" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://www.google.com/')}
            style={Style.iconAssociate}
          >
            <Icon name="google" size={40} color="#DB4437" />
          </TouchableOpacity>
        </Block> */}
      </Block>
    );
  }
}

ProfileScreen.defaultProps = {};

ProfileScreen.propTypes = {
  errorCode: PropTypes.string,
  userId: PropTypes.string,
  profile: PropTypes.object,
  userActions: PropTypes.object,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  userId: state.user.userId,
  profile: state.user.profile,
  loading: state.user.loading,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileScreen);

