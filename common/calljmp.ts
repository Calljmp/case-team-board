import { Calljmp } from "@calljmp/react-native";

const calljmp = new Calljmp({
  development: {
    enabled: __DEV__,
    apiToken: 'WxRm2EXOeFkTMobgox7zA7mkjpJpG3fBCcuS2Y/y48T7gWykiAXIPz1ACLxdNC+HOt/62CFFB/Pjg6HSPlgGJg=='
  }
});

export default calljmp;
