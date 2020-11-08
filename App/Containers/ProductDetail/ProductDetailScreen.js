import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Toast, { DURATION } from 'react-native-easy-toast';
import {
  Image, TouchableOpacity,
  FlatList, Dimensions,
  ScrollView, RefreshControl,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { userService } from '../../Services/UserService';
import { cartService } from '../../Services/CartService';
import {
  Button, Block,Text, Cart,
  Card, Header, Input, Picker, TextCurrency, Loading, BaseModal
} from "../../Components";
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIonic from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ProgressBar } from 'react-native-paper';
import { Badge } from 'react-native-paper';
import { strings } from '../../Locate/I18n';
import Style from './ProductDetailScreenStyle';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import CartActions from '../../Stores/Cart/Actions';
import UserActions from '../../Stores/User/Actions';
import { branchService } from '../../Services/BranchService';
import { resetUser } from '../../Utils/storage.helper';
import { Config } from '../../Config/index';
import { Screens } from '../../Utils/screens';
import { Constants } from '../../Utils/constants';
import { chunk, textTruncate } from '../../Utils/commonFunction';
import HTML from 'react-native-render-html';
const { width, height } = Dimensions.get('window');
const widthCarousel = width - (ApplicationStyles.marginHorizontal.marginHorizontal * 2);
class ProductDetailScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      carousel: [{ url: Images.product2}, { url: Images.product3}, { url: Images.product4}, { url: Images.product5}],
      indexActive: 0,
      comment: [],
      product: {},
      loading: true,
      refreshing: false,
      isOpen: false,
      infoPromotion : {}
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const { errorCode, navigation } = nextProps;
    let { product } = prevState;
    const { rating } = navigation.state.params;
    let data = { errorCode };
    if (rating) {
      product.rating = rating;
      data.product = product;
    }
    return data;
  };

  componentDidMount = () => {
    this.fetchProductById();
  };

  fetchProductById = () => {
    const { language, navigation } = this.props;
    const { productId, productCode, branchId } = navigation.state.params;
    if (productId) {
      branchService.fetchProductById(productId, productCode, branchId, language).then(response => {
        const data  = response.data && data !== null ? response.data : {};
        this.setState({
          loading: false,
          product: data
        })
      }).catch(error => {
        this.setState({
          product: {},
          loading: false
        })
      });
    }
  };

  renderCenterHeader = () => {
    return (
      <Input
        // value={noted}
        style={Style.input}
        onFocus={()=> this.setState({
          isShowSort: false
        })}
        onChangeText={text => this.handleChange(text, 'noted')}
        rightLabel={
          <Icon
            name="search"
            style={Style.searchIcon}
            size={20}
            onPress={() => {}}
          />
        }
      />
    );
  };

  handleScrollView = index => {
    this.flatListImage.scrollToIndex({ animated: true, index });
    this.setState({
      indexActive: index
    })
  };

  renderItemCarousel = ({item, index}) => {
    const { navigation } = this.props;
    const { product } = this.state;
    const imageZoom = product.additionalImageUrl ? product.additionalImageUrl : [];
    const imageUrl = `${Config.IMAGE_URL}${item}`;
    return (
      <Block flex={false} key={{index}}>
        <TouchableOpacity onPress={() => navigation.navigate(Screens.IMAGE_PRODUCT_ZOOM, { imageZoom, index })}>
          <Image 
            source={{ uri: imageUrl }}  
            style={Style.itemCarousel}
          />
        </TouchableOpacity>
      </Block>
    );
  };

  renderItem = (item, index) => {
    const { indexActive } = this.state;
    const imageUrl = `${Config.IMAGE_URL}${item}`;

    return (
      <TouchableOpacity style={indexActive === index ? { borderColor: Colors.green, borderWidth: 1} : null} onPress={() => this.handleClickImageChild(index)}>
        <Image 
          source={{ uri: imageUrl }}  
          style={Style.imageChild}
        />
      </TouchableOpacity>
    );
  };

  handleClickImageChild = index => {
    this.carouselImage.snapToItem (index);
    this.setState({
      indexActive: index
    })
  };

  renderCarousel = () => {
    const { product } = this.state;
    const carousel = product.additionalImageUrl ? product.additionalImageUrl : [];
    return (
      <Block flex={false} style={{...ApplicationStyles.marginHorizontal}}>
        <Carousel
          data={carousel}
          renderItem={this.renderItemCarousel}
          sliderWidth={widthCarousel}
          itemWidth={widthCarousel}
          onSnapToItem={index => this.handleScrollView(index)}
          ref={ref => this.carouselImage = ref}
        />
        <FlatList
          horizontal
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          data={carousel}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({item, index}) => this.renderItem(item, index)}
          ref={ref => this.flatListImage = ref }
          style={{ marginTop: 10 }}
        />
      </Block>
    );
  };

  renderRating = (rating, size) => {
    const htmlRating = [];
    for (let index = 0; index < 5; index++) {
      htmlRating.push(
        <MaterialIcons
          name="star"
          name={index + 0.5 === rating ? 'star-half' : 'star'}
          size={size}
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

  handleOrderNumber = isAdd => {
    let { product } = this.state;
    let orderNumber = product.orderNumber ? product.orderNumber : 0;
    if (isAdd) {
      orderNumber += 1;
      product.orderNumber = orderNumber;
    } else {
      orderNumber = orderNumber > 0 ? orderNumber -= 1 : 0;
      product.orderNumber = orderNumber;
    }
    this.setState({
      product,
    });
  };

  handleInputOrderNumber = orderNumber => {
    const tmp = orderNumber ? orderNumber : 0;
    let { product } = this.state;
    product.orderNumber = parseInt(tmp);
    this.setState({
      product,
    })
  };

  handleAddToCart = () => {
    let { product } = this.state;
    const { cartActions, userId } = this.props;
    cartActions.addToCart(JSON.parse(JSON.stringify(product)), userId);
    product.orderNumber = 0;
    this.setState({
      product,
    })
  };

  handleFavorites = () => {
    let { product } = this.state;
    const { userId, userActions } = this.props;
    const data = {
      customerId: userId,
      favoriteType: 'PRODUCT',
      favoriteValue: product.productId,
      favoriteSubValue: product.productCode,
      productOfBranch: product.branchDefaultId,
    }

    userService.favorites(data).then(response => {
      if (response.success) {
        product.isFavorite = response.data;
        this.setState({
          product,
        });
        userActions.fetchFavorites(userId);
      }
    }).catch(error => {});
  };

  handleBuyNow = async() =>{
    let { product } = this.state;
    if(product && product.orderNumber > 0){
      const {navigation, cartActions, userId, language} = this.props;
      await cartActions.addToCart(JSON.parse(JSON.stringify(product)), userId);
      const { cart } = this.props;
      if(cart){
        if (userId && userId !== '') {
          cartService.createOrders(cart, language).then(response => {
            if (response.success) {
              product.orderNumber = 0;
              const data = response.data && response.data !== null ? response.data : {};
              const totalProduct = data.totalProduct ? data.totalProduct : 0;
              cartActions.setDataToCart(data, totalProduct, userId);
              navigation.navigate(Screens.CART);
            }
          }).catch(error =>{});
        } else {
          cartService.createOrdersAnonymous(cart, language).then(response => {
            if (response.success) {
              product.orderNumber = 0;
              const data = response.data && response.data !== null ? response.data : {};
              const totalProduct = data.totalProduct ? data.totalProduct : 0;
              cartActions.setDataToCart(data, totalProduct, '');
              navigation.navigate(Screens.CART);
            }
          }).catch(error =>{});
        }
      }
    }else {
      this.refs.toastFailed.show(strings('Branch.msgBuyNowFailed'), DURATION.LENGTH_LONG);
    }
  }

  handleConfirm = ({item}) => {
    this.setState({
      isOpen: true,
      infoPromotion: item
    })
  };

  renderBodyModalPromotion = () => {
    const {infoPromotion} = this.state;
    return (
      <Block column >
        <Block row >
            <Text body gray style={Style.titlePromotion}>{strings('ProductDetail.promotionName')}</Text>
            <Text body style={Style.contentPromotion}>{infoPromotion.promotionName ? infoPromotion.promotionName : ""}</Text>
        </Block>
        <Block row >
            <Text body gray style={Style.titlePromotion}>{strings('ProductDetail.promotionDateStart')}</Text>
            <Text body style={Style.contentPromotion}>{infoPromotion.dateStart ? infoPromotion.dateStart : ""}</Text>
        </Block>
        <Block row >
            <Text body gray style={Style.titlePromotion}>{strings('ProductDetail.promotionDateEnd')}</Text>
            <Text body style={Style.contentPromotion}>{infoPromotion.dateEnd ? infoPromotion.dateEnd : ""}</Text>
        </Block>
        <Block row >
            <Text body gray style={Style.titlePromotion}>{strings('ProductDetail.promotionDes')}</Text>
            <Text body style={Style.contentPromotion}>{infoPromotion.promotionDes ? infoPromotion.promotionDes : ""}</Text>
        </Block>
      </Block>
    );
  }

  handleCloseModal = () => {
    this.setState({
      isOpen: false,
    })
  }

  renderProductOverView = () => {
    const { product } = this.state;
    const { userId } = this.props;
    const rating = product.rating && product.rating !== null && product.rating.totalPoint ? product.rating.totalPoint : 0;
    const enabled = product.orderNumber && product.orderNumber > 0 ? true : false;
    const promotion = product.promotion ? product.promotion : [];
    let htmlPromotion = [];
    if (promotion.length > 0) {
      promotion.forEach(item => {
        htmlPromotion.push(
          <TouchableOpacity key={item.promotionId} onPress={() => this.handleConfirm({item})}>
              <Text error style={Style.textPromotion}
              >
                {item.promotionName ? item.promotionName : ''}
              </Text>
          </TouchableOpacity> 
        )
      });
    }
    const disabledMinus = product.orderNumber && product.orderNumber === 0 || !product.orderNumber ? true : false;
    const disabledAdd = product.orderNumber && product.orderNumber >= 100 ? true : false;
    return (
      <Block flex={false} style={Style.container}>
        <Text h3 bold green>
          <TextCurrency green h3 value={product.salePrice ? product.salePrice : 0} /> đ
        </Text>
        <Text h3 bold>{product.productName ? product.productName : ''}</Text>
        <Text h3 gray>{`${strings('ProductDetail.brand')}: ${product.brandName ? product.brandName : ''}`}</Text>
        <Text h3 green style={{marginBottom: 5}}>
          {`${strings('ProductDetail.provider')}: ${product.branchName ? product.branchName : ''}`}<Text h3 green style={{textDecorationLine : 'underline'}}>{product.address ? ` - ${product.address}` : ''}</Text>
        </Text>
        {this.renderRating(rating, 20)}
        {promotion.length > 0 && (
          <Block center row style={{marginTop: 5}}>
            <Icon name="gift" size={30} color={Colors.error} />
            <Block style={{marginLeft: 10}}>
              {htmlPromotion}
            </Block>
          </Block>
        )}
        <Block center row>
          <Button
            style={Style.button}
            onPress={() => this.handleOrderNumber(false)}
            disabled={disabledMinus}
          >
            <Text center><Icon name="minus" size={10} color={disabledMinus ? Colors.gray : Colors.black} /></Text>
          </Button>
          <Input
            value={product.orderNumber ? (product.orderNumber).toString() : '0'}
            style={[Style.button, { width: 50, marginTop: 5 }]}
            onChangeText={orderNumber => this.handleInputOrderNumber(orderNumber)}
            number
            textAlign={'center'}
          />
          <Button
            style={Style.button}
            onPress={() => this.handleOrderNumber(true)}
            disabled={disabledAdd}
          >
            <Text center><Icon name="plus" size={10} color={disabledAdd ? Colors.gray : Colors.black} /></Text>
          </Button>
          <Button
            style={[Style.button, {marginLeft: 15, borderWidth: 0}]}
            disabled={!enabled}
            onPress={() => this.handleAddToCart()}
          >
            <Text center>
              <Icon name="cart-plus" size={40} color={enabled ? Colors.green : Colors.gray} />
            </Text>
          </Button>
          {userId && userId !== '' ? (
            <TouchableOpacity
              onPress={() => this.handleFavorites()}
              style={{ marginLeft: 15 }}
            >
              <Icon
                name="heart" size={30} 
                color={product.isFavorite && product.isFavorite === 1 ? Colors.error : Colors.gray}
              />
            </TouchableOpacity>
          ) : null}
          <Button
            style={Style.buttonBuyNow}
            disabled={!enabled}
            onPress={() => this.handleBuyNow()}
          >
            <Text bold center white>{strings("Branch.buyNow")}</Text>
          </Button>
        </Block>
      </Block>
    );
  };

  renderProductInfo = () => {
    const {product} = this.state;
    return (
      <Block flex={false} style={Style.container}>
        <Text h3 bold>{strings('ProductDetail.productInfo')}</Text>
        <Block row>
          <Block flex={false} style={{width: '30%'}}>
            {product.tradeMark ? (
              <Text body>{strings('ProductDetail.tradeMark')}</Text>
            ): null}
            {product.unit ? (
              <Text body>{strings('ProductDetail.unit')}</Text>
            ): null}
            {product.guarantee ? (
              <Text body>{strings('ProductDetail.guarantee')}</Text>
            ): null}
            {product.origin ? (
              <Text body>{strings('ProductDetail.origin')}</Text>
            ) : null}
            {product.expireDate ? (
               <Text body gray>{strings('ProductDetail.expireDate')}</Text>
            ): null}
          </Block>
          <Block flex={false} style={{width: '70%'}}>
            {product.tradeMark ? (
              <Text body>{product.tradeMark}</Text>
            ): null}
            {product.unit ? (
              <Text body>{product.unit}</Text>
            ): null}
            {product.guarantee ? (
              <Text body>{product.guarantee} {strings('ProductDetail.month')}</Text>
            ): null}
            {product.origin ? (
              <Text body>{product.origin}</Text>
            ) : null}
            {product.expireDate ? (
              <Text body>{product.expireDate}</Text>
            ): null}
          </Block>
        </Block>
      </Block>
    );
  };

  renderProductDescription = () => {
    const { product } = this.state;
    const { imageUrl } = product;
    const {navigation} = this.props;
    return (
      <Block flex={false} style={Style.container}>
        <Text h3 bold>{strings('ProductDetail.productDes')}</Text>
        {product && product.longDescription != null ? (
            <Block>
                  <HTML html={textTruncate(product.longDescription, 200)}/>
                 {imageUrl && (
                  <Image
                    source={{ uri: `${Config.IMAGE_URL}${imageUrl}`}}
                    style={Style.itemCarousel}
                  />
                  )}
               <TouchableOpacity onPress={()=> navigation.navigate(Screens.PRODUCT_DESCRIPTION, {product})}>
                  <Text center green>
                    {strings('ProductDetail.readAll')}
                    {' '}<Icon name="chevron-right" size={10} color={Colors.green} />
                  </Text>
              </TouchableOpacity>
            </Block>
        ):(
            <Text center>{strings('ProductDetail.notInfoDescription')}</Text>
        )}
      </Block>
    );
  };

  showViewImageComment = imageComments => {
    const { navigation } = this.props;
    navigation.navigate(Screens.IMAGE_COMMENTS, { imageComments });
  }

  renderImagesComments = imageComments => {
    let htmlImageComments = [];
    if (imageComments.length > 0) {
      const tempImageComments = imageComments.slice(0, 12);
      const chunkImageComments = chunk(tempImageComments, 6);
      chunkImageComments.forEach((rows, index) => {
        let htmlRowImageComments = [];
        rows.forEach((item, index) => {
          const imageUrl = `${Config.IMAGE_URL}${item}`;
          htmlRowImageComments.push(
            <TouchableOpacity
              key={index}
              onPress={() => this.showViewImageComment(imageComments)}
              style={{marginVertical: 5, marginHorizontal: 5}}
            >
              <Image 
                source={{uri: imageUrl}}  
                style={Style.imageComments}
              />
            </TouchableOpacity>
          )
        })
        htmlImageComments.push(
          <Block row key={index}>
            {htmlRowImageComments}
          </Block>
        );
      });
    }
    

    return (
      <Block flex={false} style={Style.imageCommentsContainer}>
        <Text h3 bold>{`${strings('ProductDetail.allImage')} (${imageComments.length})`}</Text>
        {htmlImageComments}
        {imageComments.length > 12 && (
          <TouchableOpacity onPress={() => this.showViewImageComment(imageComments)}>
            <Text h3 green>{strings('ProductDetail.readAllImage')}</Text>
          </TouchableOpacity>
        )}
      </Block>
    );
  };

  renderComments = comment => {
    const { navigation } = this.props;
    const { product } = this.state;
    const { rating } = product;
    let htmlComments = [];
    if (comment.length > 0) {
      const tempComments = comment.slice(0, 5);
      tempComments.forEach((item, index) => {
        const htmlComment = (
          <Block key={index} style={Style.comment}>
            {this.renderRating(item.productRating ? item.productRating : 0, 15)}
            <Block row space="between">
              <Text bold>{strings(`ProductDetail.title${item.productRating}Star`)}</Text>
              <Text gray>{item.createdDate ? item.createdDate : ''}</Text>
            </Block>
            <Text gray>{item.createdName ? item.createdName : ''}</Text>
            <Text>{item.comment ? item.comment : ''}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(Screens.ANSWER_COMMENT, {comment: item, product})}
            >
              <Text green>{strings('ProductDetail.sendAnswer')}</Text>
            </TouchableOpacity>
          </Block>
        );
        htmlComments.push(htmlComment);
      })
    }

    return (
      <Block flex={false} style={{marginTop: 5}}>
        {htmlComments}
        <TouchableOpacity style={Style.comment} onPress={() => navigation.navigate(Screens.ALL_COMMENTS, { product, rating })}>
          <Text h3 green>{`${strings('ProductDetail.readAll')} ${comment.length} ${strings('ProductDetail.comment')}`}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={Style.writeComment}
          onPress={() => navigation.navigate(Screens.WRITE_COMMENTS, { product, isFromDetailsOrder: false })}
        >
          <Text h3 green center>{strings('ProductDetail.writeComment')}</Text>
        </TouchableOpacity>
      </Block>
    );
  };

  renderProductReviews = () => {
    const { navigation } = this.props;
    const { product } = this.state;
    const { rating } = product;
    const imageComments = rating && rating.imageUrl && rating.imageUrl !== null ? rating.imageUrl : [];
    const comment = rating && rating !== null && rating.comment ? rating.comment : []
    return (
      <Block flex={false} style={Style.container}>
        <Block row space="between">
          <Text h3 bold>{strings('ProductDetail.rating')}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(Screens.ALL_COMMENTS, { product, rating }
            )}
          >
            <Text h3 green>{strings('ProductDetail.readAll')}</Text>
          </TouchableOpacity>
        </Block>
        <Block center row>
          <Block flex={false} style={{width: '40%'}} center>
            <Text bold style={{fontSize: 40}}>
              {`${rating && rating !== null && rating.totalPoint ? rating.totalPoint : 0}/5`}
            </Text>
            {this.renderRating(rating && rating !== null && rating.totalPoint ? rating.totalPoint : 0, 20)}
            <Text>{`${rating && rating !== null && rating.countTotal ? rating.countTotal : 0} ${strings('ProductDetail.comment')}`}</Text>
          </Block>
          <Block flex={false} center style={{width: '60%'}}>
            <Block flex={false} row space="between" center>
              {this.renderRating(5, 15)}
              <Block style={Style.progress}>
                <ProgressBar progress={rating && rating !== null && rating.count5 ? rating.count5 / 100 : 0} color={Colors.gray} />
              </Block>
              <Text caption gray>{rating && rating !== null && rating.count5 ? rating.count5 : 0}</Text>
            </Block>
            <Block flex={false} row space="between" center>
              {this.renderRating(4, 15)}
              <Block style={Style.progress}>
                <ProgressBar progress={rating && rating !== null && rating.count4 ? rating.count4 / 100 : 0} color={Colors.gray} />
              </Block>
              <Text caption gray>{rating && rating !== null && rating.count4 ? rating.count4 : 0}</Text>
            </Block>
            <Block flex={false} row space="between" center>
              {this.renderRating(3, 15)}
              <Block style={Style.progress}>
                <ProgressBar progress={rating && rating !== null && rating.count3 ? rating.count3 / 100 : 0} color={Colors.gray} />
              </Block>
              <Text caption gray>{rating && rating !== null && rating.count3 ? rating.count3 : 0}</Text>
            </Block>
            <Block flex={false} row space="between" center>
              {this.renderRating(2, 15)}
              <Block style={Style.progress}>
                <ProgressBar progress={rating && rating !== null && rating.count2 ? rating.count2 / 100 : 0} color={Colors.gray} />
              </Block>
              <Text caption gray>{rating && rating !== null && rating.count2 ? rating.count2 : 0}</Text>
            </Block>
            <Block flex={false} row space="between" center>
              {this.renderRating(1, 15)}
              <Block style={Style.progress}>
                <ProgressBar progress={rating && rating !== null && rating.count1 ? rating.count1 / 100 : 0} color={Colors.gray} />
              </Block>
              <Text caption gray>{rating && rating !== null && rating.count1 ? rating.count1 : 0}</Text>
            </Block>
          </Block>
        </Block>
        {this.renderImagesComments(imageComments)}
        {this.renderComments(comment)}
      </Block>
    );
  };

  renderCenterHeader = () => {
    const { navigation } = this.props;
    return (
      <Block row center right>
        <Icon
          name="search"
          style={{ marginHorizontal: 10 }}
          size={25}
          color={Colors.white}
          onPress={() => {
            navigation.navigate(Screens.SEARCH)
          }}
        />
        <Icon
          name="home"
          size={30}
          color={Colors.white}
          onPress={() => {
            navigation.navigate(Screens.HOME)
          }}
        />
      </Block>
    );
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
    const { goBackAction } = navigation.state.params;
    const { loading, product, refreshing } = this.state;
    return (
      <Block style={Style.view}>
        <Header 
          rightIcon={<Cart navigation={navigation} />}
          centerHeader={this.renderCenterHeader()}
          isShowBack
          navigation={navigation}
          goBackAction={goBackAction}
          goBackData={product}
        />
          {loading ? <Loading /> : (
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => this.fetchProductById()} 
                />
              }
            >
              {this.renderCarousel()}
              {this.renderProductOverView()}
              {this.renderProductInfo()}
              {this.renderProductDescription()}
              {this.renderProductReviews()}
            </ScrollView>
          )}
          <BaseModal 
            isOpen={this.state.isOpen}
            title={strings("ProductDetail.titlePromotion")}
            bodyModal={this.renderBodyModalPromotion}
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

ProductDetailScreen.defaultProps = {};

ProductDetailScreen.propTypes = {
  userId: PropTypes.string,
  errorCode: PropTypes.string,
  language: PropTypes.string,
  address: PropTypes.array,
  userActions: PropTypes.object,
};

const mapStateToProps = (state) => ({
  userId: state.user.userId,
  errorCode: state.user.errorCode,
  language: state.user.language,
  address: state.user.address,
  total: state.cart.total,
  cart: state.cart.cart,
})

const mapDispatchToProps = (dispatch) => ({
  cartActions: bindActionCreators(CartActions, dispatch),
  userActions: bindActionCreators(UserActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductDetailScreen);
