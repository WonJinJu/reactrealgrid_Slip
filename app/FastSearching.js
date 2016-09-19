/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, {Component} from 'react';
/*import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';*/
import TextField from 'luna-rocket/LUXTextField';
import LuxButton from 'luna-rocket/LUXButton';
//import TextField from 'material-ui/TextField';
import StringType from 'ats-lib/prototype/src/String';
import {Common} from 'ats-lib';

const styles = {
  container: {
    border: '1px solid #F3F3F3',

  },
};

const styles_input = {
    root: {
        width:30,
        padding:"3px 8px 3px 8px"
    }
};

const styles_text ={
    display:{
        display:'inline-block', width:50, overflow: 'hidden', verticalAlign: 'middle'
    }
};

/*
* props : StartYMD  시작회계기간
*       : EndYMD    종료회계기간
* */
class FastSearching extends Component {
  constructor(props, context) {
    super(props, context);

    /*
    * SearchingData :
        startY:'',startM:'',startD:'',
        endY:'',endM:'',endD:''
    * */
    this.state = {
      open: false,
    };
  }

  /*
  * Case1: 엔터키로 자동입력
  * */
  autoInsertDate(SearchingData,inputValue,inputId){
    /*
    회계기간시간  this.props.StartYMD
    회계기간끝   this.props.EndYMD
    * */
    var StartYMD = this.props.StartYMD;
    var EndYMD = this.props.EndYMD;

    //조회 년도 활성화 일 경우
    //조회 : 시작 년도 & 끝 년도
    if(inputId === "startY" || inputId === "endY") {
        inputId === "startM" ? SearchingData.startPeriod.startY = StartYMD.substr(0,4) :  SearchingData.endPeriod.endY = EndYMD.substr(0,4) ;
        inputId === "startY" ? this.refs.startM.focus() :  this.refs.endM.focus() ;
    }
    //조회 : 시작 월 & 끝 월
    else if (inputId === "startM" || inputId === "endM" ) {
        //조회 년도 비활성화 일경우
        if(this.props.searchingData.yearVisible === true){
            inputId === "startM" ? SearchingData.startPeriod.startY = StartYMD.substr(0,4) :  SearchingData.endPeriod.endY = EndYMD.substr(0,4) ;
        }

        if (inputId === "startM") {
            SearchingData.startPeriod.startM = StartYMD.substr(4,2);
        }
        else {
            SearchingData.endPeriod.endM = EndYMD.substr(4,2);
        }
        inputId === "startM" ? this.refs.startD.focus() :  this.refs.endD.focus() ;
    }
    //조회 : 시작 일
    else if (inputId === "startD"){
        //자동입력를 원할때
        if( this.props.searchingData.autoStartDay === true ){

            if(SearchingData.startPeriod.startM === StartYMD.substr(4,2))
            {
                SearchingData.startPeriod.startD = StartYMD.substr(6,2);
            }
            else {
                SearchingData.startPeriod.startD = '01';
            }
        }

        if(this.props.searchingData.controlEndPeriod){
            //조회 년도 비활성화 일경우
            this.props.searchingData.yearVisible === true ? this.refs.endM.focus() : this.refs.endY.focus();
        }
        else{
            //조회 시작년월일만 활성화 일경우
            this.props.Callbacks.onFinish();
        }

    }
    //조회 : 종료 일
    else if (inputId === "endD"){
        if(SearchingData.endPeriod.endY === EndYMD.substr(4,2))
        {
            SearchingData.endPeriod.endM = EndYMD.substr(6,2);
        }
        else {
            SearchingData.endPeriod.endD = Common.DateUtil.HfxGetLastDay(SearchingData.endPeriod.endY,SearchingData.endPeriod.endM);
        }
        this.props.Callbacks.onFinish();
    }

  }

  /*
  * Case2: 직접입력
  * */
  userInsertDate(SearchingData,inputValue,inputId){
    /*
    회계기간시간  this.props.StartYMD
    회계기간끝   this.props.EndYMD
    * */
    var StartYMD = this.props.StartYMD;
    var EndYMD = this.props.EndYMD;

    var chk = false;

    //조회 년도 활성화 일 경우
    //조회 : 시작 년도 & 끝 년도
    if(inputId === "startY" || inputId === "endY") {
        inputId === "startM" ? SearchingData.startPeriod.startY = StartYMD.substr(0,4) :  SearchingData.endPeriod.endY = EndYMD.substr(0,4) ;
    }
    //조회 : 시작 월 & 끝 월
    else if (inputId === "startM" || inputId === "endM" ) {
        var inputValueMonthDay = Common.DateUtil.MakeMonthOrDayString(inputValue);
            //조회 시작월
            if (inputId === "startM") {
                chk = this.jmethodCheckDate(SearchingData.startPeriod.startY, inputValueMonthDay, SearchingData.startPeriod.startD);

                if (chk != false) {
                    //조회 년도 비활성화 일경우
                    if (this.props.searchingData.yearVisible === true) {
                        SearchingData.startPeriod.startY = StartYMD.substr(0, 4);
                    }

                    SearchingData.startPeriod.startM = inputValueMonthDay;
                }
                else {
                    if(inputValueMonthDay == "02") {
                        SearchingData.startPeriod.startM = inputValueMonthDay;
                        SearchingData.startPeriod.startD = Common.DateUtil.HfxGetLastDay(SearchingData.startPeriod.startY, inputValueMonthDay);
                    }
                    else {
                        alert("조회조건이 누락되거나 잘못된 내역이 있습니다. 다시 확인하세요.");
                        SearchingData.startPeriod.startM = "";
                        SearchingData.startPeriod.startD = "";
                    }
                }
            }
            //조회 종료월
            else {
                chk = this.jmethodCheckDate(SearchingData.endPeriod.endY, inputValueMonthDay, SearchingData.endPeriod.endD);

                if (chk != false) {
                    //조회 년도 비활성화 일경우
                    if (this.props.searchingData.yearVisible === true) {
                        SearchingData.endPeriod.endY = EndYMD.substr(0, 4);
                    }
                    SearchingData.endPeriod.endM = inputValueMonthDay;

                }
                else {
                    if(inputValueMonthDay == "02") {
                        SearchingData.endPeriod.endM = inputValueMonthDay;
                        SearchingData.endPeriod.endD = Common.DateUtil.HfxGetLastDay(SearchingData.endPeriod.endY,inputValueMonthDay);
                    }
                    else {
                        alert("조회조건이 누락되거나 잘못된 내역이 있습니다. 다시 확인하세요.");
                        SearchingData.endPeriod.endM = "";
                        SearchingData.endPeriod.endD = "";
                    }
                }
            }

    }
    //조회 : 시작 일 & 종료 일
    else if (inputId === "startD" || inputId === "endD" ) {
        var inputValueMonthDay = Common.DateUtil.MakeMonthOrDayString(inputValue);
        //조회 : 시작 일
        if(inputId === "startD" ){
            chk = this.jmethodCheckDate(SearchingData.startPeriod.startY, SearchingData.startPeriod.startM, inputValueMonthDay);
            //조회월이 비었을때
            if(SearchingData.startPeriod.startM === ""){
                alert("조회조건이 누락되거나 잘못된 내역이 있습니다. 다시 확인하세요.");
                SearchingData.startPeriod.startD = "";
            }
            else {
                if (chk != false) {
                    SearchingData.startPeriod.startD = inputValueMonthDay;
                }
                else {
                    SearchingData.startPeriod.startD = "";
                }
            }
        }
        //조회 : 종료 일
        else{
            chk = this.jmethodCheckDate(SearchingData.endPeriod.endY,SearchingData.endPeriod.endM,inputValueMonthDay);
            //조회월이 비었을때
            if(SearchingData.endPeriod.endM === ""){
                alert("조회조건이 누락되거나 잘못된 내역이 있습니다. 다시 확인하세요.");
                SearchingData.endPeriod.endD = "";
            }
            else {
                if (chk != false) {
                    SearchingData.endPeriod.endD = inputValueMonthDay;
                }
                else {
                    SearchingData.endPeriod.endD = "";
                }
            }
        }
    }
  }

  //기간 체크 날짜를 입력받아서 유효성체크 반환
  jmethodCheckDate(year,month,day){

    if(month.length >= 3){
      return false;
    }

    if(day.length >= 3){
      return false;
    }

    if(year === ""){
      year = '2007';
    }
    if(month === ""){
      month = '01';
    }
    if(day === ""){
      day = '01';
    }
    console.log(Common.DateUtil.HfxIsDate(year,month,day));
    return Common.DateUtil.HfxIsDate(year,month,day);
  }

  //시작기간과 종료기간의 크기 비교
  jmethodCheckPeriod(startDate, endDate) {

      //시작월까지만 있을 경우
      if(startDate.length == 6){
          startDate += "01";
      }
      //종료월까지만 있을 경우
      if(endDate.length == 6){
          endDate += Common.DateUtil.HfxGetLastDay(endDate.substr(0,4),endDate.substr(4,2));
      }
      var cStartDate = new Date(String(startDate).replaceAll('-', '').toDateString());
      var cEndDate = new Date(String(endDate).replaceAll('-', '').toDateString());
      var chk = cStartDate <= cEndDate;
      if(chk === true){
          return true;
      }else {
          return false;
      }
  }

  //날짜변경시 이벤트
  handleChange(e) {
    //메뉴와 주고 받는 기간조회값
    var SearchingData = this.props.searchingData;
    //입력값
    var inputValue = e.target.value;
    //입력컨트롤 아이디
    var inputId = e.target.id;


    //Case1: 엔터키로 자동입력
    if(inputValue === "") {
        this.autoInsertDate(SearchingData,inputValue,inputId);
    }
    //Case2: 직접입력
    else {
        this.userInsertDate(SearchingData,inputValue,inputId);
    }

    SearchingData.startPeriod.sDate = this.props.searchingData.startPeriod.startY + this.props.searchingData.startPeriod.startM + this.props.searchingData.startPeriod.startD;
    SearchingData.startPeriod.eDate = this.props.searchingData.endPeriod.endY + this.props.searchingData.endPeriod.endM + this.props.searchingData.endPeriod.endD;

    this.props.Callbacks.change(SearchingData);
  };

  //포커스 엔터키로이동
  handleInputKeyDown(evt) {
    if (evt.key === 'Enter') {
        if(evt.target.value === ""){
            this.handleChange(evt)
        }
        else {
            let controlId = (evt.target.id);
            if(controlId === "startY"){
                this.refs.startM.focus();
            }
            if(controlId === "startM"){
                this.refs.startD.focus();
            }
            if(controlId === "startD"){
                //조회 년도 비활성화 일경우
                if(this.props.searchingData.yearVisible === true)
                {
                    this.refs.endM.focus();
                }
                else {
                    this.refs.endY.focus();
                }
            }
            if(controlId === "endY"){
                this.refs.endM.focus();
            }
            if(controlId === "endM"){
                this.refs.endD.focus();
            }
            if(controlId === "endD"){

                if (this.jmethodCheckPeriod(this.props.searchingData.startPeriod.sDate, this.props.searchingData.startPeriod.eDate)) {
                    this.props.Callbacks.onFinish();
                }
                else {
                    alert("조회 날짜가 올바르지 않습니다.")
                }
            }
        }
    }
  }

  //임시 >> 엔터키 클릭안되서 조회용도
  clickHandler(event) {
      this.props.Callbacks.onFinish();
  };

  render() {

    var controlVisibleSetting;
    if(this.props.searchingData.controlPeriodVisible === '모든기간입력')  {
        //조회 시작 년월일 ~ 종료 년월일
        controlVisibleSetting = (
        <div>
          <div style={{display:'inline-block', width:100}}>
              <label>기   간</label>
              <div style={styles_text.display}>
                  <TextField
                      id="startY"
                      ref="startY"
                      inputBoxStyle={styles_input.root} //박스 사이즈
                      //inpuStyle //인풋박스
                      disabled={this.props.searchingData.yearVisible}
                      value={this.props.searchingData.startPeriod.startY}
                      onChange={this.handleChange.bind(this)}
                      onKeyDown={this.handleInputKeyDown.bind(this)}
                  />
              </div>
              <label >년</label>
          </div>
          <div style={{display:'inline-block', width:80}}>
            <div style={styles_text.display}>
              <TextField
                  id="startM"
                  ref="startM"
                  inputBoxStyle={styles_input.root} //박스 사이즈
                  value={this.props.searchingData.startPeriod.startM}
                  onChange={this.handleChange.bind(this)}
                  onKeyDown={this.handleInputKeyDown.bind(this)}
              />
            </div>
            <label>월</label>
          </div>
          <div style={{display:'inline-block', width:80}}>
            <div style={styles_text.display}>
              <TextField
                  id="startD"
                  ref="startD"
                  inputBoxStyle={styles_input.root} //박스 사이즈
                  value={this.props.searchingData.startPeriod.startD}
                  onChange={this.handleChange.bind(this)}
                  onKeyDown={this.handleInputKeyDown.bind(this)}
              />
            </div>
            <label>일</label>
          </div>
          <div style={{display:'inline-block', width:20}}>
          <label>  ~  </label>
          </div>
          <div style={{display:'inline-block', width:80}}>
            <div style={styles_text.display}>
              <TextField
                  id="endY"
                  ref="endY"
                  inputBoxStyle={styles_input.root} //박스 사이즈
                  disabled={this.props.searchingData.yearVisible}
                  value={this.props.searchingData.endPeriod.endY}
                  onChange={this.handleChange.bind(this)}
                  onKeyDown={this.handleInputKeyDown.bind(this)}
              />
            </div>
            <label>년</label>
          </div>
          <div style={{display:'inline-block', width:80}}>
            <div style={styles_text.display}>
              <TextField
                  id="endM"
                  ref="endM"
                  inputBoxStyle={styles_input.root} //박스 사이즈
                  value={this.props.searchingData.endPeriod.endM}
                  onChange={this.handleChange.bind(this)}
                  onKeyDown={this.handleInputKeyDown.bind(this)}
              />
            </div>
            <label>월</label>
          </div>
          <div style={{display:'inline-block', width:80}}>
            <div style={styles_text.display}>
              <TextField
                  id="endD"
                  ref="endD"
                  inputBoxStyle={styles_input.root} //박스 사이즈
                  value={this.props.searchingData.endPeriod.endD}
                  onChange={this.handleChange.bind(this)}
                  onKeyDown={this.handleInputKeyDown.bind(this)}
              />
            </div>
          <label>일</label>
          </div>

        <LuxButton
            label="조회"
            onTouchTap={this.clickHandler.bind(this)}
        />
        </div>
        );
    }
    else if(this.props.searchingData.controlPeriodVisible === '월별입력')  {
        //조회  년월일
        controlVisibleSetting = (
        <div>
          <div style={{display:'inline-block', width:100}}>
              <label>기   간</label>
              <div style={styles_text.display}>
                  <TextField
                      id="startY"
                      ref="startY"
                      inputBoxStyle={styles_input.root} //박스 사이즈
                      //inpuStyle //인풋박스
                      disabled={this.props.searchingData.yearVisible}
                      value={this.props.searchingData.startPeriod.startY}
                      onChange={this.handleChange.bind(this)}
                      onKeyDown={this.handleInputKeyDown.bind(this)}
                  />
              </div>
              <label >년</label>
          </div>
          <div style={{display:'inline-block', width:80}}>
            <div style={styles_text.display}>
              <TextField
                  id="startM"
                  ref="startM"
                  inputBoxStyle={styles_input.root} //박스 사이즈
                  value={this.props.searchingData.startPeriod.startM}
                  onChange={this.handleChange.bind(this)}
                  onKeyDown={this.handleInputKeyDown.bind(this)}
              />
            </div>
            <label>월</label>
          </div>
          <div style={{display:'inline-block', width:80}}>
            <div style={styles_text.display}>
              <TextField
                  id="startD"
                  ref="startD"
                  inputBoxStyle={styles_input.root} //박스 사이즈
                  value={this.props.searchingData.startPeriod.startD}
                  onChange={this.handleChange.bind(this)}
                  onKeyDown={this.handleInputKeyDown.bind(this)}
              />
            </div>
            <label>일</label>
          </div>


            <LuxButton
                label="조회"
                onTouchTap={this.clickHandler.bind(this)}
            />
        </div>
        );
    }
    else if(this.props.searchingData.controlPeriodVisible === '기간입력')  {
        //조회  년월~년월
        controlVisibleSetting = (
        <div>
          <div style={{display:'inline-block', width:100}}>
              <label>기   간</label>
              <div style={styles_text.display}>
                  <TextField
                      id="startY"
                      ref="startY"
                      inputBoxStyle={styles_input.root} //박스 사이즈
                      //inpuStyle //인풋박스
                      disabled={this.props.searchingData.yearVisible}
                      value={this.props.searchingData.startPeriod.startY}
                      onChange={this.handleChange.bind(this)}
                      onKeyDown={this.handleInputKeyDown.bind(this)}
                  />
              </div>
              <label >년</label>
          </div>
          <div style={{display:'inline-block', width:80}}>
            <div style={styles_text.display}>
              <TextField
                  id="startM"
                  ref="startM"
                  inputBoxStyle={styles_input.root} //박스 사이즈
                  value={this.props.searchingData.startPeriod.startM}
                  onChange={this.handleChange.bind(this)}
                  onKeyDown={this.handleInputKeyDown.bind(this)}
              />
            </div>
            <label>월</label>
          </div>
          <div style={{display:'inline-block', width:20}}>
          <label>  ~  </label>
          </div>
          <div style={{display:'inline-block', width:80}}>
            <div style={styles_text.display}>
              <TextField
                  id="endY"
                  ref="endY"
                  inputBoxStyle={styles_input.root} //박스 사이즈
                  disabled={this.props.searchingData.yearVisible}
                  value={this.props.searchingData.endPeriod.endY}
                  onChange={this.handleChange.bind(this)}
                  onKeyDown={this.handleInputKeyDown.bind(this)}
              />
            </div>
            <label>년</label>
          </div>
          <div style={{display:'inline-block', width:80}}>
            <div style={styles_text.display}>
              <TextField
                  id="endM"
                  ref="endM"
                  inputBoxStyle={styles_input.root} //박스 사이즈
                  value={this.props.searchingData.endPeriod.endM}
                  onChange={this.handleChange.bind(this)}
                  onKeyDown={this.handleInputKeyDown.bind(this)}
              />
            </div>
            <label>월</label>
          </div>

        <LuxButton
            label="조회"
            onTouchTap={this.clickHandler.bind(this)}
        />
        </div>
        );
    }

    return (
        <div>
        {controlVisibleSetting}
        </div>
    );
  }
}

export default FastSearching;