import { createClient } from 'graphql-ws';

export const query = (
  qlkubeUrl,
  queryString, 
  clusterUrl, 
  token,
  queryVariables,
  selfManagedClient
) => {
  const connectionParams= {
    authorization: `Bearer ${token}`,
    clusterUrl,
    query: queryString,
    variables: queryVariables
  };

  const client = selfManagedClient ? selfManagedClient : createClient({
    url: qlkubeUrl,
    connectionParams
  });
  return new Promise((resolve, reject) => {
    let result;
    client.subscribe(connectionParams, {
      next: (data) => {
        result = data;
      },
      error: reject,
      complete: () => resolve(result),
    });
  });
};

export const subscribe = async (
  qlkubeUrl,
  queryString,
  clusterUrl,
  token,
  queryVariables,
  onData,
  onError,
  onComplete,
  selfManagedClient
) => {
  const client = selfManagedClient ? selfManagedClient : createClient({
    url: qlkubeUrl,
  });
  const connectionParams = {
    authorization: `Bearer ${token}`,
    clusterUrl,
    query: queryString,
    queryVariables
  };
  client.subscribe(
    connectionParams,
    {
      next: onData,
      error: onError,
      complete: onComplete,
    },
  );
  return client;
};