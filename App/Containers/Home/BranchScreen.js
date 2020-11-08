import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Toast, { DURATION } from 'react-native-easy-toast';
import {
  Image, TouchableOpacity, Animated, RefreshControl,
  Dimensions, ScrollView, TouchableWithoutFeedback, FlatList
} from 'react-native';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import Carousel from 'react-native-snap-carousel';
import UserActions from '../../Stores/User/Actions';
import BranchActions from '../../Stores/Branch/Actions';
import CartActions from '../../Stores/Cart/Actions';
import CategoriesActions from '../../Stores/Categories/Actions';
import { userService } from '../../Services/UserService';
import { cartService } from '../../Services/CartService';
import {
  Button, Block,Text, BaseModal, Cart,
  Card, Header, Input, Picker, TextCurrency, InputCurrency, Loading
} from "../../Components";
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { sortBy } from 'lodash';
import { strings } from '../../Locate/I18n';
import Style from './BranchScreenStyle';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import { chunk, textTruncate } from '../../Utils/commonFunction';
import { resetUser } from '../../Utils/storage.helper';
import { Screens } from '../../Utils/screens';
import { Config } from '../../Config/index'
import { Constants } from '../../Utils/constants';

const { width, height } = Dimensions.get('window');
const widthCarousel = width - (ApplicationStyles.marginHorizontal.marginHorizontal * 2);
// const dataTypeSort = ['Chọn lọc', 'Hàng mới', 'Bán chạy', 'Giảm giá nhiều', 'Giá thấp', 'Giá cao'];
const dataTypeSort = [Constants.DEFAULT, Constants.NEW_PRODUCT, Constants.LOW_PRICE, Constants.HIGHT_PRICE]

class BranchScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      carousel: [{ url: Images.promotion3}, { url: Images.promotion4}],
      isShowSort: false,
      isShowBranchSelect: false,
      typeShort: strings(`Branch.${Constants.DEFAULT}`),
      listTypeShort: dataTypeSort,
      products: [],
      productsDefault: [],
      categories: [],
      categoriesFilter: [],
      yButtonSort: 350,
      errorCode: '',
      listBranch: [],
      branchSelected: {},
      isEditing: false,
      isEditingBranch: false,
      rating: 0,
      priceFrom: '',
      priceTo: '',
      brandId: '',
      brandName: '',
      brandImage: '',
      refreshing: false,
      selectedCategory : {},
      isLoading: false
    }
    this.animated = new Animated.Value(0);
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const { errorCode, listBranch, products, categories, navigation } = nextProps;
    const { isEditing, isEditingBranch } = prevState;
    const { params } = navigation.state;
    const { brandId, brandName, brandImage, branchId } = params;
    let data = { errorCode, listBranch, categories, productsDefault: products, brandId, brandName, brandImage };
    data.products = [];
    let listProducts = [];
    if(listBranch.length > 0){
      // if (!isEditing) {
        products.forEach(item => {
          if (item.branchDefaultId != null) {
            listProducts = listProducts.concat(item);
          }
        });
        if (listProducts.length > 0) {
          data.products = listProducts; 
        }
      // }
    }
    if (!isEditing) {
      data.categories = categories;
    }
    if (!isEditingBranch) {
      if (listBranch.length > 0) {
        if (branchId) {
          const branchSelected = listBranch.filter(item => item.branchId === branchId);
          if (branchSelected.length > 0) {
            data.branchSelected = branchSelected[0];
          } else {
            data.branchSelected = listBranch[0]; 
          }
        } else {
          data.branchSelected = listBranch[0]; 
        }
      }
    }
    return data;
  }

  componentDidMount = () => {
    this.fetchBranch();
    const { categories, branchSelected, listBranch } = this.state;
    let categoryId = "";
    if(categories.length > 0){
      categoryId = categories[0].categoryId;
    }
    let branchId = "";
    if(branchSelected == null){
      branchId = listBranch[0].branchId;
    }else {
      branchId = branchSelected.branchId;
    }
    this.fetchProduct(branchId, categoryId , true);
  };

  fetchBranch = () => {
    const { branchActions, navigation } = this.props;
    const { params } = navigation.state;
    const { brandId } = this.state;
    if (brandId !== '') {
      branchActions.fetchBranch(brandId, params.branchId);
    }
  };

  handleFilterByCategories = categoryId => {
    this.handleProcessEdit('isEditing', true);
    let { categoriesFilter } = this.state;
    const { priceFrom, priceTo, rating } = this.state;
    if (categoriesFilter.includes(categoryId)) {
      categoriesFilter = categoriesFilter.filter(item => item !== categoryId);
    } else {
      categoriesFilter.push(categoryId);
    }
    this.setState({
      categoriesFilter,
    });
    this.handleFilterProducts(categoriesFilter, priceFrom, priceTo, rating);
  };

  handleFilterProducts = (categoriesFilter, priceFrom, priceTo, rating) => {
    const { productsDefault } = this.state;
    let products = JSON.parse(JSON.stringify(productsDefault));
    if (categoriesFilter.length > 0) {
      products = products.filter(item => categoriesFilter.some(cf => item.categoryId &&  item.categoryId !== null && item.categoryId.includes(cf)));
    }

    if (rating > 0) {
      products = products.filter(item => {
        const ratingProduct = item.rating !== null && item.rating.totalPoint ? item.rating.totalPoint : 0;
        if (ratingProduct >= rating) return item;
      });
    }

    if (priceFrom !== '') {
      products = products.filter(item => item.defaultPrice >= priceFrom);
    }

    if (priceTo !== '') {
      products = products.filter(item => item.defaultPrice <= priceTo);
    }

    this.setState({
      products,
    });

    return products;
  }

  onRefresh = () => {
    const { branchSelected, brandId } = this.state;
    const { priceFrom, priceTo, rating, typeShort } = this.props;
    const { branchActions } = this.props;
      if (brandId !== '' && branchSelected && branchSelected.branchId) {
        this.handleProcessEdit('isEditing', false);
        branchActions.fetchBranch(brandId, branchSelected.branchId);
        this.handleProcessEdit('isEditing', true);
      }
    this.handleFilterSortProducts(priceFrom, priceTo, rating, typeShort);
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

  handleFilterSortProducts = (priceFrom, priceTo, rating, typeShort) => {
    const { categoriesActions } = this.props;
    const { selectedCategory, branchSelected, listBranch } = this.state;
    let branchId = "";
    if(branchSelected == null){
      branchId = listBranch[0].branchId;
    }else {
      branchId = branchSelected.branchId;
    }
    let data = {
      searchType: ['product'],
      firstResult: 0,
      maxResult: 100,
      categoryId: [selectedCategory.categoryId],
      branchId
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
    const { priceFrom, priceTo, categoriesFilter, rating, typeShort } = this.state;
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
  };

  renderDrawer = () => {
    const { categories, categoriesFilter, products, rating, priceFrom, priceTo } = this.state;
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
                onPress={() => this.handleFilterByCategories(item.categoryId)
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

  handleScroll = () => {
    if (this.sortButton) {
      this.sortButton.measure((x, y, width, height, pageX, pageY) => {
        this.setState({
          yButtonSort: pageY - 50,
        })
      })
    }
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
          <Text green style={{marginRight: 10}}><Icon name="map-marker" size={20} /> 123 Xô Viết Nghệ Tĩnh, Đà Nẵng</Text>
          <Icon name="chevron-right" size={15} color={Colors.green} />
        </Block>
      </TouchableOpacity>
    );
  };

  handleShowBranchSelect = () => {
    this.setState({
      isShowBranchSelect: true,
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

  handleFavorites = () => {
    this.handleProcessEdit('isEditing', true);
    let { branchSelected } = this.state;
    const { userId, userActions } = this.props;
    const data = {
      customerId: userId,
      favoriteType: 'BRANCH',
      favoriteValue: branchSelected.branchId,
    }

    userService.favorites(data).then(response => {
      if (response.success) {
        branchSelected.isFavorite = response.data;
        this.setState({
          branchSelected,
        });
        userActions.fetchFavorites(userId);
      }
    }).catch(error => {});
  };

  renderBranchInfo = () => {
    const { navigation, userId } = this.props;
    const { params } = navigation.state;
    const { branchSelected, brandImage , isShowBranchSelect} = this.state;
    const imageUrl = `${Config.IMAGE_URL}${brandImage}`;
    
    return(
      <Block row space="between" style={Style.container}>
        <Image 
          source={{uri: imageUrl}}
          style={Style.branchImage}
        />
        <Block style={{marginLeft: 10}}>
          <Block flex={false} row center>
            <Text h3 bold style={{width: '90%'}}>
              {params.brandName ? params.brandName : ''}
            </Text>
            {userId && userId !== '' ? (
              <TouchableOpacity onPress={() => this.handleFavorites()}>
                <Icon
                  name="heart" size={25} 
                  color={branchSelected.isFavorite && branchSelected.isFavorite === 1 ? Colors.error : Colors.gray}
                />
              </TouchableOpacity>
            ) : null}
          </Block>
            <Text body gray >{params.title}</Text>
          <Text body gray  style={{ marginTop: 10 }} >{`${strings('Branch.chooseBranch')}:`}</Text>
          <TouchableOpacity style={Style.buttonSelectBranch} onPress={() => this.handleShowBranchSelect()}>
              <Text pink2 body style={{width:'90%'}}>
                {branchSelected.branchName ? branchSelected.branchName : ''}{' '}
              </Text> 
              <Text style={{width:'10%'}}>
                <Icon name={isShowBranchSelect ? 'angle-up' : 'angle-down'} size={23} color={Colors.green} />
              </Text>
          </TouchableOpacity>
        </Block>
      </Block>
    );
  };

  renderItemCarousel = ({item, index}) => {
    return (
      <Block flex={false} key={{index}}>
        <Image 
          source={item.url}  
          style={Style.itemCarousel}
        />
      </Block>
    );
  };

  renderCarousel = () => {
    const { carousel } = this.state;
    return (
      <Block flex={false} style={{...ApplicationStyles.marginHorizontal, marginTop: 10 }}>
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

  handlePressCategory = item => {
    const {listBranch, branchSelected} = this.state;
    this.setState({
      selectedCategory: item,
      typeShort: strings(`Branch.${Constants.DEFAULT}`),
      rating: 0,
      fromPrice: '',
      toPrice: ''
    })
    this.handleProcessEdit('isEditing', false);
    let branchId = "";
    if(branchSelected == null){
      branchId = listBranch[0].branchId;
    }else {
      branchId = branchSelected.branchId;
    }
    this.fetchProduct(branchId, item.categoryId, false);
    this.flatListCategories.scrollToIndex({ animated: true, index: 0 });
  };

  renderItemCategory = (item, index) => {
    const imageUrl = `${Config.IMAGE_URL}?uploadId=${item.imageUrl ? item.imageUrl : ''}&seq=1`;
    return (
      <Block center style={{ paddingHorizontal: 10, width: 80 , height:120}}>
        <TouchableOpacity onPress={() => this.handlePressCategory(item)}>
          <Image
            source={{uri: imageUrl}}
            style={Style.categoryImage}
          />
        </TouchableOpacity>
        <Text center green body numberOfLines={2} style={{fontSize:12}}>{item.categoryName}</Text>
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
      <Block flex={false} style={[Style.container, { height: 100 }]}>
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

  renderAction = () => {
    const { isShowSort , typeShort } = this.state;

    return (
      <Block flex={false} column>
          <Block flex={false}>
            {this.renderCategories()}
          </Block>
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
      </Block>
    );
  };
  
  renderRating = rating => {
    const htmlRating = [];
    for (let index = 0; index < 5; index++) {
      htmlRating.push(
        <MaterialIcons
          name="star"
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

  updateProduct = product => {
    this.handleProcessEdit('isEditing', true);
    let { products } = this.state;
    const indexProduct = products.findIndex(item => item.productId === product.productId && item.productCode === product.productCode);
    products[indexProduct] = product;
    this.setState({
      products,
    })
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
          this.setState({isLoading: false})
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
          this.setState({isLoading: false})
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

  renderProducts = () => {
    const { products } = this.state;
    const { navigation } = this.props;
    const chunkProducts = chunk(products, 2);
    const htmlProducts = [];
    chunkProducts.forEach((dataRow, index) => {
      const htmlRowProducts = [];
      dataRow.forEach((item, index) => {
        const productName = item.productName;
        const imageUrl = `${Config.IMAGE_URL}${item.imageUrl}`;
        const rating = item.rating !== null && item.rating.totalPoint ? item.rating.totalPoint : 0;
        const enabled = item.orderNumber && item.orderNumber > 0 ? true : false;
        const disabledMinus = item.orderNumber && item.orderNumber === 0 || !item.orderNumber ? true : false;
        const disabledAdd = item.orderNumber && item.orderNumber >=100 ? true : false;
        htmlRowProducts.push(
          <Block flex={false} style={{width: '50%', paddingHorizontal: 5}} key={`${index}1`}>
            <TouchableOpacity
              onPress={() => 
                navigation.navigate(Screens.PRODUCT_DETAIL, { productId: item.productId, productCode: item.productCode, branchId: item.branchDefaultId, goBackAction: 'updateProduct', 'updateProduct': this.updateProduct })}
            >
              <Image
                source={{uri: imageUrl}}
                style={Style.productImage}
              />
            </TouchableOpacity>
            <Text center body numberOfLines={1}>{productName}</Text>
            <Block flex={false} center>
              {this.renderRating(rating)}
            </Block>
            <Text center bold pink2><TextCurrency value={item.salePrice ? item.salePrice : 0} pink2></TextCurrency> đ</Text>
            <Block flex={false} center>
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
      });
      htmlProducts.push(
        <Block flex={false} row key={index}>
          {htmlRowProducts}
        </Block>
      )
    });

    return (
      <Block>
        {products.length > 0 ? (
          <Block flex={false} style={Style.container}>{htmlProducts}</Block>
          ) :(
          <Text>{}</Text>
        )}
      </Block>
    )
  };

  handleSelectBranch = index => {
    this.handleCloseBranchSelect();
    const { listBranch, categories, selectedCategory } = this.state;
    const { branchActions } = this.props;
    const branchSelected = listBranch[index];
    this.handleProcessEdit('isEditing', false);
    this.handleProcessEdit('isEditingBranch', true);
    this.setState({
      branchSelected,
      typeShort: strings(`Branch.${Constants.DEFAULT}`),
      rating: 0,
      categoriesFilter: [],
      priceFrom: '',
      priceTo: '',
    });
    let categoryId = "";
    if (selectedCategory && categories.length > 0) {
      categoryId = selectedCategory.categoryId;
    } else {
      if(categories.length > 0){
        categoryId = categories[0].categoryId;
      }
    }
    this.fetchProduct(branchSelected.branchId, categoryId , true);
    branchActions.fetchCategoriesBranch(branchSelected.branchId);
    
  };

  fetchProduct = (branchId, productCategoryId, isRoot) => {
    const { categoriesActions } = this.props;
    let data = {
      searchType: ['product'],
      firstresult: 0,
      maxresult: 100,
      branchId: branchId
    }
    
    if (!isRoot) data.categoryId = [productCategoryId];
    categoriesActions.fetchProductsByCategory(data);
  }

  renderListBranchSelect = () => {
    const { listBranch, branchSelected } = this.state;
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
              {branchSelected.branchId === item.branchId && <Icon name="check" size={15} color={Colors.green} />}
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
      [key]: process,
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

  render() {
    const {
      isShowSort , listTypeShort ,
      typeShort, yButtonSort, errorCode,
      isShowBranchSelect, brandName, refreshing, isLoading
    } = this.state;
    const { navigation, loading, loadingProductsCategory } = this.props;
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
          title={brandName}
          rightIcon={<Cart navigation={navigation} />}
          isShowBack
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
          <ScrollView
            onScroll={this.handleScroll}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => this.onRefresh()} 
              />
            }
          >
            {/* {this.renderLocation()} */}
            {this.renderBranchInfo()}
            {this.renderCarousel()}
            {this.renderAction()}
            {loading || loadingProductsCategory ? <Loading /> : this.renderProducts()}
          </ScrollView>
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

BranchScreen.defaultProps = {};

BranchScreen.propTypes = {
  userActions: PropTypes.object,
  branchActions: PropTypes.object,
  errorCode: PropTypes.string,
  listBranch: PropTypes.array,
  products: PropTypes.array,
  categories: PropTypes.array,
  favoritesActions: PropTypes.object,
  categoriesActions: PropTypes.object,
  dataCategory: PropTypes.object,
};

const mapStateToProps = (state) => ({
  listBranch: state.branch.listBranch,
  products: state.categories.products,
  loading: state.branch.loadingProducts,
  loadingProductsCategory: state.categories.loadingProductsCategory,
  errorCode: state.user.errorCode,
  userId: state.user.userId,
  language: state.user.language,
  total: state.cart.total,
  cart: state.cart.cart,
  categories: state.categories.categories,
})

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  branchActions: bindActionCreators(BranchActions, dispatch),
  cartActions: bindActionCreators(CartActions, dispatch),
  categoriesActions: bindActionCreators(CategoriesActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BranchScreen);

