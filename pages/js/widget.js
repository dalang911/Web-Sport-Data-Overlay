window.huitu = function () {
    appview.tree.clear();
    textshadow = {
        x: 2,
        y: 2,
        blur: 0,
        color: '#000000'
    }
    console.log('清空tree');
    //背景画布
    appv_bg_pan = new Box({
        id: 'appv_bg_pan',
        x: 0,//左上角位置
        y: 0,//左上角位置
        width: appvWidth,
        height: appvHeight,
        lockRatio: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Canvas',
                width: appvWidth,
                height: appvHeight,
                fill: '#0A9A38'
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "appv_bg_pan",
                        "set": [
                            { "name": `Canvas Settings`, "url": '', "value": "", "type": "title", "tools": false },
                            { "name": `Canvas color`, "url": "appv_bg_pan.children[0].fill", "value": appv_bg_pan.children[0].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //日期时间
    appv_date_pan = new Box({
        id: 'appv_date_pan',
        x: 20,//左上角位置
        y: 20,//左上角位置
        width: 420,
        height: 56,
        lockRatio: true,
        editable: true,
        cornerRadius: 8,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                name: 'daydate',
                tag: 'Text',
                resizeFontSize: true,
                fontSize: 36,
                fontWeight: 'black',
                text: `--`,
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'top',
                shadow: textshadow
            },
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "appv_date_pan",
                        "set": [
                            { "name": `DateTime`, "url": appv_date_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "appv_date_pan.children[0].fill", "value": appv_date_pan.children[0].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },


    })

    //心率图表
    pt_heart_pan = new Box({
        id: 'pt_heart_pan',
        x: 80,//左上角位置
        y: 850,//左上角位置
        width: 400,
        height: 200,
        lockRatio: true,
        editable: true,
        hitBox: true,
        cornerRadius: 8,//圆角
        //overflow: 'hide',	//越界隐藏
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Line',
                lockRatio: true,
                width: 400,
                strokeWidth: 5,
                stroke: '#FFFFFF',
                dashPattern: [10, 10]
            },
            {
                tag: 'Line',
                lockRatio: true,
                points: [0, 100, 400, 100],
                width: 400,
                strokeWidth: 5,
                stroke: '#FFFFFF',
                dashPattern: [10, 10],
            },
            {
                tag: 'Line',
                lockRatio: true,
                points: [0, 200, 400, 200],
                width: 400,
                strokeWidth: 5,
                stroke: '#FFFFFF',
                dashPattern: [10, 10],
            },
            {
                tag: 'Text',
                resizeFontSize: true,
                x: -6,
                y: 0,
                fontSize: 20,
                fontWeight: 'black',
                text: heartRateMax,
                fill: '#FFFFFF',
                textAlign: 'right',
                verticalAlign: 'middle',
            },
            {
                tag: 'Text',
                resizeFontSize: true,
                x: -6,
                y: 100,
                fontSize: 20,
                fontWeight: 'black',
                text: Math.round((heartRateMax + heartRateMin) / 2),
                fill: '#FFFFFF',
                textAlign: 'right',
                verticalAlign: 'middle',
            },
            {
                tag: 'Text',
                resizeFontSize: true,
                x: -6,
                y: 200,
                fontSize: 20,
                fontWeight: 'black',
                text: heartRateMin,
                fill: '#FFFFFF',
                textAlign: 'right',
                verticalAlign: 'middle',
            },
            {
                tag: 'Line',
                lockRatio: true,
                points: pt_heart_points,  // [x,y, x,y ...]
                cornerRadius: 1,
                strokeWidth: 3,
                stroke: '#C71585',
                strokeCap: 'round'
            },
            {
                name: 'metrics',
                tag: 'Line',
                lockRatio: true,
                x: 50,
                width: 200,
                rotation: 90,
                fill: "blue",
                strokeWidth: 4,
                stroke: '#FFFFFF',
                strokeCap: 'round'
            },
            {
                tag: 'Rect',
                x: 360,
                y: 160,
                scale: 0.03,
                path: heart_icon,
                fill: '#C71585'
            },
            {
                tag: 'Text',
                resizeFontSize: true,
                x: 55,
                y: 180,
                fontSize: 24,
                fontWeight: 'black',
                text: '180',
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'middle',
            },
            {
                tag: 'Ellipse',
                lockRatio: true,
                around: 'center',
                x: 50,
                y: 100,
                width: 13,
                height: 13,
                fill: "#ffde7d"
            },
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "pt_heart_pan",
                        "set": [
                            { "name": `heart`, "url": "", "value": "", "type": "title", "tools": false },
                            { "name": `ruler color`, "url": "pt_heart_pan.children[0].stroke", "value": pt_heart_pan.children[0].stroke, "type": "heart_color_line", "tools": true },
                            { "name": `ruler text color`, "url": "pt_heart_pan.children[3].fill", "value": pt_heart_pan.children[3].fill, "type": "heart_line_text", "tools": true },
                            { "name": `Heart line thickness`, "url": "pt_heart_pan.children[6].strokeWidth", "value": pt_heart_pan.children[6].strokeWidth, "type": "number", "tools": true },
                            { "name": `Heart color`, "url": "pt_heart_pan.children[6].stroke", "value": pt_heart_pan.children[6].stroke, "type": "color", "tools": true },
                            { "name": `Progress line thickness`, "url": "pt_heart_pan.children[7].strokeWidth", "value": pt_heart_pan.children[7].strokeWidth, "type": "number", "tools": true },
                            { "name": `Progress line color`, "url": "pt_heart_pan.children[7].stroke", "value": pt_heart_pan.children[7].stroke, "type": "color", "tools": true },
                            { "name": `Progress dot color`, "url": "pt_heart_pan.children[10].fill", "value": pt_heart_pan.children[10].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //配速图表
    pt_pace_pan = new Box({
        id: 'pt_pace_pan',
        x: 80,//左上角位置
        y: 600,//左上角位置
        width: 400,
        height: 200,
        lockRatio: true,
        editable: true,
        hitBox: true,
        cornerRadius: 8,//圆角
        //overflow: 'hide',	//越界隐藏
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Line',
                lockRatio: true,
                width: 400,
                strokeWidth: 5,
                stroke: '#FFFFFF',
                dashPattern: [10, 10]
            },
            {
                tag: 'Line',
                lockRatio: true,
                points: [0, 100, 400, 100],
                width: 400,
                strokeWidth: 5,
                stroke: '#FFFFFF',
                dashPattern: [10, 10],
            },
            {
                tag: 'Line',
                lockRatio: true,
                points: [0, 200, 400, 200],
                width: 400,
                strokeWidth: 5,
                stroke: '#FFFFFF',
                dashPattern: [10, 10],
            },
            {
                tag: 'Text',
                resizeFontSize: true,
                x: -6,
                y: 0,
                fontSize: 20,
                fontWeight: 'black',
                text: SpeedformatPace(paceMax),
                fill: '#FFFFFF',
                textAlign: 'right',
                verticalAlign: 'middle',
            },
            {
                tag: 'Text',
                resizeFontSize: true,
                x: -6,
                y: 100,
                fontSize: 20,
                fontWeight: 'black',
                text: SpeedformatPace((paceMax + paceMin) / 2),
                fill: '#FFFFFF',
                textAlign: 'right',
                verticalAlign: 'middle',
            },
            {
                tag: 'Text',
                resizeFontSize: true,
                x: -6,
                y: 200,
                fontSize: 20,
                fontWeight: 'black',
                text: SpeedformatPace(paceMin),
                fill: '#FFFFFF',
                textAlign: 'right',
                verticalAlign: 'middle',
            },
            {
                tag: 'Line',
                lockRatio: true,
                points: pt_paces_points,  // [x,y, x,y ...]
                curve: true,
                strokeWidth: 3,
                stroke: '#00CED1',
                strokeCap: 'round'
            },
            {
                name: 'metrics',
                tag: 'Line',
                lockRatio: true,
                x: 50,
                width: 200,
                rotation: 90,
                fill: "blue",
                strokeWidth: 4,
                stroke: '   #FFFFFF',
                strokeCap: 'round'
            },
            {
                tag: 'Rect',
                x: 360,
                y: 160,
                scale: 0.03,
                path: run_icon,
                fill: ' #00CED1'
            },
            {
                tag: 'Text',
                resizeFontSize: true,
                x: 55,
                y: 180,
                fontSize: 24,
                fontWeight: 'black',
                text: '180',
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'middle',
            },
            {
                tag: 'Ellipse',
                lockRatio: true,
                around: 'center',
                x: 50,
                y: 100,
                width: 13,
                height: 13,
                fill: "#ffde7d"
            },
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "pt_pace_pan",
                        "set": [
                            { "name": `Pace`, "url": "", "value": "", "type": "title", "tools": false },
                            { "name": `ruler color`, "url": "pt_pace_pan.children[0].stroke", "value": pt_pace_pan.children[0].stroke, "type": "pace_color_line", "tools": true },
                            { "name": `ruler text color`, "url": "pt_pace_pan.children[3].fill", "value": pt_pace_pan.children[3].fill, "type": "pace_line_text", "tools": true },
                            { "name": `pace line thickness`, "url": "pt_pace_pan.children[6].strokeWidth", "value": pt_pace_pan.children[6].strokeWidth, "type": "number", "tools": true },
                            { "name": `pace line color`, "url": "pt_pace_pan.children[6].stroke", "value": pt_pace_pan.children[6].stroke, "type": "color", "tools": true },
                            { "name": `Progress line thickness`, "url": "pt_pace_pan.children[7].strokeWidth", "value": pt_pace_pan.children[7].strokeWidth, "type": "number", "tools": true },
                            { "name": `Progress line color`, "url": "pt_pace_pan.children[7].stroke", "value": pt_pace_pan.children[7].stroke, "type": "color", "tools": true },
                            { "name": `Progress dot color`, "url": "pt_pace_pan.children[10].fill", "value": pt_pace_pan.children[10].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    });

    //高程图表
    o2o_ele_pan = new Box({
        id: 'o2o_ele_pan',
        x: 550,//左上角位置
        y: 850,//左上角位置
        width: 400,
        height: 100,
        lockRatio: true,
        editable: true,
        hitBox: true,
        cornerRadius: 8,//圆角
        overflow: 'hide',	//越界隐藏
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Line',
                lockRatio: true,
                width: 400,
                strokeWidth: 5,
                stroke: '#FFFFFF',
                dashPattern: [10, 10]
            },
            {
                tag: 'Line',
                lockRatio: true,
                points: [0, 100, 400, 100],
                width: 400,
                strokeWidth: 5,
                stroke: '#FFFFFF',
                dashPattern: [10, 10],
            },
            {
                tag: 'Text',
                resizeFontSize: true,
                x: 0,
                y: 10,
                fontSize: 20,
                fontWeight: 'black',
                text: '+10',
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'middle',
            },
            {
                tag: 'Text',
                resizeFontSize: true,
                x: 0,
                y: 50,
                fontSize: 20,
                fontWeight: 'black',
                text: 0,
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'middle',
            },
            {
                tag: 'Text',
                resizeFontSize: true,
                x: 0,
                y: 90,
                fontSize: 20,
                fontWeight: 'black',
                text: '-10',
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'middle',
            },
            {
                tag: 'Line',
                lockRatio: true,
                x: 200,
                y: 50,
                points: o2o_ele_points,  // [x,y, x,y ...]
                curve: true,
                strokeWidth: 3,
                stroke: '#FFD700',
                strokeCap: 'round'
            },
            {
                name: 'metrics',
                tag: 'Line',
                lockRatio: true,
                x: 200,
                width: 100,
                rotation: 90,
                fill: "blue",
                strokeWidth: 4,
                stroke: '#FFFFFF',
                strokeCap: 'round'
            },
            {
                tag: 'Rect',
                x: 360,
                y: 60,
                scale: 0.04,
                path: mountain_icon,
                fill: '#FFD700'
            },
            {
                tag: 'Text',
                resizeFontSize: true,
                x: 210,
                y: 80,
                fontSize: 24,
                fontWeight: 'black',
                text: '180',
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'middle',
            },
            {
                tag: 'Ellipse',
                lockRatio: true,
                around: 'center',
                x: 200,
                y: 50,
                width: 13,
                height: 13,
                fill: "#ffde7d"
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "o2o_ele_pan",
                        "set": [
                            { "name": `1:1 Elevation 80m`, "url": "", "value": "", "type": "title", "tools": false },
                            { "name": `ruler color`, "url": "o2o_ele_pan.children[0].stroke", "value": o2o_ele_pan.children[0].stroke, "type": "o2o_color_line", "tools": true },
                            { "name": `ruler text color`, "url": "o2o_ele_pan.children[2].fill", "value": o2o_ele_pan.children[2].fill, "type": "o2o_line_text", "tools": true },
                            { "name": `ele line thickness`, "url": "o2o_ele_pan.children[5].strokeWidth", "value": o2o_ele_pan.children[5].strokeWidth, "type": "number", "tools": true },
                            { "name": `ele line color`, "url": "o2o_ele_pan.children[5].stroke", "value": o2o_ele_pan.children[5].stroke, "type": "color", "tools": true },
                            { "name": `Progress line thickness`, "url": "o2o_ele_pan.children[6].strokeWidth", "value": o2o_ele_pan.children[6].strokeWidth, "type": "number", "tools": true },
                            { "name": `Progress line color`, "url": "o2o_ele_pan.children[6].stroke", "value": o2o_ele_pan.children[6].stroke, "type": "color", "tools": true },
                            { "name": `Progress dot color`, "url": "o2o_ele_pan.children[9].fill", "value": o2o_ele_pan.children[9].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    });


    //高程图表
    pt_ele_pan = new Box({
        id: 'pt_ele_pan',
        x: 550,//左上角位置
        y: 850,//左上角位置
        width: 400,
        height: 200,
        lockRatio: true,
        editable: true,
        hitBox: true,
        cornerRadius: 8,//圆角
        //overflow: 'hide',	//越界隐藏
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Line',
                lockRatio: true,
                width: 400,
                strokeWidth: 5,
                stroke: '#FFFFFF',
                dashPattern: [10, 10]
            },
            {
                tag: 'Line',
                lockRatio: true,
                points: [0, 100, 400, 100],
                width: 400,
                strokeWidth: 5,
                stroke: '#FFFFFF',
                dashPattern: [10, 10],
            },
            {
                tag: 'Line',
                lockRatio: true,
                points: [0, 200, 400, 200],
                width: 400,
                strokeWidth: 5,
                stroke: '#FFFFFF',
                dashPattern: [10, 10],
            },
            {
                tag: 'Text',
                resizeFontSize: true,
                x: -6,
                y: 0,
                fontSize: 20,
                fontWeight: 'black',
                text: (eleMax).toFixed(2),
                fill: '#FFFFFF',
                textAlign: 'right',
                verticalAlign: 'middle',
            },
            {
                tag: 'Text',
                resizeFontSize: true,
                x: -6,
                y: 100,
                fontSize: 20,
                fontWeight: 'black',
                text: ((eleMax + eleMin) / 2).toFixed(2),
                fill: '#FFFFFF',
                textAlign: 'right',
                verticalAlign: 'middle',
            },
            {
                tag: 'Text',
                resizeFontSize: true,
                x: -6,
                y: 200,
                fontSize: 20,
                fontWeight: 'black',
                text: (eleMin).toFixed(2),
                fill: '#FFFFFF',
                textAlign: 'right',
                verticalAlign: 'middle',
            },
            {
                tag: 'Line',
                lockRatio: true,
                points: pt_ele_points,  // [x,y, x,y ...]
                curve: true,
                strokeWidth: 3,
                stroke: '#FFD700',
                strokeCap: 'round'
            },
            {
                name: 'metrics',
                tag: 'Line',
                lockRatio: true,
                x: 50,
                width: 200,
                rotation: 90,
                fill: "blue",
                strokeWidth: 4,
                stroke: '#FFFFFF',
                strokeCap: 'round'
            },
            {
                tag: 'Rect',
                x: 360,
                y: 160,
                scale: 0.04,
                path: mountain_icon,
                fill: '#FFD700'
            },
            {
                tag: 'Text',
                resizeFontSize: true,
                x: 55,
                y: 180,
                fontSize: 24,
                fontWeight: 'black',
                text: '180',
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'middle',
            },
            {
                tag: 'Ellipse',
                lockRatio: true,
                around: 'center',
                x: 50,
                y: 100,
                width: 13,
                height: 13,
                fill: "#ffde7d"
            },
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "pt_ele_pan",
                        "set": [
                            { "name": `Elevation`, "url": "", "value": "", "type": "title", "tools": false },
                            { "name": `ruler color`, "url": "pt_ele_pan.children[0].stroke", "value": pt_ele_pan.children[0].stroke, "type": "ele_color_line", "tools": true },
                            { "name": `ruler text color`, "url": "pt_ele_pan.children[3].fill", "value": pt_ele_pan.children[3].fill, "type": "ele_line_text", "tools": true },
                            { "name": `ele line thickness`, "url": "pt_ele_pan.children[6].strokeWidth", "value": pt_ele_pan.children[6].strokeWidth, "type": "number", "tools": true },
                            { "name": `ele line color`, "url": "pt_ele_pan.children[6].stroke", "value": pt_ele_pan.children[6].stroke, "type": "color", "tools": true },
                            { "name": `Progress line thickness`, "url": "pt_ele_pan.children[7].strokeWidth", "value": pt_ele_pan.children[7].strokeWidth, "type": "number", "tools": true },
                            { "name": `Progress line color`, "url": "pt_ele_pan.children[7].stroke", "value": pt_ele_pan.children[7].stroke, "type": "color", "tools": true },
                            { "name": `Progress dot color`, "url": "pt_ele_pan.children[10].fill", "value": pt_ele_pan.children[10].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    });


    //高程
    appv_ele_pan = new Box({
        id: 'appv_ele_pan',
        x: 420,//左上角位置
        y: 100,//左上角位置
        width: 400,
        height: 200,
        lockRatio: true,
        editable: true,
        hitBox: true,
        cornerRadius: 8,//圆角
        //overflow: 'hide',
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Line',
                lockRatio: true,
                points: ele_points,  // [x,y, x,y ...]
                cornerRadius: 1,
                strokeWidth: 1,
                stroke: '#FF0000',
                strokeCap: 'round'
            },
            {
                name: 'metrics',
                tag: 'Line',
                lockRatio: true,
                x: 50,
                width: 200,
                rotation: 90,
                fill: "blue",
                strokeWidth: 4,
                stroke: '#CCCCCC',
                strokeCap: 'round'
            },
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "appv_ele_pan",
                        "set": [
                            { "name": `elevation`, "url": "", "value": "", "type": "title", "tools": false },
                            { "name": `line thickness`, "url": "appv_ele_pan.children[0].strokeWidth", "value": appv_ele_pan.children[0].strokeWidth, "type": "number", "tools": true },
                            { "name": `elevation color`, "url": "appv_ele_pan.children[0].stroke", "value": appv_ele_pan.children[0].stroke, "type": "color", "tools": true },
                            { "name": `progress color`, "url": "appv_ele_pan.children[1].stroke", "value": appv_ele_pan.children[1].stroke, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //高程
    appv_ele18_pan = new Box({
        id: 'appv_ele18_pan',
        x: 320,//左上角位置
        y: 700,//左上角位置
        width: 800,
        height: 100,
        lockRatio: true,
        editable: true,
        hitBox: true,
        cornerRadius: 8,//圆角
        //overflow: 'hide',
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Line',
                lockRatio: true,
                points: ele18_points,  // [x,y, x,y ...]
                cornerRadius: 1,
                strokeWidth: 1,
                stroke: '#FFFFFF',
                strokeCap: 'round'
            },
            {
                tag: 'Ellipse',
                lockRatio: true,
                around: 'center',
                width: 14,
                height: 14,
                fill: "#FFCC00",
            },
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "appv_ele18_pan",
                        "set": [
                            { "name": `elevationwide`, "url": "", "value": "", "type": "title", "tools": false },
                            { "name": `line thickness`, "url": "appv_ele18_pan.children[0].strokeWidth", "value": appv_ele18_pan.children[0].strokeWidth, "type": "number", "tools": true },
                            { "name": `elevation color`, "url": "appv_ele18_pan.children[0].stroke", "value": appv_ele18_pan.children[0].stroke, "type": "color", "tools": true },
                            { "name": `progress color`, "url": "appv_ele18_pan.children[1].fill", "value": appv_ele18_pan.children[1].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //状态
    appv_nowstatus_pan = new Box({
        id: 'appv_nowstatus_pan',
        x: 30,//左上角位置
        y: 340,//左上角位置
        width: 400,
        height: 400,
        lockRatio: true,
        editable: true,

        cornerRadius: 4,
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                name: "now_status",
                tag: 'Text',
                width: 400,
                resizeFontSize: true,
                fontSize: 28,
                fontWeight: 'black',
                text: `速度：km/h\n配速：min/km\n心率：bpm\n步频：steps/min\n步幅：m\n`,
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'top',
                shadow: textshadow
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "appv_nowstatus_pan",
                        "set": [
                            { "name": `attribute`, "url": appv_nowstatus_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "appv_nowstatus_pan.children[0].fill", "value": appv_nowstatus_pan.children[0].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //分段信息
    appv_lap_pan = new Box({
        id: 'appv_lap_pan',
        x: 30,//左上角位置
        y: 560,//左上角位置
        width: 400,
        height: 400,
        lockRatio: true,
        editable: true,

        cornerRadius: 4,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                name: "lap_status",
                tag: 'Text',
                resizeFontSize: true,
                width: 400,
                fontSize: 20,
                fontWeight: 'black',
                text: `1Km用时：00:00\n2Km用时：03:00`,
                fill: '#FFFFFF',
                textAlign: 'right',
                verticalAlign: 'top',
                shadow: textshadow
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "appv_lap_pan",
                        "set": [
                            { "name": `lap`, "url": appv_lap_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "appv_lap_pan.children[0].fill", "value": appv_lap_pan.children[0].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    // 用户分段计圈
    appv_lap_user_pan = new Box({
        id: 'appv_lap_user_pan',
        x: 30,//左上角位置
        y: 560,//左上角位置
        //width: 400,
        //height: 400,
        lockRatio: true,
        editable: true,

        cornerRadius: 4,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {//bg
                tag: 'Text',
                resizeFontSize: true,
                x: 0,
                width: 520,
                fontSize: 20,
                fontWeight: 'black',
                text: ``,
                fill: '#FF0000',
                textAlign: 'left',
                verticalAlign: 'top',
                shadow: {
                    x: 8,
                    y: 0,
                    blur: 0,
                    color: '#FF0000'
                }
            },
            {//lap
                tag: 'Text',
                resizeFontSize: true,
                x: 50,
                width: 50,
                fontSize: 20,
                fontWeight: 'black',
                text: ``,
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'top',
                shadow: textshadow
            },
            {//time
                tag: 'Text',
                resizeFontSize: true,
                x: 100,
                width: 100,
                fontSize: 20,
                fontWeight: 'black',
                text: ``,
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'top',
                shadow: textshadow
            },
            {//dis
                tag: 'Text',
                resizeFontSize: true,
                x: 200,
                width: 100,
                fontSize: 20,
                fontWeight: 'black',
                text: ``,
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'top',
                shadow: textshadow
            },
            {//pace
                tag: 'Text',
                resizeFontSize: true,
                x: 300,
                width: 100,
                fontSize: 20,
                fontWeight: 'black',
                text: ``,
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'top',
                shadow: textshadow
            },
            {//cad
                tag: 'Text',
                resizeFontSize: true,
                x: 400,
                width: 70,
                fontSize: 20,
                fontWeight: 'black',
                text: ``,
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'top',
                shadow: textshadow
            },
            {//haert
                tag: 'Text',
                resizeFontSize: true,
                x: 470,
                width: 70,
                fontSize: 20,
                fontWeight: 'black',
                text: ``,
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'top',
                shadow: textshadow
            }

        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "appv_lap_user_pan",
                        "set": [
                            { "name": `lap user`, "url": appv_lap_user_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "appv_lap_user_pan.children[1].fill", "value": appv_lap_user_pan.children[1].fill, "type": "lap_user_color", "tools": true },
                            { "name": `present color`, "url": "appv_lap_user_pan.children[0].fill", "value": appv_lap_user_pan.children[0].fill, "type": "lap_user_color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //运动时间框
    appv_nowtime_pan = new Box({
        id: 'appv_nowtime_pan',
        x: appvWidth - 150,//左上角位置
        y: 15,//左上角位置
        width: 140,
        height: 46,
        lockRatio: true,
        editable: true,
        fill: '#CCEEFF',
        cornerRadius: 8,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                name: "now_time",
                tag: 'Text',
                resizeFontSize: true,
                width: 130,
                x: 0,
                y: 4,
                fontSize: 28,
                fontWeight: 'black',
                text: '00:00:00',
                fill: '#191970',
                textAlign: 'right',
                verticalAlign: 'top',
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "appv_nowtime_pan",
                        "set": [
                            { "name": `Sport ET`, "url": appv_nowtime_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Background color`, "url": "appv_nowtime_pan.fill", "value": appv_nowtime_pan.fill, "type": "color", "tools": true },
                            { "name": `Text color`, "url": "appv_nowtime_pan.children[0].fill", "value": appv_nowtime_pan.children[0].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        }
    })

    //地图
    appv_map_pan = new Box({
        id: 'appv_map_pan',
        x: appvWidth - 620,//左上角位置
        y: 200,//左上角位置
        width: 600,
        height: 600,
        lockRatio: true,
        editable: true,
        hitBox: true,
        cornerRadius: 4,//圆角
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Line',
                lockRatio: true,
                points: map_points,  // [x,y, x,y ...]
                cornerRadius: 4,
                strokeWidth: 4,
                stroke: '#FFFF00',
                strokeCap: 'round'
            },
            {
                name: 'now_map',
                tag: 'Line',
                lockRatio: true,
                points: [],  // [x,y, x,y ...]
                cornerRadius: 6,
                strokeWidth: 6,
                stroke: '#FF7F00',
                strokeCap: 'round'
            },
            {
                name: 'now_point',
                tag: 'Ellipse',
                lockRatio: true,
                around: 'center',
                width: 16,
                height: 16,
                fill: "#FF6347"
            },
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "appv_map_pan",
                        "set": [
                            { "name": `route`, "url": appv_map_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Background route thickness`, "url": "appv_map_pan.children[0].strokeWidth", "value": appv_map_pan.children[0].strokeWidth, "type": "number", "tools": true },
                            { "name": `Background route color`, "url": "appv_map_pan.children[0].stroke", "value": appv_map_pan.children[0].stroke, "type": "color", "tools": true },
                            { "name": `progress route thickness`, "url": "appv_map_pan.children[1].strokeWidth", "value": appv_map_pan.children[1].strokeWidth, "type": "number", "tools": true },
                            { "name": `progress route color`, "url": "appv_map_pan.children[1].stroke", "value": appv_map_pan.children[1].stroke, "type": "color", "tools": true },
                            { "name": `Current position size`, "url": "appv_map_pan.children[2]", "value": appv_map_pan.children[2].width, "type": "Ellipse", "tools": true },
                            { "name": `Current position color`, "url": "appv_map_pan.children[2].fill", "value": appv_map_pan.children[2].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //地图方向角
    appv_map_a_pan = new Box({
        id: 'appv_map_a_pan',
        x: appvWidth - 620,//左上角位置
        y: 200,//左上角位置
        width: 600,
        height: 600,
        lockRatio: true,
        editable: true,
        hitBox: true,
        cornerRadius: 4,//圆角
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Line',
                lockRatio: true,
                points: map_points,  // [x,y, x,y ...]
                cornerRadius: 4,
                strokeWidth: 4,
                stroke: '#FFFF00',
                strokeCap: 'round'
            },
            {
                name: 'now_map',
                tag: 'Line',
                lockRatio: true,
                points: [],  // [x,y, x,y ...]
                cornerRadius: 6,
                strokeWidth: 6,
                stroke: '#FF7F00',
                strokeCap: 'round',
                opacity: 0.7
            },
            {
                name: 'now_point',
                tag: 'Polygon',
                //lockRatio: true,
                points: [24, 0, 0, 48, 24, 36, 48, 48, 24, 0],
                around: 'center',
                fill: "#FF6347"
            },
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "appv_map_a_pan",
                        "set": [
                            { "name": `route`, "url": appv_map_a_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Background route thickness`, "url": "appv_map_a_pan.children[0].strokeWidth", "value": appv_map_a_pan.children[0].strokeWidth, "type": "number", "tools": true },
                            { "name": `Background route color`, "url": "appv_map_a_pan.children[0].stroke", "value": appv_map_a_pan.children[0].stroke, "type": "color", "tools": true },
                            { "name": `progress route thickness`, "url": "appv_map_a_pan.children[1].strokeWidth", "value": appv_map_a_pan.children[1].strokeWidth, "type": "number", "tools": true },
                            { "name": `progress route color`, "url": "appv_map_a_pan.children[1].stroke", "value": appv_map_a_pan.children[1].stroke, "type": "color", "tools": true },
                            { "name": `Current position color`, "url": "appv_map_a_pan.children[2].fill", "value": appv_map_a_pan.children[2].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })


    //web地图
    web_map_pan = new Box({
        id: 'web_map_pan',
        x: appvWidth - 620,//左上角位置
        y: 200,//左上角位置
        width: 300,
        height: 300,
        lockRatio: true,
        editable: true,
        hitBox: true,
        cornerRadius: 1000,//圆角
        overflow: 'hide',
        stroke: '#FFC800',
        strokeWidth: 10,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Canvas',
                width: 300,
                height: 300,
                draggable: true
            },

        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "web_map_pan",
                        "set": [
                            { "name": `webroute (long time)`, "url": web_map_pan.id, "value": "", "type": "title", "tools": false },
                            { "name": `border color`, "url": "web_map_pan.stroke", "value": web_map_pan.stroke, "type": "color", "tools": true },
                            { "name": `Background route color`, "url": "polyline.updateSymbol({'lineColor': value})", "value": polyline._compiledSymbol.lineColor, "type": "funcolor", "tools": true },
                            { "name": `progress route color`, "url": "new_polyline.updateSymbol({'lineColor': value})", "value": new_polyline._compiledSymbol.lineColor, "type": "funcolor", "tools": true },
                            { "name": `Current position color`, "url": "marker.updateSymbol({'markerFill': value})", "value": marker._symbol.markerFill, "type": "funcolor", "tools": true },

                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //miniweb地图
    web_minimap_pan = new Box({
        id: 'web_minimap_pan',
        x: appvWidth - 620,//左上角位置
        y: 200,//左上角位置
        width: 200,
        height: 200,
        lockRatio: true,
        editable: true,
        hitBox: true,
        cornerRadius: 1000,//圆角
        overflow: 'hide',
        stroke: '#FFC800',
        strokeWidth: 10,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Canvas',
                width: 200,
                height: 200,
                draggable: true
            },

        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "web_minimap_pan",
                        "set": [
                            { "name": `webroute (long time)`, "url": web_minimap_pan.id, "value": "", "type": "title", "tools": false },
                            { "name": `border color`, "url": "web_minimap_pan.stroke", "value": web_minimap_pan.stroke, "type": "color", "tools": true },
                            { "name": `Background route color`, "url": "mini_polyline.updateSymbol({'lineColor': value})", "value": mini_polyline._compiledSymbol.lineColor, "type": "funcolor", "tools": true },
                            { "name": `progress route color`, "url": "mini_new_polyline.updateSymbol({'lineColor': value})", "value": mini_new_polyline._compiledSymbol.lineColor, "type": "funcolor", "tools": true },
                            { "name": `Current position color`, "url": "mini_marker.updateSymbol({'markerFill': value})", "value": mini_marker._symbol.markerFill, "type": "funcolor", "tools": true },

                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //距离框
    appv_distance_pan = new Box({
        id: 'appv_distance_pan',
        x: appvWidth - 270,//左上角位置
        y: 80,//左上角位置
        width: 260,
        height: 46,
        lockRatio: true,
        editable: true,
        fill: '#191970',
        cornerRadius: 4,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Text',
                resizeFontSize: true,
                width: 100,
                x: 0,
                y: 10,
                fontSize: 20,
                fontWeight: 'black',
                text: max_distance_in_km + `Km`,
                fill: '#FFFFFF',
                textAlign: 'right',
                verticalAlign: 'top',
            },
            {
                tag: 'Text',
                resizeFontSize: true,
                width: 40,
                x: 90,
                y: 2,
                fontSize: 28,
                fontWeight: 'black',
                text: `|`,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'top',
            },
            {
                tag: 'Text',
                resizeFontSize: true,
                width: 140,
                x: 110,
                y: 0,
                fontSize: 28,
                fontWeight: 'black',
                text: `--Km`,
                fill: '#FFFFFF',
                textAlign: 'right',
                verticalAlign: 'top',
            },
            {
                tag: 'Rect',
                width: 130,
                height: 8,
                x: 120,
                y: 34,
                fill: '#00FA9A',
                cornerRadius: 4
            },
            {
                tag: 'Rect',
                className: 130,
                width: 0,
                height: 8,
                x: 120,
                y: 34,
                fill: '#FFFF00',
                cornerRadius: 4
            },
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "appv_distance_pan",
                        "set": [
                            { "name": `distance`, "url": appv_distance_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Background color`, "url": "appv_distance_pan.fill", "value": appv_distance_pan.fill, "type": "color", "tools": true },
                            { "name": `distance color`, "url": "appv_distance_pan.children[0].fill", "value": appv_distance_pan.children[0].fill, "type": "color", "tools": true },
                            { "name": `progress distance color`, "url": "appv_distance_pan.children[2].fill", "value": appv_distance_pan.children[2].fill, "type": "color", "tools": true },
                            { "name": `progress Background color`, "url": "appv_distance_pan.children[3].fill", "value": appv_distance_pan.children[3].fill, "type": "color", "tools": true },
                            { "name": `progress color`, "url": "appv_distance_pan.children[4].fill", "value": appv_distance_pan.children[4].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //lite距离框
    lite_distance_pan = new Box({
        id: 'lite_distance_pan',
        x: appvWidth - 420,//左上角位置
        y: 80,//左上角位置
        width: 400,
        height: 50,
        lockRatio: true,
        editable: true,
        fill: '#191970',
        cornerRadius: 4,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Rect',
                width: 400,
                height: 50,
                x: 0,
                y: 0,
                fill: '#CCCCCC',
                cornerRadius: 4
            },
            {
                tag: 'Rect',
                width: 0,
                height: 50,
                x: 0,
                y: 0,
                fill: '#FFFFFF',
                cornerRadius: 4
            },
            {
                tag: 'Text',
                resizeFontSize: true,
                x: 390,
                y: 3,
                fontSize: 32,
                fontWeight: 'black',
                text: `--Km`,
                fill: '#FF7F00',
                textAlign: 'right',
                verticalAlign: 'center',
                shadow: textshadow
            },
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "lite_distance_pan",
                        "set": [
                            { "name": `distance`, "url": lite_distance_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `text color`, "url": "lite_distance_pan.children[2].fill", "value": lite_distance_pan.children[2].fill, "type": "color", "tools": true },
                            { "name": `progress Background color`, "url": "lite_distance_pan.children[0].fill", "value": lite_distance_pan.children[0].fill, "type": "color", "tools": true },
                            { "name": `progress color`, "url": "lite_distance_pan.children[1].fill", "value": lite_distance_pan.children[1].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //时速
    TO_speed_pan = new Box({
        id: 'TO_speed_pan',
        x: 330,//左上角位置
        y: 290,//左上角位置
        width: 350,
        height: 50,
        lockRatio: true,
        editable: true,

        cornerRadius: 4,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Text',
                y: 1,
                x: 55,
                width: 300,
                resizeFontSize: true,
                fontSize: 32,
                fontWeight: 'black',
                text: `Speed：km/h`,
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'top',
                shadow: textshadow
            },
            {
                tag: 'Rect',
                width: 30,
                height: 30,
                scale: 0.045,
                path: speed_icon,
                fill: '#FF7F00'
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "TO_speed_pan",
                        "set": [
                            { "name": `Pace`, "url": TO_speed_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "TO_speed_pan.children[0].fill", "value": TO_speed_pan.children[0].fill, "type": "color", "tools": true },
                            { "name": `Icon color`, "url": "TO_speed_pan.children[1].fill", "value": TO_speed_pan.children[1].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //配速
    TO_pace_pan = new Box({
        id: 'TO_pace_pan',
        x: 330,//左上角位置
        y: 340,//左上角位置
        width: 350,
        height: 50,
        lockRatio: true,
        editable: true,

        cornerRadius: 4,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Text',
                y: 1,
                x: 55,
                width: 300,
                resizeFontSize: true,
                fontSize: 32,
                fontWeight: 'black',
                text: `Pace：km/h`,
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'top',
                shadow: textshadow
            },
            {
                tag: 'Rect',
                width: 30,
                height: 30,
                scale: 0.05,
                path: run_icon,
                fill: '#FF7F00'
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "TO_pace_pan",
                        "set": [
                            { "name": `Pace`, "url": TO_pace_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "TO_pace_pan.children[0].fill", "value": TO_pace_pan.children[0].fill, "type": "color", "tools": true },
                            { "name": `Icon color`, "url": "TO_pace_pan.children[1].fill", "value": TO_pace_pan.children[1].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //心率
    TO_heart_pan = new Box({
        id: 'TO_heart_pan',
        x: 330,//左上角位置
        y: 390,//左上角位置
        width: 350,
        height: 50,
        lockRatio: true,
        editable: true,

        cornerRadius: 4,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Text',
                y: 1,
                x: 55,
                width: 300,
                resizeFontSize: true,
                fontSize: 32,
                fontWeight: 'black',
                text: `Heart Rate：bpm`,
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'top',
                shadow: textshadow
            },
            {
                tag: 'Rect',
                x: 3,
                y: 2,
                scale: 0.04,
                path: heart_icon,
                fill: '#FF7F00'
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "TO_heart_pan",
                        "set": [
                            { "name": `Heart Rate`, "url": TO_heart_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "TO_heart_pan.children[0].fill", "value": TO_heart_pan.children[0].fill, "type": "color", "tools": true },
                            { "name": `Icon color`, "url": "TO_heart_pan.children[1].fill", "value": TO_heart_pan.children[1].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //踏频
    TO_rpm_pan = new Box({
        id: 'TO_rpm_pan',
        x: 330,//左上角位置
        y: 540,//左上角位置
        width: 350,
        height: 50,
        lockRatio: true,
        editable: true,
        cornerRadius: 4,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Text',
                y: 1,
                x: 55,
                width: 300,
                resizeFontSize: true,
                fontSize: 32,
                fontWeight: 'black',
                text: `Rpm：`,
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'top',
                shadow: textshadow
            },
            {
                tag: 'Rect',
                x: 3,
                y: 2,
                scale: 0.04,
                path: rpm_icon,
                fill: '#FF7F00'
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "TO_rpm_pan",
                        "set": [
                            { "name": `Cadence`, "url": TO_rpm_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "TO_rpm_pan.children[0].fill", "value": TO_rpm_pan.children[0].fill, "type": "color", "tools": true },
                            { "name": `Icon color`, "url": "TO_rpm_pan.children[1].fill", "value": TO_rpm_pan.children[1].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //步频
    x_rpm_pan = new Box({
        id: 'x_rpm_pan',
        x: 600,
        y: 800,
        width: 200,
        height: 200,
        lockRatio: true,
        editable: true,
        cornerRadius: 4,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Text',
                y: 55,
                x: 100,
                resizeFontSize: true,
                fontSize: 46,
                fontWeight: 'black',
                text: `--:--`,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'center',
            },
            {
                tag: 'Text',
                y: 115,
                x: 100,
                resizeFontSize: true,
                fontSize: 28,
                fontWeight: 'black',
                text: `RPM`,
                fill: '#CCCCCC',
                textAlign: 'center',
                verticalAlign: 'center',
            },
            {
                tag: 'Text',
                y: 25,
                x: 100,
                resizeFontSize: true,
                fontSize: 28,
                fontWeight: 'black',
                text: `CADENCE`,
                fill: '#CCCCCC',
                textAlign: 'center',
                verticalAlign: 'center',
            },
            {
                tag: 'Ellipse',
                width: 200,
                height: 200,
                startAngle: -150,
                endAngle: 30,
                innerRadius: 1,
                stroke: "#CCCCCC",
                strokeWidth: 9,
                strokeAlign: 'center',
                strokeCap: 'round',
            },
            {
                tag: 'Ellipse',
                width: 200,
                height: 200,
                startAngle: -150,
                endAngle: 30,
                innerRadius: 1,
                stroke: "#FFFFFF",
                strokeWidth: 10,
                strokeAlign: 'center',
                strokeCap: 'round',
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "x_rpm_pan",
                        "set": [
                            { "name": `Rpm`, "url": x_rpm_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "x_rpm_pan.children[0].fill", "value": x_rpm_pan.children[0].fill, "type": "color", "tools": true },
                            { "name": `Unit color`, "url": "x_rpm_pan.children[1].fill", "value": x_rpm_pan.children[1].fill, "type": "color", "tools": true },
                            { "name": `Graphic backgrounds`, "url": "x_rpm_pan.children[3].stroke", "value": x_rpm_pan.children[3].stroke, "type": "color", "tools": true },
                            { "name": `Graphic color`, "url": "x_rpm_pan.children[4].stroke", "value": x_rpm_pan.children[4].stroke, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //步频
    TO_cadence_pan = new Box({
        id: 'TO_cadence_pan',
        x: 330,//左上角位置
        y: 440,//左上角位置
        width: 350,
        height: 50,
        lockRatio: true,
        editable: true,

        cornerRadius: 4,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Text',
                y: 1,
                x: 55,
                width: 300,
                resizeFontSize: true,
                fontSize: 32,
                fontWeight: 'black',
                text: `Cadence：steps/min`,
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'top',
                shadow: textshadow
            },
            {
                tag: 'Rect',
                x: 3,
                y: 2,
                scale: 0.04,
                path: cadence_icon,
                fill: '#FF7F00'
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "TO_cadence_pan",
                        "set": [
                            { "name": `Cadence`, "url": TO_cadence_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "TO_cadence_pan.children[0].fill", "value": TO_cadence_pan.children[0].fill, "type": "color", "tools": true },
                            { "name": `Icon color`, "url": "TO_cadence_pan.children[1].fill", "value": TO_cadence_pan.children[1].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })


    //步幅
    TO_step_pan = new Box({
        id: 'TO_step_pan',
        x: 330,//左上角位置
        y: 490,//左上角位置
        width: 350,
        height: 50,
        lockRatio: true,
        editable: true,

        cornerRadius: 4,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Text',
                y: 1,
                x: 55,
                width: 300,
                resizeFontSize: true,
                fontSize: 32,
                fontWeight: 'black',
                text: `Step：m`,
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'top',
                shadow: textshadow
            },
            {
                tag: 'Rect',
                x: 3,
                y: 2,
                scale: 0.04,
                path: step_icon,
                fill: '#FF7F00'
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "TO_step_pan",
                        "set": [
                            { "name": `Step`, "url": TO_step_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "TO_step_pan.children[0].fill", "value": TO_step_pan.children[0].fill, "type": "color", "tools": true },
                            { "name": `Icon color`, "url": "TO_step_pan.children[1].fill", "value": TO_step_pan.children[1].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //功率
    TO_power_pan = new Box({
        id: 'TO_power_pan',
        x: 330,//左上角位置
        y: 590,//左上角位置
        width: 350,
        height: 50,
        lockRatio: true,
        editable: true,

        cornerRadius: 4,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Text',
                y: 1,
                x: 55,
                width: 300,
                resizeFontSize: true,
                fontSize: 32,
                fontWeight: 'black',
                text: `Power：watt`,
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'top',
                shadow: textshadow
            },
            {
                tag: 'Rect',
                x: 3,
                y: 2,
                scale: 0.04,
                path: power_icon,
                fill: '#FF7F00'
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "TO_power_pan",
                        "set": [
                            { "name": `Power`, "url": TO_power_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "TO_power_pan.children[0].fill", "value": TO_power_pan.children[0].fill, "type": "color", "tools": true },
                            { "name": `Icon color`, "url": "TO_power_pan.children[1].fill", "value": TO_power_pan.children[1].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //步频
    x_power_pan = new Box({
        id: 'x_power_pan',
        x: 1000,
        y: 800,
        width: 200,
        height: 200,
        lockRatio: true,
        editable: true,
        cornerRadius: 4,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Text',
                y: 55,
                x: 100,
                resizeFontSize: true,
                fontSize: 46,
                fontWeight: 'black',
                text: `--:--`,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'center',
            },
            {
                tag: 'Text',
                y: 115,
                x: 100,
                resizeFontSize: true,
                fontSize: 28,
                fontWeight: 'black',
                text: `WATT`,
                fill: '#CCCCCC',
                textAlign: 'center',
                verticalAlign: 'center',
            },
            {
                tag: 'Text',
                y: 25,
                x: 100,
                resizeFontSize: true,
                fontSize: 28,
                fontWeight: 'black',
                text: `POWER`,
                fill: '#CCCCCC',
                textAlign: 'center',
                verticalAlign: 'center',
            },
            {
                tag: 'Ellipse',
                width: 200,
                height: 200,
                startAngle: -150,
                endAngle: 30,
                innerRadius: 1,
                stroke: "#CCCCCC",
                strokeWidth: 9,
                strokeAlign: 'center',
                strokeCap: 'round',
            },
            {
                tag: 'Ellipse',
                width: 200,
                height: 200,
                startAngle: -150,
                endAngle: 30,
                innerRadius: 1,
                stroke: "#FFFFFF",
                strokeWidth: 10,
                strokeAlign: 'center',
                strokeCap: 'round',
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "x_power_pan",
                        "set": [
                            { "name": `Power`, "url": x_power_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "x_power_pan.children[0].fill", "value": x_power_pan.children[0].fill, "type": "color", "tools": true },
                            { "name": `Unit color`, "url": "x_power_pan.children[1].fill", "value": x_power_pan.children[1].fill, "type": "color", "tools": true },
                            { "name": `Graphic backgrounds`, "url": "x_power_pan.children[3].stroke", "value": x_power_pan.children[3].stroke, "type": "color", "tools": true },
                            { "name": `Graphic color`, "url": "x_power_pan.children[4].stroke", "value": x_power_pan.children[4].stroke, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //经纬度
    TO_gps_pan = new Box({
        id: 'TO_gps_pan',
        x: appvWidth - 400,
        y: appvHeight - 400,
        width: 400,
        height: 100,
        lockRatio: true,
        editable: true,

        cornerRadius: 4,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Text',
                y: 1,
                x: 75,
                width: 350,
                resizeFontSize: true,
                fontSize: 30,
                fontWeight: 'black',
                text: `--\n--`,
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'top',
                shadow: textshadow
            },
            {
                tag: 'Rect',
                y: 12,
                scale: 0.06,
                path: gps_icon,
                fill: '#FF7F00'
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "TO_gps_pan",
                        "set": [
                            { "name": `location`, "url": TO_gps_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "TO_gps_pan.children[0].fill", "value": TO_gps_pan.children[0].fill, "type": "color", "tools": true },
                            { "name": `Icon color`, "url": "TO_gps_pan.children[1].fill", "value": TO_gps_pan.children[1].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //行进时间
    text_nowtime_pan = new Box({
        id: 'text_nowtime_pan',
        x: appvWidth - 400,
        y: appvHeight - 300,
        width: 350,
        height: 100,
        lockRatio: true,
        editable: true,
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Text',
                width: 350,
                resizeFontSize: true,
                fontSize: 72,
                fontWeight: 'black',
                text: `--`,
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'top',
                shadow: textshadow
            },
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "text_nowtime_pan",
                        "set": [
                            { "name": `Elapsedtime`, "url": text_nowtime_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "text_nowtime_pan.children[0].fill", "value": text_nowtime_pan.children[0].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //日期时间
    text_time_pan = new Box({
        id: 'text_time_pan',
        x: appvWidth - 400,
        y: appvHeight - 200,
        width: 350,
        height: 100,
        lockRatio: true,
        editable: true,
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Text',
                width: 350,
                resizeFontSize: true,
                fontSize: 72,
                fontWeight: 'black',
                text: `--`,
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'top',
                shadow: textshadow
            },
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "text_time_pan",
                        "set": [
                            { "name": `NowTime`, "url": text_time_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "text_time_pan.children[0].fill", "value": text_time_pan.children[0].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //日期时间
    text_day_pan = new Box({
        id: 'text_day_pan',
        x: appvWidth - 400,
        y: appvHeight - 100,
        width: 350,
        height: 100,
        lockRatio: true,
        editable: true,
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Text',
                width: 350,
                resizeFontSize: true,
                fontSize: 52.5,
                fontWeight: 'black',
                text: `--`,
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'top',
                shadow: textshadow
            },
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "text_day_pan",
                        "set": [
                            { "name": `Date`, "url": text_day_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "text_day_pan.children[0].fill", "value": text_day_pan.children[0].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })


    //心率
    el_heart_pan = new Box({
        id: 'el_heart_pan',
        x: 100,
        y: 800,
        width: 200,
        height: 200,
        lockRatio: true,
        editable: true,
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Text',
                y: 50,
                x: 100,
                resizeFontSize: true,
                fontSize: 64,
                fontWeight: 'black',
                text: `--`,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'top',
            },
            {
                tag: 'Text',
                y: 150,
                x: 100,
                resizeFontSize: true,
                fontSize: 32,
                fontWeight: 'black',
                text: `bpm`,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'top',
            },
            {
                tag: 'Ellipse',
                width: 200,
                height: 200,
                startAngle: -210,
                endAngle: 30,
                innerRadius: 1,
                stroke: "#CCCCCC",
                strokeWidth: 24,
                strokeWidthFixed: true,
                strokeAlign: 'center',
                strokeCap: 'round',
            },
            {
                tag: 'Ellipse',
                width: 200,
                height: 200,
                startAngle: -210,
                endAngle: 30,
                innerRadius: 1,
                stroke: "#FF7F00",
                strokeWidth: 24,
                strokeWidthFixed: false,
                strokeAlign: 'center',
                strokeCap: 'round',
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "el_heart_pan",
                        "set": [
                            { "name": `Heart Rate`, "url": el_heart_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "el_heart_pan.children[0].fill", "value": el_heart_pan.children[0].fill, "type": "color", "tools": true },
                            { "name": `Unit color`, "url": "el_heart_pan.children[1].fill", "value": el_heart_pan.children[1].fill, "type": "color", "tools": true },
                            { "name": `Graphic backgrounds`, "url": "el_heart_pan.children[2].stroke", "value": el_heart_pan.children[2].stroke, "type": "color", "tools": true },
                            { "name": `Graphic color`, "url": "el_heart_pan.children[3].stroke", "value": el_heart_pan.children[3].stroke, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //心率
    x_heart_pan = new Box({
        id: 'x_heart_pan',
        x: 800,
        y: 800,
        width: 200,
        height: 200,
        lockRatio: true,
        editable: true,
        cornerRadius: 4,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Text',
                y: 55,
                x: 100,
                resizeFontSize: true,
                fontSize: 46,
                fontWeight: 'black',
                text: `--:--`,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'center',
            },
            {
                tag: 'Text',
                y: 115,
                x: 100,
                resizeFontSize: true,
                fontSize: 28,
                fontWeight: 'black',
                text: `BPM`,
                fill: '#CCCCCC',
                textAlign: 'center',
                verticalAlign: 'center',
            },
            {
                tag: 'Text',
                y: 25,
                x: 100,
                resizeFontSize: true,
                fontSize: 28,
                fontWeight: 'black',
                text: `HEART R`,
                fill: '#CCCCCC',
                textAlign: 'center',
                verticalAlign: 'center',
            },
            {
                tag: 'Ellipse',
                width: 200,
                height: 200,
                startAngle: -150,
                endAngle: 30,
                innerRadius: 1,
                stroke: "#CCCCCC",
                strokeWidth: 9,
                strokeAlign: 'center',
                strokeCap: 'round',
            },
            {
                tag: 'Ellipse',
                width: 200,
                height: 200,
                startAngle: -150,
                endAngle: 30,
                innerRadius: 1,
                stroke: "#FFFFFF",
                strokeWidth: 10,
                strokeAlign: 'center',
                strokeCap: 'round',
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "x_heart_pan",
                        "set": [
                            { "name": `heart rate`, "url": x_heart_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "x_heart_pan.children[0].fill", "value": x_heart_pan.children[0].fill, "type": "color", "tools": true },
                            { "name": `Unit color`, "url": "x_heart_pan.children[1].fill", "value": x_heart_pan.children[1].fill, "type": "color", "tools": true },
                            { "name": `Graphic backgrounds`, "url": "x_heart_pan.children[3].stroke", "value": x_heart_pan.children[3].stroke, "type": "color", "tools": true },
                            { "name": `Graphic color`, "url": "x_heart_pan.children[4].stroke", "value": x_heart_pan.children[4].stroke, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //速度
    el_speed_pan = new Box({
        id: 'el_speed_pan',
        x: 400,
        y: 800,
        width: 200,
        height: 200,
        lockRatio: true,
        editable: true,

        cornerRadius: 4,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Text',
                y: 56,
                x: 100,
                resizeFontSize: true,
                fontSize: 54,
                fontWeight: 'black',
                text: `--:--`,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'top',
            },
            {
                tag: 'Text',
                y: 150,
                x: 100,
                resizeFontSize: true,
                fontSize: 32,
                fontWeight: 'black',
                text: `km/h`,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'top',
            },
            {
                tag: 'Ellipse',
                width: 200,
                height: 200,
                startAngle: -210,
                endAngle: 30,
                innerRadius: 1,
                stroke: "#CCCCCC",
                strokeWidth: 24,
                strokeAlign: 'center',
                strokeCap: 'round',
            },
            {
                tag: 'Ellipse',
                width: 200,
                height: 200,
                startAngle: -210,
                endAngle: 30,
                innerRadius: 1,
                stroke: "#FF7F00",
                strokeWidth: 24,
                strokeAlign: 'center',
                strokeCap: 'round',
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "el_speed_pan",
                        "set": [
                            { "name": `Pace`, "url": el_speed_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "el_speed_pan.children[0].fill", "value": el_speed_pan.children[0].fill, "type": "color", "tools": true },
                            { "name": `Unit color`, "url": "el_speed_pan.children[1].fill", "value": el_speed_pan.children[1].fill, "type": "color", "tools": true },
                            { "name": `Graphic backgrounds`, "url": "el_speed_pan.children[2].stroke", "value": el_speed_pan.children[2].stroke, "type": "color", "tools": true },
                            { "name": `Graphic color`, "url": "el_speed_pan.children[3].stroke", "value": el_speed_pan.children[3].stroke, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //速度
    x_speed_pan = new Box({
        id: 'x_speed_pan',
        x: 400,
        y: 800,
        width: 200,
        height: 200,
        lockRatio: true,
        editable: true,
        cornerRadius: 4,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Text',
                y: 55,
                x: 100,
                resizeFontSize: true,
                fontSize: 46,
                fontWeight: 'black',
                text: `--:--`,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'center',
            },
            {
                tag: 'Text',
                y: 115,
                x: 100,
                resizeFontSize: true,
                fontSize: 28,
                fontWeight: 'black',
                text: `KM/H`,
                fill: '#CCCCCC',
                textAlign: 'center',
                verticalAlign: 'center',
            },
            {
                tag: 'Text',
                y: 25,
                x: 100,
                resizeFontSize: true,
                fontSize: 28,
                fontWeight: 'black',
                text: `SPEED`,
                fill: '#CCCCCC',
                textAlign: 'center',
                verticalAlign: 'center',
            },
            {
                tag: 'Ellipse',
                width: 200,
                height: 200,
                startAngle: -150,
                endAngle: 30,
                innerRadius: 1,
                stroke: "#CCCCCC",
                strokeWidth: 9,
                strokeAlign: 'center',
                strokeCap: 'round',
            },
            {
                tag: 'Ellipse',
                width: 200,
                height: 200,
                startAngle: -150,
                endAngle: 30,
                innerRadius: 1,
                stroke: "#FFFFFF",
                strokeWidth: 10,
                strokeAlign: 'center',
                strokeCap: 'round',
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "x_speed_pan",
                        "set": [
                            { "name": `Speed`, "url": x_speed_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "x_speed_pan.children[0].fill", "value": x_speed_pan.children[0].fill, "type": "color", "tools": true },
                            { "name": `Unit color`, "url": "x_speed_pan.children[1].fill", "value": x_speed_pan.children[1].fill, "type": "color", "tools": true },
                            { "name": `Graphic backgrounds`, "url": "x_speed_pan.children[3].stroke", "value": x_speed_pan.children[3].stroke, "type": "color", "tools": true },
                            { "name": `Graphic color`, "url": "x_speed_pan.children[4].stroke", "value": x_speed_pan.children[4].stroke, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //配速
    el_pace_pan = new Box({
        id: 'el_pace_pan',
        x: 400,
        y: 800,
        width: 200,
        height: 200,
        lockRatio: true,
        editable: true,

        cornerRadius: 4,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Text',
                y: 56,
                x: 100,
                resizeFontSize: true,
                fontSize: 54,
                fontWeight: 'black',
                text: `--:--`,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'top',
            },
            {
                tag: 'Text',
                y: 150,
                x: 100,
                resizeFontSize: true,
                fontSize: 32,
                fontWeight: 'black',
                text: `min/km`,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'top',
            },
            {
                tag: 'Ellipse',
                width: 200,
                height: 200,
                startAngle: -210,
                endAngle: 30,
                innerRadius: 1,
                stroke: "#CCCCCC",
                strokeWidth: 24,
                strokeAlign: 'center',
                strokeCap: 'round',
            },
            {
                tag: 'Ellipse',
                width: 200,
                height: 200,
                startAngle: -210,
                endAngle: 30,
                innerRadius: 1,
                stroke: "#FF7F00",
                strokeWidth: 24,
                strokeAlign: 'center',
                strokeCap: 'round',
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "el_pace_pan",
                        "set": [
                            { "name": `Pace`, "url": el_pace_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "el_pace_pan.children[0].fill", "value": el_pace_pan.children[0].fill, "type": "color", "tools": true },
                            { "name": `Unit color`, "url": "el_pace_pan.children[1].fill", "value": el_pace_pan.children[1].fill, "type": "color", "tools": true },
                            { "name": `Graphic backgrounds`, "url": "el_pace_pan.children[2].stroke", "value": el_pace_pan.children[2].stroke, "type": "color", "tools": true },
                            { "name": `Graphic color`, "url": "el_pace_pan.children[3].stroke", "value": el_pace_pan.children[3].stroke, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //配速
    x_pace_pan = new Box({
        id: 'x_pace_pan',
        x: 400,
        y: 800,
        width: 200,
        height: 200,
        lockRatio: true,
        editable: true,

        cornerRadius: 4,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Text',
                y: 55,
                x: 100,
                resizeFontSize: true,
                fontSize: 46,
                fontWeight: 'black',
                text: `--:--`,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'center',
            },
            {
                tag: 'Text',
                y: 115,
                x: 100,
                resizeFontSize: true,
                fontSize: 28,
                fontWeight: 'black',
                text: `MIN/KM`,
                fill: '#CCCCCC',
                textAlign: 'center',
                verticalAlign: 'center',
            },
            {
                tag: 'Text',
                y: 25,
                x: 100,
                resizeFontSize: true,
                fontSize: 28,
                fontWeight: 'black',
                text: `PACE`,
                fill: '#CCCCCC',
                textAlign: 'center',
                verticalAlign: 'center',
            },
            {
                tag: 'Ellipse',
                width: 200,
                height: 200,
                startAngle: -150,
                endAngle: 30,
                innerRadius: 1,
                stroke: "#CCCCCC",
                strokeWidth: 9,
                strokeAlign: 'center',
                strokeCap: 'round',
            },
            {
                tag: 'Ellipse',
                width: 200,
                height: 200,
                startAngle: -150,
                endAngle: 30,
                innerRadius: 1,
                stroke: "#FFFFFF",
                strokeWidth: 10,
                strokeAlign: 'center',
                strokeCap: 'round',
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "x_pace_pan",
                        "set": [
                            { "name": `Pace`, "url": x_pace_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "x_pace_pan.children[0].fill", "value": x_pace_pan.children[0].fill, "type": "color", "tools": true },
                            { "name": `Unit color`, "url": "x_pace_pan.children[1].fill", "value": x_pace_pan.children[1].fill, "type": "color", "tools": true },
                            { "name": `Graphic backgrounds`, "url": "x_pace_pan.children[3].stroke", "value": x_pace_pan.children[3].stroke, "type": "color", "tools": true },
                            { "name": `Graphic color`, "url": "x_pace_pan.children[4].stroke", "value": x_pace_pan.children[4].stroke, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //步频
    el_cadence_pan = new Box({
        id: 'el_cadence_pan',
        x: 700,
        y: 800,
        width: 200,
        height: 200,
        lockRatio: true,
        editable: true,

        cornerRadius: 4,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Text',
                y: 50,
                x: 100,
                resizeFontSize: true,
                fontSize: 64,
                fontWeight: 'black',
                text: `--`,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'top',
            },
            {
                tag: 'Text',
                y: 150,
                x: 100,
                resizeFontSize: true,
                fontSize: 32,
                fontWeight: 'black',
                text: `step/min`,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'top',
            },
            {
                tag: 'Ellipse',
                width: 200,
                height: 200,
                startAngle: -210,
                endAngle: 30,
                innerRadius: 1,
                stroke: "#CCCCCC",
                strokeWidth: 24,
                strokeAlign: 'center',
                strokeCap: 'round',
            },
            {
                tag: 'Ellipse',
                width: 200,
                height: 200,
                startAngle: -210,
                endAngle: 30,
                innerRadius: 1,
                stroke: "#FF7F00",
                strokeWidth: 24,
                strokeAlign: 'center',
                strokeCap: 'round',
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "el_cadence_pan",
                        "set": [
                            { "name": `Cadence`, "url": el_cadence_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "el_cadence_pan.children[0].fill", "value": el_cadence_pan.children[0].fill, "type": "color", "tools": true },
                            { "name": `Unit color`, "url": "el_cadence_pan.children[1].fill", "value": el_cadence_pan.children[1].fill, "type": "color", "tools": true },
                            { "name": `Graphic backgrounds`, "url": "el_cadence_pan.children[2].stroke", "value": el_cadence_pan.children[2].stroke, "type": "color", "tools": true },
                            { "name": `Graphic color`, "url": "el_cadence_pan.children[3].stroke", "value": el_cadence_pan.children[3].stroke, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //步频
    x_cadence_pan = new Box({
        id: 'x_cadence_pan',
        x: 600,
        y: 800,
        width: 200,
        height: 200,
        lockRatio: true,
        editable: true,
        cornerRadius: 4,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Text',
                y: 55,
                x: 100,
                resizeFontSize: true,
                fontSize: 46,
                fontWeight: 'black',
                text: `--:--`,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'center',
            },
            {
                tag: 'Text',
                y: 115,
                x: 100,
                resizeFontSize: true,
                fontSize: 28,
                fontWeight: 'black',
                text: `STEPS`,
                fill: '#CCCCCC',
                textAlign: 'center',
                verticalAlign: 'center',
            },
            {
                tag: 'Text',
                y: 25,
                x: 100,
                resizeFontSize: true,
                fontSize: 28,
                fontWeight: 'black',
                text: `CADENCE`,
                fill: '#CCCCCC',
                textAlign: 'center',
                verticalAlign: 'center',
            },
            {
                tag: 'Ellipse',
                width: 200,
                height: 200,
                startAngle: -150,
                endAngle: 30,
                innerRadius: 1,
                stroke: "#CCCCCC",
                strokeWidth: 9,
                strokeAlign: 'center',
                strokeCap: 'round',
            },
            {
                tag: 'Ellipse',
                width: 200,
                height: 200,
                startAngle: -150,
                endAngle: 30,
                innerRadius: 1,
                stroke: "#FFFFFF",
                strokeWidth: 10,
                strokeAlign: 'center',
                strokeCap: 'round',
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "x_cadence_pan",
                        "set": [
                            { "name": `Cadence`, "url": x_cadence_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "x_cadence_pan.children[0].fill", "value": x_cadence_pan.children[0].fill, "type": "color", "tools": true },
                            { "name": `Unit color`, "url": "x_cadence_pan.children[1].fill", "value": x_cadence_pan.children[1].fill, "type": "color", "tools": true },
                            { "name": `Graphic backgrounds`, "url": "x_cadence_pan.children[3].stroke", "value": x_cadence_pan.children[3].stroke, "type": "color", "tools": true },
                            { "name": `Graphic color`, "url": "x_cadence_pan.children[4].stroke", "value": x_cadence_pan.children[4].stroke, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //距离进度条
    l_distance_pan = new Box({
        id: 'l_distance_pan',
        x: appvWidth / 2 - 500,
        y: 20,
        width: 1000,
        height: 200,
        lockRatio: true,
        editable: true,
        hitBox: true,
        resizeChildren: true,
        children: [
            {
                tag: 'Rect',
                width: 1000,
                height: 50,
                x: 0,
                y: 0,
                fill: '#191970',
                cornerRadius: 20
            },
            {
                tag: 'Line',
                width: 0,
                x: 90,
                y: 25,
                StrokeCap: 'round',
                strokeWidth: 25,
                stroke: '#FFCC00',
            },
            {
                tag: 'Line',
                width: 800,
                x: 90,
                y: 25,
                strokeWidth: 30,
                stroke: '#FFFFFF',
                dashPattern: [2, 8]
            },
            {
                tag: 'Line',
                width: 800,
                x: 90,
                y: 25,
                strokeWidth: 40,
                stroke: '#FFFFFF',
                dashPattern: [3, 97]
            },
            {
                tag: 'Text',
                resizeFontSize: true,
                //width: 90,
                x: 50,
                y: 10,
                fontSize: 20,
                fontWeight: 'black',
                text: `Start`,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'top',
            },
            {
                tag: 'Text',
                resizeFontSize: true,
                ///width: 110,
                x: 940,
                y: 10,
                fontSize: 20,
                fontWeight: 'black',
                text: max_distance_in_km + `Km`,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'top',
            },
            {
                tag: 'Polygon',
                width: 20,
                height: 20,
                sides: 3,
                x: 120,
                y: 50,
                fill: '#FF0000',
            },
            {
                tag: 'Text',
                resizeFontSize: true,
                x: 120,
                y: 62,
                fontSize: 20,
                fontWeight: 'black',
                text: `--Km`,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'top',
            },


        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "l_distance_pan",
                        "set": [
                            { "name": `distancewide`, "url": l_distance_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Background color`, "url": "l_distance_pan.children[0].fill", "value": l_distance_pan.children[0].fill, "type": "color", "tools": true },
                            { "name": `progress color`, "url": "l_distance_pan.children[1].stroke", "value": l_distance_pan.children[1].stroke, "type": "color", "tools": true },
                            { "name": `Ruler color1`, "url": "l_distance_pan.children[2].stroke", "value": l_distance_pan.children[2].stroke, "type": "color", "tools": true },
                            { "name": `Ruler color2`, "url": "l_distance_pan.children[3].stroke", "value": l_distance_pan.children[3].stroke, "type": "color", "tools": true },
                            { "name": `Start color`, "url": "l_distance_pan.children[4].fill", "value": l_distance_pan.children[4].fill, "type": "color", "tools": true },
                            { "name": `End color`, "url": "l_distance_pan.children[5].fill", "value": l_distance_pan.children[5].fill, "type": "color", "tools": true },
                            { "name": `Locator color`, "url": "l_distance_pan.children[6].fill", "value": l_distance_pan.children[6].fill, "type": "color", "tools": true },
                            { "name": `Current value color`, "url": "l_distance_pan.children[7].fill", "value": l_distance_pan.children[7].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })



    //坡度
    el_slope_pan = new Box({
        id: 'el_slope_pan',
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        lockRatio: true,
        editable: true,

        cornerRadius: 4,//圆角
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Polygon',
                resizeFontSize: true,
                points: [0, 60, 0, 70, 100, 70, 100, 60, 100, 60],
                fill: '#FF4500'
            },
            {
                tag: 'Text',
                y: 0,
                x: 50,
                resizeFontSize: true,
                fontSize: 32,
                fontWeight: 'black',
                text: `0°`,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'top',
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "el_slope_pan",
                        "set": [
                            { "name": `Cadence`, "url": el_slope_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Text color`, "url": "el_slope_pan.children[1].fill", "value": el_slope_pan.children[0].fill, "type": "color", "tools": true },
                            { "name": `Graphic color`, "url": "el_slope_pan.children[0].fill", "value": el_slope_pan.children[1].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //天气
    el_weather_pan = new Box({
        id: 'el_weather_pan',
        x: appvWidth - 300,
        y: appvHeight - 650,
        width: 200,
        height: 230,
        lockRatio: true,
        editable: true,
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Rect',
                width: 200,
                height: 230,
                fill: {
                    type: 'linear',
                    from: 'top-left',
                    to: 'bottom-right',
                    stops: [{ offset: 0, color: '#A09EF5' }, { offset: 1, color: '#112950' }]
                },
                cornerRadius: 20
            },
            {
                tag: 'Text',
                y: 10,
                x: 10,
                resizeFontSize: true,
                fontSize: 26,
                fontWeight: 'black',
                text: `ShangHai`,
                fill: '#FFFFFF',
                textAlign: 'left',
                verticalAlign: 'top',
            },
            {
                tag: 'Text',
                y: 144,
                x: 100,
                resizeFontSize: true,
                fontSize: 30,
                fontWeight: 'black',
                text: `18~25℃`,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'top',
            },
            {
                tag: 'Text',
                y: 190,
                x: 100,
                resizeFontSize: true,
                fontSize: 24,
                fontWeight: 'black',
                text: `2025-12-12`,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'top',
            },
            {
                tag: 'Rect',
                x: 100,
                y: 100,
                scale: 0.1,
                around: 'center',
                path: weather_sunny_icon,
                fill: '#FFFFFF'
            }

        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "el_weather_pan",
                        "set": [
                            { "name": `weather`, "url": el_weather_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Graphic backgrounds1`, "url": "el_weather_pan.children[0].fill.stops[0].color", "value": el_weather_pan.children[0].fill.stops[0].color, "type": "color2", "tools": true },
                            { "name": `Graphic backgrounds2`, "url": "el_weather_pan.children[0].fill.stops[1].color", "value": el_weather_pan.children[0].fill.stops[1].color, "type": "color2", "tools": true },
                            { "name": `Text content1`, "url": "el_weather_pan.children[1].text", "value": el_weather_pan.children[1].text, "type": "text", "tools": true },
                            { "name": `Text color1`, "url": "el_weather_pan.children[1].fill", "value": el_weather_pan.children[1].fill, "type": "color", "tools": true },
                            { "name": `Text content2`, "url": "el_weather_pan.children[2].text", "value": el_weather_pan.children[2].text, "type": "text", "tools": true },
                            { "name": `Text color2`, "url": "el_weather_pan.children[2].fill", "value": el_weather_pan.children[2].fill, "type": "color", "tools": true },
                            { "name": `Text content3`, "url": "el_weather_pan.children[3].text", "value": el_weather_pan.children[3].text, "type": "text", "tools": true },
                            { "name": `Text color3`, "url": "el_weather_pan.children[3].fill", "value": el_weather_pan.children[3].fill, "type": "color", "tools": true },
                            { "name": `weather icon`, "url": "el_weather_pan.children[4].path", "value": el_weather_pan.children[4].path, "type": "weather", "tools": true },
                            { "name": `Icon color`, "url": "el_weather_pan.children[4].fill", "value": el_weather_pan.children[4].fill, "type": "color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })

    //高级心率
    pl_heart_pan = new Box({
        id: 'pl_heart_pan',
        x: 100,
        y: 800,
        width: 200,
        height: 200,
        lockRatio: true,
        editable: true,
        hitBox: true,
        resizeChildren: true,//子元素是否跟随 resize
        children: [
            {
                tag: 'Ellipse',//标尺
                width: 200,
                height: 200,
                startAngle: -210,
                endAngle: 30,
                innerRadius: 1,
                stroke: "#FFFFFF",
                strokeWidth: 20,
                strokeAlign: 'inside',
                dashPattern: [2, 20]
            },
            {
                tag: 'Text',//低心率文字
                y: 140,
                x: 26,
                resizeFontSize: true,
                fontSize: 14,
                fontWeight: 'black',
                text: heartRateMin,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'top',
                rotation: -120
            },
            {
                tag: 'Text',//高心率
                y: 140,
                x: 172,
                resizeFontSize: true,
                fontSize: 14,
                fontWeight: 'black',
                text: user_heartRateMax,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'top',
                rotation: 120
            },
            {
                tag: 'Text',//2
                y: 58,
                x: 30,
                resizeFontSize: true,
                fontSize: 14,
                fontWeight: 'black',
                text: '120',
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'top',
                rotation: -60
            },
            {
                tag: 'Text',//3
                y: 22,
                x: 100,
                resizeFontSize: true,
                fontSize: 14,
                fontWeight: 'black',
                text: '140',
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'top',
                rotation: 0
            },
            {
                tag: 'Text',//4
                y: 58,
                x: 170,
                resizeFontSize: true,
                fontSize: 14,
                fontWeight: 'black',
                text: '160',
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'top',
                rotation: 60
            },
            {
                tag: 'Text',//4
                y: 130,
                x: 80,
                resizeFontSize: true,
                fontSize: 36,
                fontWeight: 'black',
                text: `188`,
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'top',
            },
            {
                tag: 'Rect',
                x: 125,
                y: 130,
                scale: 0.02,
                path: heart_icon,
                fill: '#FF0000'
            },
            {
                tag: 'Rect',
                y: 155,
                x: 120,
                resizeFontSize: true,
                width: 30,
                height: 3,
                fill: '#FFFFFF'
            },
            {
                tag: 'Text',
                y: 160,
                x: 120,
                resizeFontSize: true,
                fontSize: 14,
                fontWeight: 'black',
                text: `bpm`,
                fill: '#FFFFFF',
            },
            {
                tag: 'Ellipse',
                width: 200,
                height: 200,
                startAngle: -210,
                endAngle: 30,
                innerRadius: 1,
                stroke: "#ff5c58",
                strokeWidth: 24,
                strokeWidthFixed: true,
                strokeAlign: 'center',
                strokeCap: 'round',
            },
            {
                tag: 'Ellipse',
                width: 200,
                height: 200,
                startAngle: -210,
                endAngle: -150,
                innerRadius: 1,
                stroke: "#bad1ff",
                strokeWidth: 24,
                strokeWidthFixed: false,
                strokeAlign: 'center',
                strokeCap: 'round',
            },
            {
                tag: 'Line',
                x: 19,
                y: 60,
                points: [],
                strokeWidth: 5,
                stroke: "#FF0000",
            }
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "pl_heart_pan",
                        "set": [
                            { "name": `Heart Rate`, "url": pl_heart_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `ruler color`, "url": "pl_heart_pan.children[0].stroke", "value": pl_heart_pan.children[0].stroke, "type": "color", "tools": true },
                            { "name": `Heart Rate low`, "url": "pl_heart_pan.children[1].text", "value": pl_heart_pan.children[1].text, "type": "heart_text", "tools": true },
                            { "name": `Heart Rate high`, "url": "pl_heart_pan.children[2].text", "value": pl_heart_pan.children[2].text, "type": "heart_text", "tools": true },
                            { "name": `ruler text color`, "url": "pl_heart_pan.children[1].fill", "value": pl_heart_pan.children[1].fill, "type": "heart_color", "tools": true },


                        ]
                    }
                    tosettable(json);
                    var min = parseInt(pl_heart_pan.children[1].text);
                    var max = parseInt(pl_heart_pan.children[2].text);

                    // 计算区间参数
                    var interval = max - min;
                    var step = interval / 4;

                    pl_heart_pan.children[3].text = Math.round(min + step * 1);
                    pl_heart_pan.children[4].text = Math.round(min + step * 2);
                    pl_heart_pan.children[5].text = Math.round(min + step * 3);
                }
            ],
        },
    })

    //X距离进度条
    x_distance_pan = new Box({
        id: 'x_distance_pan',
        x: appvWidth / 2 - 500,  // 保持居中定位
        y: 20,
        width: 1000,              // 矩形宽度1000
        height: 50,               // 修正为50（原100不符合当前需求）
        lockRatio: true,
        editable: true,
        hitBox: true,
        resizeChildren: true,
        children: [
            {
                tag: 'Ellipse',
                width: 20,       // 直径=2×半径（半径2525，见之前计算）
                height: 20,
                x: 58,
                y: 10,
                around: 'center',
                fill: "#FFFFFF",
            },
            // 起点文字 - 与弧线弧度匹配
            {
                tag: 'Text',
                text: 'start',
                resizeFontSize: true,
                x: 50,
                y: 20,  // 位于圆点下方
                fontSize: 20,
                fontWeight: 'black',
                fill: '#FFFFFF',
                origin: 'center',  // 以中心为旋转点
                rotation: 10,  // 匹配起点角度
                textAlign: 'center',
                verticalAlign: 'top',
                shadow: textshadow
            },
            {
                tag: 'Ellipse',
                width: 20,
                height: 20,
                x: 500,
                y: 50,
                around: 'center',
                fill: "#CCCCCC"
            },
            // 中间点文字
            {
                tag: 'Text',
                text: max_distance_in_km / 2 + `Km`,
                resizeFontSize: true,
                x: 500,
                y: 60,
                fontSize: 20,
                fontWeight: 'black',
                fill: '#FFFFFF',
                textAlign: 'center',
                verticalAlign: 'top',
                shadow: textshadow
            },
            {
                tag: 'Ellipse',
                width: 20,
                height: 20,
                x: 942,
                y: 10,
                around: 'center',
                fill: "#CCCCCC"
            },
            // 终点文字
            {
                tag: 'Text',
                text: max_distance_in_km + `Km`,
                resizeFontSize: true,
                x: 950,
                y: 20,  // 位于圆点下方
                fontSize: 20,
                fontWeight: 'black',
                fill: '#FFFFFF',
                origin: 'center',
                rotation: -10,  // 匹配终点角度.
                textAlign: 'center',
                verticalAlign: 'top',
                shadow: textshadow
            },
            {
                tag: 'Ellipse',
                width: 5050,       // 直径=2×半径（半径2525，见之前计算）
                height: 5050,
                x: -2025,            // 圆心x坐标（矩形水平中点）
                y: -5000,          // 圆心y坐标（相对于父容器，在矩形外部上方）
                startAngle: 80, // 右上角对应的角度（精确值80°）
                endAngle: 100,  // 左上角对应的角度（精确值100°）
                innerRadius: 1,    // 保持内半径为1（只显示外圆弧）
                stroke: "#CCCCCC",
                strokeWidth: 9,
                strokeAlign: 'center',
                strokeCap: 'round'
            },
            {
                tag: 'Ellipse',
                width: 5050,       // 直径=2×半径（半径2525，见之前计算）
                height: 5050,
                x: -2025,            // 圆心x坐标（矩形水平中点）
                y: -5000,          // 圆心y坐标（相对于父容器，在矩形外部上方）
                startAngle: 100, // 右上角对应的角度（精确值80°）
                endAngle: 100,  // 左上角对应的角度（精确值100°）
                innerRadius: 1,    // 保持内半径为1（只显示外圆弧）
                stroke: "#FFFFFF",
                strokeWidth: 10,
                strokeAlign: 'center',
                strokeCap: 'round'
            },
            {
                tag: 'Box',
                x: 500,
                y: -2480,
                lockRatio: true,
                rotation: 0,//控制文字角度 (-10 至 10)
                resizeChildren: true,
                children: [
                    {
                        tag: 'Text',
                        x: 0,
                        y: 0,
                        width: 5050,
                        height: 5050,
                        around: 'center',
                        rotation: 0,
                        resizeFontSize: true,
                        resizeChildren: true,
                        fontSize: 20,
                        fontWeight: 'black',
                        text: `5.25km`,
                        fill: '#FFFFFF',
                        textAlign: 'center',
                        verticalAlign: 'bottom',
                        shadow: textshadow
                    },
                ]
            },
        ],
        event: {
            [PointerEvent.DOWN]: [
                function () {
                    var json =
                    {
                        "id": "x_distance_pan",
                        "set": [
                            { "name": `distance`, "url": x_distance_pan.children[0].id, "value": "", "type": "title", "tools": false },
                            { "name": `Background Color`, "url": "x_distance_pan.children[6].stroke", "value": x_distance_pan.children[6].stroke, "type": "x_color", "tools": true },
                            { "name": `Progress Color`, "url": "x_distance_pan.children[7].stroke", "value": x_distance_pan.children[7].stroke, "type": "x_color", "tools": true },
                            { "name": `Text Color`, "url": "x_distance_pan.children[1].fill", "value": x_distance_pan.children[1].fill, "type": "x_color", "tools": true },
                        ]
                    }
                    tosettable(json);
                }
            ],
        },
    })



    //默认画布容器
    frame = new Frame({
        width: appvWidth,
        height: appvHeight,
        overflow: 'hide',
        //draggable: true,
        fill: '#0A9A38'
    })
    appview.tree.add(frame);
    frame.add(appv_bg_pan);
    console.log('appv_bg_pan');

    //缩放到合适位置
    //appview.tree.zoom(0.5);
    if (appvWidth > appvHeight) {
        appview.tree.zoom({ x: 0, y: 0, width: appvWidth, height: appvHeight }, [0, 0, 0, 0])
    } else {
        appview.tree.zoom({ x: 0, y: 0, width: appvWidth, height: appvHeight }, [0, -0, 0, 0])
    }


}
