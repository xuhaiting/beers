import error from '@/page/error'
import index from '@/page/index'
import details from '@/page/details'
import design from '@/page/design'
import goods from '@/page/goods'
import instruction from '@/page/instruction'
import product from '@/page/product'
import user from '@/page/user'
import tenant from '@/page/tenant'
import role from '@/page/role'
import uds from '@/page/uds'

let routeList = [{
	path: '*',
	component:error
}, {
	path: '/',
	name: 'index',
	component: index
}, {
	path: '/user',
	name: 'user',
	component: user
}, {
	path: '/tenant',
	name: 'tenant',
	component: tenant
}, {
	path: '/role',
	name: 'role',
	component: role
}, {
	path: '/uds',
	name: 'uds',
	component: uds
}]
export default routeList;