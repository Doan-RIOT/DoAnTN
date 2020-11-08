
import React from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import { Colors, ResponsiveUtils, Constants} from "@common";
import Text from './Text';
import { Card } from 'react-native-elements';

export default class ChildActivity extends React.PureComponent {
  render() {
    const { activity } = this.props;
    return (
      <Card containerStyle={styles.container}>
        <View style={styles.containerTitle}>
          <Text style={styles.nameActivity}>{activity.name}</Text>
        </View>
        <View style={styles.containerBody}>
          <Text style={styles.time}>{activity.from} ~ {activity.to}</Text>
          <Text>{activity.address}</Text>
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: ResponsiveUtils.normalize(20),
    padding: 0,
    overflow: 'hidden',
    marginHorizontal: 0,
    marginBottom: ResponsiveUtils.normalize(30),
    marginTop: 0
  },
  containerTitle: {
    flexDirection: 'row',
    padding: ResponsiveUtils.normalize(10),
    justifyContent: 'center',
    backgroundColor: '#42A5F5',
  },
  nameActivity: {
    fontSize: ResponsiveUtils.normalize(24),
    color: 'white',
    fontWeight: 'bold'
  },
  containerBody: {
    padding: ResponsiveUtils.normalize(24),
    alignItems: 'center',
    justifyContent: 'center'
  },
  time: {
    fontWeight: 'bold',
    marginBottom: ResponsiveUtils.normalize(15)
  },
})