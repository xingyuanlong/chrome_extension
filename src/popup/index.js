import Vue from 'vue';
import { Button, MessageBox, Message, ColorPicker, Collapse, CollapseItem } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

Vue.use(Button);
Vue.use(ColorPicker);
Vue.use(Collapse);
Vue.use(CollapseItem);

Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;

let vm = new Vue({
  el: '#app',
  render: h => h(App)
});
