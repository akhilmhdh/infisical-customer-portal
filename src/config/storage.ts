const MemoryTokenStorage = () => {
    let authToken: string;
  
    return {
      setToken: (token: string) => {
        authToken = token;
      },
      getToken: () => authToken
    };
  };

const authTokenStorage = MemoryTokenStorage();

export const getAuthToken = authTokenStorage.getToken;
export const setAuthToken = authTokenStorage.setToken;