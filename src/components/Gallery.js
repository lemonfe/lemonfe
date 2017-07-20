import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import '../styles/main.scss'
// 获取图片相关的数据
let imageDatas = require('../data/imageDatas.json');
// 利用自执行函数， 将图片名信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
    for (let i = 0, j = imageDatasArr.length; i < j; i++) {
        let singleImageData = imageDatasArr[i];

        singleImageData.imageURL = require('../images/' + singleImageData.fileName);

        imageDatasArr[i] = singleImageData;
    }
    return imageDatasArr;
})(imageDatas);

let getRangeRandom = (low,high) =>  Math.floor(Math.random() * (high - low) + low);

class ImgFigure extends React.Component {
    render() {
        let styleObj = {};

        if(this.props.arrange.pos){
          styleObj = this.props.arrange.pos;
        }
        return (
            <figure className="img-figure" style={styleObj}>
                <img src={this.props.data.imageURL} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                </figcaption>
            </figure>
        )
    }
}

class Gallery extends React.Component {
    constructor(props) {
      super(props);
      this.Constant = {
        centerPos: {
          left: 0,
          top: 0
        },
        hPosRange: {
          leftX: [0,0],
          rightX: [0,0],
          y: [0,0]
        },
        vPosRange: {
          x: [0,0],
          topY: [0,0]
        }
      };
      this.state = {
          imgsArrangeArr: [
            /*{
              pos: {
                left: '0',
                top: '0'
              }
            }*/
          ]
      }
    };


    rearrange(centerIndex) {
      let imgsArrangeArr = this.state.imgsArrangeArr,
          Constant = this.Constant,
          centerPos = Constant.centerPos,
          hPosRange = Constant.hPosRange,
          vPosRange = Constant.vPosRange,
          hPosRangeLeftX = hPosRange.leftX,
          hPosRangeRightX = hPosRange.rightX,
          hPosRangeY = hPosRange.y,
          vPosRangeTopY = vPosRange.topY,
          vPosRangeX = vPosRange.x,
          imgsArrangeTopArr = [],
          topImgNum = Math.floor(Math.random() * 2),
          topImgSpliceIndex = 0,
          imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

      //首先居中centerIndex的图片
      imgsArrangeCenterArr[0].pos = centerPos;
      //取出要布局在上方的图片的状态信息
      topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
      imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
      //布局位于上方的图片
      imgsArrangeTopArr.forEach((value,index) => {
        imgsArrangeTopArr[index].pos = {
          top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
          left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
        }
      });
      //布局左右两侧的图片
      for (let i = 0,j = imgsArrangeArr.length,k = j / 2; i < j; i++) {
        let flag = null;
        if(i < k) {
          flag = hPosRangeLeftX;
        }else{
          flag = hPosRangeRightX;
        }

        imgsArrangeArr[i].pos = {
          left: getRangeRandom(flag[0],flag[1]),
          top: getRangeRandom(hPosRangeY[0],hPosRangeY[1])
        }
      }

      if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
        imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0])
      }
      imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

      this.setState({
        imgsArrangeArr: imgsArrangeArr
      })
    };

    //组件加载以后，为每张图片计算位置的范围
    componentDidMount() {
      //获取舞台的大小
      let stage = ReactDOM.findDOMNode(this.refs.stage),
          stageW = stage.scrollWidth,
          stageY = stage.scrollHeight,
          halfStageW = Math.floor(stageW / 2),
          halfStageY = Math.floor(stageY / 2);

      //获取一个imgFigure的大小
      let imgFigure = ReactDOM.findDOMNode(this.refs.imgFigure0),
          imgW = imgFigure.scrollWidth,
          imgH = imgFigure.scrollHeight,
          halfImgW = Math.floor(imgW / 2),
          halfImgH = Math.floor(imgH / 2);

      //计算图片位置的取值范围
      this.Constant.centerPos = {
        left: halfStageW - halfImgW,
        top: halfStageY - halfImgH
      };
      this.Constant.hPosRange.leftX[0] = -halfImgW;
      this.Constant.hPosRange.leftX[1] = halfStageW - halfImgW * 3;
      this.Constant.hPosRange.rightX[0] = halfStageW + halfImgW;
      this.Constant.hPosRange.rightX[1] = stageW - halfImgW;
      this.Constant.hPosRange.y[0] = -halfImgH;
      this.Constant.hPosRange.y[1] = stageY - halfImgH;
      this.Constant.vPosRange.topY[0] = -halfImgH;
      this.Constant.vPosRange.topY[1] = halfStageY - halfImgH * 3;
      this.Constant.vPosRange.x[0] = halfStageW - imgW;
      this.Constant.vPosRange.x[1] = halfStageW;
      this.rearrange(0);
    };
    render() {
      let controUnits = [],
          imgFigures = [];
      imageDatas.forEach((val,index) => {
          if(!this.state.imgsArrangeArr[index]) {
            this.state.imgsArrangeArr[index] = {
              pos: {
                left: '0',
                top: '0'
              }
            }
          }
          imgFigures.push(<ImgFigure data={val} ref={'imgFigure'+index}
                                     arrange={this.state.imgsArrangeArr[index]} key={index}/>)
      });
    return (
        <section className="stage" ref="stage">
            <section className="img-sec">
                {imgFigures}
            </section>
            <nav className="controller-nav">
                {controUnits}
            </nav>
        </section>
    );
  }
}

export default Gallery;
