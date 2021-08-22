const devConfig = {
  url:
    'https://axoho6fc6ng5fbsm24xkygfvwq.appsync-api.us-east-1.amazonaws.com/graphql',
  region: 'us-east-1',
  auth: {
    type: 'API_KEY' as const,
    apiKey: 'da2-7d4mogzqr5bchgerpmi7eu55ae'
  },
  identityPoolId: 'us-east-1:88eff300-0658-4b1e-94bc-ba89e0d2bd67'
};

const stageConfig = {
  url:
    'https://nxcovxwe7ffmlgwmkodo5mw7ny.appsync-api.us-east-1.amazonaws.com/graphql',
  region: 'us-east-1',
  auth: {
    type: 'API_KEY' as const,
    apiKey: 'da2-sqn3nwoli5b2taaggdvysdcjze'
  },
  identityPoolId: 'us-east-1:1d5c3dbb-4ba6-4851-9435-47034cf6d5f1'
};

const prodConfig = {
  url:
    'https://crundlhmyvblzbdmckydlfy7ju.appsync-api.us-east-1.amazonaws.com/graphql',
  region: 'us-east-1',
  auth: {
    type: 'API_KEY' as const,
    apiKey: 'da2-6jwjwp72kbaxvlixg5k5gz7pbi'
  },
  identityPoolId: 'us-east-1:ecc5c699-02b3-49a4-a199-6fd9ac175509'
};

const awsConfig = () => {
  switch (ENV) {
    case ENVIRONMENTS.DEV:
    case ENVIRONMENTS.OPERATIONS:
      return devConfig;
    case ENVIRONMENTS.STAGE:
      return stageConfig;
    case ENVIRONMENTS.PROD:
      return prodConfig;
    default:
      return devConfig;
  }
};

export default awsConfig();
