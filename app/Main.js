/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, {Component} from 'react';
import TextField from 'luna-rocket/LuxTextField';
import StrisngType from 'ats-lib/prototype/src/String';
import SlipGrid from './SlipGrid';
import FastSearching from './FastSearching';

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200,
  },
};

/*
* props : StartYMD  시작회계기간
*       : EndYMD    종료회계기간
* */
class Main extends Component {
  constructor(props, context) {
    super(props, context);

    /*
    * SearchingData :
        startY:'',startM:'',startD:'',
        endY:'',endM:'',endD:''
    * */
    this.state = {
      open: false,
      startYMDPeriod : '20130101', //시작회계기간
      endYMDPeriod : '20131231',   //종료회계기간
      //컨트롤에서 받아올 값
      searchingData : {
                        startPeriod:{startY:'',startM:'',startD:'', sDate:''},
                        endPeriod:{endY:'',endM:'',endD:'', eDate:''},
                        yearVisible:true,        //true : 비활성화, false : 활성화
                        /*
                        '월별입력'   - 일자 년 월 일
                        '기간입력'   - 일자 년 월 ~ 년 월
                        '모든기간입력' -일자 년 월 일 ~ 년 월 일
                        * */
                        controlPeriodVisible:'월별입력',
                        autoStartDay:true        //true : 조회 시작기간 일자의 자동입력 자동입력 사용
                                                 //false: 조회 시작기간 일자의 자동입력 자동입력 사용하지않을때
                      },
    };
  }

  //기간을 변경할때마다 호출되는 이벤트
  change(searchingData) {
    this.setState({searchingData: searchingData});
  }

  //기간조회의 끝 일자
  quickHeaderOnFinish(){
      //데이터조회
      console.log('조회기간 조회');
  }

  render() {
    return (
        <div >
          <FastSearching  StartYMD={this.state.startYMDPeriod}
                          EndYMD={this.state.endYMDPeriod}
                          searchingData={this.state.searchingData}
                          Callbacks={{  change : this.change.bind(this),
                                        onFinish : this.quickHeaderOnFinish.bind(this)
                          }}
          />
          <SlipGrid/>
        </div>
    );
  }
}

export default Main;