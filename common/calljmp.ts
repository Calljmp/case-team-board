import { Calljmp } from "@calljmp/react-native";

const calljmp = new Calljmp({
  development: {
    enabled: __DEV__,
    apiToken: '7re7Y90ojA+1jh23wETNwLrxteisGvSgwUEj1ufmP37kO0VjQxJRKNkfXrAetk8/godfcuQYldD5+rnlxyu/Bg==',
    baseUrl: 'http://192.168.86.245:8787'
  }
});

export default calljmp;
