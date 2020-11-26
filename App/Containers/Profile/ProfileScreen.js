import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import Toast, { DURATION } from "react-native-easy-toast";
import { Image, TouchableOpacity, Linking } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  Button,
  Block,
  Text,
  BaseModal,
  Card,
  Header,
  Loading,
  CheckBox,
  Cart,
} from "../../Components";
import UserActions from "../../Stores/User/Actions";
import { strings } from "../../Locate/I18n";
import Style from "./ProfileScreenStyle";
import { Images, Colors } from "../../Theme";
import {
  getToken,
  getUserName,
  getPassword,
  resetUser,
} from "../../Utils/storage.helper";
import { Config } from "../../Config/index";
import { Screens } from "../../Utils/screens";
import { Constants } from "../../Utils/constants";
import { ScrollView } from "react-native-gesture-handler";
import { ImageBackground } from "react-native";
import { userService } from "../../Services/UserService";

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorCode: "",
      profile: {},
      profileTest: {},
      token: "",
      isSigningIn: false,
    };
  }
  componentDidMount = async () => {
    const token = await getToken();
    this.setState({
      token
    })
  };
  UNSAFE_componentWillReceiveProps (nextProps) {
    const {profile}=this.props
    if(nextProps.profile!==profile){
      this.setState({
        profile:nextProps.profile,
        isSigningIn:true
      })
    }else{
      this.setState({
        profile: profile,
        isSigningIn:true
      })
    }
  }
  renderInfo = () => {
    const { profile } = this.state;
    const { navigation, userId } = this.props;
    const { token } = this.state;
    console.log('token',token)
    const imageUrl = `${Config.IMAGE_URL}?uploadId=${
      profile.avatar ? profile.avatar : ""
    }&seq=1`;
    return (
      <ImageBackground
        source={Images.farmImage}
        style={{ flex: 1 }}
        imageStyle={{ resizeMode: "stretch" }}
      >
        <TouchableOpacity
          style={{ alignItems: "center" }}
          onPress={() => this.handleNavigateUserInfo()}
          disabled={!token || (token && token === "")}
        >
          <Block flex={false} center style={Style.container}>
            <Block flex={false} style={{ marginLeft: 10 }}>
              {this.state.isSigningIn === true ? (
                <Block flex={false}>
                  {profile ? (
                    <>
                      <Block
                        row
                        middle
                        flex={false}
                        style={{ paddingVertical: 10, marginTop: 30 }}
                      >
                        <Text
                          center
                          middle
                          h2
                          color={Colors.green}
                          bold
                          style={{}}
                        >
                          {`${
                            profile && profile.fullName ? profile.fullName : ""
                          }`}
                        </Text>
                      </Block>
                      {profile && profile.local?.email ? (
                        <Block
                          row
                          center
                          flex={false}
                          style={{ paddingVertical: 10 }}
                        >
                          <Icon
                            name="envelope"
                            size={20}
                            color={Colors.green}
                          />
                          <Text h3 style={{ marginLeft: 10 }}>
                            {profile.local.email}
                          </Text>
                        </Block>
                      ) : null}
                      {profile && profile.phone ? (
                        <Block
                          row
                          center
                          flex={false}
                          style={{ paddingVertical: 20 }}
                        >
                          <Icon name="phone" size={25} color={Colors.green} />
                          <Text h3 style={{ marginLeft: 10 }}>
                            {profile.phone}
                          </Text>
                        </Block>
                      ) : null}
                      {profile && profile.address ? (
                        <Block
                          row
                          center
                          flex={false}
                          style={{ paddingVertical: 10 }}
                        >
                          <Icon
                            name="map-marker"
                            size={27}
                            color={Colors.green}
                          />
                          <Text h3 style={{ marginLeft: 10 }}>
                            {profile.address}
                          </Text>
                        </Block>
                      ) : null}
                    </>
                  ) : (
                    <Text>{strings("Profile.msgUpdateProfile")}</Text>
                  )}
                </Block>
              ) : (
                <Block flex={false} style={Style.logInOut} row center>
                  <TouchableOpacity
                    onPress={() => navigation.navigate(Screens.LOGIN)}
                  >
                    <Text green h3>
                      {strings("Login.login")}
                    </Text>
                  </TouchableOpacity>
                  <Text h3 green>
                    /
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate(Screens.SIGNUP)}
                  >
                    <Text green h3>
                      {strings("Login.signUp")}
                    </Text>
                  </TouchableOpacity>
                </Block>
              )}
            </Block>
          </Block>
          <Image
            source={profile.avatar ? { uri: imageUrl } : Images.avatar}
            style={Style.avatar}
          />
        </TouchableOpacity>
      </ImageBackground>
    );
  };

  renderContent = () => {
    const { navigation } = this.props;
    return (
      <>
        <TouchableOpacity
          onPress={() => navigation.navigate(Screens.PROMOTION)}
        >
          <Block flex={false} center row style={Style.container}>
            <Text h3 bold>
              {strings("Profile.yourPromotion")}
            </Text>
          </Block>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate(Screens.ADDRESS)}>
          <Block flex={false} center row style={Style.container}>
            <Text h3 bold>
              {strings("Profile.listAddress")}
            </Text>
          </Block>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate(Screens.LIST_ORDER)}
        >
          <Block flex={false} center row style={Style.container}>
            <Text h3 bold>
              {strings("Profile.listOrder")}
            </Text>
          </Block>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => navigation.navigate(Screens.LIST_ORDER)}>
          <Block flex={false} center row style={Style.container}>
            <Text h3 bold >{strings('Profile.notification')}</Text>
          </Block>
        </TouchableOpacity> */}
      </>
    );
  };

  handleNavigateUserInfo = () => {
    const { navigation } = this.props;
    const { profile } = this.state;
    const data = JSON.parse(JSON.stringify(profile));
    navigation.navigate(Screens.USER_INFO, data);
  };

  render() {
    const { userActions, navigation, loading } = this.props;
    const { errorCode, profile } = this.state;
    if (errorCode === "401") {
      resetUser();
      userActions.resetUser();
      navigation.navigate(Screens.LOGIN);
    }

    return (
      <Block style={Style.view}>
        {/* <Header
          title={strings('Profile.headerTitle')}
        // rightIcon={<Cart navigation={navigation} />}
        /> */}
        {this.renderInfo()}
        {/* <ScrollView>
          {Object.entries(profile).length !== 0 ? (
          this.renderContent()
          ) : null}
        </ScrollView> */}

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
  userActions: bindActionCreators(UserActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
