import Vue from 'vue'
import Router from 'vue-router'
import routeList from './routeList'

const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
	return routerPush.call(this, location).catch(error => error)
}

Vue.use(Router);

// function getRoute() {
// 	let routes = [];
// 	let list = ["index","details"]
// 	list.map(v => {
// 		let _obj = {
// 			path: '/' + v,
// 			name: v,
// 			component: ''
// 		}
// 		if (v == "index") _obj['path'] = '/';
// 		routes.push(_obj)
// 	})
// 	routes.forEach(router => {
// 		let component = router.name;
// 		router.component = resolve => {
// 			require[('@/page/' + component + '.vue'), resolve]
// 		}
// 	})
// 	return routes;
// }

export default new Router({
	saveScrollPosition:true,
	mode: 'history',
	routes: routeList
})
