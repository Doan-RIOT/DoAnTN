import React from 'react';
import { View, Image, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Card } from 'react-native-elements';
import { Constants, Icons, Config, Images, Colors, ResponsiveUtils } from "@common";

export default class ItemActivity extends React.Component {
  state = {
    checked: false,
  }

  shouldComponentUpdate(nextProps) {
    if(nextProps.activity == null) {
      return false;
    }

    if (this.props.activity !== nextProps.activity) {
      return true;
    }

    return false;
  }

  render() {
    const { activity, index } = this.props;
    if(index == 0) {
      return (
        <Card containerStyle={styles.container}>
          <TouchableOpacity onPress={this.addActivity}>
            <View style={styles.containerTitleHome}>
              <Icon name='home' size={ResponsiveUtils.normalize(30)} color='white' />
            </View>
            <View style={styles.containerBody}>
              <Text style={styles.iconAdd}>+</Text>
              <Text>{__.t("Register your institution")}</Text>
            </View>
          </TouchableOpacity>
        </Card>
      );
    }
    else {
      return (
        <Card containerStyle={styles.container}>
          <View style={styles.containerTitleItem}>
            <View style={{flex: 1, alignItems: 'center', flexDirection: 'column'}}>
              <Text style={styles.title}>{activity.title}</Text>
            </View>
            <TouchableOpacity style={{padding: 15}} onPress={this.onDeleteActivity}>
              <Icon name='trash-alt' size={20} color='white' />
            </TouchableOpacity>
          </View>
          <View style={styles.containerBody}>
            <Text style={styles.titleContent}>{activity.title_content}</Text>
            <Text>{__.t("Monthly cost", {cost: activity.monthly_cost})}</Text>
            <Text>{__.t("Payment date", {"date": activity.payment_date})}</Text>
          </View>
        </Card>
      );
    }
  }

  addActivity = () => {

  }

  onDeleteActivity = () => {
    alert('Are you sure you want to delete?');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    margin: ResponsiveUtils.normalize(10),
    padding: 0,
    borderRadius: ResponsiveUtils.normalize(15)
  },
  containerTitleHome: {
    flexDirection: 'row',
    height: ResponsiveUtils.normalize(60),
    backgroundColor: '#BEBEBE',
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerTitleItem: {
    flexDirection: 'row',
    height: ResponsiveUtils.normalize(60),
    backgroundColor: Colors.appColor,
    alignItems: 'center',
    paddingStart: ResponsiveUtils.normalize(15)
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: ResponsiveUtils.normalize(24)
  },
  containerBody: {
    paddingVertical: ResponsiveUtils.normalize(30),
    paddingHorizontal: ResponsiveUtils.normalize(10),
    alignItems: 'center'
  },
  iconAdd: {
    marginBottom: ResponsiveUtils.normalize(10),
    fontSize: ResponsiveUtils.normalize(30)
  },
  titleContent: {
    fontWeight: 'bold',
    marginBottom: ResponsiveUtils.normalize(10),
    fontSize: ResponsiveUtils.normalize(18)
  }
});