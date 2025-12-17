function set_zh_distance_pan () {
    // 全局变量容错（核心：避免未定义报错）
    const trkpt_data = window.trkpt_data || [];
    const json_data = window.json_data || {};
    json_data.lap_standard = json_data.lap_standard || []; // 每公里用时数据
    const textshadow = window.textshadow || {}; // 文字阴影配置（复用你的样式）
    const currentFrame = trkpt_data.length - 1; // 取最后一帧数据（总距离/总时间）

    // 总距离（米）→ 转成公里数（1km对应30像素）
    const totalDistanceM = trkpt_data[currentFrame]?.distance || 0;
    const totalKm = totalDistanceM / 1000; // 总公里数（保留小数，如16.5km）
    const maxWidth = totalKm * 30; // 进度条总像素长度（精准对应总公里数）
    const kmStepPx = 30; // 每公里固定像素步长（统一基准）

    // 第一步：设置进度条长度
    if (!zh_distance_pan || !zh_distance_pan.children) return;
    const progressBarNode = zh_distance_pan.children[2];
    if (progressBarNode) {
        progressBarNode.width = maxWidth;
    }

    // 第二步：获取进度节点的父容器（要调用add方法的对象）
    const nodeContainer = zh_distance_pan.children[3];
    const nodeContainertext = zh_distance_pan.children[4];
    if (!nodeContainer || typeof nodeContainer.add !== 'function') return; // 校验add方法存在

    // 关键：清空原有节点（避免重复添加）
    if (nodeContainer.children && nodeContainer.children.length > 0) {
        for (let i = nodeContainer.children.length - 1; i >= 0; i--) {
            const child = nodeContainer.children[i];
            if (child && typeof nodeContainer.remove === 'function') {
                nodeContainer.remove(child);
            }
        }
    }

    // 第三步：生成所有需要的节点公里数（包含起点、所有整数公里、终点）
    const nodeKmList = [];
    if (totalKm > 0) {
        // 1. 先加起点（0km）
        nodeKmList.push(0);
        // 2. 加中间整数公里（1km、2km...直到总公里数的整数部分）
        const maxIntKm = Math.floor(totalKm);
        for (let km = 1; km <= maxIntKm; km++) {
            nodeKmList.push(km);
        }
        // 3. 加终点（总公里数，哪怕是小数，如16.5km），避免和整数公里重复
        if (totalKm !== maxIntKm) {
            nodeKmList.push(totalKm);
        }
    }

    // 无节点则返回
    if (nodeKmList.length === 0) return;

    // 椭圆垂直坐标（根据布局调整，0为基准）
    const ellipseY = 0;
    // 文字节点垂直坐标（位于椭圆下方/右侧，按需调整）
    const textY = ellipseY + 10;
    // 起点/终点文字偏移（可根据需要调整）
    const startEndTextY = ellipseY + 10;

    // 第四步：循环添加椭圆节点 + 每KM用时文字节点
    nodeKmList.forEach((currentKm, index) => {
        // -------------------- 1. 生成椭圆节点（确保X坐标精准） --------------------
        const isStart = currentKm === 0;
        const isEnd = currentKm === totalKm;
        const is5KmStep = Number.isInteger(currentKm) && currentKm % 5 === 0;
        const nodeSize = isStart || isEnd || is5KmStep ? 15 : 10;

        // 核心：计算X坐标（先不截断，日志验证后再兜底）
        const calcX = currentKm * kmStepPx;
        const nodeX = Math.min(calcX, maxWidth);

        // 调试日志（可选：验证10K+的X坐标是否正确）
        // if (currentKm >= 9) {
        //     console.log(`KM: ${currentKm} → 计算X: ${calcX} → 最终X: ${nodeX} → 进度条总长: ${maxWidth}`);
        // }

        const ellipseNode = {
            tag: 'Ellipse',
            x: nodeX,
            y: ellipseY,
            width: nodeSize,
            height: nodeSize,
            around: 'center',
            fill: "#FFFFFF"
        };
        nodeContainer.add(ellipseNode);

        // -------------------- 2. 生成起点文字（start） --------------------
        if (isStart) {
            const startTextNode = {
                tag: 'Text',
                text: 'Start',
                resizeFontSize: true,
                x: nodeX,
                y: startEndTextY,
                fontSize: 14,
                fontWeight: 'black',
                fill: '#FFFFFF',
                origin: 'left',
                rotation: 45,
                textAlign: 'left',
                verticalAlign: 'middle',
                //shadow: textshadow
            };
            nodeContainertext.add(startTextNode);
            // 起点不显示其他文字，直接返回
            return;
        }

        // -------------------- 3. 生成终点文字（xx.xxKm） --------------------
        if (isEnd) {
            // 格式化总长度为两位小数
            const formattedTotalKm = totalKm.toFixed(2) + 'Km';
            const endTextNode = {
                tag: 'Text',
                text: formattedTotalKm,
                resizeFontSize: true,
                x: nodeX + 10,
                y: startEndTextY - 10,
                fontSize: 14,
                fontWeight: 'black',
                fill: '#FFFFFF',
                origin: 'left',
                rotation: 45,
                textAlign: 'left',
                verticalAlign: 'middle',
                //shadow: textshadow
            };
            nodeContainertext.add(endTextNode);
            // 终点不显示其他文字，直接返回
            return;
        }

        // -------------------- 4. 生成每KM用时文字节点（核心修正对齐） --------------------
        if (!Number.isInteger(currentKm)) return;

        // 计算用时（确保索引正确）
        let time_in_seconds = 0;
        const lapIndex = currentKm - 1;
        if (lapIndex >= 0 && lapIndex < json_data.lap_standard.length) {
            time_in_seconds = json_data.lap_standard[lapIndex].total_timer_time || 0;
        }
        const minutes = Math.floor(time_in_seconds / 60).toString().padStart(2, '0');
        const seconds = Math.floor(time_in_seconds % 60).toString().padStart(2, '0');
        const timeText = `${currentKm}K ${minutes}:${seconds}`;

        // 【核心修正】旋转90度后的对齐配置（解决10K+偏移）
        const textNode = {
            tag: 'Text',
            text: timeText,
            resizeFontSize: true,
            x: nodeX,             // 和椭圆X坐标完全一致
            y: textY,             // 按需调整
            fontSize: 14,
            fontWeight: 'black',
            fill: '#FFFFFF',
            origin: 'left',     // 旋转中心=文字中心（关键）
            rotation: 45,         // 垂直文字
            // 旋转90度后，textAlign/verticalAlign调整为center/middle，确保无论文字长度都居中
            textAlign: 'left',
            verticalAlign: 'middle',
            //shadow: textshadow
        };
        nodeContainertext.add(textNode);
    });
}