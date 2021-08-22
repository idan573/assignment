import { RequestDataType, ResponseDataType } from '../reducers';

const stylistUserManagmentEndpoints = {
  [ENVIRONMENTS.DEV]: {
    url: 'https://ops-api.savvy.style/users/user_managment/stylist',
    apiKey: 'nXMw1zgqeevrkyES3fE984gHrR6siuOBeQv1BJj0'
  },
  [ENVIRONMENTS.OPERATIONS]: {
    url: 'https://ops-api.savvy.style/users/user_managment/stylist',
    apiKey: 'nXMw1zgqeevrkyES3fE984gHrR6siuOBeQv1BJj0'
  },
  [ENVIRONMENTS.STAGE]: {
    url: 'https://stage-api.savvy.style/users/user_managment/stylist',
    apiKey: 'lJL01hFWgA834S9SsPJTV4wFVvOyeqfu6XET5tBW'
  },
  [ENVIRONMENTS.PROD]: {
    url: 'https://api.savvy.style/users/user_managment/stylist',
    apiKey: 'mFx5j1Ye4V8BvN5gfokNx6LJe9apjOIs5F5vdtyK'
  }
};

export const getStylistInfo = async (
  data: RequestDataType
): Promise<ResponseDataType> => {
  const { url, apiKey } = stylistUserManagmentEndpoints[ENV];

  try {
    const response = await fetch(`${url}?userName=${data.userName}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      method: 'GET'
    });

    const stylist = await (() => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Unsuccessful response');
      }
    })();

    return stylist;
  } catch (error) {
    console.error('An error has occured while retrieving stylist', error);
  }
};
