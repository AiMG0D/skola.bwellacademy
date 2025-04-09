import router from "@/router";
import {useStore} from "@/stores/main";

export default (from: any, to: any) => {
  const store = useStore();

  if (store.loggedIn) {
    return { path: '/home' };
  }
};
