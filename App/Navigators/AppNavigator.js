import React from 'react';
import { Image } from 'react-native'
import { createAppContainer, createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Badge } from 'react-native-paper';
import { strings } from '../Locate/I18n';
import { Sizes, Colors, Images } from '../Theme';
import { Block, IconFavorites } from '../Components';
import { Screens } from '../Utils/screens';
import HomeScreenFarm from '../Containers/HomeFarm/HomeScreenFarm';
import BranchScreen from '../Containers/Home/BranchScreen';
import CategoriesScreen from '../Containers/Categories/CategoriesScreen';
import CardScreen from '../Containers/Card/CardScreen';
import FavoritesScreen from '../Containers/Favorites/FavoritesScreen';
import ProfileScreen from '../Containers/Profile/ProfileScreen';
import DetailOrderScreen from '../Containers/Profile/DetailOrderScreen';
import UserInfoScreen from '../Containers/Profile/UserInfoScreen';
import AddressScreen from '../Containers/Profile/AddressScreen';
import AddEditAddressScreen from '../Containers/Profile/AddEditAddressScreen';
import LoginScreen from '../Containers/Login/LoginScreen';
import ProductDetailScreen from '../Containers/ProductDetail/ProductDetailScreen';
import ImageCommentsScreen from '../Containers/ProductDetail/ImageCommentsScreen';
import ImageZoomScreen from '../Containers/ProductDetail/ImageZoomScreen';
import ImageProductZoomScreen from '../Containers/ProductDetail/ImageProductZoomScreen';
import AllCommentsScreen from '../Containers/ProductDetail/AllCommentsScreen';
import AnswerCommentsScreen from '../Containers/ProductDetail/AnswerCommentsScreen';
import WriteCommentsScreen from '../Containers/ProductDetail/WriteCommentsScreen';
import ListOrderScreen from '../Containers/Profile/ListOrderScreen';
import SearchScreen from '../Containers/Search/SearchScreen';
import CartScreen from '../Containers/Cart/CartScreen';
import ChangeAddressScreen from '../Containers/Cart/ChangeAddressScreen';
import PaymentMethodScreen from '../Containers/Cart/PaymentMethodScreen';
import OrderSuccessScreen from '../Containers/Cart/OrderSuccessScreen';
import SignUpScreen from '../Containers/Login/SignUpScreen';
import ActiveScreen from '../Containers/Login/ActiveScreen';
import PromotionScreen from '../Containers/Profile/PromotionScreen';
import CancelOrderScreen from '../Containers/Profile/CancelOrderScreen';
import ChangePasswordUserScreen from '../Containers/Profile/ChangePasswordUserScreen';
import ProductDescriptionScreen from '../Containers/ProductDetail/ProductDescriptionScreen';
import ReasonReturnOrderScreen from '../Containers/Profile/ReasonReturnOrderScreen';
import ProcessDetailScreen from '../Containers/ProcessDetail/ProcessDetailScreen';
import ProcessImplementScreen from '../Containers/ProcessDetail/ProcessImplementScreen';
import TaskDetailScreen from '../Containers/ProcessDetail/TaskDetailScreen';
import ProjectDetailScreen from '../Containers/ProjectDetail/ProjectDetailScreen';
import TaskProjectDetailScreen from '../Containers/ProjectDetail/TaskProjectDetailScreen';
/**
 * The root screen contains the application's navigation.
 *
 * @see https://reactnavigation.org/docs/en/hello-react-navigation.html#creating-a-stack-navigator
 */
const defaultNavigationOptions = {
  header: null,
};

const HomeStackNavigator = createStackNavigator(
  {
    // The main application screen is our "WelcomeScreen". Feel free to replace it with your
    // own screen and remove the example.
    [Screens.HOME]: HomeScreenFarm,
  },
  {
    initialRouteName: Screens.HOME,
    defaultNavigationOptions,
  },
)

const CategoriesStackNavigator = createStackNavigator(
  {
    // The main application screen is our "WelcomeScreen". Feel free to replace it with your
    // own screen and remove the example.
    [Screens.CATEGORIES]: CategoriesScreen,
  },
  {
    initialRouteName: Screens.CATEGORIES,
    defaultNavigationOptions,
  },
)

const CardStackNavigator = createStackNavigator(
  {
    // The main application screen is our "WelcomeScreen". Feel free to replace it with your
    // own screen and remove the example.
    [Screens.CARD]: CardScreen,
  },
  {
    initialRouteName: Screens.CARD,
    defaultNavigationOptions,
  },
)

const FavoritesStackNavigator = createStackNavigator(
  {
    // The main application screen is our "WelcomeScreen". Feel free to replace it with your
    // own screen and remove the example.
    [Screens.FAVORITES]: FavoritesScreen,
  },
  {
    initialRouteName: Screens.FAVORITES,
    defaultNavigationOptions,
  },
)

const ProfileStackNavigator = createStackNavigator(
  {
    // The main application screen is our "WelcomeScreen". Feel free to replace it with your
    // own screen and remove the example.
    [Screens.PROFILE]: ProfileScreen,
    [Screens.DETAIL_ORDER]: DetailOrderScreen,
    [Screens.USER_INFO]: UserInfoScreen,
    [Screens.LIST_ORDER]: ListOrderScreen,
    [Screens.PROMOTION]: PromotionScreen,
    [Screens.CANCEL_ORDER]: CancelOrderScreen,
    [Screens.CHANGE_PASSWORD_USER]: ChangePasswordUserScreen,
    [Screens.REASON_RETURN_ORDER]: ReasonReturnOrderScreen
  },
  {
    initialRouteName: Screens.PROFILE,
    defaultNavigationOptions,
  },
)

const bottomTabNavigator = createBottomTabNavigator({
  [Screens.HOME]: {
    screen: HomeStackNavigator,
    navigationOptions: {
      title: strings('Home.home'),
    },
  },
  // [Screens.CATEGORIES]: {
  //   screen: CategoriesStackNavigator,
  //   navigationOptions: {
  //     title: strings('Categories.categories'),
  //   },
  // },
  [Screens.CARD]: {
    screen: CardStackNavigator,
    navigationOptions: {
      title: strings('Project.project'),
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        return (
          <Block flex={false}>
            <Image source={Images.farmMarket} style={{ tintColor }} />
          </Block>
        );
      }
    },
  },
  // [Screens.FAVORITES]: {
  //   screen: FavoritesStackNavigator,
  //   navigationOptions: {
  //     title: strings('Favorites.favorites'),
  //     tabBarIcon: ({ focused, horizontal, tintColor }) => {
  //       return (
  //         <IconFavorites color={tintColor} />
  //       );
  //     }
  //   },
  // },
  [Screens.PROFILE]: {
    screen: ProfileStackNavigator,
    navigationOptions: {
      title: strings('Profile.profile'),
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        return (
          <Block flex={false}>
            <Icon name='user' size={22} color={tintColor} />
            {/* <Badge
              style={{ position: 'absolute', top: -4, left: 9 }}
            >0</Badge> */}
          </Block>
        );
      }
    },
  },
}, {
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      if (routeName === Screens.HOME) {
        iconName = 'home';
      } else if (routeName === Screens.CATEGORIES) {
        iconName = 'th-large';
      } else if (routeName === Screens.CARD) {
        iconName = 'credit-card';
      }
      return <Icon name={iconName} size={22} color={tintColor} />;
    }
  }),
  tabBarOptions: {
    activeTintColor: Colors.green,
    inactiveTintColor: Colors.gray,
    height: 120,
  },
});

const rootStackNavigator = createStackNavigator(
  {
    // The main application screen is our "WelcomeScreen". Feel free to replace it with your
    // own screen and remove the example.
    [Screens.HOME]: bottomTabNavigator,
    [Screens.LOGIN]: LoginScreen,
    [Screens.SIGNUP]: SignUpScreen,
    [Screens.ACTIVE]: ActiveScreen,
    [Screens.PRODUCT_DETAIL]: ProductDetailScreen,
    [Screens.PROCESS_DETAIL]: ProcessDetailScreen,
    [Screens.PROCESS_IMPLEMENT]: ProcessImplementScreen,
    [Screens.TASK]: TaskDetailScreen,
    [Screens.PROJECT]: ProjectDetailScreen,
    [Screens.TASK_PROJECT]:TaskProjectDetailScreen,
    [Screens.IMAGE_COMMENTS]: ImageCommentsScreen,
    [Screens.IMAGE_ZOOM]: ImageZoomScreen,
    [Screens.IMAGE_PRODUCT_ZOOM]: ImageProductZoomScreen,
    [Screens.ALL_COMMENTS]: AllCommentsScreen,
    [Screens.WRITE_COMMENTS]: WriteCommentsScreen,
    [Screens.ANSWER_COMMENT]: AnswerCommentsScreen,
    [Screens.SEARCH]: SearchScreen,
    [Screens.BRANCH]: BranchScreen,
    [Screens.CART]: CartScreen,
    [Screens.CHANGE_ADDRESS]: ChangeAddressScreen,
    [Screens.ADDRESS]: AddressScreen,
    [Screens.ADD_EDIT_ADDRESS]: AddEditAddressScreen,
    [Screens.PAYMENT_METHOD]: PaymentMethodScreen,
    [Screens.ORDER_SUCCESS]: OrderSuccessScreen,
    [Screens.PRODUCT_DESCRIPTION]: ProductDescriptionScreen
  },
  {
    initialRouteName: Screens.HOME,
    defaultNavigationOptions,
  },
)

export default createAppContainer(rootStackNavigator)
