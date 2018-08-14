import { appLogger } from '@/_common/helpers/appLogger'
import callbackProp from '@/_common/helpers/httpCallbackProp'
import * as appSettings from '@/_common/appSettings'
import HTTP from '@/_common/helpers/httpCommon'

export default {

  login (username, password, callback) {

    appLogger('An method of [/_common/httpCommon/services/authService.login] has been call!')

    const requestDto = {
      username: username,
      password: password
    }
    appLogger('/services/authService.login.requestDto:', JSON.stringify(requestDto))

    HTTP.getHttpClient().post(appSettings.LOGIN_URL,
      requestDto
    ).then(response => {
      appLogger('/services/authService.login.response:', JSON.stringify(response))
      appLogger('/services/authService.login.status:', response.data.status)

      if (response.data.status === true) {
          let token = response.headers.authorization
          let refreshToken = response.headers['x-refresh-token']
          let tokenExpiry = response.data.expires_in
          $nuxt.$store.dispatch('auth/login', {username: username, token: token, tokenExpiry: tokenExpiry, refreshToken: refreshToken})
          callbackProp.IsHttpError = false
          callbackProp.HttpErrorMessage = response.data.messages
        } else {
          callbackProp.IsHttpError = true
          callbackProp.HttpErrorMessage = response.data.messages
          $nuxt.$store.dispatch('auth/logout')
        }

      callbackProp.ResponseHeaders = response.headers
      callbackProp.ResponseData = response.data

      appLogger('/services/authService.login.callbackProp:', callbackProp)

      callback(null, callbackProp)
    })
      .catch(e => {
        appLogger('/services/authService.login.fail:', e)
        callbackProp.IsHttpError = true
        callbackProp.HttpErrorMessage = e.message
        callbackProp.ResponseHeaders = ''
        callbackProp.ResponseData = ''
        $nuxt.$store.dispatch('auth/logout')
        callback(e, callbackProp)
      })
  },
  logout (username, callback) {
    appLogger('An method of [/_common/httpCommon/services/authService.logout] has been call!')

    const requestDto = {}
    appLogger('/api/auth.logout.requestDto:', JSON.stringify(requestDto))

    HTTP.getHttpClient().post(appSettings.LOGOUT_URL,
      requestDto
    ).then(response => {

      $nuxt.$store.dispatch('auth/logout')

      callbackProp.IsHttpError = false
      callbackProp.HttpErrorMessage = ''
      callbackProp.ResponseHeaders = response.headers
      callbackProp.ResponseData = response.data

      appLogger('/services/authService.logout.callbackProp:', callbackProp)

      callback(null, callbackProp)

    })
      .catch(e => {
        appLogger('/services/authService.logout.fail:', e)
        callbackProp.IsHttpError = true
        callbackProp.HttpErrorMessage = e.message
        callbackProp.ResponseHeaders = ''
        callbackProp.ResponseData = ''
        callback(e, callbackProp)
      })
  }
}
