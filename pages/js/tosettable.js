// 更新编辑事件，json部件点击事件
function tosettable(json) {
    const settableDiv = document.getElementById('settable');
    settableDiv.innerHTML = ''; // 清空现有内容

    json.set.forEach(item => {
        const div = document.createElement('div');
        div.className = 'layui-form-item';

        const label = document.createElement('label');
        label.className = 'layui-form-label';
        label.textContent = item.name;
        div.appendChild(label);

        const inputDiv = document.createElement('div');
        inputDiv.className = 'layui-input-block';

        switch (item.type) {
            case 'title':
                if (!item.tools) {
                    const title = document.createElement('div');
                    title.className = 'layui-form-mid layui-word-aux';
                    title.textContent = item.value;
                    inputDiv.appendChild(title);
                }
                if (item.name != `Canvas Settings`) {
                    // 添加移除按钮
                    const removeButton = document.createElement('button');
                    removeButton.textContent = `ReMove`;
                    removeButton.className = 'layui-btn layui-btn-danger layui-btn-sm';
                    removeButton.onclick = function () {
                        new Function(json.id + '.remove();')();
                        interaction.pointerDown({ x: 0, y: 0 });
                        interaction.pointerUp();
                        settableDiv.innerHTML = '';
                    };
                    inputDiv.appendChild(removeButton);


                }
                break;
            case 'number':
                const numberInput = document.createElement('input');
                numberInput.type = 'number';
                numberInput.value = item.value;
                numberInput.className = 'layui-input';
                numberInput.onchange = function () {
                    new Function('value', 'window.' + item.url + ' = value;')(Number(this.value));
                };
                inputDiv.appendChild(numberInput);
                break;
            case 'Ellipse':
                const EllipseInput = document.createElement('input');
                EllipseInput.type = 'number';
                EllipseInput.value = item.value;
                EllipseInput.className = 'layui-input';
                EllipseInput.onchange = function () {
                    new Function('value', 'window.' + item.url + '.width = value;')(Number(this.value));
                    new Function('value', 'window.' + item.url + '.height = value;')(Number(this.value));
                };
                inputDiv.appendChild(EllipseInput);
                break;
            case 'color':
                const colorInput = document.createElement('input');
                colorInput.type = 'color';
                colorInput.value = item.value;
                colorInput.className = 'layui-input';
                colorInput.onchange = function () {
                    new Function('value', 'window.' + item.url + ' = value;')(this.value);
                    //
                    // 2. 根据 url 匹配场景，执行对应的颜色同步
                    const targetUrl = item.url; // 获取当前操作的 url
                    if (targetUrl === 'x_pace_pan.children[1].fill') {
                        // 同步中间点(children[2])和终点(children[4])的颜色为背景色
                        x_pace_pan.children[2].fill = x_pace_pan.children[1].fill;
                    }
                    if (targetUrl === 'x_cadence_pan.children[1].fill') {
                        // 同步中间点(children[2])和终点(children[4])的颜色为背景色
                        x_cadence_pan.children[2].fill = x_cadence_pan.children[1].fill;
                    }
                    if (targetUrl === 'x_speed_pan.children[1].fill') {
                        // 同步中间点(children[2])和终点(children[4])的颜色为背景色
                        x_speed_pan.children[2].fill = x_speed_pan.children[1].fill;
                    }
                    if (targetUrl === 'x_heart_pan.children[1].fill') {
                        // 同步中间点(children[2])和终点(children[4])的颜色为背景色
                        x_heart_pan.children[2].fill = x_heart_pan.children[1].fill;
                    }
                    if (targetUrl === 'x_rpm_pan.children[1].fill') {
                        // 同步中间点(children[2])和终点(children[4])的颜色为背景色
                        x_rpm_pan.children[2].fill = x_rpm_pan.children[1].fill;
                    }
                    if (targetUrl === 'x_power_pan.children[1].fill') {
                        // 同步中间点(children[2])和终点(children[4])的颜色为背景色
                        x_power_pan.children[2].fill = x_power_pan.children[1].fill;
                    }
                };
                inputDiv.appendChild(colorInput);
                break;

            case 'color2':
                const colorInput2 = document.createElement('input');
                colorInput2.type = 'color';
                colorInput2.value = item.value;
                colorInput2.className = 'layui-input';
                colorInput2.onchange = function () {
                    new Function('value', 'window.' + item.url + ' = value;')(this.value);
                    // 解析路径并生成刷新逻辑
                    const pathSegments = item.url.split('.');
                    const baseElementName = pathSegments[0];
                    if (!baseElementName) return;

                    // 动态创建执行函数
                    const refreshCode = `
								(function() {
									const element = window.${baseElementName};
									if (element && typeof element.resizeWidth === 'function') {
										element.resizeWidth(element.width - 1);
										setTimeout(() => {
											element.resizeWidth(element.width + 1);
										}, 10);
									}
								})();
							`;

                    new Function(refreshCode)();

                };
                inputDiv.appendChild(colorInput2);
                break;

            case 'funcolor':
                const funcolorInput = document.createElement('input');
                funcolorInput.type = 'color';
                funcolorInput.value = item.value;
                funcolorInput.className = 'layui-input';
                funcolorInput.onchange = function () {
                    const updateSymbolFunction = new Function('value', item.url);
                    // 调用创建的函数，并传递当前输入框的值
                    updateSymbolFunction(this.value);
                    setTimeout(getProgressBarValueAndUpdate, 20);
                };
                inputDiv.appendChild(funcolorInput);
                break;

            case 'funnumber':
                const funnumberInput = document.createElement('input');
                funnumberInput.type = 'number';
                funnumberInput.value = item.value;
                funnumberInput.className = 'layui-input';
                funnumberInput.onchange = function () {
                    const updateSymbolFunction = new Function('value', item.url);
                    // 调用创建的函数，并传递当前输入框的值
                    updateSymbolFunction(this.value);
                    setTimeout(getProgressBarValueAndUpdate, 20);
                };
                inputDiv.appendChild(funnumberInput);
                break;

            case 'text':
                const textInput = document.createElement('input'); // 创建文本输入框
                textInput.type = 'text'; // 设置类型为文本
                textInput.value = item.value; // 同样修正了拼写错误
                textInput.className = 'layui-input';
                textInput.onchange = function () {
                    new Function('value', 'window.' + item.url + ' = value;')(this.value);
                };
                inputDiv.appendChild(textInput);
                break;

            case 'weather':
                // 创建按钮容器
                const buttonGroup = document.createElement('div');
                buttonGroup.className = 'layui-btn-group layui-row layui-col-space1';

                // 天气配置数据
                const weatherTypes = [
                    { class: 'weather_sunny_icon', text: 'sunny' },
                    { class: 'weather_cloudy_icon', text: 'cloudy' },
                    { class: 'weather_rain_icon', text: 'rain' },
                    { class: 'weather_fog_icon', text: 'fog' },
                    { class: 'weather_windy_icon', text: 'windy' },
                    { class: 'weather_snow_icon', text: 'snow' },
                    { class: 'weather_night_icon', text: 'night' }
                ];

                // 内部函数直接访问外部变量
                function updateIcon(index) {
                    const icon = weatherTypes[index];
                    el_weather_pan.children[4].path = window[icon.class];
                }

                // 生成按钮并绑定事件
                weatherTypes.forEach((type, i) => {
                    const btn = document.createElement('button');
                    btn.className = `layui-btn layui-btn-xs ${type.class} layui-margin-1`;
                    btn.textContent = type.text;
                    btn.onclick = () => {
                        updateIcon(i);
                        document.querySelectorAll('.weather-btn').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                    };
                    buttonGroup.appendChild(btn);
                });

                inputDiv.appendChild(buttonGroup);
                // 添加底部链接
                const linkContainer = document.createElement('div');
                linkContainer.className = 'layui-row layui-col-space1';

                const weatherLink = document.createElement('a');
                weatherLink.className = 'layui-btn layui-btn-xs active';
                weatherLink.href = 'https://meteostat.net/';
                weatherLink.textContent = 'Link meteostat.net';
                weatherLink.target = '_blank'; // 新标签页打开

                linkContainer.appendChild(weatherLink);
                inputDiv.appendChild(linkContainer);

                break;

            //高级心率文本
            case 'heart_text':
                const heart_textInput = document.createElement('input'); // 创建文本输入框
                heart_textInput.type = 'text'; // 设置类型为文本
                heart_textInput.value = item.value; // 同样修正了拼写错误
                heart_textInput.className = 'layui-input';
                heart_textInput.onchange = function () {
                    //pl_heart_pan.children[1].text
                    new Function('value', 'window.' + item.url + ' = value;')(this.value);
                    var min = parseInt(pl_heart_pan.children[1].text);
                    var max = parseInt(pl_heart_pan.children[2].text);

                    // 计算区间参数
                    var interval = max - min;
                    var step = interval / 4;

                    pl_heart_pan.children[3].text = Math.round(min + step * 1);
                    pl_heart_pan.children[4].text = Math.round(min + step * 2);
                    pl_heart_pan.children[5].text = Math.round(min + step * 3);

                };
                inputDiv.appendChild(heart_textInput);
                break;

            case 'heart_color':
                const heart_colorInput = document.createElement('input');
                heart_colorInput.type = 'color';
                heart_colorInput.value = item.value;
                heart_colorInput.className = 'layui-input';
                heart_colorInput.onchange = function () {
                    new Function('value', 'window.' + item.url + ' = value;')(this.value);
                    pl_heart_pan.children[2].fill = pl_heart_pan.children[1].fill;
                    pl_heart_pan.children[3].fill = pl_heart_pan.children[1].fill;
                    pl_heart_pan.children[4].fill = pl_heart_pan.children[1].fill;
                    pl_heart_pan.children[5].fill = pl_heart_pan.children[1].fill;
                };
                inputDiv.appendChild(heart_colorInput);
                break;

            //高级心率表背景线
            case 'heart_color_line':
                const heart_color_lineInput = document.createElement('input');
                heart_color_lineInput.type = 'color';
                heart_color_lineInput.value = item.value;
                heart_color_lineInput.className = 'layui-input';
                heart_color_lineInput.onchange = function () {
                    new Function('value', 'window.' + item.url + ' = value;')(this.value);
                    pt_heart_pan.children[1].stroke = pt_heart_pan.children[0].stroke;
                    pt_heart_pan.children[2].stroke = pt_heart_pan.children[0].stroke;
                };
                inputDiv.appendChild(heart_color_lineInput);
                break;

            case 'heart_line_text':
                const heart_line_textInput = document.createElement('input'); // 创建文本输入框
                heart_line_textInput.type = 'color'; // 设置类型为文本
                heart_line_textInput.value = item.value; // 同样修正了拼写错误
                heart_line_textInput.className = 'layui-input';
                heart_line_textInput.onchange = function () {
                    //pl_heart_pan.children[1].text
                    new Function('value', 'window.' + item.url + ' = value;')(this.value);
                    pt_heart_pan.children[4].fill = pt_heart_pan.children[3].fill;
                    pt_heart_pan.children[5].fill = pt_heart_pan.children[3].fill;
                };
                inputDiv.appendChild(heart_line_textInput);
                break;
            //高级配速表背景线
            case 'pace_color_line':
                const pace_color_lineInput = document.createElement('input');
                pace_color_lineInput.type = 'color';
                pace_color_lineInput.value = item.value;
                pace_color_lineInput.className = 'layui-input';
                pace_color_lineInput.onchange = function () {
                    new Function('value', 'window.' + item.url + ' = value;')(this.value);
                    pt_pace_pan.children[1].stroke = pt_pace_pan.children[0].stroke;
                    pt_pace_pan.children[2].stroke = pt_pace_pan.children[0].stroke;
                };
                inputDiv.appendChild(pace_color_lineInput);
                break;

            case 'pace_line_text':
                const pace_line_textInput = document.createElement('input'); // 创建文本输入框
                pace_line_textInput.type = 'color'; // 设置类型为文本
                pace_line_textInput.value = item.value; // 同样修正了拼写错误
                pace_line_textInput.className = 'layui-input';
                pace_line_textInput.onchange = function () {
                    //pl_heart_pan.children[1].text
                    new Function('value', 'window.' + item.url + ' = value;')(this.value);
                    pt_pace_pan.children[4].fill = pt_pace_pan.children[3].fill;
                    pt_pace_pan.children[5].fill = pt_pace_pan.children[3].fill;
                };
                inputDiv.appendChild(pace_line_textInput);
                break;
            //高级高程表背景线
            case 'ele_color_line':
                const ele_color_lineInput = document.createElement('input');
                ele_color_lineInput.type = 'color';
                ele_color_lineInput.value = item.value;
                ele_color_lineInput.className = 'layui-input';
                ele_color_lineInput.onchange = function () {
                    new Function('value', 'window.' + item.url + ' = value;')(this.value);
                    pt_ele_pan.children[1].stroke = pt_ele_pan.children[0].stroke;
                    pt_ele_pan.children[2].stroke = pt_ele_pan.children[0].stroke;
                };
                inputDiv.appendChild(ele_color_lineInput);
                break;

            case 'ele_line_text':
                const ele_line_textInput = document.createElement('input'); // 创建文本输入框
                ele_line_textInput.type = 'color'; // 设置类型为文本
                ele_line_textInput.value = item.value; // 同样修正了拼写错误
                ele_line_textInput.className = 'layui-input';
                ele_line_textInput.onchange = function () {
                    //pl_heart_pan.children[1].text
                    new Function('value', 'window.' + item.url + ' = value;')(this.value);
                    pt_ele_pan.children[4].fill = pt_ele_pan.children[3].fill;
                    pt_ele_pan.children[5].fill = pt_ele_pan.children[3].fill;
                };
                inputDiv.appendChild(ele_line_textInput);
                break;

            case 'x_color':
                const x_color = document.createElement('input');
                x_color.type = 'color';
                x_color.value = item.value;
                x_color.className = 'layui-input';
                x_color.onchange = function () {
                    // 1. 先执行原逻辑：设置当前选择的目标元素颜色
                    new Function('value', 'window.' + item.url + ' = value;')(this.value);

                    // 2. 根据 url 匹配场景，执行对应的颜色同步
                    const targetUrl = item.url; // 获取当前操作的 url
                    const xPan = window.x_distance_pan; // 简化进度条对象引用

                    // 场景1：url 为 "x_distance_pan.children[6].fill"（背景颜色）
                    if (targetUrl === 'x_distance_pan.children[6].stroke') {
                        // 同步中间点(children[2])和终点(children[4])的颜色为背景色
                        xPan.children[2].fill = xPan.children[6].stroke;
                        xPan.children[4].fill = xPan.children[6].stroke;
                    }

                    // 场景2：url 为 "x_distance_pan.children[7].fill"（前景颜色）
                    else if (targetUrl === 'x_distance_pan.children[7].stroke') {
                        // 同步起点(children[0])的颜色为前景色
                        xPan.children[0].fill = xPan.children[7].stroke;
                    }

                    // 场景3：url 为 "x_distance_pan.children[1].fill"（文字颜色）
                    else if (targetUrl === 'x_distance_pan.children[1].fill') {
                        // 同步中间点文字(3)、终点文字(5)、进度文本(8的子元素)的颜色为文字色
                        xPan.children[3].fill = xPan.children[1].fill;
                        xPan.children[5].fill = xPan.children[1].fill;
                        xPan.children[8].children[0].fill = xPan.children[1].fill;
                    }
                };
                inputDiv.appendChild(x_color);
                break;

            case 'lap_user_color':
                const lap_user_color = document.createElement('input');
                lap_user_color.type = 'color';
                lap_user_color.value = item.value;
                lap_user_color.className = 'layui-input';
                lap_user_color.onchange = function () {
                    // 1. 先执行原逻辑：设置当前选择的目标元素颜色
                    new Function('value', 'window.' + item.url + ' = value;')(this.value);

                    // 2. 根据 url 匹配场景，执行对应的颜色同步
                    const targetUrl = item.url; // 获取当前操作的 url
                    const xPan = window.appv_lap_user_pan; // 简化进度条对象引用

                    // （文字颜色）
                    if (targetUrl === 'appv_lap_user_pan.children[1].fill') {
                        // 同步中间点(children[2])和终点(children[4])的颜色为背景色
                        xPan.children[2].fill = xPan.children[1].fill;
                        xPan.children[3].fill = xPan.children[1].fill;
                        xPan.children[4].fill = xPan.children[1].fill;
                        xPan.children[5].fill = xPan.children[1].fill;
                        xPan.children[6].fill = xPan.children[1].fill;

                    }

                    // （背景颜色）
                    else if (targetUrl === 'appv_lap_user_pan.children[0].fill') {
                        // 同步起点(children[0])的颜色为前景色
                        xPan.children[0].shadow.color = xPan.children[0].fill;

                    }

                };
                inputDiv.appendChild(lap_user_color);
                break;



        }

        div.appendChild(inputDiv);
        settableDiv.appendChild(div);

        if (item.type == 'title' && item.name != `Canvas Settings`) {
            // 获取目标对象
            const targetObj = window[json.id]; // 假设对象存储在全局作用域
            //console.log(targetObj);

            // 创建属性输入容器
            const attrContainer = document.createElement('div');
            attrContainer.className = 'layui-form layui-form-pane';

            // 创建两行两列布局
            const createInputRow = (prop1, prop2, label1, label2) => {
                const row = document.createElement('div');
                row.className = 'layui-row';

                // 从目标对象获取当前值
                const val1 = targetObj[prop1];
                const val2 = targetObj[prop2];
                // 第一列
                const col1 = document.createElement('div');
                col1.className = 'layui-col-md6';
                col1.innerHTML = `
							<div class="layui-form-item">
								<label class="layui-form-label" style="width: 30px;padding: 8px 5px;">${label1}</label>
								<div class="layui-input-block" style="margin-left: 30px;">
									<input type="number" class="layui-input" step="any" value="${val1}">
								</div>
							</div>
						`;

                // 第二列
                const col2 = document.createElement('div');
                col2.className = 'layui-col-md6';
                col2.innerHTML = `
							<div class="layui-form-item">
								<label class="layui-form-label" style="width: 30px;padding: 8px 5px;">${label2}</label>
								<div class="layui-input-block" style="margin-left: 30px;">
									<input type="number" class="layui-input" step="any" value="${val2}">
								</div>
							</div>
						`;

                // 事件监听（使用动态对象引用）
                col1.querySelector('input').onchange = function () {
                    const value = parseFloat(this.value);
                    if (!isNaN(value)) new Function(json.id + '.' + prop1 + ' = ' + value)();
                };

                col2.querySelector('input').onchange = function () {
                    const value = parseFloat(this.value);
                    if (!isNaN(value)) new Function(json.id + '.' + prop2 + ' = ' + value)();
                };

                row.append(col1, col2);
                return row;
            };

            // 添加坐标行
            attrContainer.appendChild(
                createInputRow('x', 'y', 'X', 'Y')
            );

            // 添加尺寸行
            attrContainer.appendChild(
                createInputRow('width', 'height', 'W', 'H')
            );
            div.appendChild(attrContainer);


        }

        function initColorDatalist() {
            // 确保只创建一次
            if (document.getElementById('globalColors')) {
                return;
            }

            // 创建datalist元素
            const datalist = document.createElement('datalist');
            datalist.id = 'globalColors';

            // 定义预定义颜色
            const colorOptions = [
                '#0A9A38', '#000000', '#FFFFFF',
                '#CCCCCC', '#FF0000', '#C71585',
                '#9900FF', '#6A0DAD', '#FF7F00',
                '#FFD700', '#FFFACD', '#0000FF',
                '#1E90FF', '#00CED1', '#808080',
                '#8B0000', '#D9B3A1', '#E6E6FA'
            ];

            // 添加颜色选项
            colorOptions.forEach(color => {
                const option = document.createElement('option');
                option.value = color;
                datalist.appendChild(option);
            });

            // 将datalist添加到head或body中
            document.head.appendChild(datalist);

            // 调试信息，确认datalist已创建
            console.log('全局颜色列表已初始化:', datalist);
        }

        initColorDatalist();

        const settable = document.getElementById('settable');

        // 在容器内查找所有符合条件的颜色输入框
        const colorInputs = settable.querySelectorAll('input[type="color"].layui-input');

        // 为每个找到的输入框添加list属性
        colorInputs.forEach(input => {
            input.setAttribute('list', 'globalColors');
        });

    });
}
