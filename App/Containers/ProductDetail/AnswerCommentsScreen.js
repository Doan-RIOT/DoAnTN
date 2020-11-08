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
import { ProgressBar } from 'react-native-paper';
import { Badge } from 'react-native-paper';
import { strings } from '../../Locate/I18n';
import Style from './AnswerCommentsScreenStyle';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import { branchService } from '../../Services/BranchService';
import { resetUser } from '../../Utils/storage.helper';
import { Config } from '../../Config/index';
import { Screens } from '../../Utils/screens';

const { width, height } = Dimensions.get('window');
class AnswerCommentsScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errorCode: '',
      comment: {},
      product: {},
      answer: '',
      msgError: '',
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const { errorCode, navigation } = nextProps;
    const { comment, product } = navigation.state.params;
    let data = { errorCode, comment, product };

    return data;
  };

  componentDidMount = () => {
  }

  renderRating = (rating, size) => {
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

  renderComments = comment => {
    return (
      <Block flex={false} style={{marginTop: 5}}>
        {this.renderRating(comment.productRating ? comment.productRating : 0, 12)}
        <Block row space="between">
          <Text bold>{strings(`ProductDetail.title${comment.productRating}Star`)}</Text>
          <Text gray>{comment.createdDate ? comment.createdDate : ''}</Text>
        </Block>
        <Text gray>{comment.createdName ? comment.createdName : ''}</Text>
        <Text>{comment.comment ? comment.comment : ''}</Text>
      </Block>
    );
  };

  handleCreateAnswer = () => {
    const { comment, answer, product } = this.state
    const { navigation, language, userId } = this.props;
    const data = {
      parentCommentId: comment.commentId,
      productCode : product.productCode,
      productId: product.productId,
      comment: answer,
      createBy: userId,
    };
    branchService.createComment(data, language).then(response => {
      if (response.success) {
        navigation.navigate(Screens.PRODUCT_DETAIL, {rating: response.data});
      } else {
        this.setState({
          msgError: response.message,
        })
      }
    }).catch(error => {})
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
    const { comment, answer } = this.state
    return (
      <Block style={Style.view}>
        <Header 
          title={strings('AnswerComments.headerTitle')}
          isShowBack
          navigation={navigation}
        />
          <ScrollView>
            <Block flex={false} style={Style.container}>
              {this.renderComments(comment)}
            </Block>
            <Block flex={false} style={Style.container} row space="between">
              <Block flex={false} style={{width: '60%'}}>
                <Input
                  style={Style.input}
                  value={answer}
                  onChangeText={text => this.setState({
                    answer: text,
                  })}
                />
              </Block>
              <Block flex={false} style={{width: '35%'}}>
                <TouchableOpacity
                  style={[Style.writeComment, answer === '' ? {borderColor: Colors.gray} : {borderColor: Colors.green}]}
                  onPress={() => this.handleCreateAnswer()}
                  disabled={answer === ''}
                >
                  <Text body color={answer === '' ? Colors.gray : Colors.green} center>{strings('WriteComments.send')}</Text>
                </TouchableOpacity>
              </Block>
            </Block>
          </ScrollView>
      </Block>
    );
  }
}

AnswerCommentsScreen.defaultProps = {};

AnswerCommentsScreen.propTypes = {
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
)(AnswerCommentsScreen);

