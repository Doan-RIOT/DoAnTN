import React, { Component } from 'react';
import { FlatList, Image, TouchableOpacity, ImageBackground, ScrollView, Animated, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Sizes, Colors, ApplicationStyles, Images } from '../../Theme';
import { Screens } from '../../Utils/screens';
import {
  Button, Block, BaseModal, Cart,
  Card, Header, Input, Picker, Loading, Text,
} from "../../Components";
import { Title } from 'react-native-paper';
import styles from './ProcessDetailScreenStyle'
import { strings } from '../../Locate/I18n';
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale'
class ProcessDetailScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Index: 0,
      scrollY: new Animated.Value(0),
    }
  }
  componentDidMount() {

  }
  renderSlidePhase = () => {
    const summary = ["Thống kê", "Dự toán", "Bộ tiêu chí",];
    const process = ["Giai đoạn 1", "Giai đoạn 2", "Giai đoạn 3", "Giai đoạn 4", "Giai đoạn 5",];
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
  handleIndexContentProcess = Index => {
    this.setState({
      Index
    });
    console.log(this.state.Index)
  }
  renderItemQuestion = (item) => {
    return (
      <Block flex={false} style={{ paddingHorizontal: 17, backgroundColor: "#E7F8FD", borderRadius: 10, paddingVertical: 10, marginBottom: 10 }}>
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
            <Text h3 bold style={styles.Title_summary}>{item.summaryQT.QuyMo}</Text>
          </Block>
        </Block>
        <Block flex={false} style={styles.lineSummary}></Block>
        <Block center flex={false} style={styles.summaryContentItem}>
          <Block flex={false}><Image source={Images.iconCalendar}></Image></Block>
          <Block row style={{ justifyContent: 'space-between' }}>
            <Text h3 style={styles.Title_summary}>{strings('HomeFarm.executionTime')}:</Text>
            <Text h3 bold style={styles.Title_summary}>{item.summaryQT.thoiGianThucHien} Tháng</Text>
          </Block>
        </Block>
        <Block flex={false} style={styles.lineSummary}></Block>
        <Block center flex={false} style={styles.summaryContentItem}>
          <Block flex={false}><Image source={Images.iconSanLuong}></Image></Block>
          <Block row style={{ justifyContent: 'space-between' }}>
            <Text h3 style={styles.Title_summary}>{strings('HomeFarm.quantity')}:</Text>
            <Text h3 bold style={styles.Title_summary}>{item.summaryQT.SanLuong}</Text>
          </Block>
        </Block>
        <Block flex={false} style={styles.lineSummary}></Block>
        <Block center flex={false} style={styles.summaryContentItem}>
          <Block flex={false}><Image source={Images.iconInvest}></Image></Block>
          <Block row style={{ justifyContent: 'space-between' }}>
            <Text h3 style={styles.Title_summary}>{strings('HomeFarm.investmentCosts')}:</Text>
            <Text h3 bold style={styles.Title_summary}>{item.summaryQT.chiPhiDauTu}</Text>
          </Block>
        </Block>
        <Block flex={false} style={styles.lineSummary}></Block>
        <Block center flex={false} style={styles.summaryContentItem}>
          <Block flex={false}><Image source={Images.iconMoney}></Image></Block>
          <Block row style={{ justifyContent: 'space-between' }}>
            <Text h3 style={styles.Title_summary}>{strings('HomeFarm.profit')}:</Text>
            <Text h3 bold style={styles.Title_summary}>{item.summaryQT.LoiNhuan}</Text>
          </Block>
        </Block>
      </Block>
    );
  }
  renderQuestions = () => {
    const listQuestion = [
      { "name": "Cách phòng bệnh đạo ôn", "content": "Trung bình mỗi vụ lúa xuân hàng năm Nghệ An có từ 6000 - 7000 ha lúa bị bệnh đạo ôn lá, đạo ôn cổ bông, làm thất thiệt 10.000 - 11.000 tấn lúa. Riêng vụ xuân năm 2018 do có hàng ngàn ha lúa bị bệnh đạo ôn cổ bông nên mức độ thất thiệt là đến gần 100.000 tấn lúa.", "like": "10", "comment": "100" },
      { "name": "Cách phòng bệnh đạo ôn", "content": "Trung bình mỗi vụ lúa xuân hàng năm Nghệ An có từ 6000 - 7000 ha lúa bị bệnh đạo ôn lá, đạo ôn cổ bông, làm thất thiệt 10.000 - 11.000 tấn lúa. Riêng vụ xuân năm 2018 do có hàng ngàn ha lúa bị bệnh đạo ôn cổ bông nên mức độ thất thiệt là đến gần 100.000 tấn lúa.", "like": "10", "comment": "100" },
      { "name": "Cách phòng bệnh đạo ôn", "content": "Trung bình mỗi vụ lúa xuân hàng năm Nghệ An có từ 6000 - 7000 ha lúa bị bệnh đạo ôn lá, đạo ôn cổ bông, làm thất thiệt 10.000 - 11.000 tấn lúa. Riêng vụ xuân năm 2018 do có hàng ngàn ha lúa bị bệnh đạo ôn cổ bông nên mức độ thất thiệt là đến gần 100.000 tấn lúa.", "like": "10", "comment": "100" }
    ]
    return (
      <Block>
        {listQuestion.map((item) => this.renderItemQuestion(item))}
      </Block>
    )
  }
  renderSupplyAndDemandChart = () => {
    const dataSupply = [
      { "label": '1', "value": 5 },
      { "label": '2', "value": 100 },
      { "label": '3', "value": 85 },
      { "label": '4', "value": 35 },
      { "label": '5', "value": 53 },
      { "label": '6', "value": 66 },
      { "label": '7', "value": 96 },
      { "label": '8', "value": 33 },
      { "label": '9', "value": 73 },
      { "label": '10', "value": 81 },
      { "label": '11', "value": 73 },
      { "label": '12', "value": 21 },
    ]
    const dataDemand = [
      { "label": '1', "value": 24 },
      { "label": '2', "value": 28 },
      { "label": '3', "value": 93 },
      { "label": '4', "value": 77 },
      { "label": '5', "value": 52 },
      { "label": '6', "value": 21 },
      { "label": '7', "value": 53 },
      { "label": '8', "value": 89 },
      { "label": '9', "value": 20 },
      { "label": '10', "value": 86 },
      { "label": '11', "value": 73 },
      { "label": '12', "value": 21 },
    ]
    const barData = [
      {
        data: dataSupply,
        svg: {
          fill: '#8BD1A7',
        },
      },
      {
        data: dataDemand,
      },
    ]
    const dataY = []
    return (
      <Block row>
        <Block center flex={false}>
          <YAxis
            data={dataSupply}
            style={{ flex: 1, }}
            yAccessor={({ index }) => index}
            scale={scale.scaleBand}
            contentInset={{}}
            svg={{ fill: Colors.catalinaBlue, fontSize: 15, }}
            // spacing={0.2}
            formatLabel={(_, index) => dataSupply[index].label}
          />
        </Block>
        <ScrollView
          horizontal
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1, marginLeft: 10 }}
        >
          <Block style={{ width: 1000  }}>
            <BarChart
              style={{ height: 250 }}
              spacingInner={0.2}
              data={barData}
              yAccessor={({ item }) => item.value}
              svg={{
                fill: '#FFC106',
              }}
              contentInset={{ bottom: 10 }}
            >
              <Grid/>
            </BarChart>
            <Block style={[styles.line, { marginTop: 5 }]}></Block>
            <XAxis
              style={{ paddingTop: 10 }}
              data={dataSupply}
              scale={scale.scaleBand}
              formatLabel={(_, index) => `T${dataSupply[index].label}`}
              // spacingInner={0.2}
              // contentInset={{ left: 10, right: 20 }}
              svg={{ fontSize: 15, fill: Colors.catalinaBlue }}
            />
          </Block>
        </ScrollView>
      </Block>
    )
  }
  renderPriceChart = () => {
    const fill = '#B097F5'
    const data = [{ "value": 10, "label": '1', }, { "value": 68, "label": '2', }, { "value": 63, "label": '3', }, { "value": 80, "label": '4', }, { "value": 22, "label": '5', }, { "value": 100, "label": '5', }, { "value": 50, "label": '6', }, { "value": 50, "label": '7', }, { "value": 50, "label": '8', }, { "value": 99, "label": '9', }, { "value": 56, "label": '10', }, { "value": 44, "label": '11', }, { "value": 80, "label": '12', }]
    return (
      <Block row>
        <Block center flex={false}>
          <YAxis
            data={data}
            style={{ flex: 1, }}
            yAccessor={({ index }) => index}
            scale={scale.scaleBand}
            // contentInset={{ top: 10, bottom: 10 }}
            svg={{ fill: Colors.catalinaBlue, fontSize: 15, }}
            spacing={0.2}
            formatLabel={(_, index) => data[index].label}
          />
        </Block>
        <ScrollView
          horizontal
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1, marginLeft: 10 }}
        >
          <Block style={{ width: 600 }}>
            <BarChart
              style={{ height: 250 }}
              spacingInner={0.2}
              // spacingOuter ={0.2}
              data={data}
              yAccessor={({ item }) => item.value}
              svg={{ fill }}
              contentInset={{ top: 10, bottom: 10 }}
            >
              <Grid />
            </BarChart>
            <Block style={[styles.line, { marginTop: 5 }]}></Block>
            <XAxis
              style={{ paddingTop: 10 }}
              data={data}
              scale={scale.scaleBand}
              formatLabel={(_, index) => `T${data[index].label}`}
              spacingInner={0.2}
              // contentInset={{ left: 10, right: 20 }}
              svg={{ fontSize: 15, fill: Colors.catalinaBlue }}
            />
          </Block>
        </ScrollView>
      </Block>
    )
  }
  renderStatistical = () => {
    const data = { "summaryQT": { "LoiNhuan": "30000000", "QuyMo": "200", "SanLuong": "300", "TenQuyTrinh": "Trồng lúa Organic", "chiPhiDauTu": "100000000", "thoiGianThucHien": "3" } }
    const dataChart = [
      { "id": "1230", "tracker": "Cung", "description": [{ "label": "1", "value": "2000" }, { "label": "2", "value": "2000" }, { "label": "3", "value": "2000" }], "status": "New", "priority": "Normal", "parentTask": 1228, "image": "", "planStartDate": null, "planEndDate": null, "actualStartDate": null, "actualEndDate": null, "estimatedTime": "", "actualTime": "", "done": "0%", "nvlName": "", "nvlQuantityPlan": "", "nvlUnitPricePlan": "", "nvlQuantityActual": "", "nvlUnitPriceActual": "", "slddName": "", "slddDonVi": "", "slddGiaTriChuan": "", "slddActualValue": "" },
      { "id": "1230", "tracker": "Cau", "description": [{ "label": "1", "value": "2000" }, { "label": "2", "value": "2000" }, { "label": "3", "value": "2000" }], "status": "New", "priority": "Normal", "parentTask": 1228, "image": "", "planStartDate": null, "planEndDate": null, "actualStartDate": null, "actualEndDate": null, "estimatedTime": "", "actualTime": "", "done": "0%", "nvlName": "", "nvlQuantityPlan": "", "nvlUnitPricePlan": "", "nvlQuantityActual": "", "nvlUnitPriceActual": "", "slddName": "", "slddDonVi": "", "slddGiaTriChuan": "", "slddActualValue": "" },
      { "id": "1230", "tracker": "Gia", "description": [{ "label": "1", "value": "2000" }, { "label": "2", "value": "2000" }, { "label": "3", "value": "2000" }], "status": "New", "priority": "Normal", "parentTask": 1228, "image": "", "planStartDate": null, "planEndDate": null, "actualStartDate": null, "actualEndDate": null, "estimatedTime": "", "actualTime": "", "done": "0%", "nvlName": "", "nvlQuantityPlan": "", "nvlUnitPricePlan": "", "nvlQuantityActual": "", "nvlUnitPriceActual": "", "slddName": "", "slddDonVi": "", "slddGiaTriChuan": "", "slddActualValue": "" }
    ]
    return (
      <Block center flex={false} style={styles.statistical}>
        <Block flex={false} style={styles.summaryProcess} >
          {this.renderSummaryProcess(data)}
        </Block>
        <Block flex={false} style={styles.chart}>
          <Block row flex={false} style={{ paddingVertical: 5 }}>
            <Text h3 bold color={Colors.catalinaBlue}>{strings('Process.supplyAndDemandCharts')}</Text>
            <Block flex={false} center middle style={{ backgroundColor: Colors.white, marginLeft: 10, borderRadius: 20, paddingHorizontal: 10, }}>
              <Text h3 bold color={"#26C165"}>2020</Text>
            </Block>
            <Block flex={false} row center style={{ marginHorizontal: 5 }}>
              <Text h3 bold color={Colors.catalinaBlue}>Cung</Text>
              <Block flex={false} style={{ width: 30, height: "70%", backgroundColor: "#8BD1A7", marginLeft: 5, borderRadius: 10 }} ></Block>
            </Block>
            <Block flex={false} row center style={{ marginHorizontal: 5 }}>
              <Text h3 bold color={Colors.catalinaBlue}>Cầu</Text>
              <Block flex={false} style={{ width: 30, height: "70%", backgroundColor: "#F6C633", marginLeft: 5, borderRadius: 10 }} ></Block>
            </Block>
          </Block>
          <Block flex={false} style={{ marginVertical: 10 }}>
            <Text h3 bold color={Colors.catalinaBlue}>Tấn</Text>
          </Block>
          <Block style={{}}>
            {this.renderSupplyAndDemandChart()}
          </Block>
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
    return (
      <Block flex={false} >
        {data.map((item) =>
          <Block center flex={false} style={styles.ItemEstimatesPhase}>
            <Block flex={false}><Image source={Images.iconMaterial} style={{ resizeMode: "stretch", marginRight: 20 }}></Image></Block>
            <Block row style={{ justifyContent: 'space-between' }}>
              <Block row style={{ justifyContent: 'space-between', marginRight: 10 }}>
                <Text h3 bold color={Colors.catalinaBlue}>{item.name}</Text>
                <Text h3 semibold color={Colors.catalinaBlue}>{item.quantity}x{item.unitPrice}</Text>
              </Block>
              <Text h3 semibold color={Colors.catalinaBlue}>{item.quantity * item.unitPrice}</Text>
            </Block>
          </Block>
        )}
        <Block flex={false} row right style={{ marginVertical: 10 }}>
          <Text h3 bold color={Colors.catalinaBlue}>{strings('Process.total')}: </Text>
          <Text h3 bold color={Colors.catalinaBlue}>100 000 vnđ</Text>
        </Block>
      </Block>
    )
  }
  renderItemEstimatesCostProcess = (data) => {
    return (
      <Block flex={false}>
        {data.map((item) =>
          <Block flex={false} style={styles.ItemEstimatesProcess}>
            <Block flex={false} style={{ marginBottom: 10 }}>
              <Text h3 bold color={Colors.catalinaBlue}>{item.name}</Text>
            </Block>
            <Block flex={false} style={styles.estimatesPhase}>
              <Block row center flex={false} style={{ height: 50, }}>
                <Block center middle flex={false} >
                  <Image source={Images.iconMaterialTime} style={{ resizeMode: "stretch", marginRight: 10 }}></Image>
                </Block>
                <Text h3 color={Colors.catalinaBlue}>{strings('Process.time')}: </Text>
                <Text h3 color={Colors.catalinaBlue}>{item.estimatesTime} ngày</Text>
              </Block>
              <Block flex={false}>
                {this.renderItemEstimatesCostPhase(item.dataEstimatesPhase)}
              </Block>
            </Block>
          </Block>
        )}
        <Block style={styles.totalCostOfPhase}>
          <Text h3 bold color={Colors.white}>{strings('Process.totalCost')} :</Text>
          <Text h3 bold color={Colors.white}>100 0000 vnđ</Text>
        </Block>
      </Block>
    )
  }
  renderEstimatesCostProcess = () => {
    const dataEstimatesProcess = [
      { "name": "Giai đoạn 1", "estimatesTime": 15, "dataEstimatesPhase": [{ "id": 1, "name": "Phân NPK", "quantity": 50, "unitPrice": "50000" }, { "id": 2, "name": "Phân NPK", "quantity": 50, "unitPrice": "50000" }, { "id": 3, "name": "Phân NPK", "quantity": 50, "unitPrice": "50000" }] },
      { "name": "Giai đoạn 2", "estimatesTime": 15, "dataEstimatesPhase": [{ "id": 1, "name": "Phân NPK", "quantity": 50, "unitPrice": "50000" }, { "id": 2, "name": "Phân NPK", "quantity": 50, "unitPrice": "50000" }, { "id": 3, "name": "Phân NPK", "quantity": 50, "unitPrice": "50000" }] }]
    return (
      <Block flex={false} style={styles.renderContent}>
        {this.renderItemEstimatesCostProcess(dataEstimatesProcess)}
      </Block>
    )
  }
  renderStandard = () => {
    return (
      <Block flex={false}>
        <Text h2 > Bộ tiêu chí</Text>
      </Block>
    )
  }
  renderTask = (data) => {
    return (
      <Block flex={false}>
        {data.map((item) =>
          <Block center flex={false} row style={{ marginBottom: 10 }} >
            <Block flex={false} style={styles.dot} />
            <TouchableOpacity style={styles.task}>
              <Text h3 bold color={Colors.catalinaBlue}>{item.name}</Text>
              <Text h4 color={Colors.catalinaBlue}>{item.estimatesTime} Ngày</Text>
            </TouchableOpacity>
          </Block>
        )}
      </Block>
    )
  }
  renderProcess = () => {
    const dataEstimatesProcess =
      [{ "id": 1, "name": "Phân NPK", "quantity": 50, "unitPrice": "50000" }, { "id": 2, "name": "Phân Quế lâm", "quantity": 50, "unitPrice": "50000" }, { "id": 3, "name": "Đạm", "quantity": 50, "unitPrice": "50000" }]
    const listTask = [{ "id": "1", "name": "Vệ sinh đồng ruộng", "estimatesTime": 4, }, { "id": "2", "name": "Làm đất", "estimatesTime": 6, }, { "id": "3", "name": "Bón phân quế lâm", "estimatesTime": 5, }, { "id": "4", "name": "Bón phân NPK", "estimatesTime": 3, }]
    return (
      <Block flex={false} style={styles.renderContent}>
        <Text h2 bold color={Colors.catalinaBlue}>Giai đoạn chuẩn bị giống và làm đất</Text>
        <Block flex={false} row center flex={false} style={{ paddingVertical: 10 }} >
          <Block flex={false} center middle flex={false}>
            <Image source={Images.iconMaterialTime} style={{ resizeMode: "stretch", marginRight: 10 }}></Image>
          </Block>
          <Text h3 color={Colors.catalinaBlue}>{strings('Process.time')}: </Text>
          <Text h3 color={Colors.catalinaBlue}>ngày</Text>
        </Block>
        <Block flex={false} style={styles.estimatesPhase}>
          <Block row center flex={false} style={{ marginBottom: 10 }}>
            <Block flex={false} style={{ backgroundColor: "#ffffff", alignItems: 'center', justifyContent: 'center', }}>
              <Image source={Images.iconMaterialMoney} style={{ resizeMode: "stretch", marginRight: 10 }}></Image>
            </Block>
            <Text h3 bold color={"#26C165"}>{strings('Process.cost')}</Text>
          </Block>
          <Block flex={false} >
            {this.renderItemEstimatesCostPhase(dataEstimatesProcess)}
          </Block>
        </Block>
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
        return (
          <Block flex={false} >
            {this.renderProcess()}
          </Block>
        )
    }
  }
  render() {
    const { navigation } = this.props;
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
    const data = { "summaryQT": { "LoiNhuan": "30000000", "QuyMo": "200", "SanLuong": "300", "TenQuyTrinh": "Trồng lúa Organic", "chiPhiDauTu": "100000000", "thoiGianThucHien": "3" } }
    return (
      <Block>
        <ScrollView style={styles.container}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
          )}
        >
          <Block flex={false} style={styles.bar}>
            <ImageBackground source={Images.imageHeader} style={styles.backGroundImage} imageStyle={{ resizeMode: "stretch", borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
              <Block column flex={false} style={{ paddingHorizontal: 20, paddingTop: 30, }}>
                <Block flex={false} style={styles.video}></Block>
                <Block flex={false} style={styles.slidePhase}>
                  {this.renderSlidePhase()}
                </Block>
              </Block>
            </ImageBackground>
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
            title={'Trồng lúa Organic'}
            navigation={navigation}
          >
          </Header>
        </Animated.View>
        <TouchableOpacity style={styles.buttonImplement}
          onPress={() => navigation.navigate(Screens.PROCESS_IMPLEMENT)}
        >
          <Text h3 bold color={'#26C165'}>{strings('Process.implement')}</Text>
        </TouchableOpacity>
      </Block>

    )
  }
}
export default ProcessDetailScreen;