import React, { Component } from 'react';
import { FlatList, Image, TouchableOpacity, ImageBackground, ScrollView, Animated,Dimensions,Modal,TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import { Screens } from '../../Utils/screens';
import {
  Button, Block, BaseModal, Cart, TextCurrency,
  Card, Header, Input, Picker, Loading, Text,
} from "../../Components";
import { Title } from 'react-native-paper';
import styles from './TaskProjectDetailScreenStyle'
import { strings } from '../../Locate/I18n';
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';
import ImagePicker from 'react-native-image-picker';
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { cardsService } from '../../Services/CardsService';
import ProcessActions from '../../Stores/Process/Actions';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes, { number, string } from 'prop-types';
import RNFetchBlob from 'rn-fetch-blob';
import { Config } from '../../Config';
import {
  getToken,
  getUserName,
  getPassword,
  resetUser,
} from "../../Utils/storage.helper";
const { height, width } = Dimensions.get('window');
class TaskProjectDetailScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Index: 0,
      scrollY: new Animated.Value(0),
      isDatePickerVisible: false,
      setDatePickerVisibility: false,
      dateStart: '',
      endTask:0,
      startTask:0,
      dataTask: {},
      dataTaskUpdate:{},
      dataMaterialUpdate:null,
      dataMeasurementUpdate:null,
      realityNum:null,
      imageData:'',
      token: "",
      dataImage:{},
      imageDataUpdate:null
    }
  }
  componentDidMount() {
    const { params } = this.props.navigation.state;
    var listImage = params.item.images
    var url = Config.API_URL
    if(listImage && listImage.length !==0){
      var imageData = listImage[listImage.length-1]
      imageData = imageData.replace("http://localhost:3000",url)
    }
    console.log('listImage',imageData)
    this.setState({
      endTask:params.endTask,
      startTask:params.startTask,
      dataTask:params.item,
      imageData
    })
  }

  handleUpdate = async () => {
    this.props.navigation.state.params.sayHello("hello")
    const token = await getToken();
    const {dataImage,dataTask}=this.state
    // // const {dataTaskUpdate} = this.state
    console.log('dataTask._id',dataTask._id)
    console.log('token',dataImage.type)
    RNFetchBlob.fetch('POST', Config.API_URL+"/task/uploadImages", {
      Authorization: "Bearer " + token,
      "Content-Type": "multipart/form-data"
    }, [
      {name: "files", filename: dataImage.fileName, type: dataImage.type, data: dataImage.data },
      {name:"taskId", data:dataTask._id},
    ])
    .then(res => 
      {if(res.data.statusCode || res.data.statusCode === 400 ){
        console.log("data" ,res.data)
      }else{
        // navigation.navigate(Screens.CARD);
        // console.log("data" ,res.data)
        // cardsActions.fetchProject();
        console.log('res',res.data)
      }
    })
    .catch(err => console.log(err))
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
          dataImage:response
        });
      }
    });
  }
  renderItemEstimatesCostPhase = (data) => {
    const { idProcess } = this.props.navigation.state.params;
    var totalCost = 0;
    var totalCostActual = 0;
    const {dataTask} = this.state
    const { navigation } = this.props;
    for( var i=0; i< data.length; i++){
      totalCost += data[i].quantity * data[i].unitPrice
    }
    for( var i=0; i< data.length; i++){
      totalCostActual += data[i].actualQuantity * data[i].actualUnitPrice
    }
    totalCost += dataTask.workerNum*dataTask.workerUnitFee
    totalCostActual += dataTask.workerNum*dataTask.workerUnitFee
    return (
      <Block flex={false} >
        <Block flex={false} style={styles.ItemEstimatesPhase}>
          <Block row center flex={false}>
            <Block flex={false}><Image source={Images.worker} tintColor={Colors.green} style={{ resizeMode: "stretch", marginRight: 20, height:20,width:20 }}></Image></Block>
            <Text h3 bold color={Colors.catalinaBlue}>Nhân công</Text>
          </Block>
          <Block row midle style={{ justifyContent: 'space-between',paddingVertical:5 }}>
            <Block row style={{ justifyContent: 'space-between', marginRight: 10 }}>
              <Text h3 bold color={Colors.catalinaBlue}>Thực tế</Text>
              <Text h3 semibold color={Colors.catalinaBlue}>{dataTask.workerNum}x{dataTask.workerUnitFee}</Text>
            </Block>
            <Block row flex={false}>
              <TextCurrency h3 bold color={Colors.catalinaBlue} value={dataTask.workerNum*dataTask.workerUnitFee}/>
              <Text h4 bold color={Colors.catalinaBlue}>đ</Text>
            </Block>
            <TouchableOpacity style={{backgroundColor:'#E7F8FD'}}
                onPress={() => navigation.navigate(Screens.MATERIAL_DETAIL,{dataTask,idProcess})}>
                <Icon
                style={{ marginLeft: 20 }}
                name="edit"
                size={20}
              />
            </TouchableOpacity>         
          </Block>
        </Block>
        {data.map((item,index) =>
          <Block key={index}  flex={false} style={styles.ItemEstimatesPhase}>
            <Block row center flex={false}>
              <Block flex={false}><Image source={Images.iconMaterial} style={{ resizeMode: "stretch", marginRight: 20 }}></Image></Block>
              <Text h3 bold color={Colors.catalinaBlue}>{item.name}</Text>
            </Block>
            <Block row midle style={{ justifyContent: 'space-between', marginRight:40,paddingVertical:5 }}>
              <Block row style={{ justifyContent: 'space-between', marginRight: 10 }}>
                <Text h3 bold color={Colors.catalinaBlue}>Dự toán:</Text>
                <Text h3 semibold color={Colors.catalinaBlue}>{item.quantity}x{item.unitPrice}</Text>
              </Block>
              <Block row flex={false}>
                <TextCurrency h3 bold color={Colors.catalinaBlue} value={item.quantity * item.unitPrice} />
                <Text h4 bold color={Colors.catalinaBlue}>đ</Text>  
              </Block>
            </Block>
            <Block row midle style={{ justifyContent: 'space-between',paddingVertical:5 }}>
              <Block row style={{ justifyContent: 'space-between', marginRight: 10 }}>
                <Text h3 bold color={Colors.catalinaBlue}>Thực tế:</Text>
                <Text h3 semibold color={Colors.catalinaBlue}>{item.actualQuantity}x{item.actualUnitPrice}</Text>
              </Block>
              <Block row flex={false}>
                <TextCurrency h3 bold color={Colors.catalinaBlue} value={item.actualQuantity * item.actualUnitPrice} />
                <Text h4 bold color={Colors.catalinaBlue}>đ</Text>  
              </Block>
              <TouchableOpacity style={{backgroundColor:'#E7F8FD'}}
                onPress={() => navigation.navigate(Screens.MATERIAL_DETAIL,{item,idProcess})}>
                <Icon
                style={{ marginLeft: 20 }}
                name="edit"
                size={20}
                />
              </TouchableOpacity>
            </Block>
          </Block>
        )}
        <Block right flex={false} style={{width:width/2,}} >
          <Block flex={false} row style={{ marginVertical: 10 }}>
            <Text h3 bold color={Colors.catalinaBlue}>{strings('Process.total')}: </Text>
          </Block>
          <Block flex={false} row style={{ marginVertical: 10 }}>
            <Text h3 bold color={Colors.catalinaBlue}>Dự toán: </Text>
            <TextCurrency h3 bold color={Colors.catalinaBlue} value={totalCost}/>
            <Text h3 bold color={Colors.catalinaBlue}> vnđ</Text>
          </Block>
          <Block flex={false} row style={{ marginVertical: 10 }}>
            <Text h3 bold color={Colors.catalinaBlue}>Thực tế: </Text>
            <TextCurrency h3 bold color={Colors.catalinaBlue} value={totalCostActual}/>
            <Text h3 bold color={Colors.catalinaBlue}> vnđ</Text>
          </Block>
        </Block>
      </Block>
    )
  }
  renderEstimatesCostTask = (materials) => {
    return (
      <Block flex={false}>
        {materials? this.renderItemEstimatesCostPhase(materials):null}
      </Block>
    )
  }
  handleChangeMeasurements = async (text, item) => {
    const { idProcess } = this.props.navigation.state.params;
    const token = await getToken();
    const { processActions } = this.props;
    var data = { 
      _id: item._id, 
      realityNum: text
      }
    if(token){
      try {
        cardsService.updateMeasurements(data,token)
            .then(response => {
              if (response) {
                console.log('update done')
                processActions.fetchProcessDetail(idProcess);
              } else {
                console.log('err1')
              }
            });
      } catch (error) {
        console.log('err2')
      }
    }
  }
  handleChange = (value, key) => {
    let { dataTaskUpdate } = this.state;
    dataTaskUpdate[key] = value;
    this.setState({
      dataTaskUpdate,
    })
  }
  renderItemSLDD = (data) => {
    return (
      <Block flex={false} >
        {data.map((item,index) =>
          <Block key={index} flex={false} style={styles.ItemSLDDD}>
            <Block row flex={false}>
              <Image source={Images.iconMaterial} style={{ resizeMode: "stretch", marginRight: 20 }}></Image>
              <Text h3 bold color={Colors.catalinaBlue}>{item.name}</Text>
            </Block>
            <Block flex={false} style={{ paddingVertical: 10 }}>
              <Text h3 bold color={Colors.catalinaBlue}>Hướng dẫn đo: </Text>
              <Text h3 color={Colors.catalinaBlue}>
                {item.guide}
              </Text>
            </Block>
            <Block flex={false} row flex={false}>
              <Block style={{marginRight:5}}>
                <Input
                  editable={false}
                  label={"Sô liệu chuẩn:"}
                  labelStyle={{ color: Colors.catalinaBlue, fontSize: 18,fontWeight: 'bold' }}
                  style={[styles.input1]}
                  value={item.standardNum.toString()}
                  labelColor={Colors.catalinaBlue}
                  rightLabel={
                    <Text h3 color={Colors.catalinaBlue} style={{marginTop:35,position: 'absolute',}}>{item.unit}</Text>
                  }
                />
              </Block>
              <Block style={{marginRight:5}}>
                <Input
                  label={"Sô liệu thực tế:"}
                  labelStyle={{ color: Colors.catalinaBlue, fontSize: 18,fontWeight: 'bold' }}
                  style={[styles.input1]}
                  value={item.realityNum && item.realityNum!==0 ? item.realityNum.toString() : null}
                  number
                  onChangeText={text => this.handleChangeMeasurements(text,item)}
                  labelColor={Colors.catalinaBlue}
                  rightLabel={
                    <Text h3 color={Colors.catalinaBlue} style={{marginTop:35,position: 'absolute',}}>{item.unit}</Text>
                  }
                />
              </Block>
            </Block>
          </Block>
        )}
      </Block>
    )
  }
  renderSLDD = (measurements) => {
    return (
      <Block flex={false}>
        {this.renderItemSLDD(measurements)}
      </Block>
    )
  }
  render() {
    const { navigation } = this.props;
    const diffClamp = Animated.diffClamp(this.state.scrollY, 0, 45)
    let {endTask,startTask,dataTask,imageData} = this.state

    let materials = [];
    let measurements = [];
    if(dataTask&&dataTask.length!==0){
    materials = dataTask.materials;
    measurements = dataTask.measurements;
    }
    const headerTranslate = diffClamp.interpolate({
      inputRange: [0, 45],
      outputRange: [0, -60],
      extrapolate: 'clamp',
    });
    return (
      <Block style={{ backgroundColor: "#B8F39A" }}>
        <Block flex={false} style={styles.estimatesTime}>
          <Block row center style={{}}>
            <Text bold h2>Ngày bắt đầu: {moment(startTask).format('DD/MM/YYYY')}</Text>
          </Block>
          <Block flex={false} style={styles.line}></Block>
          <Block row center>
            <Text flex={false} bold h2>Ngày kết thúc: {moment(endTask).format('DD/MM/YYYY')}</Text>
            <TouchableOpacity>
              <Icon
                style={{ marginLeft: 20 }}
                name="edit"
                size={25}
              />
            </TouchableOpacity>
          </Block>
        </Block>
        <ScrollView style={styles.container}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
          )}
        >
          <Block style={styles.taskContent}>
            <Block center midle flex={false}>
              <Text h1 bold>Công việc</Text>
            </Block>
            <Block midle flex={false} style={{ paddingHorizontal: 20 }}>
              <Text h3 bold style={{ marginVertical: 10 }}>Mô tả: </Text>
              <Text h3>{dataTask.description}</Text>
            </Block>
            {materials && materials.length !== 0 ? 
              <Block midle flex={false} style={{ paddingHorizontal: 20 }}>
                <Text h3 bold style={{ marginVertical: 10 }}>Nguyên vât liệu: </Text>
                {this.renderEstimatesCostTask(materials)}
              </Block>
            :null}
            {measurements && measurements.length !== 0 ? 
              <Block midle flex={false} style={{ paddingHorizontal: 20 }}>
                <Text h3 bold style={{ marginVertical: 10 }}>Số liệu đo đạc: </Text>
                {this.renderSLDD(measurements)}
              </Block>
            :null}
            <Block midle flex={false} style={{ paddingHorizontal: 20 }}>
              <Text h3 bold style={{ marginVertical: 10 }}>Cập nhật tình trạng: </Text>
              <Input
                style={[styles.input,]}
                onChangeText={text => this.handleChange(text, 'note')}
              />
            </Block>
            <Block flex={false} style={{ marginTop: 20, marginHorizontal: 20 }}>
              <Block row flex={false} style={{ justifyContent: 'space-between' }}>
                <Text h3 bold>Cập nhật hình ảnh: </Text>
                <TouchableOpacity
                  onPress={() => this.renderImagePicker()}
                >
                  <Image source={Images.iconAwesomeCamera}></Image>
                </TouchableOpacity>
              </Block>
              <Block flex={false} style={{ height: 200, marginVertical: 10, borderColor: "#D6D6D6", borderWidth: 1, borderRadius: 10 }}>
                <Image style={{ flex: 1 }} source={this.state.imageDataUpdate!==null ? { uri: 'data:image/jpeg;base64,' + this.state.imageDataUpdate }:{ uri: this.state.imageData }}></Image>
              </Block>
            </Block>
          </Block>
        </ScrollView>
        <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslate }] }]}  >
          <Header
            isShowBack
            title={'Trồng lúa Organic'}
            navigation={navigation}
          >
          </Header>
        </Animated.View>
        <TouchableOpacity style={styles.buttonImplement}
           onPress={() => this.handleUpdate()}
        >
              
          <Text h3 bold color={Colors.white}>Cập</Text>
          <Text h3 bold color={Colors.white}>nhật</Text>
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
export default connect(mapStateToprop, mapDispatchToProps)(TaskProjectDetailScreen);