import Amplify from '@aws-amplify/core';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as Sentry from '@sentry/browser';

import awsConfig from 'App/api/awsConfig';
import { authService } from 'services/authService';

class GraphqlService {
  public configurePublic(userId: string) {
    try {
      /* Public Config */
      Amplify.configure({
        API: {
          graphql_endpoint: awsConfig.url,
          graphql_headers: () => ({
            'x-api-key': awsConfig.auth.apiKey,
            'savvy-user-id': userId
          })
        }
      });
      console.log(`configure public graphql service ${userId}`);
    } catch (error) {
      console.error('Failed to configure Public service', error);
    }
  }

  public configureSecure(token: string) {
    try {
      /* Secured Config */
      Amplify.configure({
        API: {
          graphql_endpoint: awsConfig.url,
          graphql_headers: () => ({
            'access-token': token,
            'x-api-key': awsConfig.auth.apiKey
          })
        }
      });
      console.log(`configured secure graphql service`);
    } catch (error) {
      console.error('Failed to configure Secure service', error);
    }
  }

  public async graphqlOperation<T, O>(
    operation: any,
    variables: T
  ): Promise<O> {
    try {
      const { data }: any = await API.graphql(
        graphqlOperation(operation, variables)
      );

      return data;
    } catch (error) {
      console.error(error);

      if (ENV === ENVIRONMENTS.PROD) {
        Sentry.withScope(scope => {
          scope.setTag('ENV', ENV);
          scope.setTag(
            'GRAPHQL_OPERATION_NAME',
            operation?.definitions?.[0]?.name?.value
          );
          scope.setTag('VARIABLES', JSON.stringify(variables));
          Sentry.captureException(error);
        });
      }
    }
  }
}

export const graphqlService = new GraphqlService();
