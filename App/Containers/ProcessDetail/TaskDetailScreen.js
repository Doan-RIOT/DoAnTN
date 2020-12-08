import React, { Component } from 'react';
import { FlatList, Image, TouchableOpacity, ImageBackground, ScrollView, Animated, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import { Screens } from '../../Utils/screens';
import {
  Button, Block, BaseModal, Cart, TextCurrency,
  Card, Header, Input, Picker, Loading, Text,
} from "../../Components";
import { Title } from 'react-native-paper';
import styles from './TaskDetailScreenStyle'
import { strings } from '../../Locate/I18n';
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';
import ImagePicker from 'react-native-image-picker';
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Config } from '../../Config';
class TaskDetailScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Index: 0,
      scrollY: new Animated.Value(0),
      isDatePickerVisible: false,
      setDatePickerVisibility: false,
      dateStart: '',
      avatarSource: '',
      dataTask:{}
    }
  }
  componentDidMount() {
    const { item } = this.props.navigation.state.params;
    this.setState({dataTask:item})
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
        <Block center flex={false} style={styles.ItemEstimatesPhase}>
          <Block flex={false}><Image source={Images.worker} tintColor={Colors.green} style={{ resizeMode: "stretch", marginRight: 20, height:20,width:20 }}></Image></Block>
          <Block row style={{ justifyContent: 'space-between' }}>
            <Block row style={{ justifyContent: 'space-between', marginRight: 10 }}>
              <Text h3 bold color={Colors.catalinaBlue}>Nhân công</Text>
              <Text h3 semibold color={Colors.catalinaBlue}>{dataTask.workerNum}x{dataTask.workerUnitFee}</Text>
            </Block>
            <Block row flex={false}>
              <TextCurrency h3 bold color={Colors.catalinaBlue} value={dataTask.workerNum*dataTask.workerUnitFee}/>
              <Text h4 bold color={Colors.catalinaBlue}>đ</Text>
            </Block>           
          </Block>
        </Block>
        {data.map((item) =>
          <Block key={item._id} center flex={false} style={styles.ItemEstimatesPhase}>
            <Block flex={false}><Image source={Images.iconMaterial} style={{ resizeMode: "stretch", marginRight: 20 }}></Image></Block>
            <Block row style={{ justifyContent: 'space-between' }}>
              <Block row style={{ justifyContent: 'space-between', marginRight: 10 }}>
                <Text h3 bold color={Colors.catalinaBlue}>{item.name}</Text>
                <Text h3 semibold color={Colors.catalinaBlue}>{item.quantity}x{item.unitPrice}</Text>
              </Block>
              <Block row flex={false}>
                <TextCurrency h3 bold color={Colors.catalinaBlue} value={item.quantity * item.unitPrice} />
                <Text h4 bold color={Colors.catalinaBlue}>đ</Text>  
              </Block>            
            </Block>
          </Block>
        )}
        <Block flex={false} row right style={{ marginVertical: 10 }}>
          <Text h3 bold color={Colors.catalinaBlue}>{strings('Process.total')}: </Text>
          <TextCurrency h3 bold color={Colors.catalinaBlue} value={totalCost}/>
          <Text h3 bold color={Colors.catalinaBlue}> vnđ</Text>
        </Block>
      </Block>
    )
  }
  renderEstimatesCostTask = () => {
    var dataEstimatesProcess = []
    const {materials} = this.state.dataTask
    if(materials){
      dataEstimatesProcess = materials
    }
    return (
      <Block flex={false}>
        {this.renderItemEstimatesCostPhase(dataEstimatesProcess)}
      </Block>
    )
  }
  renderItemSLDD = (data) => {
    return (
      <Block flex={false} >
        {data.map((item) =>
          <Block key={item.id} flex={false} style={styles.ItemSLDDD}>
            <Block center row flex={false}>
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
            </Block>
          </Block>
        )}
      </Block>
    )
  }
  renderSLDD = (data) => {
    return (
      <Block flex={false}>
        {this.renderItemSLDD(data)}
      </Block>
    )
  }
  render() {
    const { navigation } = this.props;
    const diffClamp = Animated.diffClamp(this.state.scrollY, 0, 45)
    const { item,summaryProcess } = this.props.navigation.state.params;
    const data = item;
    const params = summaryProcess
    const headerTranslate = diffClamp.interpolate({
      inputRange: [0, 45],
      outputRange: [0, -60],
      extrapolate: 'clamp',
    });
    return (
      <Block style={{ backgroundColor: "#B8F39A" }}>
        <Block flex={false} style={styles.estimatesTime}>
          <Block row center style={{}}>
            <Text bold h2>Thời gian thực hiện: {data.estimatedTime} {data.estimatedTimeUnit}</Text>
          </Block>
        </Block>
        <ScrollView style={styles.container}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
          )}
        >
          <Block style={styles.taskContent}>
            <Block center midle flex={false} style={{paddingHorizontal:30}}>
              <Text h2 bold>{data.name}</Text>
            </Block>
            <Block midle flex={false} style={{ paddingHorizontal: 20 }}>
              <Text h3 bold style={{ marginVertical: 10 }}>Mô tả công việc:</Text>
              <Text h3>{data.description}</Text>
            </Block>
            <Block midle flex={false} style={{ paddingHorizontal: 20 }}>
              <Text h3 bold style={{ marginVertical: 10 }}>Nguyên vât liệu:</Text>
              {this.renderEstimatesCostTask()}
            </Block>
            {data.measurements && data.measurements.length !== 0 ? 
            (<Block midle flex={false} style={{ paddingHorizontal: 20 }}>
              <Text h3 bold style={{ marginVertical: 10 }}>Số liệu đo đạc:</Text>
              {this.renderSLDD(data.measurements)}
            </Block> )
            :null}
            <Block flex={false} style={{ marginTop: 20, marginHorizontal: 20 }}>
              <Block row flex={false} style={{ justifyContent: 'space-between' }}>
                <Text h3 bold>Hình ảnh</Text>
                <TouchableOpacity
                  onPress={() => this.renderImagePicker()}
                  disabled={true}
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
            title={summaryProcess.name}
            navigation={navigation}
          >
          </Header>
        </Animated.View>
        <TouchableOpacity style={styles.buttonImplement}
        onPress={() => navigation.navigate(Screens.PROCESS_IMPLEMENT,params)}
        >
          <Text h3 bold color={Colors.white}>Triển</Text>
          <Text h3 bold color={Colors.white}>Khai</Text>
        </TouchableOpacity>
      </Block>
    )
  }
}
export default TaskDetailScreen;