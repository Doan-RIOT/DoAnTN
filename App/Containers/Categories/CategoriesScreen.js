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
import styles from './CategoriesScreenStyle';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import { chunk } from '../../Utils/commonFunction';
import { resetUser } from '../../Utils/storage.helper';
import { Screens } from '../../Utils/screens';
import { Config } from '../../Config/index'
import { Constants } from '../../Utils/constants';
import moment from 'moment';
const { width, height } = Dimensions.get('window');
const dataTypeSort = [Constants.DEFAULT, Constants.NEW_PRODUCT, Constants.LOW_PRICE, Constants.HIGHT_PRICE];

class CategoriesScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Index: 0,
      refreshing: false,
      card: [1, 2, 3, 4],
      cards: {},
      typeCode: 'barCode',
      scrollY: new Animated.Value(0),
      listProjectFinished:[]
    }
  }
  componentDidMount() {
    const { categoriesActions} = this.props
    categoriesActions.fetchProjectFinished();
  }
  UNSAFE_componentWillUpdate (nextProps) {
    const {projectFinished}=this.props
    if(nextProps.projectFinished!==projectFinished){
      this.setState({listProjectFinished:nextProps.projectFinished})
    }
  }
  renderItemProject(item) {
    const { navigation } = this.props;
    var image = item.images[0]
    var url = Config.API_URL
    if(image){
      image=image.replace("http://localhost:3000",url)
    }
    return (
      <TouchableOpacity key={item._id} style={styles.container}
      onPress={() => navigation.navigate(Screens.PROJECT, item)}
      >
        <Image style={styles.image} source={{ uri: image?image:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1778&q=80" }} />
        <Block style={styles.summary}>
          <Text h1 >{item.name} </Text>
          <Block row flex={false} style={styles.timePlan}>
            <Block center>
              <Text h3 bold>Bắt đầu</Text>
              <Text h3 bold>{moment(item.planStartDate).format('DD/MM/YYYY')}</Text>
            </Block>
            <Block center>
              <Text h3 bold>Kết thúc</Text>
              <Text h3 bold>{moment(item.planStartDate+(item.estimatedTime*30*24*60*60*1000)).format('DD/MM/YYYY')}</Text>
            </Block>
          </Block>
          <Block flex={false} style={styles.progress}>
            <Text h3 bold>Tiến độ</Text>
            {this.renderSlidePhase()}
          </Block>
        </Block>
        <Block flex={false} row style={styles.statistical}>
          <Block  color={"#B8CEC9"} style={{ borderRadius: 5,paddingHorizontal:20}}>
            <Block center middle flex={false} >
              <Text h2 bold color={Colors.catalinaBlue}>Dự toán</Text>
            </Block>
            <Block center middle row flex={false} style={{ paddingVertical: 5 }}>
              <Image style={{marginLeft: 5 }} source={Images.iconLand}></Image>
              <Block center middle row style={{ justifyContent: 'space-between', marginLeft: 10 }}>
                <Text h3 bold color={Colors.catalinaBlue}> Quy mô</Text>
                <Text h3 bold color={Colors.catalinaBlue}>{item.minimalScale} {item.standardUnit}</Text>
              </Block>
            </Block>
            <Block flex={false} style={styles.line}></Block>
            <Block center middle row flex={false} style={{ paddingVertical: 5 }}>
              <Image style={{marginLeft: 5 }} source={Images.iconSanLuong}></Image>
              <Block center middle row style={{ justifyContent: 'space-between', marginLeft: 10 }}>
                <Text h3 bold color={Colors.catalinaBlue}> Chi phí</Text>
                <Block row flex={false} >
                  <TextCurrency h3 bold color={Colors.catalinaBlue} value={item.estimatedCost} />
                  <Text h3 bold color={Colors.catalinaBlue}> vnđ</Text>
                </Block>
              </Block>
            </Block>
            <Block flex={false} style={styles.line}></Block>
            <Block center middle row flex={false} style={{ paddingVertical: 5 }}>
              <Image style={{marginLeft: 5 }} source={Images.iconInvest}></Image>
              <Block center middle row style={{ justifyContent: 'space-between', marginLeft: 10 }}>
                <Text h3 bold color={Colors.catalinaBlue}>Sản lượng</Text>
                <Text h3 bold color={Colors.catalinaBlue}>{item.estimatedQuantity} kg</Text>
              </Block>
            </Block>
            <Block flex={false} style={styles.line}></Block>
            <Block center middle row flex={false} style={{ paddingVertical: 5 }}>
              <Image source={Images.iconMoney}></Image>
              <Block center middle row style={{ justifyContent: 'space-between', marginLeft: 10 }}>
                <Text h3 bold color={Colors.catalinaBlue}>Lợi nhuận</Text>
                <Block row flex={false} >
                  <TextCurrency h3 bold color={Colors.catalinaBlue} value={item.unitPrice * item.estimatedQuantity - item.estimatedCost } />
                  <Text h3 bold color={Colors.catalinaBlue}> vnđ</Text>
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
      </TouchableOpacity>
    );
  }
  renderProject() {
    const data = this.state.listProjectFinished;
    return (
      <Block center style={{ marginTop: 60 }}>
        {data.map((item) => this.renderItemProject(item))}
      </Block>
    );
  }
  renderSlidePhase = () => {
    const summary = ["Thống kê", "Dự toán", "Điều kiện",];
    const process = ["Giai đoạn 1", "Giai đoạn 2", "Giai đoạn 3", "Giai đoạn 4", "Giai đoạn 5",];
    const summaryProcess = summary.concat(process);
    summaryProcess.push("Kết thúc")
    return (
      <Block flex={false}  >
        <FlatList
          horizontal
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          data={summaryProcess}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => this.renderItemSlidePhase(item, index)}
        ></FlatList>
      </Block>
    )
  }
  renderItemSlidePhase = (item, index) => {
    const { Index } = this.state
    return (
      <TouchableOpacity style={{ marginVertical: 5, marginHorizontal: 5 }}
        onPress={() => this.handleIndexContentProcess(index)}
      >
        <Block flex={false} center middle style={[styles.renderItemSlidePhase, Index === index ? { backgroundColor: "#0A9F9E" } : { backgroundColor: "white" },]} >
          <Text color={Colors.catalinaBlue} bold h3>{item}</Text>
        </Block>
      </TouchableOpacity>
    )
  }
  handleIndexContentProcess = Index => {
    this.setState({
      Index
    });
    // console.log(this.state.Index)
  }
  render() {
    const diffClamp = Animated.diffClamp(this.state.scrollY, 0, 45)
    const headerTranslate = diffClamp.interpolate({
      inputRange: [0, 45],
      outputRange: [0, -60],
      extrapolate: 'clamp',
    });
    return (
      <Block style={{}}>
        <ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
          )}>
          {this.renderProject()}
        </ScrollView>
        <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslate }] }]}  >
          <Header
            title={'Dự án đã hoàn thành'}
          >
          </Header>
        </Animated.View>
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
  projectFinished: state.categories.ListProjectFinished
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

