import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Toast, { DURATION } from 'react-native-easy-toast';
import {
  Image, TouchableOpacity,
  FlatList, Dimensions,
  ScrollView
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {
  Button, Block,Text, BaseModal, Cart,
  Card, Header, Input, Picker, TextCurrency
} from "../../Components";
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIonic from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { PERMISSIONS, requestMultiple, checkMultiple, request } from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import { strings } from '../../Locate/I18n';
import Style from './WriteCommentsScreenStyle';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import { resetUser } from '../../Utils/storage.helper';
import { Config } from '../../Config/index';
import { Screens } from '../../Utils/screens';
import { Constants } from '../../Utils/constants';
import { branchService } from '../../Services/BranchService';
import { userService } from '../../Services/UserService';
const { width, height } = Dimensions.get('window');
const widthCarousel = width - (ApplicationStyles.marginHorizontal.marginHorizontal * 2);

class WriteCommentsScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rating: 0,
      comment: '',
      imageComments: [],
      product: {},
      msgError: '',
      isFromDetailsOrder: null,
      branchId: null,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const { errorCode, navigation } = nextProps;
    const { product, isFromDetailsOrder, branchId } = navigation.state.params;
    let data = { errorCode, product, isFromDetailsOrder };
    if (branchId) data.branchId = branchId;
    return data;
  };

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
  }

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
  }

  openCamera = async () => {
    let { imageComments } = this.state;
    if (imageComments.length < Constants.MAX_IMAGES_UPLOAD) {
      await this.requestPermission();
      const permissions = await this.checkPermission();
      if (permissions) {
        ImagePicker.openCamera({
          forceJpg: true,
          mediaType: 'photo',
        }).then(image => {
          if (image) {
            const name = image.path.replace(/^.*[\\\/]/, '');
            const imageSelect = { 
              uri: image.path,
              width: image.width,
              height: image.height,
              mime: image.mime,
              name,
            };
            this.setState({
              imageComments: imageComments.concat([imageSelect]),
            });
          }
        });
      }
    } else {
      this.setErrorsMaxImages();
    }
  };

  openPicker = async () => {
    let { imageComments } = this.state;
    if (imageComments.length < Constants.MAX_IMAGES_UPLOAD) {
      await this.requestPermission();
      const permissions = await this.checkPermission();
      if (permissions) {
        ImagePicker.openPicker({
          multiple: true,
          forceJpg: true,
          mediaType: 'photo',
        }).then(images => {
          if (images) {
            const imagesSelect = images.map(i => {
              const name = i.path.replace(/^.*[\\\/]/, '');
              return {
                uri: i.path,
                width: i.width,
                height: i.height,
                mime: i.mime,
                name,
              };
            })
            if ((imageComments.length + imagesSelect.length) <= Constants.MAX_IMAGES_UPLOAD) {
              this.setState({
                imageComments: imageComments.concat(imagesSelect),
              });
            } else {
              this.setErrorsMaxImages();
            }
          }
        });
      }
    } else {
      this.setErrorsMaxImages();
    }
  };

  setErrorsMaxImages = () => {
    this.refs.toastFailed.show(strings('WriteComments.msgErrorMaxImages'), DURATION.LENGTH_LONG)
  };

  renderRating = (rating, size) => {
    const htmlRating = [];
    for (let index = 0; index < 5; index++) {
      htmlRating.push(
        <TouchableOpacity
          style={{marginHorizontal: 5}}
          key={index}
          onPress={() => this.setState({rating: index + 1})}
        >
          <MaterialIcons
            name="star-half"
            name={index + 0.5 === rating ? 'star-half' : 'star'}
            size={size}
            key={index}
            color={(index + 0.5) <= rating ? Colors.tertiary : Colors.gray2} 
          />
        </TouchableOpacity>
      )
    }
    return (
      <Block flex={false} row>
        {htmlRating}
      </Block>
      );
  };

  handleDeleteImage = index => {
    let { imageComments } = this.state;
    imageComments.splice(index, 1);
    this.setState({
      imageComments,
    })
  };

  renderImageComments = () => {
    const { imageComments } = this.state;
    const html = []
   imageComments.forEach((item, index) => {
    html.push(
      <Block flex={false} style={{ marginTop: 10, marginRight: 10 }} key={index}>
        <Image
          style={Style.imageComments}
          source={item}
        />
        <TouchableOpacity
          style={Style.iconDeleteImage}
          onPress={() => this.handleDeleteImage(index)}
        >
          <Text center><Icon name="times" size={12} color={Colors.white} /></Text>
        </TouchableOpacity>
      </Block>
      )
    });
  
    return (
      <Block style={{ flex:1, flexDirection: 'row', flexWrap: 'wrap',}} row >
        {html}
      </Block>
    );
  }

  handleCreateComment = () => {
    this.setState({
      msgError: '',
    });
    const { comment, product, rating, imageComments } = this.state;
    const { language, userId } = this.props;
    let isError = false;
    if (rating === 0) {
      isError = true;
      this.setState({
        msgError: strings('WriteComments.msgErrorRating')
      })
      return
    }

    if (comment === '') {
      isError = true;
      this.setState({
        msgError: strings('WriteComments.msgErrorComment')
      })
      return
    }

    if (!isError) {
      let dataComments = {
        productId: product.productId,
        productCode : product.productCode,
        productRating: rating,
        comment,
        createBy: userId
      };

      if (imageComments.length > 0) {
        let dataImages = new FormData();
        imageComments.map((item, index) => {
          const image = {
            uri: item.uri,
            name: item.name,
            type: item.mime
          }
          dataImages.append('files', image);
        });
  
        userService.uploadImage(dataImages).then(response => {
          if (response.success) {
            const { data } = response;
            if (data && data !== null && data.length > 0) {
              dataComments.puploadId = data[0].uploadId;
              this.createComment(dataComments, language);
            }
          } else {
            this.refs.toastFailed.show(strings('WriteComments.msgCreateCommentFailed'), DURATION.LENGTH_LONG);
          }
        }).catch(error => this.refs.toastFailed.show(strings('WriteComments.msgCreateCommentFailed'), DURATION.LENGTH_LONG));
      } else {
        this.createComment(dataComments, language);
      }
    }
  };

  createComment = (data, language) => {
    const { navigation } = this.props;
    const { product, isFromDetailsOrder, branchId } = this.state;
    const { productId, productCode } = product;
    branchService.createComment(data, language).then(response => {
      if (response.success) {
        if (isFromDetailsOrder) {
          navigation.navigate(Screens.PRODUCT_DETAIL, { productId, productCode, branchId })
        } else {
          navigation.navigate(Screens.PRODUCT_DETAIL, { rating: response.data })
        }
      } else {
        this.setState({
          msgError: response.message,
        })
      }
    }).catch(error => this.refs.toastFailed.show(strings('WriteComments.msgCreateCommentFailed'), DURATION.LENGTH_LONG));
  }

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
    const { rating, product, msgError, comment } = this.state;
    return (
      <Block style={Style.view}>
        <Header 
          title={strings('ProductDetail.writeComment')}
          isShowBack
          navigation={navigation}
          rightIcon={
            <TouchableOpacity
              style={Style.btnOnSave}
              onPress={() => this.handleCreateComment()}
            >
              <Text white bold>
                  {strings('WriteComments.send')}
              </Text>
            </TouchableOpacity>
          }
        />
          <ScrollView>
            <Block row center space="between" style={Style.container}>
              <Image 
                source={{ uri: `${Config.IMAGE_URL}${product.imageUrl}` }}
                style={Style.imageProduct}
              />
              <Block>
                <Text green h3>{product.productName}</Text>
                <Text numberOfLines={3}>{product.productDescription}</Text>
              </Block>
            </Block>
            <Block style={Style.container}>
              <Block row>
                <TouchableOpacity
                  style={{marginVertical: 10}}
                  onPress={() => this.openCamera()}
                >
                  <Icon name="camera" size={30} color={Colors.green} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginVertical: 10, marginLeft: 10}}
                  onPress={() => this.openPicker()}
                >
                  <Icon name="folder-open" size={30} color={Colors.green} />
                </TouchableOpacity>
              </Block>
              <Text h3 center>{strings('WriteComments.title')}</Text>
              <Block center style={{marginVertical: 10}}>
                {this.renderRating(rating, 40)}
              </Block>
              <Text error center>{msgError}</Text>
              <Input
                value={comment}
                placeholder={strings('WriteComments.placeholderComment')}
                style={[Style.input, { height: 200 }]}
                multiline
                onChangeText={text => this.setState({
                  comment: text,
                })}
              />
              
              {this.renderImageComments()}
              {/* <TouchableOpacity
                style={Style.writeComment}
                onPress={() => this.handleCreateComment()}
              >
                <Text h3 green center>{strings('WriteComments.send')}</Text>
              </TouchableOpacity> */}
            </Block>
          </ScrollView>
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

WriteCommentsScreen.defaultProps = {};

WriteCommentsScreen.propTypes = {
  errorCode: PropTypes.string,
  language: PropTypes.string,
  userId: PropTypes.string,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  language: state.user.language,
  userId: state.user.userId,
})

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WriteCommentsScreen);
