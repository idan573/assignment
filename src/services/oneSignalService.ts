const axios = require('axios');

class OneSignalService {
  appId = '5938d36e-e222-4509-9b3a-5e6db792a5b4';
  oneSignalBaseUrl = 'https://onesignal.com/api/v1/';
  oneSignalEditDevicePath = playerId => `players/${playerId}`;
  oneSignalApiKey = 'MzEzYzQxOGUtM2U2My00Yzk0LTllODAtNGY2ZGQ3MDgwZGNj'
  private isSetExternalUserId = false;
  headers = {
      'Authorization': `Basic ${this.oneSignalApiKey}`
  }
  constructor() {}

  public async setExternalUserId(playerId, userId) {
    if(this.isSetExternalUserId) {
        console.log('OneSignalService.setExternalUserId already set');
        return;
    }
    const url = `${this.oneSignalBaseUrl}${this.oneSignalEditDevicePath(
      playerId
    )}`;
    try {
      const response = await axios.put(url, {
        app_id: this.appId,
        external_user_id: userId
      },
      {
          headers: this.headers
      });
      console.log('OneSignalService.setExternalUserId response=', response);
      if(response.status === 200) {
        this.isSetExternalUserId = true;
      }
      return response;
    } catch (e) {
      console.log('OneSignalService.setExternalUserId error=', e);
      return e;
    }
  }
}

export const oneSignalService = new OneSignalService();
