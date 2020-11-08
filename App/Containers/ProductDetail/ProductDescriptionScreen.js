import React, { Component } from 'react'
import { View , Dimensions, ScrollView, Image} from 'react-native'
import {
    Button, Block,Text, BaseModal,
    Card, Header, Loading, CheckBox, TextCurrency, Input, Radio
  } from "../../Components";
import Style from './ProductDescriptionScreenStyle';
import { strings } from '../../Locate/I18n';
import HTML from 'react-native-render-html';
import { Config } from '../../Config/index';

const tagsStyles= { img: {height: 150, width: 300} }
class ProductDescriptionScreen extends Component {
    render() {
        const {navigation} = this.props;
        const {product} = navigation.state.params;
        return (
            <Block style={Style.view}>
                <Header 
                    title={strings('ProductDetail.headerProductDescription')}
                    isShowBack
                    navigation={navigation}
                    />
                <ScrollView style={Style.container} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                {product.imageUrl && (
                  <Image
                    source={{ uri: `${Config.IMAGE_URL}${product.imageUrl}`}}
                    style={Style.itemCarousel}
                  />
                  )}
                    <HTML html={product.longDescription} tagsStyles={tagsStyles} imagesInitialDimensions={{width: 300, height:150}}/>
                </ScrollView>
            </Block>
        )
    }
}

export default ProductDescriptionScreen
