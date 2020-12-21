import React, { Component } from 'react';
import { FlatList, Image, TouchableOpacity, ImageBackground, ScrollView, Animated, Dimensions, RefreshControl, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import { Screens } from '../../Utils/screens';
import {
  Button, Block, BaseModal, Cart, TextCurrency,
  Card, Header, Input, Picker, Loading, Text,
} from "../../Components";
import { Title } from 'react-native-paper';
import styles from './ProjectDetailScreenStyle'
import { strings } from '../../Locate/I18n';
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale'
import Carousel from 'react-native-snap-carousel';
//redux
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes, { number, string } from 'prop-types';
import ProcessActions from '../../Stores/Process/Actions';
import { Config } from '../../Config';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import Swipeout from 'react-native-swipeout';
import { Directions } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { cardsService } from '../../Services/CardsService';
import Toast, { DURATION } from 'react-native-easy-toast';
import CategoriesActions from '../../Stores/Categories/Actions';
import CardsActions from '../../Stores/Card/Actions';
import {
  getToken,
  getUserName,
  getPassword,
  resetUser,
} from "../../Utils/storage.helper";
const { width } = Dimensions.get('window');
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const widthCarousel = width - (ApplicationStyles.marginHorizontal.marginHorizontal * 2);
class ProjectDetailScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Index: 0,
      scrollY: new Animated.Value(0),
      ProcessDetail: [],
      carousel: [],
      planStartDate: 0,
      time: [],
      carouselBackUp: [
        { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80" },
        { url: "https://images.unsplash.com/photo-1451440063999-77a8b2960d2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80" }
      ],
      updateTask: null,
      isOpen: false,
      isVisible: false,
      startDay: "",
      refreshing: false,
      dataProjectUpdate: {},
      endPhaseSlide: 0
    }
  }
  componentDidMount() {
    const { params } = this.props.navigation.state;
    const idProcess = params._id;
    const { processActions } = this.props;
    processActions.fetchProcessDetail(idProcess);
    const { carousel } = this.state
    this.setState({ planStartDate: params.planStartDate })
    //carousel
    var images = params.images
    var url = Config.API_URL
    if (images) {
      for (var i = 0; i < images.length; i++) {
        images[i] = images[i].replace("http://localhost:3000", url);
        carousel.push({ url: images[i] });
        this.setState({ carousel })
      }
    }
  }
  UNSAFE_componentWillUpdate(nextProps) {
    const { processDetail } = this.props
    if (nextProps.processDetail !== processDetail) {
      this.setState({ ProcessDetail: nextProps.processDetail })
    }
  }
  renderItemCarousel = ({ item, index }) => {
    return (
      <Block center middle flex={false} key={index}>
        <Image
          source={{ uri: item.url }}
          style={styles.itemCarousel}
        />
      </Block>
    );
  }
  renderCarousel = () => {
    const { carousel, carouselBackUp } = this.state;
    var data = null
    if (carousel[0] === undefined) {
      data = carouselBackUp
    } else {
      data = carousel
    }
    return (
      <Block flex={false} style={{ marginHorizontal: 10, marginTop: 2 }}>
        <Carousel
          data={data}
          renderItem={this.renderItemCarousel}
          loop={true}
          autoplay={true}
          sliderWidth={widthCarousel}
          itemWidth={widthCarousel}
          autoplayInterval={4000}
        />
      </Block>
    );
  };
  renderSlidePhase = () => {
    const summary = ["Thống kê", "Dự toán", "Điều kiện",];
    const process = [];
    const { phases } = this.state.ProcessDetail
    if (phases) {
      for (var i = 0; i < phases.length; i++) {
        process.push(`Giai đoạn ${i + 1}`);
      }
    }
    const summaryProcess = summary.concat(process);
    summaryProcess.push("Kết thúc")
    return (
      <Block flex={false} style={{ height: 100 }} >
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
      <TouchableOpacity style={{ marginVertical: 10, marginHorizontal: 5 }}
        onPress={() => this.handleIndexContentProcess(index)}
      >
        <Block flex={false} center middle style={[styles.renderItemSlidePhase, Index === index ? { backgroundColor: "#0A9F9E" } : { backgroundColor: "white" },]} >
          <Text color={Colors.catalinaBlue} bold h3>{item}</Text>
        </Block>
      </TouchableOpacity>
    )
  }
  renderBodyModal = () => {
    const { navigation } = this.props;
    return (
      <Block>
        <Button
          green
          onPress={() => {
            this.handleCloseModal();
            navigation.navigate(Screens.LOGIN)
          }}
        >
          <Text bold white center>
            {strings('Login.login')}
          </Text>
        </Button>
        <Button
          green
          onPress={() => {
            this.handleCloseModal();
            navigation.navigate(Screens.SIGNUP)
          }}
        >
          <Text bold white center>
            {strings('Login.signUp')}
          </Text>
        </Button>
      </Block>
    );
  };
  handleCloseModal = () => {
    this.setState({
      isOpen: false,
    })
  };
  handleIndexContentProcess = Index => {
    console.log('index', Index)
    this.setState({
      Index
    });
    // console.log(this.state.Index)
  }
  renderItemQuestion = (item) => {
    return (
      <Block key={item.id} flex={false} style={{ paddingHorizontal: 17, backgroundColor: "#E7F8FD", borderRadius: 10, paddingVertical: 10, marginBottom: 10 }}>
        <Text h3 bold color={Colors.catalinaBlue}>{item.name}</Text>
        <Text h3 color={Colors.catalinaBlue} >{item.content}</Text>
        <Block flex={false} style={styles.line}></Block>
        <Block row center flex={false} >
          <TouchableOpacity>
            <Block row center middle flex={false} style={{ height: 40, width: 40 }}>
              <Image source={Images.iconLike} style={{ resizeMode: 'stretch', height: 17, width: 17 }}></Image>
              <Text h3 bold color={Colors.catalinaBlue} style={{ marginLeft: 10 }}>{item.like}</Text>
            </Block>
          </TouchableOpacity>
          <TouchableOpacity>
            <Block row center middle flex={false} style={{ height: 40, width: 40, marginLeft: 30 }}>
              <Image source={Images.iconComment} style={{ resizeMode: 'stretch', height: 17, width: 17 }}></Image>
              <Text h3 bold color={Colors.catalinaBlue} style={{ marginLeft: 10 }}>{item.comment}</Text>
            </Block>
          </TouchableOpacity>
        </Block>
      </Block>
    )
  }
  renderSummaryProcess(item) {
    return (
      <Block flex={false} style={styles.summaryContent}>
        <Block center flex={false} style={styles.summaryContentItem}>
          <Block flex={false}><Image source={Images.iconLand}></Image></Block>
          <Block row style={{ justifyContent: 'space-between' }}>
            <Text h3 style={styles.Title_summary}>Diện tích canh tác:</Text>
            <Text h3 bold style={styles.Title_summary}>{item.minimalScale} {item.standardUnit}</Text>
          </Block>
        </Block>
        <Block flex={false} style={styles.lineSummary}></Block>
        <Block center flex={false} style={styles.summaryContentItem}>
          <Block flex={false}><Image source={Images.iconCalendar}></Image></Block>
          <Block row style={{ justifyContent: 'space-between' }}>
            <Text h3 style={styles.Title_summary}>{strings('HomeFarm.executionTime')}:</Text>
            <Text h3 bold style={styles.Title_summary}>{item.estimatedTime} {item.estimatedTimeUnit}</Text>
          </Block>
        </Block>
        <Block flex={false} style={styles.lineSummary}></Block>
        <Block center flex={false} style={styles.summaryContentItem}>
          <Block flex={false}><Image source={Images.iconSanLuong}></Image></Block>
          <Block row style={{ justifyContent: 'space-between' }}>
            <Text h3 style={styles.Title_summary}>{strings('HomeFarm.quantity')}:</Text>
            <Text h3 bold style={styles.Title_summary}>{item.estimatedQuantity} kg</Text>
          </Block>
        </Block>
        <Block flex={false} style={styles.lineSummary}></Block>
        <Block center flex={false} style={styles.summaryContentItem}>
          <Block flex={false}><Image source={Images.iconInvest}></Image></Block>
          <Block row style={{ justifyContent: 'space-between' }}>
            <Text h3 style={styles.Title_summary}>{strings('HomeFarm.investmentCosts')}:</Text>
            <Block row flex={false} >
              <TextCurrency h3 bold color={Colors.catalinaBlue} value={item.estimatedCost} />
              <Text h3 bold color={Colors.catalinaBlue}> vnđ</Text>
            </Block>
          </Block>
        </Block>
        <Block flex={false} style={styles.lineSummary}></Block>
        <Block center flex={false} style={styles.summaryContentItem}>
          <Block flex={false}><Image source={Images.iconMoney}></Image></Block>
          <Block row style={{ justifyContent: 'space-between' }}>
            <Text h3 style={styles.Title_summary}>{strings('HomeFarm.profit')}:</Text>
            <Block row flex={false} >
              <TextCurrency h3 bold color={Colors.catalinaBlue} value={item.unitPrice * item.estimatedQuantity - item.estimatedCost} />
              <Text h3 bold color={Colors.catalinaBlue}> vnđ</Text>
            </Block>
          </Block>
        </Block>
      </Block>
    );
  }
  renderQuestions = () => {
    const listQuestion = [
      { "id": 1, "name": "Cách phòng bệnh đạo ôn", "content": "Trung bình mỗi vụ lúa xuân hàng năm Nghệ An có từ 6000 - 7000 ha lúa bị bệnh đạo ôn lá, đạo ôn cổ bông, làm thất thiệt 10.000 - 11.000 tấn lúa. Riêng vụ xuân năm 2018 do có hàng ngàn ha lúa bị bệnh đạo ôn cổ bông nên mức độ thất thiệt là đến gần 100.000 tấn lúa.", "like": "10", "comment": "100" },
      { "id": 2, "name": "Cách phòng bệnh đạo ôn", "content": "Trung bình mỗi vụ lúa xuân hàng năm Nghệ An có từ 6000 - 7000 ha lúa bị bệnh đạo ôn lá, đạo ôn cổ bông, làm thất thiệt 10.000 - 11.000 tấn lúa. Riêng vụ xuân năm 2018 do có hàng ngàn ha lúa bị bệnh đạo ôn cổ bông nên mức độ thất thiệt là đến gần 100.000 tấn lúa.", "like": "10", "comment": "100" },
      { "id": 3, "name": "Cách phòng bệnh đạo ôn", "content": "Trung bình mỗi vụ lúa xuân hàng năm Nghệ An có từ 6000 - 7000 ha lúa bị bệnh đạo ôn lá, đạo ôn cổ bông, làm thất thiệt 10.000 - 11.000 tấn lúa. Riêng vụ xuân năm 2018 do có hàng ngàn ha lúa bị bệnh đạo ôn cổ bông nên mức độ thất thiệt là đến gần 100.000 tấn lúa.", "like": "10", "comment": "100" }
    ]
    return (
      <Block>
        {listQuestion.map((item) => this.renderItemQuestion(item))}
      </Block>
    )
  }
  renderImagePicker = () => {
    const options = {
      title: 'Chọn ảnh',
      cancelButtonTitle: "Thoát",
      takePhotoButtonTitle: "Chụp ảnh",
      chooseFromLibraryButtonTitle: "Chọn ảnh từ thư viện",
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // const source = { };
        this.setState({
          imageDataUpdate: response.data,
          dataImage: response
        });
      }
    });
  }
  showDatePicker = () => {
    this.setDatePickerVisibility(true);
  };

  hideDatePicker = () => {
    this.setDatePickerVisibility(false);
  };
  handleConfirm = birthDate => {
    this.hideDatePicker();
    let { ProcessDetail } = this.state

    ProcessDetail.planStartDate = Date.parse(birthDate);
    this.setState({
      ProcessDetail
    })
  };

  setDatePickerVisibility = isVisible => {
    this.setState({
      isVisible,
    })
  };
  handleChange = (value, key) => {
    let { ProcessDetail } = this.state;
    ProcessDetail[key] = value;
    this.setState({
      ProcessDetail
    })
  }
  handleUpdateProject = async () => {
    const { params } = this.props.navigation.state;
    const idProcess = params._id;
    const { processActions } = this.props;
    const token = await getToken();
    let { ProcessDetail } = this.state;
    console.log('ud', ProcessDetail.address)
    console.log('udd', ProcessDetail.planStartDate)
    let dataUpdate = {
      "_id": ProcessDetail._id,
      "planStartDate": ProcessDetail.planStartDate,
      "address": ProcessDetail.address
    }
    console.log('update', dataUpdate)
    if (token) {
      try {
        cardsService.updateProject(dataUpdate, token)
          .then(response => {
            if (response) {
              console.log('update done', response)
              // processActions.fetchProcessDetail(idProcess);
              processActions.fetchProcessDetail(idProcess);
              this.refs.toastSuccess.show('Cập nhật thành công', DURATION.LENGTH_LONG);
            } else {
              console.log('err1')
            }
          });
      } catch (error) {
        console.log('err2')
      }
    }
  }
  renderStatistical = () => {
    const { params } = this.props.navigation.state;
    const { ProcessDetail } = this.state
    var images = ProcessDetail.images
    var url = Config.API_URL
    var imageproject = null
    if (images) {
      for (var i = 0; i < images.length; i++) {
        images[i] = images[i].replace("http://localhost:3000", url);
        imageproject = images[0]
      }
    }
    console.log('ProcessDetail', ProcessDetail)
    return (
      <Block center flex={false} style={styles.statistical}>
        <Block flex={false} style={styles.summaryProcess} >
          {this.renderSummaryProcess(params)}
        </Block>
        <Block flex={false} style={styles.chart}>
          <Block flex={false} row center style={{ marginVertical: 15, justifyContent: 'space-between' }} >
            <Text h2 bold>Cập nhật thông tin</Text>
            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: "center", borderWidth: 1, borderColor: 'green', borderRadius: 5 }}
              onPress={() => this.handleUpdateProject()}
            >
              <Text h3 bold style={{ marginLeft: 5, paddingHorizontal: 5 }} color={"#26C165"} >Cập nhật</Text>
            </TouchableOpacity>
          </Block>
          <TouchableOpacity onPress={() => this.showDatePicker()}>
            <Input
              label={'Thơi gian bắt đầu'}
              value={ProcessDetail.planStartDate !== '' ? moment(ProcessDetail.planStartDate).format('DD/MM/YYYY') : null}
              style={styles.input}
              labelStyle={{ fontSize: 20, color: Colors.catalinaBlue }}
              onChangeText={text => this.handleChange(text, 'planStartDate')}
              rightLabel={
                <Icon
                  name="calendar"
                  style={{ position: 'absolute', marginTop: 30 }}
                  size={30}
                  onPress={() => this.showDatePicker()}
                />
              }
              editable={false}
            />
          </TouchableOpacity>
          <Block flex={false} style={{ marginTop: 10 }}>
            <Input
              label={'Địa chỉ canh tác'}
              labelStyle={{ fontSize: 20, color: Colors.catalinaBlue }}
              style={[styles.input]}
              value={ProcessDetail && ProcessDetail.address ? ProcessDetail.address : ''}
              onChangeText={text => this.handleChange(text, 'address')}
            />
          </Block>
          <Block flex={false} style={{ marginTop: 10, width: "100%" }}>
            <Block row flex={false} style={{ justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 20, color: Colors.catalinaBlue }}>Cập nhật hình ảnh: </Text>
              <TouchableOpacity
                onPress={() => this.renderImagePicker()}
              >
                <Image source={Images.iconAwesomeCamera}></Image>
              </TouchableOpacity>
            </Block>
            <Block flex={false} style={{ height: 200, marginVertical: 10, borderColor: "#D6D6D6", borderWidth: 1, borderRadius: 10 }}>
              <Image style={{ flex: 1 }} source={{ uri: imageproject }}></Image>
            </Block>
          </Block>
        </Block>
        <Toast
          ref="toastFailed"
          style={{ backgroundColor: Colors.accent }}
          position='top'
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
        />
        <Toast
          ref="toastSuccess"
          style={{ backgroundColor: Colors.green }}
          position='top'
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
        />
      </Block>
    )
  }
  renderItemEstimatesCostPhase = (data) => {
    var workerCost = 0;
    var dataTask = [];
    var workerNum = 0;
    var workerUnitFee = 0;
    var medium = 0;
    for (var i = 0; i < data.length; i++) {
      dataTask = dataTask.concat(data[i].materials)
      if (data[i].workerNum) {
        workerCost += data[i].workerNum * data[i].workerUnitFee;
        workerNum += data[i].workerNum;
        workerUnitFee += data[i].workerUnitFee;
        medium += 1;
      }
    }
    workerUnitFee = workerUnitFee / medium
    var totalCost = 0;
    for (var i = 0; i < dataTask.length; i++) {
      totalCost += dataTask[i].actualQuantity * dataTask[i].actualUnitPrice
    }
    console.log('nl', dataTask)
    totalCost += workerCost
    return (
      <Block flex={false} >
        <Block center flex={false} style={styles.ItemEstimatesPhase}>
          <Block flex={false}><Image source={Images.worker} tintColor={Colors.green} style={{ resizeMode: "stretch", marginRight: 20, height: 20, width: 20 }}></Image></Block>
          <Block row style={{ justifyContent: 'space-between' }}>
            <Block row style={{ justifyContent: 'space-between', marginRight: 10 }}>
              <Text h3 bold color={Colors.catalinaBlue}>Nhân công</Text>
              <Text h3 semibold color={Colors.catalinaBlue}>{workerNum}x{workerUnitFee}</Text>
            </Block>
            <Block row flex={false}>
              <TextCurrency h3 bold color={Colors.catalinaBlue} value={workerCost} />
              <Text h4 bold color={Colors.catalinaBlue}>đ</Text>
            </Block>
          </Block>
        </Block>
        {dataTask.map((item, index) =>
          <Block key={index} center flex={false} style={styles.ItemEstimatesPhase}>
            <Block flex={false}><Image source={Images.iconMaterial} style={{ resizeMode: "stretch", marginRight: 20 }}></Image></Block>
            <Block row style={{ justifyContent: 'space-between' }}>
              <Block row style={{ justifyContent: 'space-between', marginRight: 10 }}>
                <Text h3 bold color={Colors.catalinaBlue} numberOfLines={1} ellipsizeMode={'tail'} style={{ width: 110 }}>{item.name}</Text>
                <Text h3 semibold color={Colors.catalinaBlue}>{item.actualQuantity}x{item.actualUnitPrice}</Text>
              </Block>
              <Block row flex={false}>
                <TextCurrency h3 bold color={Colors.catalinaBlue} value={item.actualQuantity * item.actualUnitPrice} />
                <Text h4 bold color={Colors.catalinaBlue}> đ</Text>
              </Block>
            </Block>
          </Block>
        )}
        <Block flex={false} row right style={{ marginVertical: 10 }}>
          <Text h3 bold color={Colors.catalinaBlue}>{strings('Process.total')}: </Text>
          <TextCurrency h3 bold color={Colors.catalinaBlue} value={totalCost} />
          <Text h3 bold color={Colors.catalinaBlue}> vnđ</Text>
        </Block>
      </Block>
    )
  }
  sayHelloHandle = (data) => {
    console.log(data)
  }
  updateListTasks = (data) => {
    this.setState({
      updateTask: data
    });
  }
  renderItemEstimatesCostProcess = (data) => {
    const { planStartDate, time } = this.state
    var dataTask = []
    for (var i = 0; i < data.length; i++) {
      dataTask = dataTask.concat(data[i].tasks)
    }
    var dataMaterials = []
    for (var i = 0; i < dataTask.length; i++) {
      dataMaterials = dataMaterials.concat(dataTask[i].materials)
    }
    var totalCost = 0;
    var workerCost = 0
    for (var i = 0; i < dataMaterials.length; i++) {
      totalCost += dataMaterials[i].quantity * dataMaterials[i].unitPrice
    }
    for (var i = 0; i < dataTask.length; i++) {
      if (dataTask[i].workerNum) {
        workerCost += dataTask[i].workerNum * dataTask[i].workerUnitFee;
      }
    }
    totalCost += workerCost

    return (
      <Block flex={false}>
        <Block flex={false} style={styles.totalCostOfPhase}>
          <Text h3 bold color={Colors.white}>{strings('Process.totalCost')} :</Text>
          <Block row flex={false}>
            <TextCurrency h3 bold color={Colors.white} value={totalCost} />
            <Text h3 bold color={Colors.white}> vnđ</Text>
          </Block>
        </Block>
        {data.map((item, index) =>
          <Block key={index} flex={false} style={styles.ItemEstimatesProcess}>
            <Block flex={false} style={{ marginBottom: 10 }}>
              <Text h3 bold color={Colors.catalinaBlue}>{strings('Process.phase')} {index + 1}: {item.name}</Text>
            </Block>
            <Block flex={false} style={styles.estimatesPhase}>
              <Block row center flex={false} style={{ height: 50, }}>
                <Block center middle flex={false} >
                  <Image source={Images.iconMaterialTime} tintColor={Colors.green} style={{ resizeMode: "stretch", marginRight: 10 }}></Image>
                </Block>
                <Text h3 color={Colors.catalinaBlue}>{strings('Process.time')}: </Text>
                <Text h3 color={Colors.catalinaBlue}>{moment(time[index].start).format('DD/MM/YYYY')}</Text>
                <Text h3 color={Colors.catalinaBlue}> - </Text>
                <Text h3 color={Colors.catalinaBlue}>{moment(time[index].end).format('DD/MM/YYYY')}</Text>
              </Block>
              <Block flex={false}>
                {this.renderItemEstimatesCostPhase(item.tasks)}
              </Block>
            </Block>
          </Block>
        )}
      </Block>
    )
  }
  renderEstimatesCostProcess = () => {
    const { phases } = this.state.ProcessDetail
    return (
      <Block flex={false} style={styles.renderContent}>
        {this.renderItemEstimatesCostProcess(phases)}
      </Block>
    )
  }
  renderStandard = () => {
    return (
      <Block flex={false}>
        <Text h2 ></Text>
      </Block>
    )
  }
  renderEndproject = () => {
    const { phases } = this.state.ProcessDetail
    console.log('a', phases)
    var dataTask = []
    for (var i = 0; i < phases.length; i++) {
      dataTask = dataTask.concat(phases[i].tasks)
    }
    var dataMaterials = []
    for (var i = 0; i < dataTask.length; i++) {
      dataMaterials = dataMaterials.concat(dataTask[i].materials)
    }
    var totalCost = 0;
    var workerCost = 0
    for (var i = 0; i < dataMaterials.length; i++) {
      totalCost += dataMaterials[i].quantity * dataMaterials[i].unitPrice
    }
    for (var i = 0; i < dataTask.length; i++) {
      if (dataTask[i].workerNum) {
        workerCost += dataTask[i].workerNum * dataTask[i].workerUnitFee;
      }
    }
    totalCost += workerCost
    var totalCostActual = 0;
    for (var i = 0; i < dataMaterials.length; i++) {
      totalCostActual += dataMaterials[i].actualQuantity * dataMaterials[i].actualQuantity
    }
    totalCostActual += workerCost
    return (
      <Block flex={false} style={{ marginHorizontal: 10 }}>
        <Block center flex={false}>
          <Text h2 bold >Kế thúc dự án</Text>
        </Block>

        <Block flex={false} style={styles.totalCostOfPhase}>
          <Text h3 bold color={Colors.white}>Tông chi phí dự toán:</Text>
          <Block row flex={false}>
            <TextCurrency h3 bold color={Colors.white} value={totalCost} />
            <Text h3 bold color={Colors.white}> vnđ</Text>
          </Block>
        </Block>

        <Block flex={false} style={styles.totalCostOfPhase}>
          <Text h3 bold color={Colors.white}>Tông chi đầu tư:</Text>
          <Block row flex={false}>
            <TextCurrency h3 bold color={Colors.white} value={totalCostActual} />
            <Text h3 bold color={Colors.white}> vnđ</Text>
          </Block>
        </Block>

        <Block center flex={false} style={{ backgroundColor: Colors.green, paddingVertical: 20, marginTop: 50 }}>
          <TouchableOpacity
            onPress={() => this.handleEndProject()}
          >
            <Text h2 bold color={Colors.catalinaBlue}>Kết thúc</Text>
          </TouchableOpacity>
        </Block>
      </Block>
    )
  }
  renderTask = (data, startPhase, endPhase) => {
    const { params } = this.props.navigation.state;
    const idProcess = params._id;
    const { navigation } = this.props;
    const { updateTask } = this.state;
    let timeTask = [];
    if (updateTask && updateTask !== null) {
      data.push(updateTask);
      this.setState({
        updateTask: null
      })
    }
    if (data && data.length !== 0) {
      var start = 0;
      var end = startPhase;
      for (var i = 0; i < data.length; i++) {
        start = end
        end += data[i].estimatedTime * 24 * 60 * 60 * 1000
        timeTask.push({ start: start, end: end });
      }
    }
    return (
      <Block flex={false}>
        {data.map((item, index) =>
          <Block key={item._id} center flex={false} row style={{ marginBottom: 10 }} >
            <Block flex={false} style={styles.dot} />
            <TouchableOpacity style={[styles.task, item.isDailyTask === true ? { backgroundColor: "#7CFC00" } : { backgroundColor: "#E7F8FD" },]}
              onPress={() => navigation.navigate(Screens.TASK_PROJECT, { item, startTask: timeTask[index].start, endTask: timeTask[index].end, idProcess, sayHello: this.sayHelloHandle })}
            >
              <Text h3 bold color={Colors.catalinaBlue}>{item.name}</Text>
              <Block row flex={false}>
                <Text h4 color={Colors.catalinaBlue}>{moment(timeTask[index].start).format('DD/MM/YYYY')}</Text>
                <Text h4 color={Colors.catalinaBlue}> - </Text>
                <Text h4 color={Colors.catalinaBlue}>{moment(timeTask[index].end).format('DD/MM/YYYY')}</Text>
              </Block>
            </TouchableOpacity>
          </Block>
        )}
      </Block>
    )
  }
  renderProcess = (data) => {
    const { navigation } = this.props;
    var listTask = [];
    var idphase = ''
    if (data) {
      listTask = data.tasks
      idphase = data._id
    }
    const { planStartDate, time, Index } = this.state
    return (
      <Block flex={false} style={styles.renderContent}>
        <Text h2 bold color={Colors.catalinaBlue}>{data.name}</Text>
        <Block flex={false} row center flex={false} style={{ paddingVertical: 15 }} >
          <Block flex={false} center middle flex={false}>
            <Image source={Images.iconMaterialTime} tintColor={Colors.green} style={{ resizeMode: "stretch", marginRight: 10 }}></Image>
          </Block>
          <Block row flex={false}>
            <Text h3 bold color={Colors.catalinaBlue}>Từ : </Text>
            <Text h3 bold color={Colors.catalinaBlue}>{moment(time[Index - 3].start).format('DD/MM/YYYY')}</Text>
          </Block>
          <Text> - </Text>
          <Block row flex={false}>
            <Text h3 bold color={Colors.catalinaBlue}>Đến : </Text>
            <Text h3 bold color={Colors.catalinaBlue}>{moment(time[Index - 3].end).format('DD/MM/YYYY')}</Text>
          </Block>
        </Block>
        <Block flex={false} style={styles.estimatesPhase}>
          <Block row center flex={false} style={{ marginBottom: 10 }}>
            <Block flex={false} style={{ backgroundColor: "#ffffff", alignItems: 'center', justifyContent: 'center', }}>
              <Image source={Images.iconMaterialMoney} style={{ resizeMode: "stretch", marginRight: 10 }}></Image>
            </Block>
            <Text h3 bold color={"#26C165"}>Nguyên liệu cần chuẩn bị</Text>
          </Block>
          <Block flex={false} >
            {this.renderItemEstimatesCostPhase(listTask)}
          </Block>
        </Block>
        <Block flex={false} style={styles.estimatesPhase}>
          <Block flex={false} style={{ height: 40, flexDirection: "row", alignItems: 'center' }}>
            <Block flex={false} style={{ backgroundColor: "#ffffff", alignItems: 'center', justifyContent: 'center', }}>
              <Image source={Images.iconTodoList} style={{ resizeMode: "stretch", marginRight: 10 }}></Image>
            </Block>
            <Block row center style={{ justifyContent: 'space-between' }} >
              <Text h3 bold color={"#26C165"}>{strings('Process.task')}</Text>
              <TouchableOpacity style={{ flexDirection: 'row', justifyContent: "center" }}
                onPress={() => navigation.navigate(Screens.ADD_TASK, { idphase, updateListTasks: this.updateListTasks })}
              >
                <Icon name="plus-circle" size={21} color={Colors.green} />
                <Text h3 style={{ marginLeft: 5 }} color={"#26C165"} >{strings('Project.addTask')}</Text>
              </TouchableOpacity>
            </Block>
          </Block>
          <Block flex={false}>
            {this.renderTask(listTask, time[Index - 3].start, time[Index - 3].end)}
          </Block>
        </Block>
      </Block>
    )
  }
  renderEndProcess = () => {

  }
  renderContentprocess = () => {
    const { phases } = this.state.ProcessDetail
    const index = this.state.Index
    switch (index) {
      case 0:
        return (
          <Block flex={false} >
            {this.renderStatistical()}
          </Block>
        );
      case 1:
        return (
          <Block flex={false} >
            {this.renderEstimatesCostProcess()}
          </Block>
        );
      case 2:
        return (
          <Block flex={false} >
            {this.renderStandard()}
          </Block>
        );
      case 9:
        return (
          <Block flex={false} >
            {this.renderEndproject()}
          </Block>
        );
      default:
        var data = {}
        if (phases) {
          for (var i = 0; i < phases.length; i++) {
            if (index === i + 3) {
              data = phases[i]
            }
          }
        }
        return (
          <Block flex={false} >
            {this.renderProcess(data)}
          </Block>
        )
    }
  }
  onRefresh = () => {
    const { } = this.props;
    this.handleFilterSortProcess();
  };

  handleFilterSortProcess = () => {
    const { params } = this.props.navigation.state;
    const idProcess = params._id;
    const { processActions } = this.props;
    processActions.fetchProcessDetail(idProcess);
    this.setState({
      isEditing: true,
    });
  };

  handleEndProject = async () => {
    const { params } = this.props.navigation.state;
    const idProcess = params._id;
    const { categoriesActions, navigation, cardsActions } = this.props;
    const token = await getToken();
    let { ProcessDetail } = this.state;
    let dataUpdate = {
      "_id": ProcessDetail._id,
      "isFinished": true
    }
    // console.log('update', dataUpdate)
    if (token) {
      try {
        cardsService.updateProjectEnd(dataUpdate, token)
          .then(response => {
            if (response) {
              console.log('update done')
              // processActions.fetchProcessDetail(idProcess);
              categoriesActions.fetchProjectFinished();
              cardsActions.fetchProject();
              navigation.navigate(Screens.CATEGORIES);
            } else {
              console.log('err1')
            }
          });
      } catch (error) {
        console.log('err2')
      }
    }
  }
  render() {
    const { navigation } = this.props;
    const diffClamp = Animated.diffClamp(this.state.scrollY, 0, 45)
    const { ProcessDetail, time, planStartDate, isOpen } = this.state
    const { phases } = ProcessDetail
    const { isVisible, refreshing } = this.state;

    const dateTimePicker = ProcessDetail.planStartDate
    if (phases && phases.length !== 0) {
      var start = 0;
      var end = ProcessDetail.planStartDate;
      for (var i = 0; i < phases.length; i++) {
        start = end
        end += phases[i].estimatedTime * 24 * 60 * 60 * 1000
        time.push({ start: start, end: end });
        // console.log('start',moment(start).format('DD/MM/YYYY'))
        // console.log('end',moment(end).format('DD/MM/YYYY'))
      }
      // console.log('time',time);
    }
    const headerTranslate = diffClamp.interpolate({
      inputRange: [0, 45],
      outputRange: [0, -60],
      extrapolate: 'clamp',
    });
    return (
      <Block>
        <ScrollView style={styles.container}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
          )}
          refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={refreshing}
              onRefresh={() => this.onRefresh()}
            />
          }
        >
          <Block flex={false} style={styles.bar}>
            <Block column flex={false} style={{ paddingHorizontal: 5, paddingTop: 30, }}>
              <Block center middle flex={false} style={styles.carousel}>
                {this.renderCarousel()}
              </Block>
              <Block flex={false} style={styles.slidePhase}>
                {this.renderSlidePhase()}
              </Block>
            </Block>
          </Block>
          {/* render centent */}
          {this.renderContentprocess()}
          {/* <Block flex={false} style={styles.questions}>
            <Block row center flex={false}>
              <Block center middle flex={false} style={{ height: 40, width: 40 }}>
                <Image source={Images.iconQuestion} style={{ resizeMode: 'stretch', height: 27, width: 27 }}></Image>
              </Block>
              <Text h2 color={"#26C165"}>{strings('Process.questions')}</Text>
            </Block>
            {this.renderQuestions()}
          </Block> */}
        </ScrollView>
        {isVisible && (
          <DateTimePickerModal
            isVisible={isVisible}
            mode="date"
            onConfirm={this.handleConfirm}
            onCancel={this.hideDatePicker}
            date={dateTimePicker}
          />
        )}
        <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslate }] }]}  >
          <Header
            isShowBack
            title={ProcessDetail.name}
            navigation={navigation}
          >
          </Header>
        </Animated.View>
        {/* <TouchableOpacity style={styles.buttonImplement}
          onPress={() => navigation.navigate(Screens.PROCESS_IMPLEMENT)}
        >
          <Text h3 bold color={Colors.white}>Triển</Text>
          <Text h3 bold color={Colors.white}>khai</Text>
        </TouchableOpacity> */}
        <BaseModal
          isOpen={isOpen}
          bodyModal={this.renderBodyModal}
          footerModal={this.renderFooterModal}
          onCancel={this.handleCloseModal}
          useScrollView={true}
        />
      </Block>

    )
  }
}
const mapStateToprop = (state) => ({
  processDetail: state.process.processDetail
})

const mapDispatchToProps = (dispatch) => ({
  processActions: bindActionCreators(ProcessActions, dispatch),
  categoriesActions: bindActionCreators(CategoriesActions, dispatch),
  cardsActions: bindActionCreators(CardsActions, dispatch),
})
export default connect(mapStateToprop, mapDispatchToProps)(ProjectDetailScreen);