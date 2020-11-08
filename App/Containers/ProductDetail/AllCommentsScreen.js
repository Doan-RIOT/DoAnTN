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
import IconIonic from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ProgressBar } from 'react-native-paper';
import { Badge } from 'react-native-paper';
import { strings } from '../../Locate/I18n';
import Style from './AllCommentsScreenStyle';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import { resetUser } from '../../Utils/storage.helper';
import { Config } from '../../Config/index';
import { Screens } from '../../Utils/screens';
import { Constants } from '../../Utils/constants';
import { chunk } from '../../Utils/commonFunction';

const { width, height } = Dimensions.get('window');
const widthCarousel = width - (ApplicationStyles.marginHorizontal.marginHorizontal * 2);

class AllCommentsScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageComments: [{ url: Images.product2}, { url: Images.product3}, { url: Images.product4}, { url: Images.product5}],
      errorCode: '',
      comment: [],
      rating: {},
      product: {},
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const { errorCode, navigation } = nextProps;
    const { isEditing } = prevState;
    const { rating, product } = navigation.state.params;
    let data = { errorCode, rating, product };
    return data;
  };

  componentDidMount = () => {
  }

  renderRating = (rating, size) => {
    const htmlRating = [];
    for (let index = 0; index < 5; index++) {
      htmlRating.push(
        <MaterialIcons
          name="ios-star-half"
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
    const { navigation } =  this.props;
    const { product } = this.state;
    let htmlComments = [];
    if (comment.length > 0) {
      comment.forEach((item, index) => {
        const { childComment } = item;
        const htmlAnswers= [];
        if (childComment.length > 0) {
          childComment.forEach((childItem, index) => {
            const htmlAnswer = (
              <Block key={index} style={{paddingVertical: 5}}>
                <Text>{childItem.comment ? childItem.comment : ''}</Text>
                <Text gray>
                  {`${childItem.createdName ? childItem.createdName : ''} - ${childItem.createdDate ? childItem.createdDate : ''}`}
                </Text>
              </Block>
            )
            htmlAnswers.push(htmlAnswer);
          });
        }

        const htmlComment = (
          <Block key={index} style={Style.comment}>
            {this.renderRating(item.productRating ? item.productRating : 0, 12)}
            <Block row space="between">
              <Text bold>{strings(`ProductDetail.title${item.productRating}Star`)}</Text>
              <Text gray>{item.createdDate ? item.createdDate : ''}</Text>
            </Block>
            <Text gray>{item.createdName ? item.createdName : ''}</Text>
            <Text>{item.comment ? item.comment : ''}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(Screens.ANSWER_COMMENT, { comment: item, product })}
            >
              <Text green>{strings('ProductDetail.sendAnswer')}</Text>
            </TouchableOpacity>
            <Block style={{paddingLeft: 20}}>
              {htmlAnswers}
            </Block>
          </Block>
        );
        htmlComments.push(htmlComment);
      })
    }

    return (
      <Block flex={false} style={{marginTop: 5}}>
        {htmlComments}
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
    const { rating } = this.state;
    const comment = rating !== null && rating.comment ? rating.comment : [];
    const imageComments = rating && rating.imageUrl && rating.imageUrl !== null ? rating.imageUrl : [];
    return (
      <Block flex={false} style={Style.container}>
        <Block row space="between">
          <Text h3 bold>{strings('ProductDetail.rating')}</Text>
        </Block>
        <Block center row>
          <Block flex={false} style={{width: '40%'}} center>
            <Text bold style={{fontSize: 40}}>
              {`${rating !== null && rating.totalPoint ? rating.totalPoint : 0}/5`}
            </Text>
            {this.renderRating(rating !== null && rating.totalPoint ? rating.totalPoint : 0, 17)}
            <Text>{`${rating !== null && rating.countTotal ? rating.countTotal : 0} ${strings('ProductDetail.comment')}`}</Text>
          </Block>
          <Block flex={false} center style={{width: '60%'}}>
            <Block flex={false} row space="between" center>
              {this.renderRating(5, 12)}
              <Block style={Style.progress}>
                <ProgressBar progress={rating !== null && rating.count5 ? rating.count5 / 100 : 0} color={Colors.gray} />
              </Block>
              <Text caption gray>{rating !== null && rating.count5 ? rating.count5 : 0}</Text>
            </Block>
            <Block flex={false} row space="between" center>
              {this.renderRating(4, 12)}
              <Block style={Style.progress}>
                <ProgressBar progress={rating !== null && rating.count4 ? rating.count4 / 100 : 0} color={Colors.gray} />
              </Block>
              <Text caption gray>{rating !== null && rating.count4 ? rating.count4 : 0}</Text>
            </Block>
            <Block flex={false} row space="between" center>
              {this.renderRating(3, 12)}
              <Block style={Style.progress}>
                <ProgressBar progress={rating !== null && rating.count3 ? rating.count3 / 100 : 0} color={Colors.gray} />
              </Block>
              <Text caption gray>{rating !== null && rating.count3 ? rating.count3 : 0}</Text>
            </Block>
            <Block flex={false} row space="between" center>
              {this.renderRating(2, 12)}
              <Block style={Style.progress}>
                <ProgressBar progress={rating !== null && rating.count2 ? rating.count2 / 100 : 0} color={Colors.gray} />
              </Block>
              <Text caption gray>{rating !== null && rating.count2 ? rating.count2 : 0}</Text>
            </Block>
            <Block flex={false} row space="between" center>
              {this.renderRating(1, 12)}
              <Block style={Style.progress}>
                <ProgressBar progress={rating !== null && rating.count1 ? rating.count1 / 100 : 0} color={Colors.gray} />
              </Block>
              <Text caption gray>{rating !== null && rating.count1 ? rating.count1 : 0}</Text>
            </Block>
          </Block>
        </Block>
        {this.renderImagesComments(imageComments)}
        {this.renderComments(comment)}
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
    return (
      <Block style={Style.view}>
        <Header 
          title={strings('AllComments.headerTitle')}
          isShowBack
          navigation={navigation}
        />
          <ScrollView>
            {this.renderProductReviews()}
          </ScrollView>
      </Block>
    );
  }
}

AllCommentsScreen.defaultProps = {};

AllCommentsScreen.propTypes = {
  errorCode: PropTypes.string,
  language: PropTypes.string,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  language: state.user.language,
})

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AllCommentsScreen);

