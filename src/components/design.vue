<template>
	<div class="designContainer">
        <div class="beers">
            <div class="imgUnit" :class="{active: active === item.id}" v-for="item in list" :key="item.id" 
                :style="{
                    width: item.position.width + 'px', 
                    height: item.position.height + 'px',
                    left: item.position.x + 'px',
                    top: item.position.y + 'px',
                    transform:'rotate('+item.position.rotate+'deg)',
                    zIndex: item.position.zIndex
                }"
                @touchstart="onHandleTouchStart($event, {...item})"
                @touchmove="onHandleTouchMove"
                @touchend="onHandleTouchEnd"
            >
                <img class="img" :src="item.url"/>
                <div class='drag' v-if="active === item.id">
                    <div class="dragBtn scale el-icon-crop"
                        @touchstart.prevent.stop="onHandleScaleStart"
                        @touchmove.prevent.stop="onHandleScale"
                        @touchend.prevent.stop="onHandleScaleEnd"
                    ></div>
                    <div class="dragBtn del el-icon-error"
                        @touchstart.prevent.stop="onHandleDel({...item})"
                    ></div>
                    <div class="dragBtn up el-icon-upload2"
                        @touchstart.prevent.stop="onHandleUp"
                    ></div>
                    <div class="dragBtn down el-icon-download"
                        @touchstart.prevent.stop="onHandleDown"
                    ></div>
                    <!-- <div class="rotate"
                        @touchStart.prevent.stop="onHandleRotateStart"
                        @touchmove.prevent.stop="onHandleRotateMove"
                    >
                        <div class="el-icon-refresh"></div>
                    </div> -->
                </div>
            </div>
        </div>
		<div class="operate"></div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
                list: [],
                active: 2,
                index: '',
                clientX: 0,
                clientY: 0,
                x: 0,
                y: 0,
                rotateX: 0,
                rotateY: 0,
                ratio: 1,
                boundObject: {},
                position: {},
                centerPoint: {}
			};
        },
        props: {
            data: {
                type: Array
            }
        },
        methods: {
            onHandleUp() {
                this.list[this.index].position.zIndex ++;
            },
            onHandleDown() {
                this.list[this.index].position.zIndex --;
            },
            onHandleDel(item) {
                const { id, position } = item;
                const index = this.list.findIndex(r => {
                    return r.id === id
                })
                this.list.splice(index, 1);
            },
            onHandleScaleStart(e) {
                this.ratio = 1;
                const touches = e.touches[0];
                const { clientX, clientY } = touches;
                const { x, y } = this.boundObject;
                const diagonal = Math.sqrt(Math.pow((clientX - x), 2) + Math.pow((clientY - y), 2));
                this.centerPoint["diagonal"] = diagonal; 
            },
            onHandleScale(e) {
                const touches = e.touches[0];
                const { clientX, clientY } = touches;
                const { x, y } = this.boundObject;
                const { diagonal } = this.centerPoint;
                const { width, height } = this.position;
                const ndiagonal = Math.sqrt(Math.pow((clientX - x), 2) + Math.pow((clientY - y), 2));
                const ratio = ndiagonal / diagonal;
                this.ratio = ratio;
                this.list[this.index].position.width = width * ratio;
                this.list[this.index].position.height = height * ratio;
            },
            onHandleScaleEnd() {
                const ratio = this.ratio;
                const { width, height } = this.position;
                this.position.width = width * ratio;
                this.position.height = height * ratio;
                const { x, y } = this.centerPoint;
                this.centerPoint.x = x * ratio;
                this.centerPoint.y = y * ratio;
            },
            onHandleRotateStart(e) {
                const touches = e.touches[0];
                const { clientX, clientY } = touches;
                this.rotateX = clientX;
                this.rotateY = clientY;
            },
            onHandleTouchStart(e, item) {
                const touches = e.touches[0];
                const { clientX, clientY } = touches;
                this.clientX = clientX;
                this.clientY = clientY;
                const { id, position = {} } = item;
                const index = this.list.findIndex(r => {
                    return r.id === id
                })
                this.active = id;
                this.index = index;
                this.position = Object.assign({}, position);
                const boundObject = e.target.getBoundingClientRect();
                this.boundObject = boundObject;
                const { x, y, width, height } = boundObject;
                const cx = x + width / 2;
                const cy = y + height / 2;
                this.centerPoint = {
                    x: cx,
                    y: cy
                }
            },
            onHandleTouchMove(e) {
                const touches = e.touches[0];
                const { clientX, clientY } = touches;
                const item = this.list[this.index];
                const { x, y } = this.position;
                this.list[this.index].position.x = clientX - this.clientX + x;
                this.list[this.index].position.y = clientY - this.clientY + y;
            },
            onHandleRotateMove(e) {
                const touches = e.touches[0];
                const { clientX, clientY } = touches;
                const diffX = clientX - this.rotateX;
                const diffY = clientY - this.rotateY;
                const degree =  (360 * Math.atan2(diffY, diffX)) / (2 * Math.PI);
                console.log("degree",degree);
                this.list[this.index].position.rotate = degree;
            },
            onHandleTouchEnd() {
                console.log("onHandleTouchEnd")
            }
        },
        created() {
            const data = this.data;
            this.list = data;
        }
	};
</script>
<style scoped>
    .designContainer {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .operate {
        width: 100%;
        height: 15rem;
        flex-shrink: 0;
    }

    .beers {
        position: relative;
        width: 400px;
        height: 0;
        margin: 2rem;
        border: 1px solid #444;
        overflow: hidden;
        flex-grow: 1;
    }

    .drag {
        position: absolute;
        z-index: 10;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }

    .dragBtn {
        position: absolute;
        z-index: 1;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
    }

    .dragBtn.del {
        left: 0;
        top: 0;
        transform: translate(-50%, -50%);
    }

    .dragBtn.scale {
        right: 0;
        bottom: 0;
        transform: translate(50%, 50%);
    }

    .dragBtn.up {
        right: 0;
        top: 0;
        transform: translate(50%, -50%);
    }

    .dragBtn.down {
        left: 0;
        bottom: 0;
        transform: translate(-50%, 50%);
    }

    .rotate {
        position: absolute;
        z-index: 1;
        left: 50%;
        bottom: 0;
        width: 2rem;
        height: 4rem;
        transform: translate(-50%, 100%);
        font-size: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .rotate:before {
        content: "";
        width: 2px;
        height: 1rem;
        background: #000;
    }

    .imgUnit {
        position: absolute;
        border-width: 2px;
        border-style: dashed;
        border-color: rgba(255, 255, 255, 0);
    }

    .imgUnit.active {
        border-color: #000;
    }

    .imgUnit .img {
        width: 100%;
        height: 100%;
    }
</style>