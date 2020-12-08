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
      avatarSource: '',
      endTask:0,
      startTask:0,
      dataTask: {},
      modalVisible: false
    }
  }
  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.setState({
      endTask:params.endTask,
      startTask:params.startTask,
      dataTask:params.item
    })
  }
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  handleupdate (){
    this.props.navigation.state.params.sayHello("hello")
    console.log(this.props.navigation.state.params.sayHello)
    console.log(this.props.navigation.state.params)
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
          avatarSource: response.data,
        });
      }
    });
  }
  renderItemEstimatesCostPhase = (data) => {
    var totalCost = 0;
    const {dataTask} = this.state
    for( var i=0; i< data.length; i++){
      totalCost += data[i].quantity * data[i].unitPrice
    }
    totalCost += dataTask.workerNum*dataTask.workerUnitFee
    return (
      <Block flex={false} >
        <Block flex={false} style={styles.ItemEstimatesPhase}>
          <Block row center flex={false}>
            <Block flex={false}><Image source={Images.worker} tintColor={Colors.green} style={{ resizeMode: "stretch", marginRight: 20, height:20,width:20 }}></Image></Block>
            <Text h3 bold color={Colors.catalinaBlue}>Nhân công</Text>
          </Block>
          <Block row midle style={{ justifyContent: 'space-between',marginRight:40,paddingVertical:5 }}>
            <Block row style={{ justifyContent: 'space-between', marginRight: 10 }}>
              <Text h3 bold color={Colors.catalinaBlue}>Dự toán</Text>
              <Text h3 semibold color={Colors.catalinaBlue}>{dataTask.workerNum}x{dataTask.workerUnitFee}</Text>
            </Block>
            <Block row flex={false}>
              <TextCurrency h3 bold color={Colors.catalinaBlue} value={dataTask.workerNum*dataTask.workerUnitFee}/>
              <Text h4 bold color={Colors.catalinaBlue}>đ</Text>
            </Block>        
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
                onPress={() => {
                this.setModalVisible(true);
              }}>
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
                <Text h3 semibold color={Colors.catalinaBlue}>{item.quantity}x{item.unitPrice}</Text>
              </Block>
              <Block row flex={false}>
                <TextCurrency h3 bold color={Colors.catalinaBlue} value={item.quantity * item.unitPrice} />
                <Text h4 bold color={Colors.catalinaBlue}>đ</Text>  
              </Block>
              <TouchableOpacity style={{backgroundColor:'#E7F8FD'}}
                onPress={() => {
                this.setModalVisible(true);
              }}>
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
            <TextCurrency h3 bold color={Colors.catalinaBlue} value={totalCost}/>
            <Text h3 bold color={Colors.catalinaBlue}> vnđ</Text>
          </Block>
        </Block>
      </Block>
    )
  }
  renderEstimatesCostTask = (materials) => {
    console.log('dataTask',materials)
    return (
      <Block flex={false}>
        {materials? this.renderItemEstimatesCostPhase(materials):null}
      </Block>
    )
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
                  // onChangeText={(text) => this.setState({ username: text })}
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
                  value={item.standardNum.toString()}
                  // onChangeText={(text) => this.setState({ username: text })}
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
    let {endTask,startTask,dataTask} = this.state
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
    const { modalVisible } = this.state;
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
              <Text h3 bold style={{ marginVertical: 10 }}>Mô tả tình trạng: </Text>
              <Input
                style={[styles.input,]}
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
                <Image style={{ flex: 1 }} source={{ uri: 'data:image/jpeg;base64,' + this.state.avatarSource }} ></Image>
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
           onPress={() => this.handleupdate()}
        >
              
          <Text h3 bold color={Colors.white}>Cập</Text>
          <Text h3 bold color={Colors.white}>nhật</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <Block style={styles.centeredView}>
            <Block style={styles.modalView}>
            <Input
              label={'Số lượng'}
              style={[styles.input2,]}
              // onChangeText={text => this.handleChange(text, 'scale')}
              number
            />
            <Input
              label={'Đơn giá'}
              style={[styles.input2,]}
              // onChangeText={text => this.handleChange(text, 'scale')}
              number
            />
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  this.setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Thoát</Text>
              </TouchableHighlight>
            </Block>
          </Block>
        </Modal>
      </Block>
    )
  }
}
export default TaskProjectDetailScreen;