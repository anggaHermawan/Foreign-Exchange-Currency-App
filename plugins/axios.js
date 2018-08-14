import * as appSettings from '@/_common/appSettings'

export default function ({ $axios, redirect }) {
  $axios.onRequest(function(config) {
    console.log('Making request to ' + config.url)
  })

  $axios.onError(function(error) {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/400')
    }
  })
}
