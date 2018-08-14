import callbackProp from '@/_common/helpers/httpCallbackProp'
import * as appSettings from '@/_common/appSettings'
const axios = require('axios');


export default {
  getBaseValue (paramData, callback) {
    axios({
      method: 'get',
      url: appSettings.URL_GET_BASE_VALUE + paramData,
    })
      .then(function(response) {
        callbackProp.IsHttpError = false
        callbackProp.HttpErrorMessage = ''
        callbackProp.ResponseData = response
        callback(callbackProp)
      }).catch(e => {
        callbackProp.IsHttpError = true
        callbackProp.HttpErrorMessage = e
        callbackProp.ResponseData = ''
        callback(callbackProp)
    });
  },
}
