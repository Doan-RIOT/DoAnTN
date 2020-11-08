import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Toast, { DURATION } from 'react-native-easy-toast';
import {
  Image, TouchableOpacity, Animated, FlatList, RefreshControl,
  Dimensions, ScrollView, TouchableWithoutFeedback,
} from 'react-native';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import UserActions from '../../Stores/User/Actions';
import {
  Button, Block,Text, BaseModal, Cart,
  Card, Header, Input, Picker, TextCurrency, InputCurrency, Loading
} from "../../Components";
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIonic from 'react-native-vector-icons/Ionicons';
import { sortBy } from 'lodash';
import { strings } from '../../Locate/I18n';
import Style from './FavoritesScreenStyle';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import { chunk } from '../../Utils/commonFunction';
import { resetUser } from '../../Utils/storage.helper';
import { Screens } from '../../Utils/screens';
import { Config } from '../../Config/index'
import { Constants } from '../../Utils/constants';
import { categoriesService } from '../../Services/CategoriesService';
const { width, height } = Dimensions.get('window');
const dataTypeSort = [Constants.DEFAULT, Constants.NEW_PRODUCT, Constants.LOW_PRICE, Constants.HIGHT_PRICE]

class FavoritesScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      brands: [],
      products: [],
      errorCode: '',
      refreshing: false,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const { errorCode, favorites } = nextProps;
    const brands = favorites && favorites.brand !== null ? favorites.brand : [];
    const products = favorites && favorites.product !== null ? favorites.product : [];
    const data = {
      errorCode,
      brands,
      products
    };
    

    return data;
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    const { brands  } = this.state;
    
    this.focusListener = navigation.addListener('didFocus', () => {
      if (brands && brands.length > 0 && this.flatListBrands) {
        this.flatListBrands.scrollToIndex({ animated: true, index: 0 });
      }
    });
  };

  onRefresh = () => {
    const { userActions, userId } = this.props;
    userActions.fetchFavorites(userId);
  };

  componentWillUnmount = () => {
    this.focusListener.remove();
  }

  renderCenterHeader = () => {
    const { navigation } = this.props;
    return (
      <TouchableWithoutFeedback
        onPress={()=> {
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
  
  renderRating = rating => {
    const htmlRating = [];
    for (let index = 0; index < 5; index++) {
      htmlRating.push(
        <IconIonic
          name="ios-star-half"
          name={index + 0.5 === rating ? 'ios-star-half' : 'ios-star'}
          size={15}
          key={index}
          color={(index + 0.5) <= rating ? Colors.tertiary : Colors.gray2} 
        />
      )
    }
    return (
      <Block flex={false} row>
        {htmlRating}
      </Block>
      );
  };

  renderItemBrand = (item, index) => {
    const { navigation } = this.props;
    const data = {
      brandName: item.brandName,
      brandId: item.brandId,
      brandImage: item.imageUrl,
    };

    const imageUrl = `${Config.IMAGE_URL}${item.imageUrl ? item.imageUrl : ''}`;
    return (
      <Block center style={{ paddingHorizontal: 5, width: 140 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate(Screens.BRANCH, data)}
        >
          <Image
            source={{uri: imageUrl}}
            style={Style.categoryImage}
          />
        </TouchableOpacity>
        <Text center green body numberOfLines={2}>
          {item.brandName ? item.brandName : ''}
        </Text>
      </Block>
    )
  };

  renderBrand = (loading, brands) => {
    return (
      <Block flex={false} style={[Style.container, { height: 125 }]}>
        {loading ? <Loading /> : (
          <>
            {brands && brands.length > 0 ? (
              <FlatList
              horizontal
              scrollEnabled
              showsHorizontalScrollIndicator={false}
              data={brands}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({item, index}) => this.renderItemBrand(item, index)}
              ref={ref => this.flatListBrands = ref }
            />
            ) : (
              <Block center middle>
                
              </Block>
            )}
          </>
        )}
      </Block>
    );
  };

  renderItemProduct = item => {
    const { navigation } = this.props;
    const rating = item.rating !== null && item.rating.totalPoint ? item.rating.totalPoint : 0;
    const imageUrl = `${Config.IMAGE_URL}${item.imageUrl ? item.imageUrl : ''}`;

    return (
      <Block
        center
        style={{ flex: 0.45, paddingHorizontal: 5 }}
        key={item.productId}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate(Screens.PRODUCT_DETAIL, { productId: item.productId, productCode: item.productCode, branchId: item.branchDefaultId })}
        >
          <Image
            source={{uri: imageUrl}}
            style={Style.productImage}
          />
        </TouchableOpacity>
        <Text body>{item.productName}</Text>
        <Text gray body>{item.branchName} - {item.branchAddress}</Text>
        {this.renderRating(rating)}
        <Text bold pink2><TextCurrency value={item.salePrice ? item.salePrice : 0} pink2></TextCurrency> đ</Text>
      </Block>
    )
  };

  renderProducts = (loading, products, refreshing) => {
    return (
      <Block style={[Style.container, { marginBottom: 10, paddingVertical: 0 }]}>
        {loading ? <Loading /> : (
          <>
            <FlatList
              numColumns={2}
              vertical
              scrollEnabled
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{justifyContent:'space-between'}}
              data={products}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item, index }) => this.renderItemProduct(item)}
              refreshControl={
                <RefreshControl
                  //refresh control used for the Pull to Refresh
                  refreshing={refreshing}
                  onRefresh={() => this.onRefresh()}
                />
              }
            />
            {products && products.length === 0 ? (
              <Block center middle>
              </Block>
            ) : null}
          </>
          
        )}
      </Block>
    );
  }

  renderContent = () => {
    const { brands, products, loading, refreshing } = this.state;

    return (
      <>
        {/* {this.renderLocation()} */}
        {this.renderBrand(loading, brands)}
        {this.renderProducts(loading, products, refreshing)}
      </>
    )
  }
  
  render() {
    const { errorCode } = this.state;
    const { navigation, userId } = this.props;
    if ( errorCode === '401') {
      resetUser();
      userActions.resetUser();
      navigation.navigate(Screens.LOGIN);
    }

    return (
      <Block style={Style.view}>
        <Header
          centerHeader={this.renderCenterHeader()}
          rightIcon={<Cart navigation={navigation} />}
          navigation={navigation}
        />
          {userId && userId !== '' ? this.renderContent() : null}
      </Block>
    );
  }
}

FavoritesScreen.defaultProps = {};

FavoritesScreen.propTypes = {
  userActions: PropTypes.object,
  favorites: PropTypes.object,
  errorCode: PropTypes.string,
  loading: PropTypes.bool,
  userId: PropTypes.string,
};

const mapStateToProps = (state) => ({
  favorites: state.user.favorites,
  loading: state.user.loading,
  errorCode: state.user.errorCode,
  userId: state.user.userId,
})

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FavoritesScreen);

