<template>
  <v-app>
    <v-content>
      <v-layout row mt-3>
        <v-flex xs12 sm4 md4 offset-sm4 offset-md4>
          <v-toolbar>
            <v-toolbar-title>  <b>{{inputCurrency.text}} - {{inputCurrency.desc}}</b></v-toolbar-title>
          </v-toolbar>
          <v-card>
            <v-layout wrap>
              <v-flex xs12 sm4 md4 mb-4 ml-4>
                <v-overflow-btn
                  @change="onChangeInputCurrency"
                  v-model="inputCurrency"
                  :items="currencyList"
                  label="Select currency"
                  item-text="text"
                  return-object
                  hide-details
                ></v-overflow-btn>
              </v-flex>
              <v-flex xs12 sm2 md2></v-flex>
              <v-flex xs12 sm5 md5 mt-4>
              <v-text-field
                v-on:keypress="isNumber()"
                @input="onChangeInputValue"
                v-model="inputValue"
                style="text-align-last: right;margin-top: 0"
              ></v-text-field>
            </v-flex>
            </v-layout>
          </v-card>
          <v-card >
            <v-card-text>
              <v-card>
                <v-list two-line>
                  <template v-for="(item, index) in items">
                    <v-list-tile
                      :key="item.title"
                      avatar
                      ripple
                    >
                      <v-list-tile-content>
                        <v-list-tile-title><b>{{ item.calculateBaseValue }}</b></v-list-tile-title>
                        <v-list-tile-sub-title class="text--primary">{{ item.base }}</v-list-tile-sub-title>
                        <v-list-tile-sub-title><b>{{ item.value }}</b></v-list-tile-sub-title>
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-btn icon ripple @click="onRemove(index)">
                          <v-icon >remove_circle</v-icon>
                        </v-btn>
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-divider
                      v-if="index + 1 < items.length"
                      :key="index"
                    ></v-divider>
                  </template>
                </v-list>
              </v-card>

              <v-flex d-flex xs12 sm12 md12 mt-3>
                <v-btn color="orange" v-if="isShowAdd" @click="onBtnAddCurrencies">
                  <b>Add More Currencies</b>
                  <v-icon right dark large>add_circle</v-icon>
                </v-btn>
                <v-toolbar dense v-if="isShowSubmit" >
                  <v-overflow-btn
                    v-model="currency"
                    :items="currencies_items"
                    label="Select currency"
                    item-text="text"
                    return-object
                    hide-details
                  ></v-overflow-btn>
                  <v-divider vertical></v-divider>
                  <v-btn @click="onSubmit">
                    <b>Submit</b>
                  </v-btn>
                </v-toolbar>
              </v-flex>

            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-content>
    <v-footer app></v-footer>
    <v-dialog
      v-model="dialog"
      width="250"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Information
        </v-card-title>

        <v-card-text>
            {{messageDialog}}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="dialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
  import services from '@/pages/services'
  import formatter from '@/_common/helpers/formatter'
  const axios = require('axios');

  export default {
    mounted (){
      this.getBaseValue()
    },
    data () {
      return {
        dialog: false,
        messageDialog: '',
        isShowAdd: true,
        isShowSubmit: false,
        listDataValue: [],
        inputValue: 10.00,
        inputCurrency: {text:'USD',desc:'United States Dollar'},
        tempInputCurrency: {text:'USD',desc:'United States Dollar'},
        currency: null,
        currencyList: [
          {text:'USD',desc:'United States Dollar'},
          {text:'INR',desc:'Indian Rupee'},
          {text:'MYR',desc:'Malaysian ringgit'},
          {text:'JPY',desc:'Japanese Yen'},
          {text:'KRW',desc:'South Korean Won'},
          {text:'EUR',desc:'Euro'},
          {text:'CAD',desc:'Canadian Dollar'},
          {text:'IDR',desc:'Indonesian Rupiah'},
          {text:'GBP',desc:'British Pound'},
          {text:'CHF',desc:'Swiss Franc'},
          {text:'SGD',desc:'Singapore Dollar'},
          ],
        currencies_items: [
          {text:'INR',desc:'Indian Rupee'},
          {text:'MYR',desc:'Malaysian ringgit'},
          {text:'JPY',desc:'Japanese Yen'},
          {text:'KRW',desc:'South Korean Won'},
          {text:'EUR',desc:'Euro'}
          ],
        dataList: [
          {text:'CAD',desc:'Canadian Dollar'},
          {text:'IDR',desc:'Indonesian Rupiah'},
          {text:'GBP',desc:'British Pound'},
          {text:'CHF',desc:'Swiss Franc'},
          {text:'SGD',desc:'Singapore Dollar'},
        ],
        items: []
      }
    },

    methods: {
      calculate () {
        this.items = []
        for(let i = 0 ; i < this.dataList.length ; i++){
          let itemsData = {
            calculateBaseValue: 0,
            base: '',
            value: ''
          }
          itemsData.calculateBaseValue = this.dataList[i].text + ' ' +  formatter.formatPrice(this.inputValue * this.listDataValue[this.dataList[i].text])
          itemsData.base = this.dataList[i].text + ' - ' + this.dataList[i].desc
          itemsData.value = '1 ' + this.inputCurrency.text + ' = ' + this.dataList[i].text + ' ' +  formatter.formatPrice( this.listDataValue[this.dataList[i].text])
          this.items.push(itemsData)
        }
      },
      getBaseValue (){
        services.getBaseValue(this.inputCurrency.text, this.getBaseValueCallback)
      },
      getBaseValueCallback (properties){
        if (properties.IsHttpError === false) {
          this.listDataValue = []
          this.listDataValue = properties.ResponseData.data.rates
          this.calculate()
         console.log("Succes get Base Value")
        } else {
          this.messageDialog = 'Failed get Base Value'
          this.dialog = true
        }
      },
      onRemove (index) {
        for(let i = 0 ; i < this.dataList.length ; i++){
          if(this.dataList[i].text == this.items[index].base.substring(0,3)){
            this.currencies_items.push(this.dataList[i])
            this.dataList.splice(i,1)
          }
        }
        this.items.splice(index, 1)
      },
      onBtnAddCurrencies (){
        this.isShowAdd = false
        this.isShowSubmit = true
      },
      onSubmit (){
        if(this.currency != null){
          this.dataList.push(this.currency)
          for (let j =0 ; j < this.currencies_items.length ; j++){
            if(this.currencies_items[j].text == this.currency.text){
              this.currencies_items.splice(j,1)
            }
          }
          let itemsData = {
            calculateBaseValue: 0,
            base: '',
            value: ''
          }
          itemsData.calculateBaseValue = this.currency.text + ' ' +  formatter.formatPrice(this.inputValue * this.listDataValue[this.currency.text])
          itemsData.base = this.currency.text + ' - ' + this.currency.desc
          itemsData.value = '1 ' + this.inputCurrency.text + ' = ' + this.currency.text + ' ' +  formatter.formatPrice( this.listDataValue[this.currency.text])
          this.items.push(itemsData)
          this.isShowAdd = true
          this.isShowSubmit = false
          this.currency = null
        }else {
          this.messageDialog = 'Please Select Currency'
          this.dialog = true
        }

      },
      onChangeInputValue () {
        this.calculate()
      },
      isNumber () {
        debugger
        let evt = window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
          evt.preventDefault()
        }else if( charCode == 46){
          var str = this.inputValue.toString()
          if (str.includes(".")){
            evt.preventDefault()
          }else {
            return true;
          }
        } else {
          return true;
        }
      },
      onChangeInputCurrency () {
        this.currencies_items.push(this.tempInputCurrency)
        this.tempInputCurrency = this.inputCurrency
        for (let j =0 ; j < this.currencies_items.length ; j++){
          if(this.currencies_items[j].text == this.inputCurrency.text){
            this.currencies_items.splice(j,1)
          }
        }
        for (let i =0 ; i < this.dataList.length ; i++){
          if(this.dataList[i].text == this.inputCurrency.text){
            this.dataList.splice(i,1)
          }
        }
        this.getBaseValue()
      },
    },
  }
</script>

<style>

</style>
