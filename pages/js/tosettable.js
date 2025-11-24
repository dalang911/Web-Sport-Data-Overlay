// 提前加载Layui依赖（确保动态生成时模块已加载）
layui.use(['colorpicker', 'jquery'], function () { });

// 公共配置：预定义颜色（所有Layui颜色选择器共用）
const presetColors = [
    '#0A9A38', '#000000', '#FFFFFF',
    '#CCCCCC', '#FF0000', '#C71585',
    '#9900FF', '#6A0DAD', '#FF7F00',
    '#FFD700', '#FFFACD', '#0000FF',
    '#1E90FF', '#00CED1', '#808080',
    '#8B0000', '#D9B3A1', '#E6E6FA'
];

// 公共函数：创建Layui颜色选择器（适配所有颜色类型的业务逻辑）
function createLayuiColorPicker(inputDiv, item, callback) {
    layui.use(['colorpicker', 'jquery'], function () {
        const colorpicker = layui.colorpicker;
        const $ = layui.jquery;

        // 1. 创建隐藏的原生输入框（仅用于存储颜色值，不显示）
        const colorInput = document.createElement('input');
        colorInput.type = 'hidden'; // 隐藏存储用输入框
        colorInput.value = item.value || '#FFFFFF';
        colorInput.className = 'layui-input';
        inputDiv.appendChild(colorInput);

        // 2. 创建可视化触发按钮（用户实际点击的元素）
        const triggerBtn = document.createElement('div');
        triggerBtn.className = 'laycolor-trigger';
        triggerBtn.style.cssText = `
            width: 40px;
            height: 40px;
            border-radius: 4px;
            border: 1px solid #e6e6e6;
            background-color: ${item.value || '#FFFFFF'};
            cursor: pointer;
            transition: all 0.2s;
            display: inline-block;
            vertical-align: middle;
        `;
        inputDiv.appendChild(triggerBtn);

        // 3. 渲染Layui颜色选择器
        colorpicker.render({
            elem: triggerBtn, // 绑定触发按钮
            target: colorInput, // 关联存储用输入框
            color: item.value || '#FFFFFF', // 初始颜色
            alpha: true, // 开启透明度（可选关闭）
            format: 'rgb', // 输出十六进制颜色
            predefine: true,
            colors: presetColors, // 自定义预定义颜色
            change: function (color) {
                // 实时更新触发按钮背景
                triggerBtn.style.backgroundColor = color;
                colorInput.value = color;
            },
            done: function (color) {
                // 选择完成后：更新样式 + 执行业务回调（保留原有逻辑）
                triggerBtn.style.backgroundColor = color;
                colorInput.value = color;
                callback(color); // 传入选择的颜色，执行对应业务逻辑
            }
        });

        // 鼠标悬浮样式优化
        $(triggerBtn).hover(
            () => $(triggerBtn).css({ borderColor: '#1E9FFF', boxShadow: '0 0 8px rgba(30, 159, 255, 0.3)' }),
            () => $(triggerBtn).css({ borderColor: '#e6e6e6', boxShadow: 'none' })
        );
    });
}

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
                        // 新增：如果是地图相关的id，销毁地图实例
                        if (json.id === 'web_map_pan') {
                            full_map.remove();
                            full_map = null;
                            full_mapInitialized = false;
                        }
                        if (json.id === 'web_minimap_pan') {
                            mini_map.remove();
                            mini_map = null;
                            mini_mapInitialized = false;
                        }
                        if (json.id === 'web_rotatemap_pan') {
                            rotate_map.remove();
                            rotate_map = null;
                            rotate_mapInitialized = false;
                        }
                        if (json.id === 'web_gaodemap_pan') {
                            gaode_map.destroy();
                            gaode_map = null;
                            gaode_mapInitialized = false;
                        }
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

            // ---------------------- 所有颜色类型统一使用Layui选择器 ----------------------
            case 'color':
                createLayuiColorPicker(inputDiv, item, function (color) {
                    new Function('value', 'window.' + item.url + ' = value;')(color);
                    // 原有颜色同步逻辑
                    const targetUrl = item.url;
                    if (targetUrl === 'x_pace_pan.children[1].fill') {
                        x_pace_pan.children[2].fill = color;
                    }
                    if (targetUrl === 'x_cadence_pan.children[1].fill') {
                        x_cadence_pan.children[2].fill = color;
                    }
                    if (targetUrl === 'x_speed_pan.children[1].fill') {
                        x_speed_pan.children[2].fill = color;
                    }
                    if (targetUrl === 'x_heart_pan.children[1].fill') {
                        x_heart_pan.children[2].fill = color;
                    }
                    if (targetUrl === 'x_rpm_pan.children[1].fill') {
                        x_rpm_pan.children[2].fill = color;
                    }
                    if (targetUrl === 'x_power_pan.children[1].fill') {
                        x_power_pan.children[2].fill = color;
                    }
                });
                break;

            case 'color2':
                createLayuiColorPicker(inputDiv, item, function (color) {
                    new Function('value', 'window.' + item.url + ' = value;')(color);
                    // 原有刷新逻辑
                    const pathSegments = item.url.split('.');
                    const baseElementName = pathSegments[0];
                    if (!baseElementName) return;
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
                });
                break;

            case 'web_map_color':
                createLayuiColorPicker(inputDiv, item, function (color) {
                    const updateSymbolFunction = new Function('value', item.url);
                    updateSymbolFunction(color);
                    setTimeout(() => {
                        updateLeaferData(parseInt(maxFrame * 0.7));
                    }, 300);
                });
                break;

            case 'heart_color':
                createLayuiColorPicker(inputDiv, item, function (color) {
                    new Function('value', 'window.' + item.url + ' = value;')(color);
                    pl_heart_pan.children[2].fill = color;
                    pl_heart_pan.children[3].fill = color;
                    pl_heart_pan.children[4].fill = color;
                    pl_heart_pan.children[5].fill = color;
                });
                break;

            case 'heart_color_line':
                createLayuiColorPicker(inputDiv, item, function (color) {
                    new Function('value', 'window.' + item.url + ' = value;')(color);
                    pt_heart_pan.children[1].stroke = color;
                    pt_heart_pan.children[2].stroke = color;
                });
                break;

            case 'heart_line_text':
                createLayuiColorPicker(inputDiv, item, function (color) {
                    new Function('value', 'window.' + item.url + ' = value;')(color);
                    pt_heart_pan.children[4].fill = color;
                    pt_heart_pan.children[5].fill = color;
                });
                break;

            case 'pace_color_line':
                createLayuiColorPicker(inputDiv, item, function (color) {
                    new Function('value', 'window.' + item.url + ' = value;')(color);
                    pt_pace_pan.children[1].stroke = color;
                    pt_pace_pan.children[2].stroke = color;
                });
                break;

            case 'pace_line_text':
                createLayuiColorPicker(inputDiv, item, function (color) {
                    new Function('value', 'window.' + item.url + ' = value;')(color);
                    pt_pace_pan.children[4].fill = color;
                    pt_pace_pan.children[5].fill = color;
                });
                break;

            case 'ele_color_line':
                createLayuiColorPicker(inputDiv, item, function (color) {
                    new Function('value', 'window.' + item.url + ' = value;')(color);
                    pt_ele_pan.children[1].stroke = color;
                    pt_ele_pan.children[2].stroke = color;
                });
                break;

            case 'ele_line_text':
                createLayuiColorPicker(inputDiv, item, function (color) {
                    new Function('value', 'window.' + item.url + ' = value;')(color);
                    pt_ele_pan.children[4].fill = color;
                    pt_ele_pan.children[5].fill = color;
                });
                break;

            case 'o2o_color_line':
                createLayuiColorPicker(inputDiv, item, function (color) {
                    new Function('value', 'window.' + item.url + ' = value;')(color);
                    o2o_ele_pan.children[1].stroke = color;
                });
                break;

            case 'o2o_line_text':
                createLayuiColorPicker(inputDiv, item, function (color) {
                    new Function('value', 'window.' + item.url + ' = value;')(color);
                    o2o_ele_pan.children[4].fill = color;
                    o2o_ele_pan.children[5].fill = color;
                });
                break;

            case 'x_color':
                createLayuiColorPicker(inputDiv, item, function (color) {
                    new Function('value', 'window.' + item.url + ' = value;')(color);
                    const targetUrl = item.url;
                    const xPan = window.x_distance_pan;
                    if (targetUrl === 'x_distance_pan.children[6].stroke') {
                        xPan.children[2].fill = color;
                        xPan.children[4].fill = color;
                    } else if (targetUrl === 'x_distance_pan.children[7].stroke') {
                        xPan.children[0].fill = color;
                    } else if (targetUrl === 'x_distance_pan.children[1].fill') {
                        xPan.children[3].fill = color;
                        xPan.children[5].fill = color;
                        xPan.children[8].children[0].fill = color;
                    }
                });
                break;

            case 'lap_user_color':
                createLayuiColorPicker(inputDiv, item, function (color) {
                    new Function('value', 'window.' + item.url + ' = value;')(color);
                    const targetUrl = item.url;
                    const xPan = window.appv_lap_user_pan;
                    if (targetUrl === 'appv_lap_user_pan.children[1].fill') {
                        xPan.children[2].fill = color;
                        xPan.children[3].fill = color;
                        xPan.children[4].fill = color;
                        xPan.children[5].fill = color;
                        xPan.children[6].fill = color;
                    } else if (targetUrl === 'appv_lap_user_pan.children[0].fill') {
                        xPan.children[0].shadow.color = color;
                    }
                });
                break;

            // ---------------------- 其他原有case（原封不动保留） ----------------------
            case 'funnumber':
                const funnumberInput = document.createElement('input');
                funnumberInput.type = 'number';
                funnumberInput.value = item.value;
                funnumberInput.className = 'layui-input';
                funnumberInput.onchange = function () {
                    const updateSymbolFunction = new Function('value', item.url);
                    updateSymbolFunction(this.value);
                    setTimeout(getProgressBarValueAndUpdate, 20);
                };
                inputDiv.appendChild(funnumberInput);
                break;

            case 'text':
                const textInput = document.createElement('input');
                textInput.type = 'text';
                textInput.value = item.value;
                textInput.className = 'layui-input';
                textInput.onchange = function () {
                    new Function('value', 'window.' + item.url + ' = value;')(this.value);
                };
                inputDiv.appendChild(textInput);
                break;

            case 'weather':
                const buttonGroup = document.createElement('div');
                buttonGroup.className = 'layui-btn-group layui-row layui-col-space1';
                const weatherTypes = [
                    { class: 'weather_sunny_icon', text: 'sunny' },
                    { class: 'weather_cloudy_icon', text: 'cloudy' },
                    { class: 'weather_rain_icon', text: 'rain' },
                    { class: 'weather_fog_icon', text: 'fog' },
                    { class: 'weather_windy_icon', text: 'windy' },
                    { class: 'weather_snow_icon', text: 'snow' },
                    { class: 'weather_night_icon', text: 'night' }
                ];
                function updateIcon(index) {
                    const icon = weatherTypes[index];
                    el_weather_pan.children[4].path = window[icon.class];
                }
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
                const linkContainer = document.createElement('div');
                linkContainer.className = 'layui-row layui-col-space1';
                const weatherLink = document.createElement('a');
                weatherLink.className = 'layui-btn layui-btn-xs active';
                weatherLink.href = 'https://meteostat.net/';
                weatherLink.textContent = 'Link meteostat.net';
                weatherLink.target = '_blank';
                linkContainer.appendChild(weatherLink);
                inputDiv.appendChild(linkContainer);
                break;

            case 'heart_text':
                const heart_textInput = document.createElement('input');
                heart_textInput.type = 'text';
                heart_textInput.value = item.value;
                heart_textInput.className = 'layui-input';
                heart_textInput.onchange = function () {
                    new Function('value', 'window.' + item.url + ' = value;')(this.value);
                    var min = parseInt(pl_heart_pan.children[1].text);
                    var max = parseInt(pl_heart_pan.children[2].text);
                    var interval = max - min;
                    var step = interval / 4;
                    pl_heart_pan.children[3].text = Math.round(min + step * 1);
                    pl_heart_pan.children[4].text = Math.round(min + step * 2);
                    pl_heart_pan.children[5].text = Math.round(min + step * 3);
                };
                inputDiv.appendChild(heart_textInput);
                break;

            case 'full_map_zoom_number':
                const full_map_zoom_numberInput = document.createElement('input');
                full_map_zoom_numberInput.type = 'number';
                full_map_zoom_numberInput.value = item.value;
                full_map_zoom_numberInput.className = 'layui-input';
                full_map_zoom_numberInput.onchange = function () {
                    full_map.fitExtent(full_polyline.getExtent(), (this.value / 100));
                    setTimeout(() => {
                        updateLeaferData(parseInt(maxFrame * 0.7));
                    }, 300);
                };
                inputDiv.appendChild(full_map_zoom_numberInput);
                break;

            case 'full_map_sel':
                const sourceBtnContainer = document.createElement('div');
                sourceBtnContainer.style.display = 'flex';
                sourceBtnContainer.style.gap = '8px';
                sourceBtnContainer.style.alignItems = 'center';
                Object.values(mapSourceConfigs).forEach(sourceConfig => {
                    const sourceBtn = document.createElement('button');
                    sourceBtn.textContent = sourceConfig.name;
                    sourceBtn.className = 'layui-btn layui-btn-sm';
                    sourceBtn.style.padding = '0 12px';
                    sourceBtn.style.cursor = 'pointer';
                    sourceBtn.onclick = function () {
                        switchMapSource(full_map, sourceConfig.id);
                        document.querySelectorAll('.layui-btn-sm', sourceBtnContainer).forEach(btn => {
                            btn.classList.remove('layui-btn-primary');
                        });
                        this.classList.add('layui-btn-primary');
                    };
                    sourceBtnContainer.appendChild(sourceBtn);
                });
                inputDiv.appendChild(sourceBtnContainer);
                break;

            case 'mini_map_zoom_number':
                const mini_map_zoom_numberInput = document.createElement('input');
                mini_map_zoom_numberInput.type = 'number';
                mini_map_zoom_numberInput.value = item.value;
                mini_map_zoom_numberInput.className = 'layui-input';
                mini_map_zoom_numberInput.onchange = function () {
                    mini_map.setZoom(this.value);
                    setTimeout(() => {
                        updateLeaferData(parseInt(maxFrame * 0.7));
                    }, 300);
                };
                inputDiv.appendChild(mini_map_zoom_numberInput);
                break;

            case 'mini_map_sel':
                const minisourceBtnContainer = document.createElement('div');
                minisourceBtnContainer.style.display = 'flex';
                minisourceBtnContainer.style.gap = '8px';
                minisourceBtnContainer.style.alignItems = 'center';
                Object.values(mapSourceConfigs).forEach(sourceConfig => {
                    const sourceBtn = document.createElement('button');
                    sourceBtn.textContent = sourceConfig.name;
                    sourceBtn.className = 'layui-btn layui-btn-sm';
                    sourceBtn.style.padding = '0 12px';
                    sourceBtn.style.cursor = 'pointer';
                    sourceBtn.onclick = function () {
                        switchMapSource(mini_map, sourceConfig.id);
                        document.querySelectorAll('.layui-btn-sm', minisourceBtnContainer).forEach(btn => {
                            btn.classList.remove('layui-btn-primary');
                        });
                        this.classList.add('layui-btn-primary');
                    };
                    minisourceBtnContainer.appendChild(sourceBtn);
                });
                inputDiv.appendChild(minisourceBtnContainer);
                break;

            case 'rotate_map_zoom_number':
                const rotate_map_zoom_numberInput = document.createElement('input');
                rotate_map_zoom_numberInput.type = 'number';
                rotate_map_zoom_numberInput.value = item.value;
                rotate_map_zoom_numberInput.className = 'layui-input';
                rotate_map_zoom_numberInput.onchange = function () {
                    rotate_map.setZoom(this.value);
                    setTimeout(() => {
                        updateLeaferData(parseInt(maxFrame * 0.7));
                    }, 300);
                };
                inputDiv.appendChild(rotate_map_zoom_numberInput);
                break;

            case 'rotate_map_sel':
                const rotatesourceBtnContainer = document.createElement('div');
                rotatesourceBtnContainer.style.display = 'flex';
                rotatesourceBtnContainer.style.gap = '8px';
                rotatesourceBtnContainer.style.alignItems = 'center';
                Object.values(mapSourceConfigs).forEach(sourceConfig => {
                    const sourceBtn = document.createElement('button');
                    sourceBtn.textContent = sourceConfig.name;
                    sourceBtn.className = 'layui-btn layui-btn-sm';
                    sourceBtn.style.padding = '0 12px';
                    sourceBtn.style.cursor = 'pointer';
                    sourceBtn.onclick = function () {
                        switchMapSource(rotate_map, sourceConfig.id);
                        document.querySelectorAll('.layui-btn-sm', rotatesourceBtnContainer).forEach(btn => {
                            btn.classList.remove('layui-btn-primary');
                        });
                        this.classList.add('layui-btn-primary');
                    };
                    rotatesourceBtnContainer.appendChild(sourceBtn);
                });
                inputDiv.appendChild(rotatesourceBtnContainer);
                break;

            case 'gaode_map_zoom_number':
                const gaode_map_zoom_numberInput = document.createElement('input');
                gaode_map_zoom_numberInput.type = 'number';
                gaode_map_zoom_numberInput.value = item.value;
                gaode_map_zoom_numberInput.className = 'layui-input';
                gaode_map_zoom_numberInput.onchange = function () {
                    gaode_map.setZoom(this.value);
                    setTimeout(() => {
                        updateLeaferData(parseInt(maxFrame * 0.7));
                    }, 300);
                };
                inputDiv.appendChild(gaode_map_zoom_numberInput);
                break;

            case 'gaode_map_sel':
                const gaodesourceBtnContainer = document.createElement('div');
                gaodesourceBtnContainer.style.display = 'flex';
                gaodesourceBtnContainer.style.gap = '8px';
                gaodesourceBtnContainer.style.alignItems = 'center';
                const buttonConfigs = [
                    {
                        name: '高德矢量',
                        setLayer: () => {
                            gaode_map.setLayers([new AMap.createDefaultLayer()]);
                        }
                    },
                    {
                        name: '高德卫星',
                        setLayer: () => {
                            gaode_map.setLayers([new AMap.TileLayer.Satellite()]);
                        }
                    }
                ];
                buttonConfigs.forEach((config, index) => {
                    const sourceBtn = document.createElement('button');
                    sourceBtn.textContent = config.name;
                    sourceBtn.className = 'layui-btn layui-btn-sm';
                    sourceBtn.style.padding = '0 12px';
                    sourceBtn.style.cursor = 'pointer';
                    sourceBtn.onclick = function () {
                        config.setLayer();
                        document.querySelectorAll('.layui-btn-sm', gaodesourceBtnContainer).forEach(btn => {
                            btn.classList.remove('layui-btn-primary');
                        });
                        this.classList.add('layui-btn-primary');
                        setTimeout(() => {
                            updateLeaferData(parseInt(maxFrame * 0.7));
                        }, 300);
                    };
                    gaodesourceBtnContainer.appendChild(sourceBtn);
                });
                inputDiv.appendChild(gaodesourceBtnContainer);
                break;

            case 'font_selector':
                // 字体选择容器（纵向排列所有元素）
                const fontContainer = document.createElement('div');
                fontContainer.style.display = 'flex';
                fontContainer.style.flexDirection = 'column';
                fontContainer.style.gap = '12px'; // 元素间距
                fontContainer.style.alignItems = 'flex-start';

                // 第一行：文本框 + 确定按钮（横向排列）
                const inputRow = document.createElement('div');
                inputRow.style.display = 'flex';
                inputRow.style.gap = '8px';
                inputRow.style.alignItems = 'center';

                // 文本框（初始值同步全局字体变量，空值时显示空）
                const fontInput = document.createElement('input');
                fontInput.type = 'text';
                fontInput.value = globalFontFamily; // 直接绑定全局变量，保持同步
                fontInput.className = 'layui-input';
                fontInput.style.width = '200px';
                fontInput.placeholder = 'Please enter the font name (e.g., Bitter)';
                inputRow.appendChild(fontInput);

                // 确定按钮（支持手动清空文本框后点击，触发恢复默认）
                const confirmBtn = document.createElement('button');
                confirmBtn.textContent = 'Confirm';
                confirmBtn.className = 'layui-btn layui-btn-sm layui-btn-normal';
                confirmBtn.onclick = function () {
                    loadFontAndUpdate(fontInput.value); // 直接传入文本框值（空值也会处理）
                };
                inputRow.appendChild(confirmBtn);
                fontContainer.appendChild(inputRow);

                // 第二行：预设字体按钮（默认=清空，Bitter/Satisfy=自定义）
                const presetBtnGroup = document.createElement('div');
                presetBtnGroup.className = 'layui-btn-group';
                presetBtnGroup.style.gap = '8px';

                // 预设按钮配置（默认按钮 value 为空字符串）
                const presetFonts = [
                    { name: 'Default', value: '' }, // 核心：默认=空值，触发恢复默认
                    { name: 'Bitter', value: 'Bitter' },
                    { name: 'Satisfy', value: 'Satisfy' }
                ];

                presetFonts.forEach(preset => {
                    const presetBtn = document.createElement('button');
                    presetBtn.textContent = preset.name;
                    presetBtn.className = 'layui-btn layui-btn-sm layui-btn-primary';
                    presetBtn.onclick = function () {
                        fontInput.value = preset.value; // 同步文本框值（默认按钮清空文本框）
                        loadFontAndUpdate(preset.value); // 直接触发更新，无需再点确定
                    };
                    presetBtnGroup.appendChild(presetBtn);
                });
                fontContainer.appendChild(presetBtnGroup);

                // 第三行：提示文字 + 字体网站链接
                const tipDiv = document.createElement('div');
                tipDiv.className = 'layui-form-mid layui-word-aux';
                tipDiv.style.marginTop = '4px';
                tipDiv.innerHTML = `
  Please enter a font name (obtainable from the following websites):
  <a href="https://fonts.googleapis.com" target="_blank" style="color: #1E9FFF;">Google Fonts</a>
  or
  <a href="https://fonts.joway.io/" target="_blank" style="color: #1E9FFF;">Font Library</a>
  <br>
  Click "Default" to restore the browser's native font
`;
                fontContainer.appendChild(tipDiv);

                // 将字体选择容器添加到输入区域
                inputDiv.appendChild(fontContainer);
                break;
        }

        div.appendChild(inputDiv);
        settableDiv.appendChild(div);

        // 原有属性输入容器逻辑（原封不动保留）
        if (item.type == 'title' && item.name != `Canvas Settings`) {
            const targetObj = window[json.id];
            const attrContainer = document.createElement('div');
            attrContainer.className = 'layui-form layui-form-pane';
            const createInputRow = (prop1, prop2, label1, label2) => {
                const row = document.createElement('div');
                row.className = 'layui-row';
                const val1 = targetObj[prop1];
                const val2 = targetObj[prop2];
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
                col1.querySelector('input').onchange = function () {
                    const value = parseFloat(this.value);
                    if (!isNaN(value)) {
                        const target = window[json.id];
                        if (label1 === 'W') {
                            target.resizeWidth(value);
                        } else if (label1 === 'H') {
                            target.resizeHeight(value);
                        } else {
                            target[prop1] = value;
                        }
                    }
                };
                col2.querySelector('input').onchange = function () {
                    const value = parseFloat(this.value);
                    if (!isNaN(value)) {
                        const target = window[json.id];
                        if (label2 === 'W') {
                            target.resizeWidth(value);
                        } else if (label2 === 'H') {
                            target.resizeHeight(value);
                        } else {
                            target[prop2] = value;
                        }
                    }
                };
                row.append(col1, col2);
                return row;
            };
            attrContainer.appendChild(createInputRow('x', 'y', 'X', 'Y'));
            attrContainer.appendChild(createInputRow('width', 'height', 'W', 'H'));
            div.appendChild(attrContainer);
        }

    });
}