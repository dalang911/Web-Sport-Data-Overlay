// 等待DOM完全加载后再执行
document.addEventListener('DOMContentLoaded', () => {
    // 1. 大地图
    fullmap = document.createElement('div');
    fullmap.style.width = '300px';
    fullmap.style.height = '300px';
    fullmap.style.position = 'fixed'; // 关键：脱离文档流，使left生效
    fullmap.style.left = '-300px'; // 元素宽300px，刚好移出左侧可视区域
    fullmap.style.top = '0'; // 可选：固定在顶部，避免垂直方向占位
    fullmap.style.visibility = 'hidden'; // 双重保险：视觉隐藏
    document.body.appendChild(fullmap);

    // 2. 小地图
    minimap = document.createElement('div');
    minimap.style.width = '300px';
    minimap.style.height = '300px';
    minimap.style.position = 'fixed'; // 关键：脱离文档流，使left生效
    minimap.style.left = '-300px'; // 元素宽300px，刚好移出左侧可视区域
    minimap.style.top = '0'; // 可选：固定在顶部，避免垂直方向占位
    minimap.style.visibility = 'hidden'; // 双重保险：视觉隐藏

    // 此时document.body已存在，可安全调用appendChild
    document.body.appendChild(minimap);

    //rotate
    // 3. 旋转地图
    rotatemap = document.createElement('div');
    rotatemap.style.width = '300px';
    rotatemap.style.height = '300px';
    rotatemap.style.position = 'fixed'; // 关键：脱离文档流，使left生效
    rotatemap.style.left = '-400px'; // 元素宽300px，刚好移出左侧可视区域
    rotatemap.style.top = '0px'; // 可选：固定在顶部，避免垂直方向占位
    rotatemap.style.visibility = 'hidden'; // 双重保险：视觉隐藏

    // 此时document.body已存在，可安全调用appendChild
    document.body.appendChild(rotatemap);

    //rotate
    // 4. 高德旋转地图
    gaodemap = document.createElement('div');
    gaodemap.style.width = '300px';
    gaodemap.style.height = '300px';
    gaodemap.style.position = 'fixed'; // 关键：脱离文档流，使left生效
    gaodemap.style.left = '-400px'; // 元素宽300px，刚好移出左侧可视区域
    gaodemap.style.top = '-400px'; // 可选：固定在顶部，避免垂直方向占位
    gaodemap.style.visibility = 'hidden'; // 双重保险：视觉隐藏

    // 此时document.body已存在，可安全调用appendChild
    document.body.appendChild(gaodemap);

});


// 卫星地图经纬度提取
function set_leafletmap_latlngs(rqjson) {
    // 清空现有的latlngs数组
    latlngs.length = 0;

    // 遍历rqjson.data.trkpt数组
    for (var i = 0; i < rqjson.data.trkpt.length; i++) {
        // 获取每个点的纬度和经度
        var lat = rqjson.data.trkpt[i].position_lat;
        var lng = rqjson.data.trkpt[i].position_long;

        // 注意：maptalks的经纬度顺序是先经度后纬度
        latlngs.push([lng, lat]);
    }


}

/**
 * 标准 WGS84 转 GCJ-02（高德坐标系）算法
 * 基于官方公开逻辑实现，误差≤2米，无异常值
 */
function wgs84ToGcj02(lng, lat) {
    const PI = Math.PI;
    const a = 6378137.0; // 地球长半轴
    const ee = 0.00669342162296594323; // 第一偏心率平方（WGS84标准值）

    // 先判断是否在中国大陆境内（境外不偏移）
    if (!isInChina(lng, lat)) {
      return { lng, lat };
    }

    let dLat = transformLat(lng - 105.0, lat - 35.0);
    let dLng = transformLng(lng - 105.0, lat - 35.0);
    const radLat = lat / 180.0 * PI;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI);
    dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI);

    // 叠加偏移量，得到GCJ-02坐标
    const gcjLat = lat + dLat;
    const gcjLng = lng + dLng;
    return { lng: gcjLng, lat: gcjLat };
  }

  /**
   * 纬度偏移量计算（标准GCJ-02公式）
   */
  function transformLat(x, y) {
    const PI = Math.PI;
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * PI) + 320.0 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0;
    return ret;
  }

  /**
   * 经度偏移量计算（标准GCJ-02公式）
   */
  function transformLng(x, y) {
    const PI = Math.PI;
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x * PI / 30.0)) * 2.0 / 3.0;
    return ret;
  }

  /**
   * 校验坐标是否在中国大陆境内
   */
  function isInChina(lng, lat) {
    return lng >= 73.66 && lng <= 135.05 && lat >= 3.86 && lat <= 53.55;
  }

  /**
   * 批量转换 + 过滤无效坐标
   */
  function batchWgs84ToGcj02(wgs84Arr) {
    return wgs84Arr
      // 先过滤原始数据中的无效坐标
      .filter(([lng, lat]) =>
        typeof lng === "number" && !isNaN(lng) &&
        typeof lat === "number" && !isNaN(lat) &&
        lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90
      )
      // 转换为GCJ-02
      .map(([lng, lat]) => {
        const gcj = wgs84ToGcj02(lng, lat);
        // 保留8位小数，确保精度
        return [Number(gcj.lng.toFixed(8)), Number(gcj.lat.toFixed(8))];
      });
  }

  // ------------------------------
  // 批量转换并输出结果
  // ------------------------------
//   const gcj02Data = batchWgs84ToGcj02(wgs84Data);
//   console.log("WGS84 原始数据：");
//   console.log(wgs84Data);
//   console.log("\n高德 GCJ-02 转换结果：");
//   console.log(gcj02Data);

// 1. 大地图变量
let full_map = null; // 地图实例
let full_marker = null; // 标记点
let full_polyline = null; //完整轨迹折线
let new_full_polyline = null; // 进行中轨迹折线
let full_mapInitialized = false; // 地图初始化状态标记

// 2. 小地图变量
let mini_map = null; // 地图实例
let mini_marker = null; // 标记点
let mini_polyline = null; //完整轨迹折线
let new_mini_polyline = null; // 进行中轨迹折线
let mini_mapInitialized = false; // 地图初始化状态标记

// 3. rotate地图变量
let rotate_map = null; // 地图实例
let rotate_marker = null; // 标记点
let rotate_polyline = null; //完整轨迹折线
let new_rotate_polyline = null; // 进行中轨迹折线
let rotate_mapInitialized = false; // 地图初始化状态标记

// 4. gaoderotate地图变量
let gaode_map = null; // 地图实例
let gaode_marker = null; // 标记点
let gaode_polyline = null; //完整轨迹折线
let new_gaode_polyline = null; // 进行中轨迹折线
let gaode_mapInitialized = false; // 地图初始化状态标记

let latlngs = []; // 导航坐标数组（请确保该数组在调用前已初始化）
let gaode_latlngs = []; // 导航坐标数组（请确保该数组在调用前已初始化）

// 1. 定义多个图源配置（可按需扩展/修改）
mapSourceConfigs = {
    // 默认图源：openstreetmap.fr
    osmHot: {
        id: 'osmHot',
        name: 'OSM.FR',
        urlTemplate: 'https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        subdomains: ['b', 'c'],
        crossOrigin: 'anonymous',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://hot.openstreetmap.org/">Humanitarian OpenStreetMap Team</a>',
        minZoom: 1,
        maxZoom: 19 // 该服务支持的最大缩放级别
    },
    // 可选图源1：OpenStreetMap 标准瓦片
    carto: {
        id: 'carto',
        name: 'Carto',
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ["a", "b", "c", "d"],
        crossOrigin: 'anonymous',
        attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>',
        minZoom: 1,
        maxZoom: 19
    },
    // 可选图源3：Esri地图（英文世界适配）
    arcgisonline: {
        id: 'arcgisonline',
        name: 'Esri.WorldImagery',
        urlTemplate: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        crossOrigin: 'anonymous',
        attribution: '© <a href="https://maps.google.com/">Google Maps</a>',
        minZoom: 1,
        maxZoom: 20
    },

};

// 2. 创建默认图源的瓦片层（openstreetmap.fr）
defaultTileLayer = new maptalks.TileLayer('base', {
    renderer: 'canvas', // 保持原渲染器配置
    ...mapSourceConfigs.osmHot // 展开默认图源配置
});

// 2. 创建默认图源的瓦片层（openstreetmap.fr）
minidefaultTileLayer = new maptalks.TileLayer('base', {
    renderer: 'canvas', // 保持原渲染器配置
    ...mapSourceConfigs.osmHot // 展开默认图源配置
});

// 3. 创建默认图源的瓦片层（openstreetmap.fr）
rotatedefaultTileLayer = new maptalks.TileLayer('base', {
    renderer: 'gl', // 保持原渲染器配置
    ...mapSourceConfigs.osmHot // 展开默认图源配置
});

// 配置大地图
function full_map_maptalks() {
    // 避免重复初始化
    if (full_mapInitialized) {
        console.log('地图已初始化，无需重复创建');
        return;
    }

    // 检查坐标数组是否已初始化（避免后续操作空数组）
    if (!latlngs || latlngs.length === 0) {
        console.error('latlngs 坐标数组未初始化或为空，无法创建地图');
        return;
    }



    // 3. 初始化地图（默认加载 osmHot 图源）
    full_map = new maptalks.Map(fullmap, {
        center: [118.9, 33.8], // 初始中心点
        zoom: 15, // 初始缩放级别
        baseLayer: defaultTileLayer // 传入默认瓦片层
    });



    // 创建折线实例（全局变量赋值）
    full_polyline = new maptalks.LineString(latlngs, {
        symbol: { 'lineColor': '#FFFF00', 'lineWidth': 5, 'lineOpacity': 0.9 }
    });
    const mini_polyline = new maptalks.LineString(latlngs, {
        symbol: { 'lineColor': '#FFFF00', 'lineWidth': 5, 'lineOpacity': 0.9 }
    });

    // 导航折线（全局变量赋值）
    new_full_polyline = new maptalks.LineString([], {
        symbol: { 'lineColor': '#FF8C00', 'lineWidth': 5, 'lineOpacity': 0.9 }
    });


    // 标记点（全局变量赋值）
    full_marker = new maptalks.Marker(latlngs[0], {
        symbol: {
            'markerType': 'ellipse',
            'markerFill': '#FF6347',
            'markerFillOpacity': 0.9,
            'markerLineWidth': 0,
            'markerWidth': 15,
            'markerHeight': 15
        }
    });


    // 添加图层和几何对象
    const layer = new maptalks.VectorLayer('vector').addTo(full_map);
    // const minilayer = new maptalks.VectorLayer('vector').addTo(minimap);
    layer.addGeometry(full_polyline, new_full_polyline, full_marker);
    // minilayer.addGeometry(mini_polyline, mini_new_polyline, mini_marker);

    // 更新折线和视野
    full_polyline.setCoordinates(latlngs);
    // mini_polyline.setCoordinates(latlngs);
    full_map.fitExtent(full_polyline.getExtent(), 0.13);
    // minimap.setCenterAndZoom(latlngs[0], 16);

    // 2. 初始化完成！标记状态为 true
    full_mapInitialized = true;
    console.log('地图初始化完成，可调用 daohang()');

    frame.add(window['web_map_pan']);




}

// 大地图导航函数
function full_daohang(index) {
    // 3. 第一步：检查初始化状态和所有依赖变量
    if (!full_mapInitialized) {
        console.warn('地图未初始化完成，请等待后再调用 daohang()');
        return;
    }
    if (!full_marker || !new_full_polyline || !latlngs) {
        console.error('导航依赖的变量未初始化（marker/new_polyline/latlngs）');
        return;
    }

    // 4. 第二步：检查下标有效性（原逻辑保留）
    if (index < 0 || index >= latlngs.length) {
        console.error('下标超出范围（有效范围：0 ~ ' + (latlngs.length - 1) + '）');
        return;
    }

    // 5. 正常执行导航逻辑（原逻辑保留）
    const coordinates = latlngs[index];
    full_marker.setCoordinates(coordinates);
    // mini_marker.setCoordinates(coordinates);

    const polylineCoordinates = latlngs.slice(0, index + 1);
    new_full_polyline.setCoordinates(polylineCoordinates);
    // mini_new_polyline.setCoordinates(polylineCoordinates);

    // map.panTo(coordinates);
    // minimap.setCenter(coordinates);
    const mapCanvas = fullmap.querySelector("canvas");
    web_map_pan.children[0].context.drawImage(mapCanvas, 0, 0, web_map_pan.children[0].width, web_map_pan.children[0].height);
    web_map_pan.children[0].paint()
}

// 配置小地图
function mini_map_maptalks() {
    // 避免重复初始化
    if (mini_mapInitialized) {
        console.log('地图已初始化，无需重复创建');
        return;
    }

    // 检查坐标数组是否已初始化（避免后续操作空数组）
    if (!latlngs || latlngs.length === 0) {
        console.error('latlngs 坐标数组未初始化或为空，无法创建地图');
        return;
    }



    // 3. 初始化地图（默认加载 osmHot 图源）
    mini_map = new maptalks.Map(minimap, {
        center: [118.9, 33.8], // 初始中心点
        zoom: 16, // 初始缩放级别
        baseLayer: minidefaultTileLayer // 传入默认瓦片层
    });



    // 创建折线实例（全局变量赋值）
    mini_polyline = new maptalks.LineString(latlngs, {
        symbol: { 'lineColor': '#FFFF00', 'lineWidth': 5, 'lineOpacity': 0.9 }
    });

    // 导航折线（全局变量赋值）
    new_mini_polyline = new maptalks.LineString([], {
        symbol: { 'lineColor': '#FF8C00', 'lineWidth': 5, 'lineOpacity': 0.9 }
    });


    // 标记点（全局变量赋值）
    mini_marker = new maptalks.Marker(latlngs[0], {
        symbol: {
            'markerType': 'ellipse',
            'markerFill': '#FF6347',
            'markerFillOpacity': 0.9,
            'markerLineWidth': 0,
            'markerWidth': 15,
            'markerHeight': 15
        }
    });


    // 添加图层和几何对象
    const minilayer = new maptalks.VectorLayer('vector').addTo(mini_map);
    // const minilayer = new maptalks.VectorLayer('vector').addTo(minimap);
    minilayer.addGeometry(mini_polyline, new_mini_polyline, mini_marker);
    // minilayer.addGeometry(mini_polyline, mini_new_polyline, mini_marker);

    // 更新折线和视野
    mini_polyline.setCoordinates(latlngs);
    // mini_polyline.setCoordinates(latlngs);
    mini_map.setCenterAndZoom(latlngs[0], 16)
    // minimap.setCenterAndZoom(latlngs[0], 16);

    // 2. 初始化完成！标记状态为 true
    mini_mapInitialized = true;
    console.log('地图初始化完成，可调用 mini_daohang()');

    frame.add(window['web_minimap_pan']);




}

// 小地图导航函数
function mini_daohang(index) {
    // 3. 第一步：检查初始化状态和所有依赖变量
    if (!mini_mapInitialized) {
        console.warn('地图未初始化完成，请等待后再调用 mini_daohang()');
        return;
    }
    if (!mini_marker || !new_mini_polyline || !latlngs) {
        console.error('导航依赖的变量未初始化（mini_marker/new_mini_polyline/latlngs）');
        return;
    }

    // 4. 第二步：检查下标有效性（原逻辑保留）
    if (index < 0 || index >= latlngs.length) {
        console.error('下标超出范围（有效范围：0 ~ ' + (latlngs.length - 1) + '）');
        return;
    }

    // 5. 正常执行导航逻辑（原逻辑保留）
    const coordinates = latlngs[index];
    mini_marker.setCoordinates(coordinates);

    const polylineCoordinates = latlngs.slice(0, index + 1);
    new_mini_polyline.setCoordinates(polylineCoordinates);

    // map.panTo(coordinates);
    mini_map.setCenter(coordinates);
    const minimapCanvas = minimap.querySelector("canvas");
    web_minimap_pan.children[0].context.drawImage(minimapCanvas, 0, 0, web_minimap_pan.children[0].width, web_minimap_pan.children[0].height);
    web_minimap_pan.children[0].paint()
}

// 配置rotate地图
function rotate_map_maptalks() {
    // 避免重复初始化
    if (rotate_mapInitialized) {
        console.log('地图已初始化，无需重复创建');
        return;
    }

    // 检查坐标数组是否已初始化（避免后续操作空数组）
    if (!latlngs || latlngs.length === 0) {
        console.error('latlngs 坐标数组未初始化或为空，无法创建地图');
        return;
    }



    // 3. 初始化地图（默认加载 osmHot 图源）
    rotate_map = new maptalks.Map(rotatemap, {
        center: [118.9, 33.8], // 初始中心点
        zoom: 18, // 初始缩放级别
        pitch: 60,
        baseLayer: rotatedefaultTileLayer, // 传入默认瓦片层

    });



    // 创建折线实例（全局变量赋值）
    rotate_polyline = new maptalks.LineString(latlngs, {
        symbol: { 'lineColor': '#FFFF00', 'lineWidth': 5, 'lineOpacity': 0.9 }
    });

    // 导航折线（全局变量赋值）
    new_rotate_polyline = new maptalks.LineString([], {
        symbol: { 'lineColor': '#FF8C00', 'lineWidth': 5, 'lineOpacity': 0.9 }
    });


    // 标记点（全局变量赋值）
    rotate_marker = new maptalks.Marker(latlngs[0], {
        symbol: {
            'markerType': 'ellipse',
            'markerFill': '#FF6347',
            'markerFillOpacity': 0.9,
            'markerLineWidth': 0,
            'markerWidth': 15,
            'markerHeight': 15
        }
    });


    // 添加图层和几何对象
    const rotatelayer = new maptalks.VectorLayer('vector').addTo(rotate_map);
    // const minilayer = new maptalks.VectorLayer('vector').addTo(minimap);
    rotatelayer.addGeometry(rotate_polyline, new_rotate_polyline, rotate_marker);
    // minilayer.addGeometry(mini_polyline, mini_new_polyline, mini_marker);

    // 更新折线和视野
    rotate_polyline.setCoordinates(latlngs);
    // mini_polyline.setCoordinates(latlngs);
    rotate_map.setCenterAndZoom(latlngs[0], 16)
    // minimap.setCenterAndZoom(latlngs[0], 16);

    // 2. 初始化完成！标记状态为 true
    rotate_mapInitialized = true;
    console.log('地图初始化完成，可调用 rotate_daohang()');

    frame.add(window['web_rotatemap_pan']);




}

// 小地图导航函数
function rotate_daohang(index) {
    // 3. 第一步：检查初始化状态和所有依赖变量
    if (!rotate_mapInitialized) {
        console.warn('地图未初始化完成，请等待后再调用 mini_daohang()');
        return;
    }
    if (!rotate_marker || !new_rotate_polyline || !latlngs) {
        console.error('导航依赖的变量未初始化（mini_marker/new_mini_polyline/latlngs）');
        return;
    }

    // 4. 第二步：检查下标有效性（原逻辑保留）
    if (index < 0 || index >= latlngs.length) {
        console.error('下标超出范围（有效范围：0 ~ ' + (latlngs.length - 1) + '）');
        return;
    }

    // 5. 正常执行导航逻辑（原逻辑保留）
    const coordinates = latlngs[index];
    rotate_marker.setCoordinates(coordinates);

    const polylineCoordinates = latlngs.slice(0, index + 1);
    new_rotate_polyline.setCoordinates(polylineCoordinates);

    // map.panTo(coordinates);
    rotate_map.setCenter(coordinates);
    //appv_map_a_pan.children[2].rotation = trkpt_data[currentFrame].azimuth;
    rotate_map.setBearing(trkpt_data[index].azimuth);
    const rotatemapCanvas = rotatemap.querySelector("canvas");
    web_rotatemap_pan.children[0].context.drawImage(rotatemapCanvas, 0, 0, web_rotatemap_pan.children[0].width, web_rotatemap_pan.children[0].height);
    web_rotatemap_pan.children[0].paint()
}

// 配置rotate地图
function gaode_map_amap() {
    //检查是否是第一次转换
    if (gaode_latlngs.length == 0) {
        gaode_latlngs = batchWgs84ToGcj02(latlngs);
    }




    // 避免重复初始化
    if (gaode_mapInitialized) {
        console.log('地图已初始化，无需重复创建');
        return;
    }

    // 检查坐标数组是否已初始化（避免后续操作空数组）
    if (!gaode_latlngs || gaode_latlngs.length === 0) {
        console.error('gaode_latlngs 坐标数组未初始化或为空，无法创建地图');
        return;
    }



    // 3. 初始化地图（默认加载 osmHot 图源）
    gaode_map = new AMap.Map(gaodemap, {
        center: [118.9, 33.8], // 初始中心点
        zoom: 18, // 初始缩放级别
        zooms:[2,26],
        pitch: 45,
        rotation: (0 - trkpt_data[0].azimuth),
        viewMode:'3D', //开启3D视图,默认为关闭
        WebGLParams: {//允许截图
            preserveDrawingBuffer: true
        },


    });



    // 创建折线实例（全局变量赋值）
    gaode_polyline = new AMap.Polyline({
        path: gaode_latlngs,
        strokeColor: "#FFFF00",
        strokeOpacity: 0.9,
        strokeWeight: 5,
        // 折线样式还支持 'dashed'
        strokeStyle: "solid",
        lineJoin: 'round',
        lineCap: 'round',
      })

    // 导航折线（全局变量赋值）

    new_gaode_polyline = new AMap.Polyline({
        //path: [],
        strokeColor: "#FF8C00",
        strokeOpacity: 0.9,
        strokeWeight: 5,
        // 折线样式还支持 'dashed'
        strokeStyle: "solid",
        lineJoin: 'round',
        lineCap: 'round',
      })


    // 标记点（全局变量赋值）
    gaode_marker = new AMap.CircleMarker({
        center:gaode_latlngs[0],
        radius:15,//3D视图下，CircleMarker半径不要超过64px
        strokeWeight:0,
        fillColor:'#FF6347',
        fillOpacity:0.9,
      })


    // 添加图层和几何对象
    //const gaodelayer = new maptalks.VectorLayer('vector').addTo(gaode_map);
    // const minilayer = new maptalks.VectorLayer('vector').addTo(minimap);
    //gaodelayer.addGeometry(gaode_polyline, new_gaode_polyline, gaode_marker);
    // minilayer.addGeometry(mini_polyline, mini_new_polyline, mini_marker);
    gaode_map.add([gaode_polyline, new_gaode_polyline, gaode_marker]);



    // 更新折线和视野
    //gaode_polyline.setCoordinates(latlngs);
    // mini_polyline.setCoordinates(latlngs);
    gaode_map.setZoomAndCenter(20, gaode_latlngs[0])
    // minimap.setCenterAndZoom(latlngs[0], 16);

    // 2. 初始化完成！标记状态为 true
    gaode_mapInitialized = true;
    console.log('地图初始化完成，可调用 rgaode_daohang()');

    frame.add(window['web_gaodemap_pan']);




}

// 小地图导航函数
function gaode_daohang(index) {
    // 3. 第一步：检查初始化状态和所有依赖变量
    if (!gaode_mapInitialized) {
        console.warn('地图未初始化完成，请等待后再调用 mini_daohang()');
        return;
    }
    if (!gaode_marker || !new_gaode_polyline || !gaode_latlngs) {
        console.error('导航依赖的变量未初始化（mini_marker/new_mini_polyline/latlngs）');
        return;
    }

    // 4. 第二步：检查下标有效性（原逻辑保留）
    if (index < 0 || index >= gaode_latlngs.length) {
        console.error('下标超出范围（有效范围：0 ~ ' + (gaode_latlngs.length - 1) + '）');
        return;
    }

    // 5. 正常执行导航逻辑（原逻辑保留）
    const coordinates = gaode_latlngs[index];
    gaode_marker.setCenter(coordinates);

    const polylineCoordinates = gaode_latlngs.slice(0, index + 1);
    new_gaode_polyline.setPath(polylineCoordinates);

    // map.panTo(coordinates);
    gaode_map.setCenter(coordinates,true);
    //appv_map_a_pan.children[2].rotation = trkpt_data[currentFrame].azimuth;
    gaode_map.setRotation(0 - trkpt_data[index].azimuth,true);
    //console.log(gaode_map.getRotation(),trkpt_data[index].azimuth);
    const gaodemapCanvas = gaode_map.getContainer().querySelector('div.amap-layers > canvas');
    web_gaodemap_pan.children[0].context.drawImage(gaodemapCanvas, 0, 0, web_gaodemap_pan.children[0].width, web_gaodemap_pan.children[0].height);
    web_gaodemap_pan.children[0].paint()
}



// 4. 封装图源切换函数（核心：一键切换，自动刷新）
// 第一步：先定义「地图ID → 地图实例」的映射（新增！关键）
// 后续新增地图实例（如 mid_map），只需在这里添加映射即可


// 第二步：修改后的图源切换函数（新增 mapId 参数）
function switchMapSource(mapId, sourceId) {
    // 1. 校验地图ID是否存在（关键：找到要切换的地图实例）
    const targetMap = mapId;


    // 2. 校验图源ID是否存在（保留原逻辑）
    const targetConfig = mapSourceConfigs[sourceId];
    if (!targetConfig) {
        console.error(`不存在ID为${sourceId}的图源，请检查配置`);
        return;
    }

    // 3. 创建新的瓦片层（保留原逻辑）
    const newTileLayer = new maptalks.TileLayer(`${mapId}_${targetConfig.id}`, {

        ...targetConfig     // 展开目标图源配置
    });

    // 4. 替换对应地图的底图 + 刷新（核心：操作 targetMap 而非固定实例）
    targetMap.setBaseLayer(newTileLayer);
    setTimeout(() => {
        updateLeaferData(parseInt(maxFrame * 0.7));
    }, 300); // 500毫秒 = 0.5秒


    // 可选：打印详细日志（便于调试）
    console.log(`已为地图【${mapId}】切换图源至：${targetConfig.name}`);
}

