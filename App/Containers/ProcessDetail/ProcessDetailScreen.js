import React, { Component } from 'react';
import { FlatList, Image, TouchableOpacity, ImageBackground, ScrollView, Animated,Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import { Screens } from '../../Utils/screens';
import {
  Button, Block, BaseModal, Cart,TextCurrency,
  Card, Header, Input, Picker, Loading, Text,
} from "../../Components";
import { Title } from 'react-native-paper';
import styles from './ProcessDetailScreenStyle'
import { strings } from '../../Locate/I18n';
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';
import Carousel from 'react-native-snap-carousel';
//redux
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes, { number, string } from 'prop-types';
import ProcessActions from '../../Stores/Process/Actions';
import { Config } from '../../Config';

const { width } = Dimensions.get('window');
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const widthCarousel = width - (ApplicationStyles.marginHorizontal.marginHorizontal * 2);

class ProcessDetailScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Index: 0,
      scrollY: new Animated.Value(0),
      carousel: [],
      carouselBackUp: [
        { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80" }, 
        { url: "https://images.unsplash.com/photo-1451440063999-77a8b2960d2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80"}
      ],
      ProcessDetail: [],
    }
  }
  componentDidMount() {
    const { params } = this.props.navigation.state;
    const idProcess = params._id;
    const { processActions } = this.props;
    processActions.fetchProcessDetail(idProcess);
    const {carousel} = this.state
    //carousel
    var images = params.images
    var url = Config.API_URL
    if(images){
      for(var i =0 ; i<images.length;i++){
        images[i]=images[i].replace("http://localhost:3000",url);
        carousel.push({url:images[i]});
        this.setState({carousel})
      }
    }
  }
  UNSAFE_componentWillUpdate (nextProps) {
    const {processDetail}=this.props
    if(nextProps.processDetail!==processDetail){
      this.setState({ProcessDetail:nextProps.processDetail})
    }
  }
  renderItemCarousel = ({ item, index }) => {
    return (
      <Block center middle flex={false} key={index}>
        <Image
          source={{uri:item.url}}
          style={styles.itemCarousel}
        />
      </Block>
    );
  }
  renderCarousel = () => {
    const { carousel,carouselBackUp } = this.state;
    var data= null
    if(carousel[0] === undefined){
      data =carouselBackUp
    }else{
      data = carousel
    }
    return (
      <Block flex={false} style={{ marginHorizontal:10, marginTop: 2 }}>
        <Carousel
          data={data}
          renderItem={this.renderItemCarousel}
          loop={true}
          autoplay={true}
          sliderWidth={widthCarousel}
          itemWidth={widthCarousel}
          autoplayInterval= {4000}
        />
      </Block>
    );
  };
  renderSlidePhase = () => {
    const summary = ["Thống kê", "Dự toán", "Điều kiện",];
    const process = [];
    const {phases} = this.state.ProcessDetail
    if(phases){
      for(var i=0; i < phases.length; i++){
        process.push(`${strings('Process.phase')} ${i+1}`);
      }
    }
    const summaryProcess = summary.concat(process);
    // summaryProcess.push("Kết thúc")
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
  handleIndexContentProcess = Index => {
    this.setState({
      Index
    });
    // console.log(this.state.Index)
  }
  renderItemQuestion = (item) => {
    return (
      <Block key={item.id}  flex={false} style={{ paddingHorizontal: 17, backgroundColor: "#E7F8FD", borderRadius: 10, paddingVertical: 10, marginBottom: 10 }}>
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
            <Text h3 style={styles.Title_summary}>{strings('HomeFarm.minimalScale')}:</Text>
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
              <TextCurrency h3 bold color={Colors.catalinaBlue} value={item.unitPrice * item.estimatedQuantity - item.estimatedCost } />
                <Text h3 bold color={Colors.catalinaBlue}> vnđ</Text>
              </Block>
          </Block>
        </Block>
      </Block>
    );
  }
  renderQuestions = () => {
    const listQuestion = [
      {"id":1, "name": "Cách phòng bệnh đạo ôn", "content": "Trung bình mỗi vụ lúa xuân hàng năm Nghệ An có từ 6000 - 7000 ha lúa bị bệnh đạo ôn lá, đạo ôn cổ bông, làm thất thiệt 10.000 - 11.000 tấn lúa. Riêng vụ xuân năm 2018 do có hàng ngàn ha lúa bị bệnh đạo ôn cổ bông nên mức độ thất thiệt là đến gần 100.000 tấn lúa.", "like": "10", "comment": "100" },
      {"id":2, "name": "Cách phòng bệnh đạo ôn", "content": "Trung bình mỗi vụ lúa xuân hàng năm Nghệ An có từ 6000 - 7000 ha lúa bị bệnh đạo ôn lá, đạo ôn cổ bông, làm thất thiệt 10.000 - 11.000 tấn lúa. Riêng vụ xuân năm 2018 do có hàng ngàn ha lúa bị bệnh đạo ôn cổ bông nên mức độ thất thiệt là đến gần 100.000 tấn lúa.", "like": "10", "comment": "100" },
      {"id":3, "name": "Cách phòng bệnh đạo ôn", "content": "Trung bình mỗi vụ lúa xuân hàng năm Nghệ An có từ 6000 - 7000 ha lúa bị bệnh đạo ôn lá, đạo ôn cổ bông, làm thất thiệt 10.000 - 11.000 tấn lúa. Riêng vụ xuân năm 2018 do có hàng ngàn ha lúa bị bệnh đạo ôn cổ bông nên mức độ thất thiệt là đến gần 100.000 tấn lúa.", "like": "10", "comment": "100" }
    ]
    return (
      <Block>
        {listQuestion.map((item) => this.renderItemQuestion(item))}
      </Block>
    )
  }
  renderPriceChart = () => {
    const fill = '#B097F5'
    const axesSvg = { fontSize: 15, fill: Colors.catalinaBlue };
    const verticalContentInset = { top: 20, bottom: 20 }
    const xAxisHeight = 30
    const data = [
      { "value": 20000, "label": '1', },
      { "value": 12000, "label": '2', },
      { "value": 50000, "label": '3', },
      { "value": 42000, "label": '4', },
      { "value": 21000, "label": '5', },
      { "value": 35000, "label": '5', },
      { "value": 24000, "label": '6', },
      { "value": 38000, "label": '7', },
      { "value": 41000, "label": '8', },
      { "value": 23000, "label": '9', },
      { "value": 21000, "label": '10', },
      { "value": 14000, "label": '11', },
      { "value": 24000, "label": '12', }]
    const dataY = data.map(item => item.value)
    return (
      <Block row>
        <YAxis
          data={dataY}
          style={{ marginBottom: xAxisHeight, marginHorizontal: 10 }}
          contentInset={verticalContentInset}
          svg={axesSvg}
        />
        <Block style={{ flex: 1 }}>
          <BarChart
            style={{ height: 200 }}
            spacingInner={0.2}
            // spacingOuter ={0.2}
            data={data}
            yAccessor={({ item }) => item.value}
            svg={{ fill }}
            contentInset={verticalContentInset}
          >
            <Grid />
          </BarChart>
          {/* <Block style={[styles.line, { marginTop: 5 }]}></Block> */}
          <XAxis
            style={{ paddingTop: 10 }}
            data={data}
            scale={scale.scaleBand}
            formatLabel={(_, index) => `${data[index].label}`}
            spacingInner={0.2}
            // contentInset={{ left: 10, right: 20 }}
            svg={{ fontSize: 15, fill: Colors.catalinaBlue }}
          />
        </Block>
      </Block>
    )
  }
  renderStatistical = () => {
    const { params } = this.props.navigation.state
    return (
      <Block center flex={false} style={styles.statistical}>
        <Block flex={false} style={styles.summaryProcess} >
          {this.renderSummaryProcess(params)}
        </Block>
        <Block flex={false} style={styles.chart}>
          <Block flex={false} row>
            <Text h3 bold color={Colors.catalinaBlue}>{strings('Process.priceChart')}</Text>
            <Block flex={false} center middle style={{ backgroundColor: Colors.white, marginLeft: 10, borderRadius: 10, paddingHorizontal: 10, }}>
              <Text h3 bold color={"#26C165"}>2020</Text>
            </Block>
          </Block>
          <Block flex={false} style={{ marginTop: 10 }}>
            <Text h3 bold color={Colors.catalinaBlue}>vnđ/kg</Text>
          </Block>
          <Block>
            {this.renderPriceChart()}
          </Block>
        </Block>
      </Block>
    )
  }
  renderItemEstimatesCostPhase = (data) => {
    // console.log('workerNum',data[0].workerNum)
    var workerCost = 0;
    var dataTask = [];
    var workerNum = 0;
    var workerUnitFee = 0;
    var medium =0;
    for(var i=0; i<data.length; i++){
      dataTask = dataTask.concat(data[i].materials)
      if(data[i].workerNum){
        workerCost += data[i].workerNum * data[i].workerUnitFee ;
        workerNum += data[i].workerNum ;
        workerUnitFee += data[i].workerUnitFee ;
        medium += 1 ;
      }
    }
    workerUnitFee = workerUnitFee/medium
    var totalCost = 0;
    for(var i=0; i<dataTask.length; i++){
      totalCost += dataTask[i].quantity * dataTask[i].unitPrice
    }
    totalCost += workerCost
    return (
      <Block flex={false} >
        <Block center flex={false} style={styles.ItemEstimatesPhase}>
          <Block flex={false}><Image source={Images.worker} tintColor={Colors.green} style={{ resizeMode: "stretch", marginRight: 20, height:20,width:20 }}></Image></Block>
          <Block row style={{ justifyContent: 'space-between' }}>
            <Block row style={{ justifyContent: 'space-between', marginRight: 10 }}>
              <Text h3 bold color={Colors.catalinaBlue}>Nhân công</Text>
              <Text h3 semibold color={Colors.catalinaBlue}>{workerNum}x{workerUnitFee}</Text>
            </Block>
            <Block row flex={false}>
              <TextCurrency h3 bold color={Colors.catalinaBlue} value={workerCost}/>
              <Text h4 bold color={Colors.catalinaBlue}>đ</Text>
            </Block>           
          </Block>
        </Block>
        {dataTask.map((item) =>
          <Block key={item._id}  center flex={false} style={styles.ItemEstimatesPhase}>
            <Block flex={false}><Image source={Images.iconMaterial} style={{ resizeMode: "stretch", marginRight: 20 }}></Image></Block>
            <Block row style={{ justifyContent: 'space-between' }}>
              <Block row style={{ justifyContent: 'space-between', marginRight: 10 }}>
                <Text h3 bold numberOfLines={1} ellipsizeMode={'tail'} style={{width:110}} color={Colors.catalinaBlue}>{item.name}</Text>
                <Text h3 semibold color={Colors.catalinaBlue}>{item.quantity}x{item.unitPrice}</Text>
              </Block>
              <Block row flex={false}>
                <TextCurrency h3 bold color={Colors.catalinaBlue} value={item.quantity * item.unitPrice}/>
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
  renderItemEstimatesCostProcess = (data) => {
    var dataTask = []
    for(var i=0; i<data.length; i++){
      dataTask = dataTask.concat(data[i].tasks)
    }
    var dataMaterials =[]
    for(var i=0; i<dataTask.length; i++){
      dataMaterials = dataMaterials.concat(dataTask[i].materials)
    }
    var totalCost = 0;
    var workerCost = 0
    for(var i=0; i<dataMaterials.length; i++){
      totalCost += dataMaterials[i].quantity * dataMaterials[i].unitPrice
    }
    for(var i=0; i<dataTask.length; i++){
      if(dataTask[i].workerNum){
        workerCost += dataTask[i].workerNum * dataTask[i].workerUnitFee ;
      }
    }
    totalCost += workerCost
    return (
      <Block flex={false}>
        <Block flex={false} style={styles.totalCostOfPhase}>
          <Text h3 bold color={Colors.white}>{strings('Process.totalCost')} :</Text>
          <Block row flex={false}>
            <TextCurrency h3 bold color={Colors.white} value={totalCost}/>
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
                <Text h3 color={Colors.catalinaBlue}>{item.estimatedTime} {item.estimatedTimeUnit}</Text>
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
    const {phases} = this.state.ProcessDetail
    return (
      <Block flex={false} style={styles.renderContent}>
        {this.renderItemEstimatesCostProcess(phases)}
      </Block>
    )
  }
  renderStandard = () => {
    return (
      <Block flex={false}>
        <Text h2 >Điều kiện</Text>
      </Block>
    )
  }
  renderTask = (data) => {
    const { params } = this.props.navigation.state;
    if(params){
      var summaryProcess = params
    }
    const { navigation } = this.props;
    return (
      <Block flex={false}>
        {data.map((item) =>
          <Block key={item._id} center flex={false} row style={{ marginBottom: 10 }} >
            <Block flex={false} style={styles.dot} />
            <TouchableOpacity style={styles.task}
             onPress={() => navigation.navigate(Screens.TASK,{item,summaryProcess})}
            >
              <Text h3 bold color={Colors.catalinaBlue}>{item.name}</Text>
              <Text h4 color={Colors.catalinaBlue}>{item.estimatedTime} {item.estimatedTimeUnit}</Text>
            </TouchableOpacity>
          </Block>
        )}
      </Block>
    )
  }
  renderProcess = (data) => {
    var listTask = []
    if(data){
      listTask=data.tasks
    }  
    return (
      <Block flex={false} style={styles.renderContent}>
        <Text h2 bold color={Colors.catalinaBlue}>{data.name}:</Text>
        <Block flex={false} row center flex={false} style={{ paddingVertical: 10 }} >
          <Block flex={false} center middle flex={false}>
            <Image source={Images.iconMaterialTime} tintColor={Colors.green} style={{ resizeMode: "stretch", marginRight: 10 ,height:20,width:20 }}></Image>
          </Block>
          <Text h3 color={Colors.catalinaBlue}>{strings('Process.time')}: </Text>
          <Text h3 color={Colors.catalinaBlue}>{data.estimatedTime} {data.estimatedTimeUnit}</Text>
        </Block>
        <Text h3 color={Colors.catalinaBlue} style={{ paddingVertical: 10 }}>{data.description}</Text>
        <Block flex={false} style={styles.estimatesPhase}>
          <Block row center flex={false} style={{ marginBottom: 10 }}>
            <Block flex={false} style={{ backgroundColor: "#ffffff", alignItems: 'center', justifyContent: 'center', }}>
              <Image source={Images.iconMaterialMoney} style={{ resizeMode: "stretch", marginRight: 10 }}></Image>
            </Block>
            <Text h3 bold color={"#26C165"}>{strings('Process.cost')}</Text>
          </Block>
          <Block flex={false} >
            {this.renderItemEstimatesCostPhase(listTask)}
          </Block>
        </Block>
        {/* <Block flex={false} style={styles.estimatesPhase}>
          <Block flex={false} style={{ height: 40, flexDirection: "row", alignItems: 'center' }}>
            <Block flex={false} style={{ backgroundColor: "#ffffff", alignItems: 'center', justifyContent: 'center' }}>
              <Image source={Images.dailyClock} style={{ resizeMode: "stretch", marginRight: 10,height:30,width:30 }}></Image>
            </Block>
            <Text h3 bold color={"#26C165"}>{strings('Process.dailyTask')}</Text>
          </Block>
          <Block flex={false}>
            {this.renderTask(listTask)}
          </Block>
        </Block> */}

        <Block flex={false} style={styles.estimatesPhase}>
          <Block flex={false} style={{ height: 40, flexDirection: "row", alignItems: 'center' }}>
            <Block flex={false} style={{ backgroundColor: "#ffffff", alignItems: 'center', justifyContent: 'center', }}>
              <Image source={Images.iconTodoList} style={{ resizeMode: "stretch", marginRight: 10 }}></Image>
            </Block>
            <Text h3 bold color={"#26C165"}>{strings('Process.task')}</Text>
          </Block>
          <Block flex={false}>
            {this.renderTask(listTask)}
          </Block>
        </Block>
      </Block>
    )
  }
  renderEndProcess = () => {

  }
  renderContentprocess = () => {
    const {phases} = this.state.ProcessDetail
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
      default:
        var data = {}
        if(phases){
          for(var i = 0;i<phases.length;i++){
          if(index === i+3){
            data =phases[i]
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
  render() {
    const { navigation } = this.props;
    const { params } = this.props.navigation.state;
    const diffClamp = Animated.diffClamp(this.state.scrollY, 0, 45)
    // const headerHeight = diffClamp.interpolate({
    //   inputRange: [0, 55],
    //   outputRange: [55, 0],
    //   extrapolate: 'clamp',
    // });
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
          <Block flex={false} style={styles.questions}>
            <Block row center flex={false}>
              <Block center middle flex={false} style={{ height: 40, width: 40 }}>
                <Image source={Images.iconQuestion} style={{ resizeMode: 'stretch', height: 27, width: 27 }}></Image>
              </Block>
              <Text h2 color={"#26C165"}>{strings('Process.questions')}</Text>
            </Block>
            {this.renderQuestions()}
          </Block>
        </ScrollView>
        <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslate }] }]}  >
          <Header
            isShowBack
            title={params.name}
            navigation={navigation}
          >
          </Header>
        </Animated.View>
        <TouchableOpacity style={styles.buttonImplement}
          onPress={() => navigation.navigate(Screens.PROCESS_IMPLEMENT,params)}
        >
          <Text h3 bold color={Colors.white}>Triển</Text>
          <Text h3 bold color={Colors.white}>khai</Text>
        </TouchableOpacity>
      </Block>

    )
  }
}
const mapStateToprop = (state) => ({
  processDetail: state.process.processDetail
})

const mapDispatchToProps = (dispatch) => ({
  processActions: bindActionCreators(ProcessActions, dispatch),
})
export default connect(mapStateToprop, mapDispatchToProps)(ProcessDetailScreen);