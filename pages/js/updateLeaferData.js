// ==================================================
// 2. 工具函数（新增：统一Leafer数据更新函数）
// ==================================================
/**
 * 统一更新Leafer数据的函数（适配所有场景）
 * @param {Object} trkpt - 轨迹点数据（必须包含 timestamp 和 sec 字段）
 * @param {boolean} [updateMemory=true] - 是否同时更新内存Leafer（默认true）
 */
window.updateLeaferData = function (currentFrame, updateMemory = true) {
    try {

        //当前日期时间
        // 给view_info的文本赋值，转换进度
        $('#view_info').html(currentFrame.toString() + '/' + endFrame.toString() + ' MAX:' + maxFrame.toString());

        //长度条

        if (validElementIds.includes('appv_distance_pan') || validElementIds.includes('l_distance_pan') || validElementIds.includes('lite_distance_pan')) {

            //开始填充
            // 获取trkpt_data数组中最后一个元素的distance属性值，除以1000后进行四舍五入保留两位小数
            //zcd.text = max_distance_in_km + `Km`;//总长度
            let distance_in_km = Math.round(trkpt_data[currentFrame].distance / 1000 * 100) / 100;
            //console.log(currentFrame, distance_in_km);
            appv_distance_pan.children[2].text = distance_in_km + `Km`;//行进长度

            var jdtcd = (trkpt_data[currentFrame].distance / trkpt_data[maxFrame - 1].distance) * appv_distance_pan.children[3].width;//计算实时长度
            appv_distance_pan.children[4].width = jdtcd;
            //长进度条l_distance_pan
            l_distance_pan.children[7].text = distance_in_km + `Km`;//行进长度

            //距离条
            var jdtcd = (trkpt_data[currentFrame].distance / trkpt_data[maxFrame - 1].distance) * l_distance_pan.children[2].width;//计算实时长度
            l_distance_pan.children[1].width = jdtcd;
            l_distance_pan.children[6].x = jdtcd + l_distance_pan.children[1].x - l_distance_pan.children[6].width / 2;
            l_distance_pan.children[7].x = jdtcd + l_distance_pan.children[1].x;

            //距离条
            var jdtcd = (trkpt_data[currentFrame].distance / trkpt_data[maxFrame - 1].distance) * lite_distance_pan.children[0].width;//计算实时长度
            lite_distance_pan.children[1].width = jdtcd;
            lite_distance_pan.children[2].text = distance_in_km + `/`+ max_distance_in_km;//行进长度


        }

        // X长度条
        if (validElementIds.includes('x_distance_pan')) {
            // 获取当前距离和总距离
            let currentDistance = trkpt_data[currentFrame].distance;
            let totalDistance = trkpt_data[maxFrame - 1].distance;

            // 计算进度比例（0到1之间）
            let progressRatio = Math.min(Math.max(currentDistance / totalDistance, 0), 1);

            // 计算当前距离的公里数显示
            let distanceInKm = Math.round(currentDistance / 1000 * 100) / 100;
            let totalDistanceInKm = Math.round(totalDistance / 1000 * 100) / 100;

            // 更新进度文本
            x_distance_pan.children[8].children[0].text = `${distanceInKm}Km`;

            // 计算前景弧线的终点角度（从80度到100度）
            const startAngle = 80;
            const endAngle = 100;
            //const currentEndAngle = startAngle + (endAngle - startAngle) * progressRatio;
            const currentEndAngle = endAngle - (endAngle - startAngle) * progressRatio;

            // 更新前景弧线
            x_distance_pan.children[7].startAngle = currentEndAngle;

            // 计算并更新文本旋转角度（与弧线进度匹配）
            // 角度范围从10度到-10度，与弧线角度变化同步
            const textRotation = 10 - 20 * progressRatio;
            x_distance_pan.children[8].rotation = textRotation;

            // 当进度达到50%（中间点）时，将中间点端点改为白色
            if (progressRatio >= 0.5) {
                x_distance_pan.children[2].fill = x_distance_pan.children[7].stroke;
            } else {
                x_distance_pan.children[2].fill = x_distance_pan.children[6].stroke;
            }

            // 当进度达到100%（终点）时，将终点端点改为白色
            if (progressRatio >= 1.0) {
                x_distance_pan.children[4].fill = x_distance_pan.children[7].stroke;
            } else {
                x_distance_pan.children[4].fill = x_distance_pan.children[6].stroke;
            }

        }

        //高程
        if (validElementIds.includes('appv_ele18_pan') || validElementIds.includes('appv_ele_pan')) {
            //设置高程图型坐标
            //let offsetXY = appv_ele18_pan.children[1].width / 2;
            appv_ele18_pan.children[1].x = ele18_points[2 * currentFrame];
            appv_ele18_pan.children[1].y = ele18_points[2 * currentFrame + 1];

            appv_ele_pan.children[1].x = ele_points[2 * currentFrame];
        }


        //当前行进时间
        if (validElementIds.includes('appv_nowtime_pan') || validElementIds.includes('text_nowtime_pan')) {
            //当前进行时间 var now_time_str = secondsToHHMMSS(trkpt_data[currentFrame].sec);
            appv_nowtime_pan.children[0].text = secondsToHHMMSS(trkpt_data[currentFrame].sec);
            text_nowtime_pan.children[0].text = secondsToHHMMSS(trkpt_data[currentFrame].sec);
        }

        //画地图轨迹
        if (validElementIds.includes('appv_map_pan') || validElementIds.includes('appv_map_a_pan')) {
            //画地图
            var now_points = [];
            for (let index = 0; index <= currentFrame; index++) {
                //画经过路线
                now_points.push(map_points[index * 2]);   // 第一个数值乘以2
                now_points.push(map_points[index * 2 + 1]); // 第二个数值乘以2

            }
            if (validElementIds.includes('appv_map_pan')) {
                appv_map_pan.children[1].points = now_points;
                //画当前点
                appv_map_pan.children[2].x = map_points[currentFrame * 2];
                appv_map_pan.children[2].y = map_points[currentFrame * 2 + 1];
            }
            if (validElementIds.includes('appv_map_a_pan')) {
                appv_map_a_pan.children[1].points = now_points;
                //画当前点
                appv_map_a_pan.children[2].x = map_points[currentFrame * 2];
                appv_map_a_pan.children[2].y = map_points[currentFrame * 2 + 1];
                appv_map_a_pan.children[2].rotation = trkpt_data[currentFrame].azimuth;
            }

        }



        //画web地图
        if (validElementIds.includes('web_map_pan') || validElementIds.includes('web_minimap_pan')) {

            daohang(currentFrame);
            if (validElementIds.includes('web_map_pan')) {
                const mapCanvas = document.querySelector("#leafletmap > div > div.maptalks-all-layers > div.maptalks-canvas-layer > canvas");
                web_map_pan.children[0].context.drawImage(mapCanvas, 0, 0, web_map_pan.children[0].width, web_map_pan.children[0].height);
                web_map_pan.children[0].paint()
            }
            if (validElementIds.includes('web_minimap_pan')) {
                const minimapCanvas = document.querySelector("#leafletmap_mini > div > div.maptalks-all-layers > div.maptalks-canvas-layer > canvas");
                web_minimap_pan.children[0].context.drawImage(minimapCanvas, 0, 0, web_minimap_pan.children[0].width, web_minimap_pan.children[0].height);
                web_minimap_pan.children[0].paint()
            }

        }



        //当前经纬度
        if (validElementIds.includes('TO_gps_pan')) {
            TO_gps_pan.children[0].text = `${convertToDegreeMinuteSecond(trkpt_data[currentFrame].position_lat)}\n${convertToDegreeMinuteSecond(trkpt_data[currentFrame].position_long)}`;
        }




        //当前状态
        // 获取速度，若不存在则设为0
        let speed = trkpt_data[currentFrame] && trkpt_data[currentFrame].speed ? trkpt_data[currentFrame].speed : 0;
        let pace;
        if (speed > 0) {
            let pace_in_minutes = 60 / speed;  // 先计算配速对应的分钟数
            let minutes = Math.floor(pace_in_minutes);  // 取整得到分钟数
            let seconds = Math.floor((pace_in_minutes - minutes) * 60);  // 计算剩余的秒数
            pace = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;  // 格式化为mm:ss格式
        } else {
            pace = "00:00";
        }

        // 获取心率，若不存在则设为0
        let heart_rate = trkpt_data[currentFrame] && trkpt_data[currentFrame].heart_rate ? trkpt_data[currentFrame].heart_rate : 0;
        // 获取步频，若不存在则设为0
        let cadence = trkpt_data[currentFrame] && trkpt_data[currentFrame].cadence ? trkpt_data[currentFrame].cadence : 0;
        // 获取步幅，若不存在则设为0
        let step_length = trkpt_data[currentFrame] && trkpt_data[currentFrame].step_length ? trkpt_data[currentFrame].step_length : 0;
        // 获取高程，若不存在则设为0
        let altitude = trkpt_data[currentFrame] && trkpt_data[currentFrame].altitude ? trkpt_data[currentFrame].altitude : 0;
        // 获取功率，若不存在则设为0
        let power = trkpt_data[currentFrame] && trkpt_data[currentFrame].power ? trkpt_data[currentFrame].power : 0;


        //综合
        if (validElementIds.includes('appv_nowstatus_pan')) {
            appv_nowstatus_pan.children[0].text = `Speed：${speed.toFixed(2)} km/h\nPace：${pace} min/km\nHeart Rate：${heart_rate} bpm\nCadence：${cadence} steps/min\nStep：${step_length} m`;
        }

        //to仪表盘
        if (validElementIds.includes('TO_pace_pan')) {
            TO_pace_pan.children[0].text = `${pace} min/km`;
        }

        //to仪表盘
        if (validElementIds.includes('TO_speed_pan')) {
            TO_speed_pan.children[0].text = `${speed} km/h`;
        }

        //to仪表盘
        if (validElementIds.includes('TO_heart_pan')) {
            TO_heart_pan.children[0].text = `${heart_rate} bpm`;
            // 根据奇偶性设置心率图标缩放比例
            if (currentFrame % 2 === 0) {
                TO_heart_pan.children[1].scale = 0.038; // 偶数帧缩放值
            } else {
                TO_heart_pan.children[1].scale = 0.04;  // 奇数帧缩放值
            }
        }
        //to仪表盘
        if (validElementIds.includes('TO_cadence_pan')) {
            TO_cadence_pan.children[0].text = `${cadence} steps/min`;
        }

        //to仪表盘
        if (validElementIds.includes('TO_rpm_pan')) {
            TO_rpm_pan.children[0].text = `${(cadence / 2) | 0} Rpm`;
        }

        if (validElementIds.includes('x_rpm_pan')) {
            x_rpm_pan.children[0].text = `${(cadence / 2) | 0}`;
            // 定义角度范围
            const minEndAngle = -150;
            const maxEndAngle = 30;
            const angleRange = maxEndAngle - minEndAngle; // 180度区间
            // 计算速度范围
            const speedRange = cadenceMax - cadenceMin;
            let currentAngle;
            if (speedRange <= 0) {
                // 处理速度范围为0的特殊情况（如所有速度相同）
                currentAngle = minEndAngle; // 或设置为中间值 (minEndAngle + maxEndAngle) / 2
            } else {
                // 线性映射当前速度到角度范围
                const speedRatio = (cadence - cadenceMin) / speedRange;
                currentAngle = minEndAngle + (speedRatio * angleRange);

                // 确保角度在有效范围内（防止超出边界）
                currentAngle = Math.max(minEndAngle, Math.min(maxEndAngle, currentAngle));
            }
            // 设置最终角度
            x_rpm_pan.children[4].endAngle = currentAngle;
        }

        //to仪表盘
        if (validElementIds.includes('TO_step_pan')) {
            TO_step_pan.children[0].text = `${step_length} m`;
        }

        //to仪表盘
        if (validElementIds.includes('TO_power_pan')) {
            TO_power_pan.children[0].text = `${(Math.trunc(power)) | 0} watt`;
        }

        if (validElementIds.includes('x_power_pan')) {
            x_power_pan.children[0].text = `${Math.trunc(power)}`;
            // 定义角度范围
            const minEndAngle = -150;
            const maxEndAngle = 30;
            const angleRange = maxEndAngle - minEndAngle; // 180度区间
            // 计算速度范围
            const speedRange = powerMax - powerMin;
            let currentAngle;
            if (speedRange <= 0) {
                // 处理速度范围为0的特殊情况（如所有速度相同）
                currentAngle = minEndAngle; // 或设置为中间值 (minEndAngle + maxEndAngle) / 2
            } else {
                // 线性映射当前速度到角度范围
                const speedRatio = (power - powerMin) / speedRange;
                currentAngle = minEndAngle + (speedRatio * angleRange);

                // 确保角度在有效范围内（防止超出边界）
                currentAngle = Math.max(minEndAngle, Math.min(maxEndAngle, currentAngle));
            }
            // 设置最终角度
            x_power_pan.children[4].endAngle = currentAngle;
        }

        //心率仪表盘
        if (validElementIds.includes('el_heart_pan')) {
            el_heart_pan.children[0].text = `${heart_rate}`;
            //max220,min40，系数1.33
            if (heart_rate < 40) {
                heart_rate = 40;
            }
            el_heart_pan.children[3].endAngle = -210 + (heart_rate - 40) * 1.33;
        }

        if (validElementIds.includes('x_heart_pan')) {
            x_heart_pan.children[0].text = `${heart_rate}`;
            // 定义角度范围
            const minEndAngle = -150;
            const maxEndAngle = 30;
            const angleRange = maxEndAngle - minEndAngle; // 180度区间
            // 计算速度范围
            const speedRange = heartRateMax - heartRateMin;
            let currentAngle;
            if (speedRange <= 0) {
                // 处理速度范围为0的特殊情况（如所有速度相同）
                currentAngle = minEndAngle; // 或设置为中间值 (minEndAngle + maxEndAngle) / 2
            } else {
                // 线性映射当前速度到角度范围
                const speedRatio = (heart_rate - heartRateMin) / speedRange;
                currentAngle = minEndAngle + (speedRatio * angleRange);

                // 确保角度在有效范围内（防止超出边界）
                currentAngle = Math.max(minEndAngle, Math.min(maxEndAngle, currentAngle));
            }
            // 设置最终角度
            x_heart_pan.children[4].endAngle = currentAngle;
        }




        //高级心率仪表盘
        if (validElementIds.includes('pl_heart_pan')) {
            // 获取原始数值并转换为整数
            var min = parseInt(pl_heart_pan.children[1].text);
            var max = parseInt(pl_heart_pan.children[2].text);
            // 计算区间参数
            var interval = max - min;

            pl_heart_pan.children[6].text = `${heart_rate}`;
            pl_heart_pan.children[11].endAngle = -210 + (heart_rate - min) * 240 / interval;
            //计算心率区间
            if (heart_rate - min > interval * 0.95) {
                pl_heart_pan.children[11].stroke = "#FF0000";
            } else if (heart_rate - min > interval * 0.88) {
                pl_heart_pan.children[11].stroke = "#FF8800";
            } else if (heart_rate - min > interval * 0.84) {
                pl_heart_pan.children[11].stroke = "#FFD700";
            } else if (heart_rate - min > interval * 0.74) {
                pl_heart_pan.children[11].stroke = "#7CFC00";
            } else {
                pl_heart_pan.children[11].stroke = "#7FFFD4";
            }
            // 获取最近10条心率数据（含当前帧）
            const heartRates = [];
            for (let i = 0; i < 10; i++) {
                const frameIndex = currentFrame - i;
                // 确保数据有效性，越界或无效数据返回0
                heartRates.push(frameIndex >= 0 && trkpt_data[frameIndex] ? trkpt_data[frameIndex].heart_rate : 0);
            }

            // 计算折线点坐标
            const zheart_points = [];
            const pl_heart_pan_width = pl_heart_pan.width * 0.75;
            const pl_heart_pan_40 = pl_heart_pan_width * 0.2;
            const pl_heart_pan_80 = pl_heart_pan_width * 0.4;
            const xStep = pl_heart_pan_width / (10 - 1); // X轴间隔计算（保持10个点平均分布）

            for (let i = 0; i < 10; i++) {
                // X坐标计算：从右向左排列（最新数据在最右侧）
                const x = pl_heart_pan_width - i * xStep;

                // Y坐标计算（关键修改部分）：
                // 1. 将0-80的心率映射到0-10的显示范围（因40px高度/4px/unit=10units）
                // 2. 计算垂直偏移量（每个单位对应4像素）
                // 3. 坐标系转换：画布底部为150，向上递减
                const heartRate = heartRates[i];
                const displayValue = heartRates[i] - heartRates[i + 1]; // 80→10
                var y = pl_heart_pan_40 - (displayValue * 6);
                // 边界约束（重要补充）
                if (y < 0) {
                    y = 0;
                } else if (y > pl_heart_pan_80) {
                    y = pl_heart_pan_80;
                }
                zheart_points.push(x, y);
            }

            // 更新路径数据
            pl_heart_pan.children[12].points = zheart_points;
        }


        //配速仪表盘
        if (validElementIds.includes('el_pace_pan')) {
            el_pace_pan.children[0].text = `${pace}`;
            //max22，min0，系数10.9
            el_pace_pan.children[3].endAngle = -210 + speed * 10.9;
        }

        // 配速仪表盘
        if (validElementIds.includes('x_pace_pan')) {
            x_pace_pan.children[0].text = `${pace}`;
            // 定义角度范围
            const minEndAngle = -150;
            const maxEndAngle = 30;
            const angleRange = maxEndAngle - minEndAngle; // 180度区间
            // 计算速度范围
            const speedRange = paceMax - paceMin;
            let currentAngle;
            if (speedRange <= 0) {
                // 处理速度范围为0的特殊情况（如所有速度相同）
                currentAngle = minEndAngle; // 或设置为中间值 (minEndAngle + maxEndAngle) / 2
            } else {
                // 线性映射当前速度到角度范围
                const speedRatio = (speed - paceMin) / speedRange;
                currentAngle = minEndAngle + (speedRatio * angleRange);

                // 确保角度在有效范围内（防止超出边界）
                currentAngle = Math.max(minEndAngle, Math.min(maxEndAngle, currentAngle));
            }
            // 设置最终角度
            x_pace_pan.children[4].endAngle = currentAngle;
        }

        //速度仪表盘
        if (validElementIds.includes('el_speed_pan')) {
            el_speed_pan.children[0].text = `${speed}`;
            //max60，min0，系数3.5
            el_speed_pan.children[3].endAngle = -210 + speed * 3.5;
        }

        if (validElementIds.includes('x_speed_pan')) {
            x_speed_pan.children[0].text = `${speed}`;
            // 定义角度范围
            const minEndAngle = -150;
            const maxEndAngle = 30;
            const angleRange = maxEndAngle - minEndAngle; // 180度区间
            // 计算速度范围
            const speedRange = paceMax - paceMin;
            let currentAngle;
            if (speedRange <= 0) {
                // 处理速度范围为0的特殊情况（如所有速度相同）
                currentAngle = minEndAngle; // 或设置为中间值 (minEndAngle + maxEndAngle) / 2
            } else {
                // 线性映射当前速度到角度范围
                const speedRatio = (speed - paceMin) / speedRange;
                currentAngle = minEndAngle + (speedRatio * angleRange);

                // 确保角度在有效范围内（防止超出边界）
                currentAngle = Math.max(minEndAngle, Math.min(maxEndAngle, currentAngle));
            }
            // 设置最终角度
            x_speed_pan.children[4].endAngle = currentAngle;
        }



        //步频仪表盘
        if (validElementIds.includes('el_cadence_pan')) {
            el_cadence_pan.children[0].text = `${cadence}`;
            //max240，min0，系数1
            el_cadence_pan.children[3].endAngle = -210 + cadence * 1;
        }

        if (validElementIds.includes('x_cadence_pan')) {
            x_cadence_pan.children[0].text = `${cadence}`;
            // 定义角度范围
            const minEndAngle = -150;
            const maxEndAngle = 30;
            const angleRange = maxEndAngle - minEndAngle; // 180度区间
            // 计算速度范围
            const speedRange = cadenceMax - cadenceMin;
            let currentAngle;
            if (speedRange <= 0) {
                // 处理速度范围为0的特殊情况（如所有速度相同）
                currentAngle = minEndAngle; // 或设置为中间值 (minEndAngle + maxEndAngle) / 2
            } else {
                // 线性映射当前速度到角度范围
                const speedRatio = (cadence - cadenceMin) / speedRange;
                currentAngle = minEndAngle + (speedRatio * angleRange);

                // 确保角度在有效范围内（防止超出边界）
                currentAngle = Math.max(minEndAngle, Math.min(maxEndAngle, currentAngle));
            }
            // 设置最终角度
            x_cadence_pan.children[4].endAngle = currentAngle;
        }


        //计算圈速
        // 计算圈速
        if (validElementIds.includes('appv_lap_pan')) {
            let segment_info = "";
            let lap = "";
            // 计算已经完成的整公里数
            let completed_km = Math.floor(trkpt_data[currentFrame].distance / 1000);
            // 当前总距离(米)和总时间(秒)
            const currentTotalDistance = trkpt_data[currentFrame].distance;
            const currentTotalSec = trkpt_data[currentFrame].sec;

            // 计算已完成公里的时间
            for (let km = 1; km <= completed_km; km++) {
                if (km % 5 === 0 && km > 0) {
                    // 每5km汇总展示
                    let startKm = km - 4;
                    let endKm = km;
                    let totalTimeInSeconds = 0;
                    for (let i = startKm - 1; i < endKm; i++) {
                        if (i < json_data.lap_standard.length) {
                            totalTimeInSeconds += json_data.lap_standard[i].total_timer_time;
                        }
                    }
                    let minutes = Math.floor(totalTimeInSeconds / 60);
                    let seconds = Math.floor(totalTimeInSeconds % 60);

                    lap += `${startKm}-${endKm}km：${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}\n`;
                    segment_info = lap;
                } else {
                    let time_in_seconds = km - 1 < json_data.lap_standard.length ? json_data.lap_standard[km - 1].total_timer_time : 0;
                    let minutes = Math.floor(time_in_seconds / 60);
                    let seconds = Math.floor(time_in_seconds % 60);
                    segment_info += `${km}km：${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}\n`;
                }
            }

            // 计算当前正在进行的公里段(未完成1km)的即时用时
            const currentKm = completed_km + 1; // 当前所在公里段
            const distanceInCurrentKm = currentTotalDistance % 1000; // 当前公里已行驶距离(米)

            if (distanceInCurrentKm > 0) {
                // 找到上一个整公里点的时间
                let lastKmSec = 0; // 默认为起点时间(0秒)
                const lastKmDistance = completed_km * 1000; // 上一个整公里的距离

                // 遍历轨迹点找到上一个整公里点的时间
                // 从当前帧往前找效率更高
                for (let i = currentFrame; i >= 0; i--) {
                    if (trkpt_data[i].distance <= lastKmDistance) {
                        lastKmSec = trkpt_data[i].sec;
                        break;
                    }
                }

                // 计算当前公里已用时间
                const timeInCurrentKm = currentTotalSec - lastKmSec;
                const minutes = Math.floor(timeInCurrentKm / 60);
                const seconds = Math.floor(timeInCurrentKm % 60);

                // 添加到显示信息，用特殊标识区分未完成公里
                segment_info += `+${Math.round(distanceInCurrentKm)}m：` +
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}\n`;
            }

            // 显示圈速信息
            appv_lap_pan.children[0].text = segment_info;
        }


        //用户圈速
        if (validElementIds.includes('appv_lap_user_pan')) {
            const currentTimestamp = trkpt_data[currentFrame].timestamp; // 当前参照时间戳
            const lapUser = data.data.lap_user; // 圈数数据数组
            let lapIndex = -1; // 记录当前所在的圈数索引

            // 遍历圈数数据，找到当前时间戳所在的圈数区间
            for (let i = 0; i < lapUser.length; i++) {
                const currentLapStart = lapUser[i].start_time;
                // 下一个圈数的开始时间（最后一个圈数没有下一个，用无穷大处理）
                const nextLapStart = i < lapUser.length - 1 ? lapUser[i + 1].start_time : Infinity;

                // 判断当前时间是否在 [当前圈开始时间, 下一圈开始时间) 区间内
                if (currentTimestamp >= currentLapStart && currentTimestamp < nextLapStart) {
                    lapIndex = i;
                    break;
                }
            }

            // 生成标记字符串（换行符数量等于圈数索引，后接X）
            let segment_info = '';
            if (lapIndex !== -1) { // 找到有效圈数时
                segment_info = '\n'.repeat(lapIndex + 1) + 'ㅤㅤ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉';
            } // 未找到时保持空字符串（可根据需求调整默认提示）

            // 更新显示内容
            appv_lap_user_pan.children[0].text = segment_info;
        }


        //带标尺的心率
        if (validElementIds.includes('pt_heart_pan')) {
            pt_heart_pan.children[7].x = pt_heart_pan.width / maxFrame * currentFrame;
            pt_heart_pan.children[9].x = pt_heart_pan.width / maxFrame * currentFrame + 5;
            pt_heart_pan.children[10].x = pt_heart_pan.width / maxFrame * currentFrame;
            pt_heart_pan.children[10].y = pt_heart_points[currentFrame * 2 + 1];
            pt_heart_pan.children[9].text = heart_rate;
        }


        //带标尺的配速
        if (validElementIds.includes('pt_pace_pan')) {
            pt_pace_pan.children[7].x = pt_pace_pan.width / maxFrame * currentFrame;
            pt_pace_pan.children[9].x = pt_pace_pan.width / maxFrame * currentFrame + 5;
            pt_pace_pan.children[10].x = pt_pace_pan.width / maxFrame * currentFrame;
            pt_pace_pan.children[10].y = pt_paces_points[currentFrame * 2 + 1];
            pt_pace_pan.children[9].text = pace;
        }

        //带标尺的高程
        if (validElementIds.includes('pt_ele_pan')) {
            pt_ele_pan.children[7].x = pt_ele_pan.width / maxFrame * currentFrame;
            pt_ele_pan.children[9].x = pt_ele_pan.width / maxFrame * currentFrame + 5;
            pt_ele_pan.children[10].x = pt_ele_pan.width / maxFrame * currentFrame;
            pt_ele_pan.children[10].y = pt_ele_points[currentFrame * 2 + 1];
            pt_ele_pan.children[9].text = altitude;
        }



        //当前日期时间
        if (validElementIds.includes('appv_date_pan')) {
            appv_date_pan.children[0].text = timestampToDateString(trkpt_data[currentFrame].timestamp);
        }


        //当前时间
        if (validElementIds.includes('text_time_pan')) {
            text_time_pan.children[0].text = timestampToDateString(trkpt_data[currentFrame].timestamp, 0);
        }


        //当前日期
        if (validElementIds.includes('text_day_pan')) {
            text_day_pan.children[0].text = timestampToDateString(trkpt_data[currentFrame].timestamp, 1);
        }


        //画坡度
        if (validElementIds.includes('el_slope_pan')) {
            //const slope_points = [0, 60, 0, 70, 100, 70, 100, 60, 100, 60];
            var slope_points = el_slope_pan.children[0].points;
            slope_points[1] = slope_points[7];
            slope_points[9] = slope_points[7];
            const slopeValue = parseFloat(trkpt_data[currentFrame].slope) * slope_points[6];
            const slopeValuestr = parseFloat(trkpt_data[currentFrame].slope) * 100;
            // 创建副本以避免修改原始数组
            const newSlopePoints = slope_points.slice();
            // 根据坡度调整坐标
            if (slopeValue > 0) {
                // 修改第8位（索引7）的y值：向下移动
                newSlopePoints[9] -= slopeValue;
            } else if (slopeValue < 0) {
                // 修改第2位（索引1）的y值：向上移动
                newSlopePoints[1] += slopeValue;
            }
            //更新points 属性
            el_slope_pan.children[1].text = slopeValuestr.toFixed(0) + "°";
            el_slope_pan.children[0].points = newSlopePoints;
        }





        // // 4. 可选：更新【内存Leafer】数据（视频生成画布，默认开启）
        // if (updateMemory && window.memoryFrame) {
        //     // 查找内存中的时间/时长面板（与前端ID一致）
        //     const memoryDatePan = window.memoryFrame.children.find(obj => obj.id === 'appv_date_pan');
        //     const memorySecPan = window.memoryFrame.children.find(obj => obj.id === 'text_nowtime_pan');

        //     if (memoryDatePan?.children[0]) {
        //         memoryDatePan.children[0].text = formattedTime;
        //     }
        //     if (memorySecPan?.children[0]) {
        //         memorySecPan.children[0].text = formattedSec;
        //     }
        // }

        //console.log('Leafer数据更新成功', { timestamp: trkpt.timestamp, sec: trkpt.sec });
        return true;
    } catch (error) {
        console.error('Leafer数据更新失败：', error);
        return false;
    }
};
