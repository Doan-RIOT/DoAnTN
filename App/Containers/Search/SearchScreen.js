import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import {
  Image, TouchableOpacity, FlatList, Dimensions,
  Animated, ScrollView, TouchableWithoutFeedback
} from 'react-native';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import UserActions from '../../Stores/User/Actions';
import {
  Button, Block,Text, BaseModal, Cart,
  Card, Header, Input, Picker, TextCurrency, InputCurrency, Loading
} from "../../Components";
import IconIonic from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { searchService } from '../../Services/SearchService';
import { strings } from '../../Locate/I18n';
import Style from './SearchScreenStyle';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import { chunk } from '../../Utils/commonFunction';
import { resetUser } from '../../Utils/storage.helper';
import { Screens } from '../../Utils/screens';
import { Config } from '../../Config/index'
import { Constants } from '../../Utils/constants';
const { width, height } = Dimensions.get('window');
const dataTypeSort = [Constants.DEFAULT, Constants.NEW_PRODUCT, Constants.LOW_PRICE, Constants.HIGHT_PRICE];

class SearchScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowSort: false,
      isShowBranchSelect: false,
      typeShort: strings(`Branch.${Constants.DEFAULT}`),
      listTypeShort: dataTypeSort,
      keyword: '',
      firstResult: 0,
      maxResult: 50,
      isShowSuggestion: true,
      brand: [],
      totalBrand: 0,
      products: [],
      totalProducts: 0,
      errorCode: '',
      loadingBrand: false,
      loading: false,
      yButtonSort: 200,
      listBranch: [],
      isEditing: false,
      isShowAction: false,
      categoriesFilter: [],
      rating: 0,
      priceFrom: '',
      priceTo: '',
      categories: [],
      productSelect: {}
    }
    this.animated = new Animated.Value(0);
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const { errorCode } = nextProps;
    let data = { errorCode };
    return data;
  }

  componentDidMount = () => {};

  renderDrawer = () => {
    const { categories, products, rating, priceFrom, priceTo, categoriesFilter } = this.state;
    let htmlCategories = [];
    if (categories.length > 0) {
      const tempCategories = chunk(categories, 2);
      tempCategories.forEach((rowItem, index) => {
        let htmlRowCategories = []
        rowItem.forEach(item => {
          htmlRowCategories.push(
            <Block flex={false} middle key={item.productCategoryId} style={{width: '49%'}}>
              <TouchableOpacity
                style={[Style.categories, categoriesFilter.includes(item.productCategoryId) ? Style.categoriesSelect : null]}
                onPress={() => this.handleFilterByCategories(item.productCategoryId)
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
            <Text h3 bold>{strings('Branch.listCategories')}</Text>
            {htmlCategories}
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
              {categoriesFilter.length === 0 && priceFrom === '' && priceTo === '' && rating === 0 ? strings('Home.closeFilter') : `${strings('Home.viewMore')} ${products.length} ${strings('Branch.product')}`}
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

  handleSearch = () => {
    const { keyword, firstResult, maxResult } = this.state;
    this.setState({
      typeShort: strings(`Branch.${Constants.DEFAULT}`),
      categoriesFilter: [],
      rating: 0,
      priceFrom: '',
      priceTo: ''
    });
    if (keyword && keyword.trim() !== '') {
      const data = {
        searchType: ['brand', 'product', 'category'],
        keyword,
        firstResult: firstResult,
        maxResult: maxResult,
      }
      this.search(data, false);
    }
  };
  
  renderCenterHeader = () => {
    const { navigation } = this.props;
    const { keyword } = this.state;
    return (
      <Input
        value={keyword}
        style={Style.input}
        onChangeText={keyword => {
          this.setState({
            keyword,
            isShowSuggestion: false,
          })
        }}
        rightLabel={
          <Icon
            name="search"
            style={Style.searchIcon}
            size={20}
            onPress={() => {}}
          />
        }
        autoFocus
        onBlur={() => this.handleSearch()}
      />
    );
  }

  renderSuggestion = () => {
    return (
      <Block>
        <Block style={Style.suggestion}>
          <Block flex={false} row>
            <IconIonic name="md-flame" size={20} color={Colors.error} />
            <Text h3 bold style={{ marginLeft: 20 }}>{strings('Search.hotKey')}</Text>
          </Block>
          <Block row style={Style.hotKeyContent}>
            <TouchableOpacity>
              <Text body style={Style.hotKey}>trà sữa</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text body style={Style.hotKey}>tai nghe bluetooth</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text body style={Style.hotKey}>khẩu trang</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text body style={Style.hotKey}>giày nam</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text body style={Style.hotKey}>giày nữ</Text>
            </TouchableOpacity>
          </Block>
        </Block>
        <Block style={[Style.suggestion, {marginTop: 10}]}>
          <Block flex={false} row space="between">
            <Text h3 >{strings('Search.searchHistories')}</Text>
            <TouchableOpacity>
              <Text h3 green>{strings('Search.delete')}</Text>
            </TouchableOpacity>
          </Block>
          <Block>
            <ScrollView>
              <TouchableOpacity style={{ marginTop: 10 }}>
                <Block flex={false} row center space="between">
                  <Text body>trà sữa</Text>
                  <IconIonic name="md-arrow-back" size={25} style={{transform: [{ rotate: '45deg'}]}} />
                </Block>
              </TouchableOpacity>
              <TouchableOpacity style={{marginTop: 10}}>
                <Block flex={false} row center space="between">
                  <Text body>khẩu trang</Text>
                  <IconIonic name="md-arrow-back" size={25} style={{transform: [{ rotate: '45deg'}]}} />
                </Block>
              </TouchableOpacity>
            </ScrollView>
          </Block>
        </Block>
      </Block>
    );
  }

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
    const { categoriesFilter, priceFrom, priceTo, rating, typeShort } = this.state;
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
            onBlur={() => this.handleFilterSortProducts(categoriesFilter, priceFrom, priceTo, rating, typeShort)}
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
            onBlur={() => this.handleFilterSortProducts(categoriesFilter, priceFrom, priceTo, rating, typeShort)}
          />
        </Block>
      </Block>
    )
  };

  handleCancelFilter = (isCancel, isClose) => {
    if (isCancel) {
      const { typeShort } = this.state;
      this.setState({
        categoriesFilter: [],
        rating: 0,
        priceFrom: '',
        priceTo: ''
      });
      this.handleFilterSortProducts('', '', 0, typeShort);
    }
    if (isClose) this.drawer.closeDrawer();
  };

  handleFilterByCategories = categoryId => {
    let { categoriesFilter } = this.state;
    const { priceFrom, priceTo, rating, typeShort } = this.state;
    if (categoriesFilter.includes(categoryId)) {
      categoriesFilter = categoriesFilter.filter(item => item !== categoryId);
    } else {
      categoriesFilter.push(categoryId);
    }
    this.setState({
      categoriesFilter,
    });
    this.handleFilterSortProducts(categoriesFilter, priceFrom, priceTo, rating, typeShort);
  };

  handleFilterByRating = rating => {
    const { categoriesFilter, priceFrom, priceTo, typeShort} = this.state;
    this.setState({
      rating,
    });

    this.handleFilterSortProducts(categoriesFilter, priceFrom, priceTo, rating, typeShort);
  }

  handleFilterSortProducts = (categoriesFilter, priceFrom, priceTo, rating, typeShort) => {
    const { firstResult, maxResult, keyword } = this.state;
    let data = {
      searchType: ['product', 'category'],
      firstResult: firstResult,
      maxResult: maxResult,
      keyword,
    };
      
    if (categoriesFilter && categoriesFilter.length > 0) 
      data.categoryId = categoriesFilter;

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

    this.search(data, true);
  }

  search = (data, isFilter) => {
    const { language } = this.props;
    this.setState({
      loading: true,
    });
    if (!isFilter) this.setState({
      loadingBrand: true,
    })
    searchService.search(data, language).then(response => {
      if (response.success && response.data && data !== null) {
        const { brand, product, category } = response.data;
        if (!isFilter) {
          this.setState({
            categories: category ? category : [],
            brand: brand.brand ? brand.brand : [],
            totalBrand: brand.totalRecord ? brand.totalRecord : 0,
          })
        }
        this.setState({
          products: product.product,
          totalProducts: product.totalRecord,
        })
      }
      this.setState({
        loading: false,
        isShowAction: true,
      });
      if (!isFilter) this.setState({
        loadingBrand: false,
      })
    }).catch(error => {
      this.setState({
        loading: false
      });
    })
  };

  renderItemBrand = (item, index) => {
    const { navigation } = this.props;
    const data = {
      brandName: item.brandName,
      brandId: item.brandId,
      brandImage: item.imageUrl,
    }
    const imageUrl = `${Config.IMAGE_URL}${item.imageUrl}`;
    return (
      <Block center style={{ paddingHorizontal: 10, width: 120 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate(Screens.BRANCH, data)}
        >
          <Image
            source={{uri: imageUrl}}
            style={Style.brandImage}
          />
        </TouchableOpacity>
        <Text center green body numberOfLines={2}>{item.brandName}</Text>
      </Block>
    )
  };

  renderBrands = () => {
    const { brand } = this.state;

    return (
      <Block flex={false} style={[Style.container, { height: 130 }]}>
        <FlatList
          horizontal
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          data={brand}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({item, index}) => this.renderItemBrand(item, index)}
          ref={ref => this.flatListCategories = ref }
        />
      </Block>
    );
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

  handleSelectBranch = index => {
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

  renderItemProduct = item => {
    const { navigation } = this.props;
    const rating = item.rating !== null && item.rating.totalPoint ? item.rating.totalPoint : 0;

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
            source={{ uri: `${Config.IMAGE_URL}${item.imageUrl}`}}
            style={Style.productImage}
          />
        </TouchableOpacity>
        <Text body>{item.productName}</Text>
        <Text gray body>{item.branchName} - {item.branchAddress}</Text>
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
              <IconIonic name="ios-arrow-forward" size={10} style={{marginLeft: 10}} color={Colors.green} />
            </Block>
          </TouchableOpacity>
        ): null}
      </Block>
    )
  };

  renderProducts = loading => {
    const { products } = this.state;
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
        />
      )}
      </Block>
    );
  }

  handleSortProducts = (item) => {
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
      isShowSuggestion, isShowBranchSelect,
      products, brand, loading, loadingBrand,
      totalBrand, totalProducts, isShowAction,
    } = this.state;
    const { navigation } = this.props;
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
      <Block style={Style.view} onPress={() => alert('xxx')}>
        <Header 
          centerHeader={this.renderCenterHeader()}
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
          {isShowSuggestion && this.renderSuggestion()}
          {loading && loadingBrand ? <Loading /> : null}
          {brand.length > 0 && (
            <Text green style={{ marginTop: 5, marginLeft: 10 }}>
              {`${strings('Search.listBrand')}(${totalBrand ? totalBrand : ''})`}
            </Text>
          )}
          {brand.length > 0 && this.renderBrands()}
          {isShowAction && this.renderAction()}
          {products.length > 0 && (
            <Text green style={{ marginTop: 5, marginLeft: 10 }}>{`${strings('Search.listProduct')}(${totalProducts ? totalProducts : ''})`}</Text>
          )}
          {products.length > 0 && this.renderProducts(loading)}
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
          {isShowBranchSelect ? this.renderListBranchSelect() : null}
        </DrawerLayout>
      </Block>
    );
  }
}

SearchScreen.defaultProps = {};

SearchScreen.propTypes = {
  errorCode: PropTypes.string,
  language: PropTypes.string,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  language: state.user.language,
})

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchScreen);
