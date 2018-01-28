/**
 * 首页粒子组件
 * props: color,speed,
 */
import React from 'react';
import propTypes from 'prop-types';

function drawLine(src, tar, ctx, color) {
    ctx.strokeStyle = color || 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.moveTo(src.x, src.y);
    ctx.lineTo(tar.x, tar.y);
    ctx.stroke();
}
class Circle {
    constructor(opts) {
        this._color = opts.color || 'rgba(0,0,0,0.3)';
        this.speedX = opts.speedX;
        this.speedY = opts.speedY;
        this._radius = opts.radius || 1;
        this._ctx = opts.ctx;
        this.x = opts.x || 10;
        this.y = opts.y || 10;
        this._canvasDom = opts.canvasDom;
    }
    draw() {
        this._ctx.fillStyle = this._color;
        this._ctx.beginPath();
        this._ctx.arc(this.x, this.y, this._radius, 0, 2 * Math.PI);
        this._ctx.fill();
    }
    run() {
        // 每秒运动的函数 改变圆心的坐标
        //随机运动的方向 当圆与边界相切的时候调整运动的方向
        this._chooseToward();
        this.x += this.speedX;
        this.y += this.speedY;
    }
    _chooseToward() { //选择方向
        let maxX = this._canvasDom.clientWidth;
        let maxY = this._canvasDom.clientHeight;
        if(this.x >= (maxX - this._radius) || this.x <= this._radius) {
            this.speedX = - this.speedX;
        }
        if(this.y >= (maxY - this._radius) || this.y <= this._radius) {
            this.speedY = - this.speedY;
        }
    }
}
class Particle extends React.Component {
    constructor(props) {
        super(props);
        this.mainDraw = this.mainDraw.bind(this);
    }
    componentDidMount() {
        const canvasDom = document.getElementById('canvas');
        // 初始化粒子数组
        this.initParticle(canvasDom, 50);
        // 开始动画
        this.frameId = requestAnimationFrame(this.mainDraw);
        // 监听窗口size变化 动态改变canvas大小
        window.addEventListener('resize', this.handleSizeChange);
    }
    componentWillUnmount() {
        // 解除监听
        window.removeEventListener('resize', this.handleSizeChange);
    }
    render() {
        return (
            <div id="particle-wrapper">
                <canvas id="canvas"/>
            </div>
        );
    }
    /**
     * 粒子动画主帧
     * 
     * @memberof Particle
     */
    mainDraw() {
        let canvas = document.getElementById('canvas');
        if(!canvas) {
            return cancelAnimationFrame(this.frameId);
        }
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        this._circleArr.forEach(function(circle) {
            circle.draw();
        });
        for(let i = 0; i < 25; i++) {
            this._circleArr.forEach((circle) => {
                drawLine(this._circleArr[i], circle, ctx);
            });
        }
        this._circleArr.forEach(function(circle) {
            circle.run();
        });
        requestAnimationFrame(this.mainDraw);
    }
    /**
     * 粒子效果初始化
     * 
     * @param {HTMLDOM} canvasDom  canvas的dom元素对象
     * @memberof Particle
     */
    initParticle(canvasDom, maxCircle) {
        if(!canvasDom) {
            return;
        }
        let wrapperDom = document.getElementById('particle-wrapper');
        let wrapperWidth = wrapperDom.clientWidth;
        let wrapperHeight = wrapperDom.clientHeight;
        // 初始化canvas画布大小
        canvasDom.setAttribute('width', wrapperWidth);
        canvasDom.setAttribute('height', wrapperHeight);
        // 随机粒子
        this._circleArr = [];
        for(let i = 0; i < maxCircle; i++) {
            this._circleArr.push(new Circle({
                x: Math.floor(Math.random() * wrapperDom.clientWidth),
                y: Math.floor(Math.random() * wrapperDom.clientHeight),
                radius: Math.floor(Math.random() * 5) + 3,
                ctx: canvasDom.getContext('2d'),
                speedX: Math.random(),
                speedY: Math.random(),
                canvasDom: canvasDom,
            }));
        }
    }
    handleSizeChange() {
        let wrapper = document.getElementById('particle-wrapper');
        let canvas = document.getElementById('canvas');
        canvas.setAttribute('width', wrapper.clientWidth);
        canvas.setAttribute('height', wrapper.clientHeight);
    }
}
Particle.propTypes = {
    opts: propTypes.object
};
export default Particle;