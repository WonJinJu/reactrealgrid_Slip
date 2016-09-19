//Main 그리드
var dataProvider;
var gridView;

//편집한 셀을 기록하기 위해 전역으로 하나 만듬
var dicEditCell;

let sUrl = "http://localhost:8000/slip/";

$(document).ready( function() {
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
    LoadData();
    //})

    //삭제
    $("#btnDelete").click(function () {
        let rows = gridView.getCheckedRows(true);
        if (confirm("삭제하시겠습니까?" + rows)) {
            callDeleteAPI();
        }
    });
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
    var fields = [
        {
            fieldName: "sq_acttax2",
            dataType: RealGridJS.DataType.NUMBER
        },
        {
            fieldName: "no_acct",
            dataType: RealGridJS.DataType.TEXT,
            calculateCallback: function (dataRow, fieldName, fieldNames, values) {
                var no_acct = values[fieldNames.indexOf("no_acct")];

                if (isNaN(no_acct) || isNaN(no_acct))
                    return undefined;
                else
                    return padLeft(no_acct, 5, '0');
            }
        },
        {
            fieldName: "da_date",
            dataType: RealGridJS.DataType.NUMBER
            //dataType: RealGridJS.DataType.DATETIME,
            //datetimeFormat: "yyyyMMdd"
        },
        {
            fieldName: "day",
            dataType: RealGridJS.DataType.NUMBER
        },
        {
            fieldName: "cd_trade",
            dataType: RealGridJS.DataType.TEXT
        },
        {
            fieldName: "nm_trade",
            dataType: RealGridJS.DataType.TEXT
        },
        {
            fieldName: "cd_remark",
            dataType: RealGridJS.DataType.TEXT
        },
        {
            fieldName: "nm_remark",
            dataType: RealGridJS.DataType.TEXT
        },
        {
            fieldName: "ty_gubn",
            dataType: RealGridJS.DataType.NUMBER
        },
        {
            fieldName: "cd_acctit",
            dataType: RealGridJS.DataType.TEXT
        },
        {
            fieldName: "key_acctit",
            dataType: RealGridJS.DataType.NUMBER
        },
        {
            fieldName: "nm_acctit",
            dataType: RealGridJS.DataType.TEXT
        },
        {
            fieldName: "mn_bungae1",
            dataType: RealGridJS.DataType.NUMBER
        },
        {
            fieldName: "mn_bungae2",
            dataType: RealGridJS.DataType.NUMBER
        },
        {
            fieldName: "cd_deptemp",
            dataType: RealGridJS.DataType.TEXT
        },
        {
            fieldName: "nm_deptemp",
            dataType: RealGridJS.DataType.TEXT
        },
        {
            fieldName: "cd_field",
            dataType: RealGridJS.DataType.TEXT
        },
        {
            fieldName: "nm_field",
            dataType: RealGridJS.DataType.TEXT
        },
        {
            fieldName: "cd_pjt",
            dataType: RealGridJS.DataType.TEXT
        },
        {
            fieldName: "nm_project",
            dataType: RealGridJS.DataType.TEXT
        },
        {
            fieldName: "cd_finance",
            dataType: RealGridJS.DataType.TEXT
        },
        {
            fieldName: "nm_finance",
            dataType: RealGridJS.DataType.TEXT
        },
        {
            fieldName: "yn_card",
            dataType: RealGridJS.DataType.NUMBER
        },
        {
            fieldName: "nm_cardgb"
        },
        {
            fieldName: "cd_jepum",
            dataType: RealGridJS.DataType.TEXT
        },
        {
            fieldName: "nm_jepum",
            dataType: RealGridJS.DataType.TEXT
        },
        {
            fieldName: "cd_bjoh",
            dataType: RealGridJS.DataType.TEXT
        },
        {
            fieldName: "nm_bjoh",
            dataType: RealGridJS.DataType.TEXT
        },
        {
            fieldName: "yn_use"
        },
        {
            fieldName: "ty_copy"
        },
        {
            fieldName: "no_exter2"
        },
        {
            fieldName: "ty_bungae"
        },
        {
            fieldName: "nm_memot"
        },
        {
            fieldName: "nm_memo"
        },
        {
            fieldName: "sq_bungae"
        },
        {
            fieldName: "no_car"
        },
        {
            fieldName: "no_carbody"
        },
        {
            fieldName: "dt_insert"
        },
        {
            fieldName: "sq_sbguid"
        }
    ];
    //DataProvider의 setFields함수로 필드를 입력합니다.
    dataProvider.setFields(fields);
}

function setColumns() {
    //*** A2 컬럼 만들기 ***//
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
    var columns = [
        {
            name : "da_date",
            fieldName : "da_date",
            visible : false
        },
        {
            name : "sq_acttax2",
            fieldName : "sq_acttax2",
            visible : false,
            editable : false
        },
        {
            name: "day",
            fieldName: "day",
            header: {
                text: "일"
            },
            required: true,
            requiredLevel: "info",
            requiredMessage: "일자는 반드시 입력해야 합니다.",
            editor: {
                type: "number",
                maxLength: 2,
                positiveOnly: true
            },
            styles: {
                textAlignment: "center"
            },
            dynamicStyles: [
                {
                    criteria: "values['ty_gubn'] % 2 = 1",
                    styles: {
                        figureBackground: "#ff0000ff",
                        foreground: "#ffff0000"
                    },
                },
                {
                    criteria: "values['ty_gubn'] % 2 = 0",
                    styles: {
                        figureBackground: "#ff0000ff",
                        foreground: "#000fff"
                    }
                }
            ],
            width: 50
        },
        {
            name: "no_acct",
            fieldName: "no_acct",
            header: {
                text: "번호"
            },
            styles : {

            },
            editable : false,
            readonly : true,
            width: 60
        },
        {
            name: "cd_trade",
            fieldName: "cd_trade",
            header: {
                text: "코드"
            },
            editor : {
                maxLength : 5
            },
            width: 70
        },
        {
            name: "nm_trade",
            fieldName: "nm_trade",
            header: {
                text: "거래처명"
            },
            editor : {
                maxLength : 5
            },
            styles:{
                textAlignment: "near"
            },
            width: 100
        },
        {
            name: "ty_gubn",
            fieldName: "ty_gubn",
            header: {
                text: "구분"
            },
            required: true,
            requiredLevel: "info",
            requiredMessage: "구분은 반드시 입력해야 합니다.",
            values: ["1", "2", "3", "4", "5", "6"],
            labels: ["출금", "입금", "차변", "대변", "결차", "결대"],
            editor: {
                type: "dropDown",
                dropDownCount: 6,
                dropDownPosition: "button",
                partialMatch: "true"
            },
            dynamicStyles: [
                {
                    criteria: "value % 2 = 1",
                    styles: {
                        figureBackground: "#ff0000ff",
                        foreground: "#ffff0000"
                    },
                },
                {
                    criteria: "value % 2 = 0",
                    styles: {
                        figureBackground: "#ff0000ff",
                        foreground: "#000fff"
                    }
                }
            ],
            lookupDisplay : true,
            styles: {
                textAlignment: "center"
            },
            width: 50
        },
        {
            name: "key_acctit",
            fieldName: "key_acctit",
            visible : false,
            editable : false
        },
        {
            name: "cd_acctit",
            fieldName: "cd_acctit",
            header: {
                text: "코드"
            },
            required: true,
            requiredLevel: "info",
            requiredMessage: "계정과목 코드는 반드시 입력해야 합니다.",
            editor : {
                maxLength : 5
            },
            width: 70
        },
        {
            name: "nm_acctit",
            fieldName: "nm_acctit",
            header: {
                text: "계정과목"
            },
            editor : {
                maxLength : 5
            },
            styles: {
                textAlignment: "near",
                numberFormat: "#,##0"
            },
            editable : false,
            width: 150
        },
        {
            name: "cd_remark",
            fieldName: "cd_remark",
            header: {
                text: "코드"
            },
            editor : {
                maxLength : 2
            },
            width: 50
        },
        {
            name: "nm_remark",
            fieldName: "nm_remark",
            header: {
                text: "적요"
            },
            editor : {
                maxLength : 100
            },
            styles:{
                textAlignment: "near"
            },
            width: 200
        },
        {
            name: "mn_bungae1",
            fieldName: "mn_bungae1",
            header: {
                text: "차변(출금)"
            },
            editor: {
                maxLength: 17
            },
            styles: {
                textAlignment: "far",
                numberFormat: "#,##0"
            },
            dynamicStyles: [{
                criteria: "values['ty_gubn'] = 4 OR values['ty_gubn'] = 6",
                styles: "background=#EAEAEA"
            },
            {
                criteria: "values['mn_bungae1'] = 0",
                styles: "foreground=#EAEAEA"
            }],
            width: 100,
            footer: {
                styles: {
                    textAlignment: "far",
                    numberFormat: "#,##0",
                    font: "Arial,12"
                },
                text: "합계",
                expression: "sum",
                groupText: "합계",
                groupExpression: "sum"
            }
        },
        {
            name: "mn_bungae2",
            fieldName: "mn_bungae2",
            header: {
                text: "대변(입금)"
            },
            editor: {
                maxLength: 17
            },
            styles: {
                textAlignment: "far",
                numberFormat: "#,##0"
            },
            dynamicStyles: [{
                criteria: "values['ty_gubn'] = 3 OR values['ty_gubn'] = 5",
                styles: "background=#EAEAEA"
            },
            {
                criteria: "values['ty_gubn'] <= 2",
                styles: "background=#EAEAEA;foreground=#EAEAEA"
            },
            {
                criteria: "values['mn_bungae2'] = 0",
                styles: "foreground=#EAEAEA"
            }],
            width: 100,
            footer: {
                styles: {
                    textAlignment: "far",
                    numberFormat: "#,##0",
                    font: "Arial,12"
                },
                text: "합계",
                expression: "sum",
                groupText: "합계",
                groupExpression: "sum"
            }
        },
        {
            name: "cd_bjoh",
            fieldName: "cd_bjoh",
            header: {
                text: "관리"
            },
            editable : false,
            readonly: true,
            width: 40
        }
    ];
    gridView.setColumns(columns);
}

function setStyles(grid) {

    //gridViewStyles()는 gridViewStyles.js에 있는 함수임(html에 스트립트 추가함)
    grid.setStyles(gridViewStyles());
};

function setOptions() {
    //개별 옵션 적용 가능 하나, 나는 아래처럼 뭉탱이로 하겠다. 한군데에 깔끔하게!
    gridView.setOptions({
        panel: {visible: false},
        indicator: {visible: false},
        checkBar: {visible: true},
        stateBar: {visible: false}
    });

    gridView.setEditOptions({
        //insertable: true,
        //appendable: true,
        //deletable: true,
        commitWhenExitLast : true,
        crossWhenExitLast : true

    })
};

// gridview callback method
function setGridCallbackFunc() {
    //GridView와 연결된 이벤트
    gridView.onCurrentRowChanged = function (grid, oldRow, newRow) {
        // 최초 입력시에만 수정가능하도록
        //var isNew = (newRow < 0) || dataProvider.getRowState(newRow) === "created";

        //if (!RealGridJS.isMobile())
        //    grid.setColumnProperty("cd_deptemp", "editable", isNew);

        if (newRow > -1) {
            if (dataProvider.getRowState(newRow) === "created") {
                grid.setColumnProperty("mn_bungae1", "editable", true);
                grid.setColumnProperty("mn_bungae2", "editable", true);
            }
            else {
                var editable = dataProvider.getValue(newRow, "ty_gubn") == 4 || dataProvider.getValue(newRow, "ty_gubn") == 6
                grid.setColumnProperty("mn_bungae1", "editable", !editable);
                grid.setColumnProperty("mn_bungae2", "editable", editable);
            }
        }
    }

    //편집이 끝나면 다음 셀로 이동시키기
    gridView.onCellEdited = function (grid, itemIndex, dataRow, field) {

        var focusCell = gridView.getCurrent();

        MakeDicDataForUpdate(focusCell.fieldName, dataRow);

        if (focusCell.fieldName == "mn_bungae1" || focusCell.fieldName == "mn_bungae2") {

            gridView.commit();
            InsertSlip(gridView, dataProvider, itemIndex, dataRow);
        }
        else if(focusCell.fieldName == "nm_remark") {
            var flag = findFieldValue("ty_gubn", dataRow) == 4 || findFieldValue("ty_gubn", dataRow) == 6
            if(flag) {
                focusCell.column = "mn_bungae2";
                focusCell.fieldName = "mn_bungae2";
            }
            else{
                focusCell.column = "mn_bungae1";
                focusCell.fieldName = "mn_bungae1";
            }
        }
        else {
            let colNames = gridView.getColumnNames(true);
            let nextColName = colNames[0];
            for (let i = 0; i < colNames.length; i++) {
                if (colNames[i] == focusCell.fieldName) {
                    for(let j = i + 1; j < colNames.length; j++){
                        if(gridView.getColumnProperty(colNames[j], 'editable')) {
                            nextColName = colNames[j];
                            j = colNames.length;
                        }
                    }
                }
            }
            focusCell.column = nextColName;
            focusCell.fieldName = nextColName;
        }
        //포커스된 셀 변경
        gridView.setCurrent(focusCell);
    }

    gridView.onKeyDown = function (grid, key, ctrl, shift, alt) {

        //enter(13) or right arrow(39)
        //참고사이트(입력키에대한 값을 알려줌)
        //https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
        if (key === 13 || key === 39) {


        }
    }
}

function MakeDicDataForUpdate(pCellName, dataRow) {
    let dicName;
    let dicVal;
    switch (pCellName) {
        case "day":
            dicVal = getdaDate("", findFieldValue('day', dataRow), dataRow);
            dicName = "da_date";
            break;
        case "mn_bungae1":
        case "mn_bungae2":
            dicVal = getmnBungae(findFieldValue('ty_gubn', dataRow), dataRow);
            dicName = "mn_bungae";
            break;
        default:
            dicVal = findFieldValue(pCellName, dataRow);
            dicName = pCellName;
            break;
    }

    dicEditCell[dicName] = dicVal;
}
// provider callback method
function setProviderCallbackFunc() {
    //provider에 연결된 이벤트
    dataProvider.onRowUpdated = function (provider, row) {
        let sqActtax2 = findFieldValue("sq_acttax2", row);
        if (sqActtax2 != null && (provider.getRowState(row) !== "created")) {
            if (Object.keys(dicEditCell).length > 0) {
                callUpdateAPI(sqActtax2)
            }
        }
    }
}


//개발자가 필요에 의해 추가한 이벤트
function findFieldIndex(fields, fieldName) {
        for (var i = 0; i < fields.length; i++) {
            if (fields[i].fieldName.toUpperCase() == fieldName.toUpperCase())
                return i;
        }
        return -1;
    }

//현재 Row의 pfieldName에 해당하는 값 return
function findFieldValue(pfieldName, rowIndex) {

    //var itemIndex = gridView.getCurrent().itemIndex;
    var fields = dataProvider.getFields();

    var fieldIndex = findFieldIndex(fields, pfieldName);
    var value = gridView.getValue(rowIndex, fieldIndex);

    if (value != undefined && value.toString().length > 0)
        return value;
    else {
        return null;
    }
}

function InsertSlip(grid, provider, itemIndex, datarow) {
    if (grid.getValues(itemIndex) != undefined && (provider.getRowState(datarow) === "created")) {
        //insert API
        callInsertAPI(grid, provider, itemIndex, datarow);
    }
}

function SetProviderNewRow(grid, provider) {
    var row = provider.addRow({});
    grid.setCurrent({dataRow: row});
}

function getdaDate(pMon, pDay, itemIndex) {
    var value = "201301";//findFieldValue("da_date", itemIndex);
    var rtnVal = "";
    if(value!= null && value.length == 6 && pDay != ""){
        if(pMon == "")
            rtnVal = value.substring(0,6) + padLeft(pDay, 2, '0');
        else
            rtnVal = value.substring(0,4) + padLeft(pMon, 2, '0') + padLeft(pDay, 2, '0');
    }

    if(rtnVal != undefined && rtnVal.length == 8)
        return rtnVal;
    else
        return rtnVal;
}

function getmnBungae(ptyGubn, itemIndex) {

    let mnBungae;
    if(ptyGubn == 2 || ptyGubn == 4)
        mnBungae = findFieldValue('mn_bungae2', itemIndex);
    else
        mnBungae = findFieldValue('mn_bungae1', itemIndex);

    if(mnBungae != undefined && mnBungae > 0)
        return mnBungae;
    else
        return 0;
}

function CheckInputValue(pCheckParam) {
    let rtnFlag = true;
    for(let key in pCheckParam){
        switch (key){
            case "da_date": {
                if (pCheckParam[key] == undefined || pCheckParam[key].length != 8) {
                    //rtnFlag = false;
                    return rtnFlag;
                }

            }
            case "cd_acctit": {
                if (pCheckParam[key] == undefined || pCheckParam[key].length != 5) {
                    //rtnFlag = false;
                    return rtnFlag;
                }
            }
            case "key_acctit":
            case "mn_bungae": {
                if (pCheckParam[key] == undefined || pCheckParam[key].length <= 0) {
                    return rtnFlag;
                }
            }
        }
    }
    return rtnFlag;
}

function padLeft(nr, n, str){
    return Array(n-String(nr).length+1).join(str||'0')+nr;
}

//API 관련 Method [select, insert, update, delete]
function LoadData() {
    $.ajax({
        url: sUrl + "from_date/" + '20130101' + '/to_date/' + '20130131' + '/',
        contentType: 'application/json'
    })
        .success(function (response) {

            dataProvider.setRows(response.data.data);
            gridView.setFocus();
        })
        .complete(function (response) {
            SetProviderNewRow(gridView, dataProvider)
        });
}

function callInsertAPI(grid, provider, itemIndex, datarow) {
    //한번더 검증 & insert api 만들
    let daDate = getdaDate("", findFieldValue('day', datarow), datarow);

    let param = {};
    param.da_date = daDate;
    param.ty_gubn = findFieldValue('ty_gubn', datarow);
    //findFieldValue('key_acctit', datarow);
    param.cd_acctit = findFieldValue('cd_acctit', datarow);
    param.key_acctit = "2007010111010" + param.cd_acctit; //이부분은 코드도움에서 받자
    param.mn_bungae = getmnBungae(param.ty_gubn, datarow);
    param.cd_trade = findFieldValue('cd_trade', datarow);
    param.nm_trade = findFieldValue('nm_trade', datarow);
    param.cd_remark = findFieldValue('cd_remark', datarow);
    param.nm_remark = findFieldValue('nm_remark',datarow);

    if (CheckInputValue(param)) {
        $.ajax({
            url: sUrl,
            type: "POST",
            dataType: "json",
            data: param
        })
            .success(function (response) {
                //provider.insertRow([]);
                //provider.insertRow(pInsertData);
                if(response.status == 200) {
                    provider.setValue(datarow, "no_acct", response.data.data[0].no_acct);
                    provider.setValue(datarow, "sq_acttax2", response.data.data[0].sq_acttax2);
                    provider.setValue(datarow, "sq_bungae", response.data.data[0].sq_bungae);

                    provider.setRowState(datarow, "none", true); //상태변경
                    SetProviderNewRow(grid, provider); //한줄추가
                }
            })
            .complete(function (response) {
                //SetProviderNewRow(gridView, dataProvider)
            });
    }
    else {
        alert("[callInsertAPI] : Check Require insertValue")
    }
}

function callUpdateAPI(pSqActtax2) {
    //한번더 검증 & insert api 만들
    if(pSqActtax2 != null && pSqActtax2.toString().length > 0 && dicEditCell != undefined && Object.keys(dicEditCell).length > 0) {
        if (CheckInputValue(dicEditCell)) {
            let param = [];
            for (let item in dicEditCell) {
                param.push({column: item, value: dicEditCell[item]})
            }
            $.ajax({
                url: sUrl,
                type: "PUT",
                dataType: "json",
                contentType: 'application/json', //API 에서 param 인식을 위해 필수!
                data: JSON.stringify({sq_acttax2: pSqActtax2, update: param})
                //JSON.stringify() : API 에 data를 json 형식으로 전달하기위해 필수
            })
                .success(function (response) {
                    dicEditCell = {}
                })
                .complete(function (response) {
                    dicEditCell = {}
                });
        }
    }
}

function callDeleteAPI() {
    //한번더 검증 & insert api 만들
    let rows = gridView.getCheckedRows(true);
    let param = [];
    for (let item in rows) {
        let sqActtax2 = findFieldValue("sq_acttax2", rows[item]);
        if (sqActtax2 != null && (dataProvider.getRowState(rows[item]) !== "created")) {
            param.push(sqActtax2)
        }
    }
    if (param.length > 0) {
        $.ajax({
            url: sUrl,
            type: "DELETE",
            dataType: "json",
            contentType: 'application/json', //API 에서 param 인식을 위해 필수!
            data: JSON.stringify({sq_acttax2: param})
            //data: param
            //JSON.stringify() : API 에 data를 json 형식으로 전달하기위해 필수
        })
            .success(function (response) {
                dicEditCell = {}
                if (response.status == 200) {
                    dataProvider.removeRows(rows);
                }
            })
            .complete(function (response) {
                dicEditCell = {}
            });
    }
}


