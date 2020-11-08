import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Toast, { DURATION } from 'react-native-easy-toast';
import {
  Image, TouchableOpacity, FlatList,
  Dimensions, ScrollView, Platform,
  TouchableWithoutFeedback, RefreshControl,
  Linking
} from 'react-native';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import Carousel from 'react-native-snap-carousel';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import {
  Button, Block,Text, BaseModal, Cart,
  Card, Header, Input, Picker, Loading
} from "../../Components";
import UserActions from '../../Stores/User/Actions';
import BranchActions from '../../Stores/Branch/Actions';
import CardsActions from '../../Stores/Card/Actions';
import CartActions from '../../Stores/Cart/Actions';
import {
  getToken, getLanguage,
  resetUser, getUserId,
  getCart, removeStorageItem,
} from '../../Utils/storage.helper';
import { chunk } from '../../Utils/commonFunction';
import Icon from 'react-native-vector-icons/FontAwesome';
import { strings } from '../../Locate/I18n';
import Style from './HomeScreenStyle';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import { Config } from '../../Config/index';
import { Screens } from '../../Utils/screens';
import { Constants } from '../../Utils/constants';
import { userService } from '../../Services/UserService';
import { cartService } from '../../Services/CartService';
import { mergeCart } from '../../Utils/commonFunction';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import * as Animatable from "react-native-animatable";
const { width } = Dimensions.get('window');
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const widthCarousel = width - (ApplicationStyles.marginHorizontal.marginHorizontal * 2);

class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      brand: [],
      categories: [],
      carousel: [{ url: Images.promotion1}, { url: Images.promotion2}],
      categoriesFilter: [],
      refreshing: false,
      selectedCity: '',
      location: [],
      cities: [],
      isShowSort: false,
      yButtonSort: 350,
      scan: false,
      isOpen: false,
      infoAccount: {},
      titleAccount: '',
      isFlashOn: false
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const { errorCode, brand, categories, location } = nextProps;
    const data = { errorCode, brand, categories, location};
    if (location.length > 0) {
      const locations = [];
      locations.push({label : 'Tất cả', value : ''});
      const cities = locations.concat(location.map(item => { return { label: item.name, value: item.id}}));
      data.cities = cities;
    }
    return data;
  }

  componentDidMount = async() => {
    const {
      userActions, branchActions,
      cardsActions
    } = this.props;
    userActions.fetchLocation();
    const token = await getToken();
    const language = await getLanguage();
    const userId = await getUserId();
    const userInfo = {
      token: token ? token : '',
      language: language ? language : Constants.VI,
      userId: userId ? userId : '',
    };
    this.handleGetDataCart(userInfo.userId);
    userActions.setInfoUser(userInfo);
    if (userId && userId !== '' && token && token !== '') {
      userActions.fetchProfile(userId);
      cardsActions.fetchCards(userId);
      userActions.fetchAddress(userId);
      userActions.fetchHistoriesOrder(userId);
      userActions.fetchPromotion(userId);
      userActions.fetchFavorites(userId);
    }
    branchActions.fetchBrand(null, null);
    branchActions.fetchCategories();
    this.requestUserPermission(userId);
  };

  onRefresh = () => {
    const { branchActions } = this.props;
    branchActions.fetchBrand(null, null);
  };

  requestUserPermission = async userId => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      messaging().onMessage(async remoteMessage => {
        this.pushNotification(remoteMessage);
      });
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        this.pushNotification(remoteMessage);
      });
      messaging().getToken().then(token => {
        if (userId && userId !== '') {
          this.saveTokenToDatabase(userId, token);
        }
      });
      messaging().onTokenRefresh(token => {
        if (userId && userId !== '') {
          this.saveTokenToDatabase(userId, token);
        }
      });
    }
  };

  saveTokenToDatabase = (userId, token) => {
    const data = {
      customerId: userId,
      token,
    };
    try {
      userService.saveToken(data);
    } catch (error) {}
  };

  pushNotification = remoteMessage => {
    if (Platform.OS == 'ios') {
      PushNotificationIOS.presentLocalNotification({
        alertTitle: remoteMessage.notification.title,
        alertBody: remoteMessage.notification.body,
        applicationIconBadgeNumber: 1,
      });
    } else {
      PushNotification.localNotification({
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
        soundName: 'default',
      });
    }
  };

  handleGetDataCart = async customerId => {
    const { cartActions } = this.props;
    const dataCart = await getCart(customerId);
    const dataCartAnonymous = await getCart('');
    cartService.fetchCart(customerId, Constants.VI).then(response => {
      if (response.success) {
        const data = response.data ? response.data : {};
        let temp = {};
        if (dataCart !== null) {
          const dataCartParse = JSON.parse(dataCart);
          temp = mergeCart(data, dataCartParse.cart);
        }
        if (dataCartAnonymous !== null) {
          const dataCartAnonymousParse = JSON.parse(dataCartAnonymous);
          temp = mergeCart(temp, dataCartAnonymousParse.cart);
          removeStorageItem(`${Constants.CART}_`);
        }
        const total = temp.totalProduct ? temp.totalProduct : 0;
        temp.customerId = customerId;
        cartActions.setDataToCart(temp, total, customerId);
      } else {
        if (dataCart !== null) {
          const dataCartParse = JSON.parse(dataCart);
          const { cart, total } =  dataCartParse;
          cartActions.setDataToCart(cart, total, customerId);
        } else {
          cartActions.setDataToCart({}, 0, customerId);
        }
      }
    });
  };

  handleSelectFilter = categoryId => {
    let { categoriesFilter, selectedCity } = this.state;
    const { branchActions } = this.props;
    if (categoriesFilter.includes(categoryId)) {
      categoriesFilter = categoriesFilter.filter(item => item !== categoryId);
    } else {
      categoriesFilter.push(categoryId);
    }
    let city = null;
    if(selectedCity !== ""){
        city = selectedCity;
    }
    branchActions.fetchBrand(categoriesFilter, city);
    this.setState({
      categoriesFilter,
    });
  };

  handleCancelFilter = (isCancel, isClose) => {
    if (isCancel) {
      const {selectedCity} = this.state;
      const { branchActions } = this.props;
      this.setState({
        categoriesFilter: [],
      });
      let city = null;
      if(selectedCity !== ""){
          city = selectedCity;
      }
      branchActions.fetchBrand(null, city);
    }
    if (isClose) this.drawer.closeDrawer();
  };

  handleChangeCity = (value, index) => {
    const { categoriesFilter, cities } = this.state;
    const city = cities.findIndex(item => item.value === value);
    let item = cities[city];
    let categories = null;
    if(categoriesFilter.length > 0){
      categories = categoriesFilter;
    }
    const { branchActions } = this.props;
    let checkCity = null;
    if (item.value != '') {
      checkCity = item.label;
    } 
    branchActions.fetchBrand(categories, checkCity);
    this.setState({
      selectedCity: checkCity,
    });
  };
  

  
  renderDrawer = () => {
    const { categories, categoriesFilter, brand } = this.state;
    let htmlCategories = [];
    if (categories.length > 0) {
      const tempCategories = chunk(categories, 2);
      tempCategories.forEach((rowItem, index) => {
        let htmlRowCategories = []
        rowItem.forEach(item => {
          htmlRowCategories.push(
            <Block flex={false} middle key={item.categoryId} style={{width: '49%'}}>
              <TouchableOpacity
                style={[Style.categories, categoriesFilter.includes(item.categoryId) ? Style.categoriesSelect : null]}
                onPress={() => this.handleSelectFilter(item.categoryId)
              }>
                <Text center>{item.categoryName ? item.categoryName : ''}</Text>
              </TouchableOpacity>
            </Block>
          )
        });
        htmlCategories.push(
          <Block key={index} row space="between" style={{marginTop: 10}}>
            {htmlRowCategories}
          </Block>
          );
      })
    }

    return (
      <Block>
        <ScrollView>
          <Block row flex={false} style={{backgroundColor: Colors.green, height: 70, paddingVertical: 25}}>
            <Block flex={false} style={{width: '25%'}} />
            <Block flex={false} center bottom style={{width: '50%'}}>
              <Text h3 white>{strings('Home.filterTitle')}</Text>
            </Block>
            <Block flex={false} bottom style={{width: '25%'}}>
              <TouchableOpacity onPress={() => this.handleCancelFilter(true, false)}>
                <Text white>{strings('Home.cancelFilter')}</Text>
              </TouchableOpacity>
            </Block>
          </Block>
          <Block style={{paddingHorizontal: 10, marginTop: 10}}>
            <Text h3 bold>{strings('Home.listCategories')}</Text>
            {htmlCategories}
          </Block>
        </ScrollView>
        <Block bottom style={{paddingHorizontal: 10, marginTop: 10}}>
          <Button
            green
            style={{paddingHorizontal: 10}}
            onPress={() => this.handleCancelFilter(categoriesFilter.length === 0, true)}
          >
            <Text center white>{categoriesFilter.length === 0 ? strings('Home.closeFilter') : `${strings('Home.viewMore')} ${brand.length} ${strings('Home.brand')}`}</Text>
          </Button>
        </Block>
      </Block>
    );
  };

  renderCenterHeader = () => {
    const { navigation } = this.props;
    return (
      <TouchableWithoutFeedback
        onPress={()=> {
          this.drawer.closeDrawer();
          navigation.navigate(Screens.SEARCH);
        }}
      >
        <Block flex={false}>
          <Input
            style={Style.search}
            editable={false}
            pointerEvents="none"
            rightLabel={
              <Icon
                name="search"
                style={Style.searchIcon}
                size={20}
                onPress={() => {this.drawer.closeDrawer();
                  navigation.navigate(Screens.SEARCH)
                }}
              />
            }
          />
        </Block>
      </TouchableWithoutFeedback>
    );
  };

  renderItemCarousel = ({item, index}) => {
    return (
      <Block flex={false} key={index}>
        <Image 
          source={item.url}  
          style={Style.itemCarousel}
        />
      </Block>
    );
  }

  renderLocation = () => {
    return (
      <TouchableOpacity>
        <Block flex={false} row center space="between" style={Style.address}>
          <Text green style={{marginRight: 10}}><Icon name="map-marker" size={20} /> 123 Xô Viết Nghệ Tĩnh, Đà Nẵng</Text>
          <Icon name="chevron-right" size={15} color={Colors.green} />
        </Block>
      </TouchableOpacity>
    );
  };

  renderCarousel = () => {
    const { carousel } = this.state;
    return (
      <Block flex={false} style={{...ApplicationStyles.marginHorizontal, marginTop: 2 }}>
        <Carousel
          data={carousel}
          renderItem={this.renderItemCarousel}
          loop={true}
          autoplay={true}
          sliderWidth={widthCarousel}
          itemWidth={widthCarousel}
        />
      </Block>
    );
  };

  renderAction = () => {
    return (
      <Block 
        flex={false} center middle row
        style={{...ApplicationStyles.marginHorizontal }}
      >
        <Block flex={false} style={{ width:'85%', paddingRight: 20 }}>
          <Picker
            selectedValue={this.state.selectedCity}
            label={strings('AddEditAddress.provinceCity')} 
            onChange={(value, index) => this.handleChangeCity(value, index)}
            data={this.state.cities}
            fontSize={Sizes.h3}
            labelFontSize={Sizes.font}
            baseColor={Colors.green}
            pickerStyle={Style.pickerStyle}
          />
        </Block>
        <Block flex={false} style={{ paddingTop: 40 }}>
          <TouchableOpacity onPress={() => this.drawer.openDrawer()}>
            <Text body>
              <Icon name="filter" size={20} color={Colors.green} /> {strings('Home.filter')}
            </Text>
          </TouchableOpacity>
        </Block>
      </Block>
    );
  };
  
  renderItem = item => {
    const { navigation } = this.props;
    const data = {
      brandName: item.brandName,
      brandId: item.brandId,
      brandImage: item.imageUrl,
      title: item.title,
      subTitle: item.subTitle
    }
    const imageUrl = `${Config.IMAGE_URL}${item.imageUrl}`;
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(Screens.BRANCH, data)}
        style={{ flex: 0.5, marginVertical: 5 }}
      >
      <Block
        center
        key={item.brandName}
        style={{ paddingHorizontal: 5 }}
      >
        <Image 
          source={{uri: imageUrl}}
          style={Style.brand}
        />
        <Block flex={false}>
          <Text style={{ marginTop:5 }} center body>{item.brandName ? item.brandName : ''}</Text>
        </Block>
      </Block>
    </TouchableOpacity>
    )
  };

  renderContent = (brand, loading, refreshing) => {
    return (
      <DrawerLayout
        ref={drawer => {
          this.drawer = drawer;
        }}
        drawerWidth={width / 5 * 4}
        drawerPosition={DrawerLayout.positions.Right}
        drawerType='front'
        drawerBackgroundColor={Colors.white}
        keyboardDismissMode="on-drag"
        renderNavigationView={this.renderDrawer}
      >
        {/* {this.renderLocation()} */}
        {this.renderCarousel()}
        {this.renderAction()}
        {loading ? <Loading /> : (
          <Block style={[Style.container, { marginBottom: 10, paddingVertical: 0 }]}>
            <FlatList
              numColumns={2}
              vertical
              scrollEnabled
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{justifyContent:'space-between'}}
              data={brand}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item, index }) => this.renderItem(item)}
              refreshControl={
                <RefreshControl
                  //refresh control used for the Pull to Refresh
                  refreshing={refreshing}
                  onRefresh={() => this.onRefresh()}
                />
              }
            />
          </Block>
        )}
      </DrawerLayout>
    );
  }

  handleActiveQR = () => {
    this.setState({
      scan: true,
    });
  };

  handleMakeSlideOutTranslation(translationType, fromValue) {
    return {
      from: {
        [translationType]: SCREEN_WIDTH * -0.10
      },
      to: {
        [translationType]: fromValue
      }
    };
  }

  handleScanner = (response) => {
    const check = response.data.substring(0, 4);
    this.setState({
      scan: false,
    });
    
    if (check === 'http') {
      Linking.openURL(response.data).catch((err) =>
        console.error('An error occured', err),
      );
    } else {
      try {
        const bodyResponse = JSON.parse(response.data);
        if (bodyResponse) {
          const data = {
            username: bodyResponse.username,
            password: bodyResponse.password,
            firstName: bodyResponse.firstName,
            lastName: bodyResponse.lastName,
            phone: bodyResponse.phone,
            gender: bodyResponse.gender,
            email: bodyResponse.email,
            address: bodyResponse.address,
            birthDate: bodyResponse.birthDate
          };
          userService.signUp(data).then(response => {
            if (response.success) {
              this.setState({
                isOpen: true, 
                infoAccount: response.data,
                titleAccount: strings('Home.msgSignupSuccess')
              });
            }else {
              this.refs.toastFailed.show(strings('Home.msgSignupExist'), DURATION.LENGTH_LONG);
            }
          });
        } else {
          this.setState({
            scan: false,
          });
      }
      } catch (error) {
        this.refs.toastFailed.show(strings('Home.msgSignupFailed'), DURATION.LENGTH_LONG);
      }
    }
  };

  renderBodyModalAccount = () => {
    const {infoAccount} = this.state;
    let gender = "";
    if(infoAccount.gender === "0"){
      gender = "Nam"
    } else if (infoAccount.gender === "1") {
      gender = "Nữ"
    } else {
      gender = "Khác"
    }
    return (
      <Block column >
        <Text body h3 center>{strings('Home.titleAccount')}</Text>
        <Block row style={{marginTop:10}}>
            <Text body gray style={Style.titleAccount}>{strings('Home.nameAccount')}</Text>
            <Text body style={Style.contentAccount}>{infoAccount.firstName != null || infoAccount.lastName != null ? infoAccount.firstName +' '+infoAccount.lastName : ""}</Text>
        </Block>
        <Block row >
            <Text body gray style={Style.titleAccount}>{strings('Home.phoneAccount')}</Text>
            <Text body style={Style.contentAccount}>{infoAccount.phone ? infoAccount.phone : ""}</Text>
        </Block>
        <Block row >
            <Text body gray style={Style.titleAccount}>{strings('Home.genderAccount')}</Text>
            <Text body style={Style.contentAccount}>{infoAccount.gender ? gender : ""}</Text>
        </Block>
        <Block row >
            <Text body gray style={Style.titleAccount}>{strings('Home.birthdayAccount')}</Text>
            <Text body style={Style.contentAccount}>{infoAccount.birthDate ? infoAccount.birthDate : ""}</Text>
        </Block>
        <Block row >
            <Text body gray style={Style.titleAccount}>{strings('Home.emailAccount')}</Text>
            <Text body style={Style.contentAccount}>{infoAccount.email ? infoAccount.email : ""}</Text>
        </Block>
        <Block row >
            <Text body gray style={Style.titleAccount}>{strings('Home.addressAccount')}</Text>
            <Text body style={Style.contentAccount}>{infoAccount.address ? infoAccount.address : ""}</Text>
        </Block>
      </Block>
    );
  }

  handleCloseModal = () => {
    this.setState({
      isOpen: false,
    })
  }

  handleFlash = () => {
    const {isFlashOn} = this.state;
    this.setState({isFlashOn: !isFlashOn});
  }

  render() {
    const { brand, errorCode, refreshing, scan, isOpen, titleAccount, isFlashOn } = this.state;
    const { navigation, loading, userActions, userId } = this.props;
    if ( errorCode === '401') {
      resetUser();
      userActions.resetUser();
      navigation.navigate(Screens.LOGIN);
    }
    
    return (
      <Block style={Style.view}>
        {scan ? (
          <QRCodeScanner
            reactivate={true}
            flashMode={isFlashOn ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
            showMarker={true}
            ref={(node) => {
              this.scanner = node;
            }}
            onRead={this.handleScanner}
            containerStyle={{
              backgroundColor: Colors.overlay,
            }}
            cameraStyle={{
              height: SCREEN_HEIGHT
            }}
            topViewStyle={{height: 0, flex: 0}}
            customMarker={
              <Block flex={false} style={Style.rectangleContainer}>
                <Block flex={false} style={Style.topOverlay}>
                  <Text style={Style.centerText}>
                    {strings('Home.scannerQRCode')}
                  </Text>
                </Block>
                <Block flex={false} row>
                  <Block flex={false} style={Style.leftAndRightOverlay} />
                  <Block flex={false} style={Style.rectangle}>
                      <MaterialCommunityIcons
                        name="scan-helper"
                        size={SCREEN_WIDTH * 0.73}
                        color={Colors.green3}
                      />
                    <Animatable.View
                      style={Style.scanBar}
                      direction="alternate-reverse"
                      iterationCount="infinite"
                      duration={2700}
                      easing="linear"
                      animation={this.handleMakeSlideOutTranslation(
                        "translateY",
                        SCREEN_WIDTH * -0.68
                      )}
                    />
                  </Block>
                  <Block flex={false} style={Style.leftAndRightOverlay} />
                </Block>
                <Block style={Style.bottomOverlay} />
              </Block>
            }
            bottomContent={
              <Block flex={false} row style={{marginTop:50}}>
                <TouchableOpacity
                  style={[Style.buttonTouchable, {marginRight:5}]}
                  onPress={() => this.handleFlash()}>
                  <Text style={Style.buttonTextStyle}>
                    <MaterialIcons name={isFlashOn ? "flash-on" : "flash-off"} size={25} color={Colors.white} />
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[Style.buttonTouchable, {marginLeft:5}]}
                  onPress={() => this.setState({scan: false, isFlashOn: false})}>
                  <Text style={Style.buttonTextStyle}>
                    <MaterialIcons name="cancel" size={25} color={Colors.white} />
                  </Text>
                </TouchableOpacity>
              </Block>
            }
          />
        ): (
          <Block style={Style.view}>
            <Header 
              isShowButton
              userId={userId}
              onPressBtn={this.handleActiveQR}
              centerHeader={this.renderCenterHeader()}
              rightIcon={<Cart navigation={navigation} />}
            />
            {this.renderContent(brand, loading, refreshing)}
          </Block>
        )}
        <BaseModal 
            isOpen={isOpen}
            title={titleAccount}
            bodyModal={this.renderBodyModalAccount}
            onCancel={this.handleCloseModal} 
            useScrollView={true}
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

HomeScreen.defaultProps = {};

HomeScreen.propTypes = {
  userActions: PropTypes.object,
  branchActions: PropTypes.object,
  brand: PropTypes.array,
  categories: PropTypes.array,
  loading: PropTypes.bool,
  userId: PropTypes.string,
  total: PropTypes.number,
  location: PropTypes.array,
};

const mapStateToProps = (state) => ({
  brand: state.branch.brands,
  loading: state.branch.loadingListBrand,
  categories: state.branch.categories,
  errorCode: state.user.errorCode,
  userId: state.user.userId,
  total: state.cart.total,
  location: state.user.location,
})

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  branchActions: bindActionCreators(BranchActions, dispatch),
  cardsActions: bindActionCreators(CardsActions, dispatch),
  cartActions: bindActionCreators(CartActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeScreen);

