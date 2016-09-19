"use strict";

//Main 그리드

var dataProvider;
var gridView;

//편집한 셀을 기록하기 위해 전역으로 하나 만듬
var dicEditCell;

$(document).ready(function () {
    //초기화
    dicEditCell = {};

    //1. Grid컨드롤을 화면상에 올리기
    createGrid();

    //2. DataProvider DataFeild 만들기
    setDataFields();

    //3. GridView에 Columns 구성
    setColumns();

    //4.GridView Style 적용
    //....요긴 디자인 영역
    setStyles(gridView);

    //5. GridView Option 수정
    setOptions();
    //******************************//

    //6. GridView에 대한 이벤트
    setGridCallbackFunc();
    //******************************//

    //7. Provider 에 대한 이벤트
    setProviderCallbackFunc();

    //8. API 통해서 DataProvider에 Data 채우기
    //버튼을 클릭하면 Main Data Load.
    //$("#btnSearch").on("click", function () {
    //   LoadData();
    //})
});

//기본적으로 세팅해야 그리드가 제대로 만들어짐
function createGrid() {
    var id = "realgrid";

    RealGridJS.setTrace(false);
    RealGridJS.setRootContext("./script");

    dataProvider = new RealGridJS.LocalDataProvider();
    gridView = new RealGridJS.GridView(id);
    gridView.setDataSource(dataProvider);
}

function setDataFields() {
    //*** A5 컬럼-필드 연결하기 ***//

    /*
    SELECT 	DISTINCT a.da_date, a.sq_acttax2,
                SUBSTR(a.da_date, 1, 4) AS year,
                SUBSTR(a.da_date, 5, 2) AS month,
                SUBSTR(a.da_date, 7, 2) AS day,
                a.cd_trade, a.nm_trade, a.cd_remark, a.nm_remark,
                CASE a.ty_gubn
                    WHEN 1 THEN '출금'
                    WHEN 2 THEN '입금'
                    WHEN 3 THEN '차변'
                    WHEN 4 THEN '대변'
                    WHEN 5 THEN '결차'
                    WHEN 6 THEN '결대'
                END AS nm_gubn, a.ty_gubn,
                a.cd_acctit, a.key_acctit, b.nm_acctit,
                CASE WHEN a.ty_gubn IN (1,2,3,5) THEN a.mn_bungae ELSE 0
                      END AS mn_bungae1,
                CASE WHEN a.ty_gubn IN (1,2,4,6) THEN a.mn_bungae ELSE 0
                      END AS mn_bungae2,
                a.no_acct, a.cd_deptemp, a.cd_field ,a.cd_pjt,
                c.nm_deptemp as nm_dept ,d.nm_field ,e.nm_project,
                a.cd_finance ,f.nm_fitem as nm_finance ,a.yn_card,
                coalesce(g.nm_cardgb,1) as nm_cardgb,
                a.cd_jepum ,h.nm_goods as nm_jepum ,a.cd_bjoh ,
                i.nm_bjoh ,a.nm_linecolor ,a.yn_use, a.ty_copy ,
                a.no_exter2 ,a.ty_bungae ,a.nm_memot ,a.nm_memo ,
                a.sq_bungae, a.no_car ,a.no_carbody ,a.dt_insert,
                a.sq_sbguid
    * */
    var fields = [{
        fieldName: "year"
    }, {
        fieldName: "month"
    }, {
        fieldName: "day"
    }];
    //DataProvider의 setFields함수로 필드를 입력합니다.
    dataProvider.setFields(fields);
}

function setColumns() {
    //*** A2 컬럼 만들기 ***//
    var columns = [{
        name: "cd_deptemp",
        fieldName: "cd_deptemp",
        header: {
            text: "코드"
        },
        required: true,
        requiredLevel: "error",
        requiredMessage: "부서코드는 반드시 입력해야 합니다.",
        editor: {
            type: "number",
            maxLength: 2,
            positiveOnly: true
        },
        styles: {
            textAlignment: "center"
        },
        width: 60
    }, {
        name: "nm_deptemp",
        fieldName: "nm_deptemp",
        header: {
            text: "부서명"
        },
        required: true,
        requiredLevel: "info",
        requiredMessage: "부서명은 반드시 입력해야 합니다.",
        width: 150
    }, {
        name: "yn_disabled",
        fieldName: "yn_disabled",
        header: {
            text: "사용"
        },
        /*editor: {
         type: "dropDown",
         maxLength: 1,
         dropDownCount: 2,
         values: ["여", "부"],
         labels: ["여", "부"]
         },*/
        editor: {
            maxLength: 1
        },
        renderer: {
            type: "check",
            editable: true,
            startEditOnClick: true,
            trueValues: "여",
            falseValues: "부",
            labelPosition: "right"
        },
        defaultValue: "여",
        styles: {
            textAlignment: "center"
        },
        width: 50
    }];
    gridView.setColumns(columns);
}

function setStyles(grid) {

    //gridViewStyles()는 gridViewStyles.js에 있는 함수임(html에 스트립트 추가함)
    grid.setStyles(gridViewStyles());
};

function setOptions() {
    //개별 옵션 적용 가능 하나, 나는 아래처럼 뭉탱이로 하겠다. 한군데에 깔끔하게!
    gridView.setOptions({
        panel: { visible: false },
        indicator: { visible: true },
        checkBar: { visible: false },
        stateBar: { visible: false }
    });

    gridView.setEditOptions({
        //insertable: true,
        //appendable: true,
        //deletable: true,
        commitWhenExitLast: true
    });
};

// gridview callback method
function setGridCallbackFunc() {
    //GridView와 연결된 이벤트
    gridView.onCurrentRowChanged = function (grid, oldRow, newRow) {
        // 최초 입력시에만 수정가능하도록
        var isNew = newRow < 0 || dataProvider.getRowState(newRow) === "created";

        if (!RealGridJS.isMobile()) grid.setColumnProperty("cd_deptemp", "editable", isNew);

        dataProvider_Right.clearRows();
        var cdDeptemp = getCdDeptemp();
        if (cdDeptemp.length > 0) {
            LoadData_Right(cdDeptemp);
        } else {
            //SetProviderNewRow(gridView_Right, dataProvider_Right)
        }
        console.log('onCurrentRowChanged');
    };

    //편집이 끝나면 다음 셀로 이동시키기
    gridView.onCellEdited = function (grid, itemIndex, dataRow, field) {

        var focusCell = gridView.getCurrent();

        dicEditCell[focusCell.fieldName] = gridView.getValues(itemIndex)[focusCell.fieldName];

        //focusCell.dataRow = 0;
        //alert(focusCell.dataRow)
        if (focusCell.fieldName == "cd_deptemp") {
            focusCell.column = "nm_deptemp";
            focusCell.fieldName = "nm_deptemp";
        } else if (focusCell.fieldName == "nm_deptemp") {
            focusCell.column = "yn_disabled";
            focusCell.fieldName = "yn_disabled";

            gridView.commit();
            InsertDEPT(gridView, dataProvider, itemIndex, dataRow);
        } else {}
        /*focusCell.dataRow = focusCell.dataRow + 1;
        focusCell.column = "cd_deptemp";
        focusCell.fieldName = "cd_deptemp";*/

        //포커스된 셀 변경
        gridView.setCurrent(focusCell);
    };

    gridView.onKeyDown = function (grid, key, ctrl, shift, alt) {

        //enter(13) or right arrow(39)
        //참고사이트(입력키에대한 값을 알려줌)
        //https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
        if (key === 13 || key === 39) {
            //main grid의 마지막 컬럼에서 엔터나 오른쪽 방향키 입력시 detail grid에 포커스 가도록 수정
            var focusCell = gridView.getCurrent();
            if (focusCell.column == "yn_disabled") {
                gridView_Right.setFocus();
            }
        }
        console.log('onKeyDown');
    };
}

// provider callback method
function setProviderCallbackFunc() {
    //provider에 연결된 이벤트
    dataProvider.onRowUpdated = function (provider, row) {
        //var values = provider.getRow(row);
        if (Object.keys(dicEditCell).length > 0) callUpdateAPI("");
    };
}

//개발자가 필요에 의해 추가한 이벤트
function findField(fields, fieldName) {
    for (var i = 0; i < fields.length; i++) {
        if (fields[i].fieldName.toUpperCase() == fieldName.toUpperCase()) return i;
    }
    return -1;
}

function InsertDEPT(grid, provider, itemIndex, datarow) {
    if (grid.getValues(itemIndex) != undefined && provider.getRowState(datarow) === "created") {
        grid.setValue(itemIndex, 'yn_disabled', "여");

        //Insert 시킬 값 만듬
        var insertRow = [grid.getValues(itemIndex).cd_deptemp, grid.getValues(itemIndex).nm_deptemp, grid.getValues(itemIndex).yn_disabled == "부" ? 1 : 0];

        //insert API
        callInsertAPI(grid, provider, itemIndex, datarow, insertRow);
    }
}

function SetProviderNewRow(grid, provider) {
    var row = provider.addRow({ yn_disabled: "" });
    grid.setCurrent({ dataRow: row });
}

function getCdDeptemp() {
    var itemIndex = gridView.getCurrent().itemIndex;
    var fields = dataProvider.getFields();
    var fieldIndex = findField(fields, "cd_deptemp");
    var value = gridView.getValue(itemIndex, fieldIndex);

    if (value != undefined && value.length == 2) return value;else return "";
}

function getCdEmp() {
    var itemIndex = gridView_Right.getCurrent().itemIndex;
    var fields = dataProvider_Right.getFields();
    var fieldIndex = findField(fields, "cd_deptemp");
    var value = gridView_Right.getValue(itemIndex, fieldIndex);

    if (value != undefined && value.length == 2) return value;else return "";
}

//API 관련 Method [select, insert, update, delete]
function LoadData() {
    $.ajax({
        url: "http://localhost:8000/testApp/",
        contentType: 'application/json',
        cache: false
    }).success(function (response) {

        dataProvider.setRows(response.data.data);
        gridView.setFocus();
        /*var a = new Array();
           for(i = 0; i < 1000; i++){
         for(var ar in response.data.data){
         a.push(response.data.data[ar])
         }
         }
         dataProvider.setRows(a);*/
    }).complete(function (response) {
        SetProviderNewRow(gridView, dataProvider);
    });
}

function callInsertAPI(provider, itemIndex, datarow, pInsertData) {
    //한번더 검증 & insert api 만들
    var cdDept = getCdDeptemp();

    if (cdDept.length == 2 && pInsertData != undefined && pInsertData.length == 3) {
        var param = {};
        var sUrl = "";
        if (provider == dataProvider) {
            sUrl = "http://localhost:8000/testApp/";
        } else {
            sUrl = "http://localhost:8000/testApp/" + cdDept + "/";
        }

        param.cd_deptemp = pInsertData[0];
        param.nm_deptemp = pInsertData[1];
        param.yn_disabled = pInsertData[2] == "여" ? 0 : pInsertData[2] == "부" ? 1 : pInsertData[2];

        $.ajax({
            url: sUrl,
            type: "POST",
            dataType: "json",
            data: param
        }).success(function (response) {
            provider.insertRow(pInsertData);
            provider.setRowState(datarow, "none", true); //상태변경
            SetProviderNewRow(grid, provider); //한줄추가
            gridView_Right.setFocus();
        }).complete(function (response) {
            //SetProviderNewRow(gridView, dataProvider)
        });
    }
}

function callUpdateAPI(pCdEmp) {
    //한번더 검증 & insert api 만들
    var cdDept = getCdDeptemp();

    if (cdDept.length == 2 && dicEditCell != undefined && Object.keys(dicEditCell).length > 0) {

        if (pCdEmp.length == 0) {
            cdDept = cdDept + "00";
        } else {
            cdDept = cdDept + pCdEmp;
        }
        var param = [];
        for (var item in dicEditCell) {
            param.push({ column: item, value: dicEditCell[item] });
        }
        $.ajax({
            url: "http://localhost:8000/testApp/",
            type: "PUT",
            dataType: "json",
            contentType: 'application/json', //API 에서 param 인식을 위해 필수!
            data: JSON.stringify({ cd_deptemp: cdDept, update: param })
            //JSON.stringify() : API 에 data를 json 형식으로 전달하기위해 필수
        }).success(function (response) {
            dicEditCell = {};
        }).complete(function (response) {
            dicEditCell = {};
        });
    }
}

//# sourceMappingURL=main-compiled.js.map

//# sourceMappingURL=main-compiled-compiled.js.map