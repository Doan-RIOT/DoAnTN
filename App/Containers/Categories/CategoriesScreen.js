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
import CartActions from '../../Stores/Cart/Actions';
import CategoriesActions from '../../Stores/Categories/Actions';
import { cartService } from '../../Services/CartService';
import {
  Button, Block,Text, Cart,
  Card, Header, Input,
  TextCurrency, InputCurrency, Loading
} from "../../Components";
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIonic from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { strings } from '../../Locate/I18n';
import Style from './CategoriesScreenStyle';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import { chunk } from '../../Utils/commonFunction';
import { resetUser } from '../../Utils/storage.helper';
import { Screens } from '../../Utils/screens';
import { Config } from '../../Config/index'
import { Constants } from '../../Utils/constants';
const { width, height } = Dimensions.get('window');
const dataTypeSort = [Constants.DEFAULT, Constants.NEW_PRODUCT, Constants.LOW_PRICE, Constants.HIGHT_PRICE]

class CategoriesScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowSort: false,
      isShowBranchSelect: false,
      typeShort: strings(`Branch.${Constants.DEFAULT}`),
      listTypeShort: dataTypeSort,
      products: [],
      categories: [],
      yButtonSort: 200,
      errorCode: '',
      listBranch: [],
      isEditing: false,
      rating: 0,
      priceFrom: '',
      priceTo: '',
      productSelect: {},
      selectedCategory : {},
      refreshing: false,
      isLoading: false
    }
    this.animated = new Animated.Value(0);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { errorCode, categories, products } = nextProps;
    const { isEditing } = prevState;
    let data = {
      errorCode,
      products
    };

    if (!isEditing) {
      data.categories = categories;
    }
    
    return data;
  }

  componentDidMount = () => {
    this.fetchProduct(null, true);
  };

  fetchProduct = (productCategoryId, isRoot) => {
    const { categoriesActions } = this.props;
    let data = {
      searchType: ['product'],
      firstresult: 0,
      maxresult: 100,
    }
    if (!isRoot) data.categoryId = [productCategoryId];
    categoriesActions.fetchProductsByCategory(data);
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
  
  handleCancelFilter = (isCancel, isClose) => {
    if (isCancel) {
      const { typeShort } = this.state;
      this.setState({
        rating: 0,
        priceFrom: '',
        priceTo: ''
      });
      this.handleFilterSortProducts('', '', 0, typeShort);
    }
    if (isClose) this.drawer.closeDrawer();
  };

  handleFilterByRating = rating => {
    const { priceFrom, priceTo, typeShort} = this.state;
    this.setState({
      rating,
    });

    this.handleFilterSortProducts(priceFrom, priceTo, rating, typeShort);
  }

  onRefresh = () => {
    const { priceFrom, priceTo, rating, typeShort } = this.props;
    this.handleFilterSortProducts(priceFrom, priceTo, rating, typeShort);
  };

  handleFilterSortProducts = (priceFrom, priceTo, rating, typeShort) => {
    const { categoriesActions } = this.props;
    const { selectedCategory } = this.state;
    let data = {
      searchType: ['product'],
      firstResult: 0,
      maxResult: 100,
      categoryId: [selectedCategory.categoryId],
    };

    if (rating > 0) {
      data.rating = rating;
    }

    if (priceFrom !== '') {
      data.fromPrice = priceFrom;
    }

    if (priceTo !== '') {
      data.toPrice = priceTo;
    }

    if (typeShort === strings(`Branch.${Constants.DEFAULT}`)) {
      if (data.sort) delete data.sort;
      if (data.sortAction) delete data.sortAction;
    } else if (typeShort === strings(`Branch.${Constants.NEW_PRODUCT}`)) {
      data.sort = 'createdDate';
    } else if (typeShort === strings(`Branch.${Constants.HIGHT_PRICE}`)) {
      data.sort = 'price';
      data.sortAction = 'desc';
    } else if (typeShort === strings(`Branch.${Constants.LOW_PRICE}`)) {
      data.sort = 'price';
      data.sortAction = 'asc';
    }
    this.handleProcessEdit('isEditing', true);
    categoriesActions.fetchProductsByCategory(data);
  }

  renderRatingFilter = () => {
    const { rating } = this.state;
    return (
      <Block flex={false} style={{marginTop: 10}} space="between" row>
        <TouchableOpacity
          style={[Style.categories, rating === 5 ? Style.categoriesSelect : null, { width: '32%'}]}
          onPress={() => this.handleFilterByRating(5)
        }>
          <Text center>
            <Icon name="star" size={15}  color={Colors.tertiary}/>
            {` ${strings('Branch.from')} 5 ${strings('Branch.star')}`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[Style.categories, rating === 4 ? Style.categoriesSelect : null, { width: '32%'}]}
          onPress={() => this.handleFilterByRating(4)
        }>
           <Text center>
            <Icon name="star" size={15}  color={Colors.tertiary}/>
            {` ${strings('Branch.from')} 4 ${strings('Branch.star')}`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[Style.categories, rating === 3 ? Style.categoriesSelect : null, { width: '32%'}]}
          onPress={() => this.handleFilterByRating(3)
        }>
           <Text center>
            <Icon name="star" size={15}  color={Colors.tertiary}/>
            {` ${strings('Branch.from')} 3 ${strings('Branch.star')}`}
          </Text>
        </TouchableOpacity>
      </Block>
      );
  };

  renderPriceFilter = () => {
    const { priceFrom, priceTo, rating, typeShort } = this.state;
    return (
      <Block row space="between">
        <Block style={{padding: 5}}>
          <InputCurrency 
            value={priceFrom}
            style={Style.input}
            placeholder={strings('Branch.from')}
            onChangeText={text => this.setState({
              priceFrom: !isNaN(parseInt(text.replace(/\./g, ''))) ? parseInt(text.replace(/\./g, '')) : '',
            })}
            onBlur={() => this.handleFilterSortProducts(priceFrom, priceTo, rating, typeShort)}
          />
        </Block>
        <Block style={{padding: 5}}>
          <InputCurrency 
            value={priceTo}
            style={Style.input}
            placeholder={strings('Branch.to')}
            onChangeText={text => this.setState({
              priceTo: !isNaN(parseInt(text.replace(/\./g, ''))) ? parseInt(text.replace(/\./g, '')) : '',
            })}
            onBlur={() => this.handleFilterSortProducts(priceFrom, priceTo, rating, typeShort)}
          />
        </Block>
      </Block>
    )
  }

  renderDrawer = () => {
    const { products, rating, priceFrom, priceTo } = this.state;

    return (
      <Block>
        <ScrollView>
          <Block row flex={false} style={{backgroundColor: Colors.green, height: 70, paddingVertical: 25}}>
            <Block flex={false} style={{width: '25%'}} />
            <Block flex={false} center bottom style={{width: '50%'}}>
              <Text h3 white>{strings('Branch.filterTitle')}</Text>
            </Block>
            <Block flex={false} bottom style={{width: '25%'}}>
              <TouchableOpacity onPress={() => this.handleCancelFilter(true, false)}>
                <Text white>{strings('Home.cancelFilter')}</Text>
              </TouchableOpacity>
            </Block>
          </Block>
          <Block style={{paddingHorizontal: 10, marginTop: 10}}>
            <Text h3 bold>{strings('ProductDetail.rating')}</Text>
            {this.renderRatingFilter()}
          </Block>
          <Block style={{paddingHorizontal: 10, marginTop: 10}}>
            <Text h3 bold>{strings('Branch.price')}</Text>
            {this.renderPriceFilter()}
          </Block>
        </ScrollView>
        <Block bottom style={{paddingHorizontal: 10, marginTop: 10}}>
          <Button
            green
            style={{paddingHorizontal: 10}}
            onPress={() => this.handleCancelFilter(false, true)}
          >
            <Text center white>
              {priceFrom === '' && priceTo === '' && rating === 0 ? strings('Home.closeFilter') : `${strings('Home.viewMore')} ${products.length} ${strings('Branch.product')}`}
            </Text>
          </Button>
        </Block>
      </Block>
    );
  };

  toggleSort = () => {
    const { isShowSort } = this.state;
    this.setState({
      isShowSort: !isShowSort
    });
  };

  renderLocation = () => {
    return (
      <TouchableOpacity>
        <Block flex={false} row center space="between" style={Style.address}>
          <Text body green style={{marginRight: 10}}><Icon name="map-marker" size={20} /> 123 Xô Viết Nghệ Tĩnh, Đà Nẵng</Text>
          <Icon name="chevron-right" size={15} color={Colors.green} />
        </Block>
      </TouchableOpacity>
    );
  };

  handleShowBranchSelect = product => {
    this.setState({
      isShowBranchSelect: true,
      listBranch: product.branch,
      productSelect: product,
    })
    Animated.timing(this.animated,
      {
        toValue: height / 2, 
        duration: 200 
      }).start()
  };

  handleCloseBranchSelect = () => {
    this.setState({
      isShowBranchSelect: false,
    })
    Animated.timing(this.animated,
      {
        toValue: 0,
        duration: 100
      }).start()
  };

  renderAction = () => {
    const { isShowSort , typeShort } = this.state;

    return (
      <Block
        flex={false}
        center row space="between"
        style={{...ApplicationStyles.marginHorizontal, marginTop: 10 }}
      >
        <TouchableOpacity
          onPress={() => this.toggleSort()}
          ref={(ref) => { this.sortButton = ref }}
        >
          <Text body>{strings('Home.sort')}: <Text body bold> {typeShort}</Text>  <Icon name={isShowSort ? 'angle-up' : 'angle-down'} size={20} color={Colors.green} /></Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.drawer.openDrawer()}>
          <Text body>
            <Icon name="filter" size={20} color={Colors.green} /> {strings('Home.filter')}
          </Text>
        </TouchableOpacity>
      </Block>
    );
  };
  
  renderRating = rating => {
    const htmlRating = [];
    for (let index = 0; index < 5; index++) {
      htmlRating.push(
        <MaterialIcons
          name="star-half"
          name={index + 0.5 === rating ? 'star-half' : 'star'}
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

  renderItemProduct = item => {
    const { navigation } = this.props;
    const rating = item.rating !== null && item.rating.totalPoint ? item.rating.totalPoint : 0;
    const imageUrl = `${Config.IMAGE_URL}${item.imageUrl}`;
    const enabled = item.orderNumber && item.orderNumber > 0 ? true : false;
    const disabledMinus = item.orderNumber && item.orderNumber === 0 || !item.orderNumber ? true : false;
    const disabledAdd = item.orderNumber && item.orderNumber >=100 ? true : false;
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
        <Text body numberOfLines={1}>{item.productName}</Text>
        <Text gray body numberOfLines={1}>{item.branchName} - {item.branchAddress}</Text>
        {this.renderRating(rating)}
        <Text bold pink2><TextCurrency value={item.salePrice ? item.salePrice : 0} pink2></TextCurrency> đ</Text>
        {item.branch && item.branch.length > 1 ? (
          <TouchableOpacity
            onPress={() => this.handleShowBranchSelect(item)}
          >
            <Block flex={false} middle row>
              <Text green body>
                {`${item.branch.length -1} ${strings('Categories.anotherLocation')}`}
              </Text>
              <MaterialIcons name="arrow-forward" size={10} style={{marginLeft: 10}} color={Colors.green} />
            </Block>
          </TouchableOpacity>
        ): null}
        <Block flex={false} center style={{height:90}}>
              <Block row>
                <Button
                    style={Style.buttonAddNumber}
                    onPress={() => this.handleOrderNumber({ product:item }, false)}
                    disabled={disabledMinus}
                >
                    <Text center><Icon name="minus" size={10} color={Colors.green} /></Text>
                </Button>
                <Input
                  value={item.orderNumber ? (item.orderNumber).toString() : '0'}
                  style={[Style.buttonAddNumber, { width: 50, marginTop: 8.3 , padding:5}]}
                  onChangeText={orderNumber => this.handleInputOrderNumber({product: item}, orderNumber)}
                  number
                  textAlign={'center'}
                />
                <Button
                  style={Style.buttonAddNumber}
                  onPress={() => this.handleOrderNumber({ product: item }, true)}
                  disabled={disabledAdd}
                >
                  <Text center><Icon name="plus" size={10} color={Colors.green} /></Text>
                </Button>
                <Button
                    style={[Style.button, {marginLeft: 10, marginTop:6, borderWidth: 0}]}
                    disabled={!enabled}
                    onPress={() => this.handleAddToCart({ item })}
                  >
                    <Text center>
                      <Icon name="cart-plus" size={30} color={enabled ? Colors.green : Colors.gray} />
                    </Text>
                  </Button>
              </Block>
              <Button
                  style={Style.buttonBuyNow}
                  disabled={!enabled}
                  onPress={() => this.handleBuyNow({item})}
                >
                  <Text bold center white>{strings("Branch.buyNow")}</Text>
              </Button>
            </Block>
      </Block>
    )
  };

  handleSelectBranch = index => {
    this.handleCloseBranchSelect();
    const { listBranch, products, productSelect } = this.state;
    const branchSelected = listBranch[index];
    const indexProduct = products.findIndex(item => item.productId === productSelect.productId);
    products[indexProduct].branchName = branchSelected.branchName;
    products[indexProduct].branchDefaultId = branchSelected.branchId;
    products[indexProduct].branchAddress = branchSelected.address;
    this.setState({
      products
    })
  };

  renderListBranchSelect = () => {
    const { listBranch, productSelect } = this.state;
    let htmlListBranch = [];
    if (listBranch.length > 0) {
      listBranch.forEach((item, index) => {
        const htmlBranch = (
          <TouchableOpacity
            key={index}
            style={Style.itemBranch}
            onPress={() => this.handleSelectBranch(index)}
          >
            <Text>
              {item.branchName ? item.branchName : ''}
              {productSelect.branchDefaultId === item.branchId && <Icon name="check" size={15} color={Colors.green} />}
            </Text>
          </TouchableOpacity>
        );

        htmlListBranch.push(htmlBranch);
      })
    }
    return (
      <Animated.View style={{
        backgroundColor: Colors.white,
        width: width,
        height: this.animated,
      }}>
        <ScrollView style={{padding: 10}}>
          <TouchableOpacity onPress={() => this.handleCloseBranchSelect()}>
            <Text right><Icon name="times" size={20} color={Colors.error} /></Text>
          </TouchableOpacity>
          {htmlListBranch}
        </ScrollView>
      </Animated.View>
    )
  };

  handleProcessEdit = (key, process) => {
    this.setState({
      [key]: process
    })
  };

  handleSortProducts = item => {
    let { products, priceFrom, priceTo, rating } = this.state;
    const typeShort = strings(`Branch.${item}`);
    this.handleFilterSortProducts(priceFrom, priceTo, rating, typeShort)
    this.setState({
      typeShort,
      isShowSort: false,
      products,
    });
  };

  handlePressCategory = item => {
    this.setState({
      selectedCategory: item,
      typeShort: strings(`Branch.${Constants.DEFAULT}`),
      rating: 0,
      fromPrice: '',
      toPrice: ''
    })
    this.handleProcessEdit('isEditing', false);
    this.fetchProduct(item.categoryId, false);
    this.flatListCategories.scrollToIndex({ animated: true, index: 0 });
  };

  renderItemCategory = (item, index) => {
    const imageUrl = `${Config.IMAGE_URL}?uploadId=${item.imageUrl ? item.imageUrl : ''}&seq=1`;
    return (
      <Block center style={{ paddingHorizontal: 10, width: 120 }}>
        <TouchableOpacity onPress={() => this.handlePressCategory(item)}>
          <Image
            source={{uri: imageUrl}}
            style={Style.categoryImage}
          />
        </TouchableOpacity>
        <Text center green body numberOfLines={2}>{item.categoryName}</Text>
      </Block>
    )
  };

  handleToCategoriesParent = () => {
    this.handleProcessEdit('isEditing', false);
    const { categories } = this.state;
    const { categoriesActions } = this.props;
    if (categories && categories.length > 0) {
      categoriesActions.fetchParentCategory(categories[0].categoryId);
      this.flatListCategories.scrollToIndex({ animated: true, index: 0 });
    }
  };

  renderCategories = () => {
    const { categories } = this.state;
    const isShowBack = categories.length > 0 && !categories[0].root ? true : false;
    return (
      <Block flex={false} style={[Style.container, { height: 125 }]}>
        <Block row>
          <Block flex={false} center middle style={{ marginRight: 10 }}>
            {isShowBack && (
              <TouchableOpacity onPress={this.handleToCategoriesParent}>
                <Icon name="angle-left" color={Colors.green} size={70} />
              </TouchableOpacity>
            )}
          </Block>
          <FlatList
            horizontal
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({item, index}) => this.renderItemCategory(item, index)}
            ref={ref => this.flatListCategories = ref }
          />
        </Block>
      </Block>
    );
  };

  handleOrderNumber = ( {product}, isAdd ) => {
    let { products } = this.state;
    const index = products.findIndex(item => item.productId === product.productId && item.productCode === product.productCode);
    let item = products[index];
    let orderNumber = item.orderNumber ? item.orderNumber : 0;
    if (isAdd) {
      orderNumber += 1;
      item.orderNumber = orderNumber;
    } else {
      orderNumber = orderNumber > 0 ? orderNumber -= 1 : 0;
      item.orderNumber = orderNumber;
    }
    products[index] = item;
    this.setState({ products });
  }

  handleInputOrderNumber = ( {product}, orderNumber ) => {
    const tmp = orderNumber ? orderNumber : 0;
    let {products} = this.state;
    const index = products.findIndex(item => item.productId === product.productId && item.productCode === product.productCode);
    let item = products[index];
    item.orderNumber = parseInt(tmp);
    products[index] = item;
    this.setState({ products });
  }

  handleAddToCart = ({ item }) => {
      const {cartActions, userId} = this.props;
      cartActions.addToCart(JSON.parse(JSON.stringify(item)), userId);
      item.orderNumber = 0;
  }

  handleBuyNow = async({ item }) =>{
    if(item.orderNumber > 0){
      this.setState({isLoading: true});
      const {navigation, cartActions, userId, language} = this.props;
      await cartActions.addToCart(JSON.parse(JSON.stringify(item)), userId);
      const { cart } = this.props;
      if (userId && userId !== '') {
        cartService.createOrders(cart, language).then(response => {
          this.setState({isLoading: false});
          if (response.success) {
            item.orderNumber = 0;
            const data = response.data && response.data !== null ? response.data : {};
            const totalProduct = data.totalProduct ? data.totalProduct : 0;
            cartActions.setDataToCart(data, totalProduct, userId);
            navigation.navigate(Screens.CART);
          }
        }).catch(error =>{});
      } else {
        cartService.createOrdersAnonymous(cart, language).then(response => {
          this.setState({isLoading: false});
          if (response.success) {
            item.orderNumber = 0;
            const data = response.data && response.data !== null ? response.data : {};
            const totalProduct = data.totalProduct ? data.totalProduct : 0;
            cartActions.setDataToCart(data, totalProduct, '');
            navigation.navigate(Screens.CART);
          }
        }).catch(error =>{});
      }
    }else {
      this.refs.toastFailed.show(strings('Branch.msgBuyNowFailed'), DURATION.LENGTH_LONG);
    }
  }

  renderProducts = loading => {
    const { products, refreshing } = this.state;
    return (
      <Block style={[Style.container, { marginBottom: 10, paddingVertical: 0 }]}>
      {loading ? <Loading /> : (
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
      )}
      </Block>
    );
  }
  
  render() {
    const {
      isShowSort , listTypeShort ,
      typeShort, yButtonSort, errorCode,
      isShowBranchSelect, selectedCategory, isLoading
    } = this.state;
    const { navigation, loading } = this.props;
    if ( errorCode === '401') {
      resetUser();
      userActions.resetUser();
      navigation.navigate(Screens.LOGIN);
    }

    let htmlTypeSort = [];
    if (listTypeShort.length > 0) {
      listTypeShort.forEach((item, index) => {
        htmlTypeSort.push(
          <TouchableOpacity 
            key={index}
            onPress={() => this.handleSortProducts(item)}
            style={{marginVertical: 5}}
          >
            <Block flex={false} row space="between" center>
              <Text h3>
                {strings(`Branch.${item}`)} 
              </Text>
              {strings(`Branch.${item}`) === typeShort && <Icon name="check" size={20} color={Colors.green} />}
            </Block>
          </TouchableOpacity>
        );
      });
    }
    return (
      <Block style={Style.view}>
        <Header
          centerHeader={this.renderCenterHeader()}
          rightIcon={<Cart navigation={navigation} />}
          navigation={navigation}
        />
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
          <Block>
            {/* {this.renderLocation()} */}
            {this.renderCategories()}
            <Block flex={false} style={{ paddingHorizontal: 10, paddingTop: 5 }}>
              <Text green>{selectedCategory.categoryName ? selectedCategory.categoryName : ''}</Text>
            </Block>
            {this.renderAction()}
            {this.renderProducts(loading)}
          </Block>
          {isShowSort && (
            <>
              <ScrollView style={[Style.sortType, {top: yButtonSort}]}>
                {htmlTypeSort}
              </ScrollView>
              <TouchableWithoutFeedback 
                style={Style.touchOut} 
                onPress={() => this.setState({isShowSort: false})}
              >
                <Block style={Style.backgroundTypeSort} />
              </TouchableWithoutFeedback>
            </>
          )}
          {isShowBranchSelect > 0 && (
            <TouchableWithoutFeedback 
              style={[Style.touchOut, {bottom: height / 2}]} 
              onPress={() => this.handleCloseBranchSelect()}
            >
              <Block style={[Style.backgroundTypeSort, {bottom: height / 2}]} />
            </TouchableWithoutFeedback>
          )}
          {this.renderListBranchSelect()}
        </DrawerLayout>
        <Toast
          ref="toastFailed"
          style={{backgroundColor: Colors.accent}}
          position='top'
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
        />
        {
          isLoading ? (
            <Block style={Style.loading}>
              <Loading color={Colors.white}/>
              <Text white>{strings('Branch.loading')}</Text>
            </Block>
          ): null
        }  
        
      </Block>
    );
  }
}

CategoriesScreen.defaultProps = {};

CategoriesScreen.propTypes = {
  userActions: PropTypes.object,
  categoriesActions: PropTypes.object,
  errorCode: PropTypes.string,
  dataCategory: PropTypes.object,
  loading: PropTypes.bool,
  language: PropTypes.string,
};

const mapStateToProps = (state) => ({
  categories: state.categories.categories,
  products: state.categories.products,
  loading: state.categories.loadingProductsCategory,
  errorCode: state.user.errorCode,
  language: state.user.language,
  userId: state.user.userId,
  language: state.user.language,
  total: state.cart.total,
  cart: state.cart.cart,
})

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  categoriesActions: bindActionCreators(CategoriesActions, dispatch),
  cartActions: bindActionCreators(CartActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CategoriesScreen);

