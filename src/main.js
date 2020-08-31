// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '../common/bags'
import 'element-ui/lib/theme-chalk/index.css'
import '../src/assets/css/public.css'

Vue.config.productionTip = false

export default new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>'
})
