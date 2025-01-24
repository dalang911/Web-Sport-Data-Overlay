/**
 * tcx file parser
 * 
 * @constructor
 */
let tcxParser = function () {
    this.xmlSource = "";
    this.metadata = {};
    this.waypoints = [];
    this.tracks = [];
    this.routes = [];
};

/**
 * Parse a tcx formatted string to a tcxParser Object
 * 将tcx格式的字符串解析为tcxParser对象
 * @param {string} tcxstring - A tcx formatted String tcx格式的字符串
 * 
 * @return {tcxParser} A tcxParser object 一个tcxParser对象
 *
 */
tcxParser.prototype.parse = function (tcxstring) {
    let keepThis = this;

    let domParser = new window.DOMParser();
    this.xmlSource = domParser.parseFromString(tcxstring, 'text/xml');
   

    // var trks = [].slice.call(this.xmlSource.querySelectorAll('Lap'));



    // //
    // var trks = [].slice.call(this.xmlSource.querySelectorAll('Lap'));
    // //console.log(trks);
    // for (let idx in trks) {
    //     let trk = trks[idx];
    let track = {};
        track.name = 'tcx file';//运动名称
        // track.cmt = keepThis.getElementValue(trk, "cmt");
        // track.desc = keepThis.getElementValue(trk, "desc");
        // track.src = keepThis.getElementValue(trk, "src");
        // track.number = keepThis.getElementValue(trk, "number");

        // let type = keepThis.queryDirectSelector(trk, "type");//运动类型，可能有
        // track.type = type != null ? type.innerHTML : null;
        // //无用
        // let link = {};
        // let linkElem = trk.querySelector('link');
        // if (linkElem != null) {
        //     link.href = linkElem.getAttribute('href');
        //     link.text = keepThis.getElementValue(linkElem, "text");
        //     link.type = keepThis.getElementValue(linkElem, "type");
        // }
        // track.link = link;

        //分段数据
        trackpoints = [];
        let trkpts = [].slice.call(this.xmlSource.querySelectorAll('Trackpoint'));//
        // console.log(trkpts);
        //循环
        for (let idxIn in trkpts) {
            var trkpt = trkpts[idxIn];
            //console.log(trkpt);
            //经纬度
            let pt = {};
            pt.lat = parseFloat(trkpt.querySelector("LatitudeDegrees").textContent);//将这个值转换为浮点数parseFloat
            pt.lon = parseFloat(trkpt.querySelector("LongitudeDegrees").textContent);
            //高程
            let floatValue = parseFloat(trkpt.querySelector("AltitudeMeters").textContent);
            if (isNaN(floatValue)) {
                pt.ele = null;
            } else {
                pt.ele = floatValue;
            }
            //当前时间
            let time = trkpt.querySelector("Time").textContent;
            if (time == null) {
                pt.time = null;
            } else {
                pt.time = new Date(time);
            }


                // 尝试获取心率值
                let ghrElement = trkpt.querySelector('Value');
                if (ghrElement) {
                    pt.hr = ghrElement && ghrElement.textContent ? parseFloat(ghrElement.textContent) : 0;
                }

                // 尝试获取踏频值
                let gcadElement = trkpt.querySelector('Cadence');

                if (gcadElement) {
                    pt.cad = gcadElement && gcadElement.textContent ? parseFloat(gcadElement.textContent) : 0;
                }

                // 尝试获取距离值
                let gdistanceElement = trkpt.querySelector('DistanceMeters');
                if (gdistanceElement) {
                    pt.distance = gdistanceElement && gdistanceElement.textContent ? parseFloat(gdistanceElement.textContent) : 0;
                }

            trackpoints.push(pt);
        }
        //测试
        //console.log(trackpoints);

        track.distance = keepThis.calculDistance(trackpoints);//总距离，分段距离组

        track.elevation = keepThis.calcElevation(trackpoints);//高程数据，avg平均、max最大、min最小、neg下降、pos爬升
        track.slopes = keepThis.calculSlope(trackpoints, track.distance.cumul);//坡度，比数值少一个
        track.points = trackpoints;//经纬度组

        keepThis.tracks.push(track);
    
};

/**
 * Get value from a XML DOM element 从XML DOM元素中获取值
 * 
 * @param  {Element} parent - Parent DOM Element 父DOM元素
 * @param  {string} needle - Name of the searched element 要查找的元素名称
 * 
 * @return {} The element value 元素的值
 */
tcxParser.prototype.getElementValue = function (parent, needle) {
    let elem = parent.querySelector(needle);
    if (elem != null) {
        return elem.innerHTML != undefined ? elem.innerHTML : elem.childNodes[0].data;
    }
    return elem;
};


/**
 * Search the value of a direct child XML DOM element 查找直接子XML DOM元素的值
 * 
 * @param  {Element} parent - Parent DOM Element 父DOM元素
 * @param  {string} needle - Name of the searched element 要搜索的元素名称
 * 
 * @return {} The element value 子元素的值 
 */
tcxParser.prototype.queryDirectSelector = function (parent, needle) {

    let elements = parent.querySelectorAll(needle);
    let finalElem = elements[0];

    if (elements.length > 1) {
        let directChilds = parent.childNodes;

        for (idx in directChilds) {
            elem = directChilds[idx];
            if (elem.tagName === needle) {
                finalElem = elem;
            }
        }
    }

    return finalElem;
};

/**
 * Calcul the Distance Object from an array of points 根据点数组计算距离对象
 * 
 * @param  {} points - An array of points with lat and lon properties 包含纬度和经度属性的点数组
 * 
 * @return {DistanceObject} An object with total distance and Cumulative distances 包含总距离和累积距离的对象
 */
tcxParser.prototype.calculDistance = function (points) {
    let distance = {};
    let totalDistance = 0;
    let cumulDistance = [];
    // 高驰，判断 trackpoints[0].distance 是否存在
    if (trackpoints.length > 0 && 'distance' in trackpoints[0]) {
        // 如果存在distance字段，则取用高驰数据
        for (var i = 0; i < trackpoints.length; i++) {
            if ('distance' in trackpoints[i]) {
                totalDistance = trackpoints[i].distance;
                cumulDistance[i] = trackpoints[i].distance;
            } else {//如果为空，取上一个值
                totalDistance = trackpoints[i-1].distance;
                cumulDistance[i] = trackpoints[i-1].distance;
            }
        }
        distance.total = totalDistance;
        distance.cumul = cumulDistance;
    } else {//经纬度计算
        for (var i = 0; i < points.length - 1; i++) {
            totalDistance += this.calcDistanceBetween(points[i], points[i + 1]);
            cumulDistance[i] = totalDistance;
        }
        cumulDistance[points.length - 1] = totalDistance;
        distance.total = totalDistance;
        distance.cumul = cumulDistance;
    }
    return distance;
};

/**
 * Calcul Distance between two points with lat and lon
 * 计算两个具有纬度和经度属性的地理点之间的距离
 * @param  {} wpt1 - A geographic point with lat and lon properties 具有纬度和经度属性的地理点1
 * @param  {} wpt2 - A geographic point with lat and lon properties 具有纬度和经度属性的地理点2
 * 
 * @returns {float} The distance between the two points 两个点之间的距离
 */
tcxParser.prototype.calcDistanceBetween = function (wpt1, wpt2) {
    let latlng1 = {};
    latlng1.lat = wpt1.lat;
    latlng1.lon = wpt1.lon;
    let latlng2 = {};
    latlng2.lat = wpt2.lat;
    latlng2.lon = wpt2.lon;
    var rad = Math.PI / 180,
        lat1 = latlng1.lat * rad,
        lat2 = latlng2.lat * rad,
        sinDLat = Math.sin((latlng2.lat - latlng1.lat) * rad / 2),
        sinDLon = Math.sin((latlng2.lon - latlng1.lon) * rad / 2),
        a = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon,
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return 6371000 * c;
};

/**
 * Generate Elevation Object from an array of points
 * 从点数组生成海拔对象
 * @param  {} points - An array of points with ele property 具有ele属性的点数组
 * 
 * @returns {ElevationObject} An object with negative and positive height difference and average, max and min altitude data 一个包含正负高度差和平均、最大、最小海拔数据的对象
 */
tcxParser.prototype.calcElevation = function (points) {
    var dp = 0,
        dm = 0,
        ret = {};

    for (var i = 0; i < points.length - 1; i++) {
        let rawNextElevation = points[i + 1].ele;
        let rawElevation = points[i].ele;

        if (rawNextElevation !== null && rawElevation !== null) {
            let diff = parseFloat(rawNextElevation) - parseFloat(rawElevation);

            if (diff < 0) {
                dm += diff;
            } else if (diff > 0) {
                dp += diff;
            }
        }
    }

    var elevation = [];
    var sum = 0;

    for (var i = 0, len = points.length; i < len; i++) {
        let rawElevation = points[i].ele;

        if (rawElevation !== null) {
            var ele = parseFloat(points[i].ele);
            elevation.push(ele);
            sum += ele;
        }
    }

    ret.max = Math.max.apply(null, elevation) || null;
    ret.min = Math.min.apply(null, elevation) || null;
    ret.pos = Math.abs(dp) || null;
    ret.neg = Math.abs(dm) || null;
    ret.avg = sum / elevation.length || null;

    return ret;
};

/**
 * Generate slopes Object from an array of Points and an array of Cumulative distance 
 * 从点数组和累积距离数组生成坡度对象
 * @param  {} points - An array of points with ele property 具有ele属性的点数组
 * @param  {} cumul - An array of cumulative distance 累积距离数组
 * 
 * @returns {SlopeObject} An array of slopes 坡度数组
 */
tcxParser.prototype.calculSlope = function (points, cumul) {
    let slopes = [];

    for (var i = 0; i < points.length - 1; i++) {
        let point = points[i];
        let nextPoint = points[i + 1];
        let elevationDiff = nextPoint.ele - point.ele;
        let distance = cumul[i + 1] - cumul[i];

        let slope = (elevationDiff * 100) / distance;
        slopes.push(slope);
    }

    return slopes;
};

/**
 * Export the tcx object to a GeoJSON formatted Object
 * 将tcx对象导出为GeoJSON格式的对象
 * @returns {} a GeoJSON formatted Object 一个GeoJSON格式的对象
 */
tcxParser.prototype.toGeoJSON = function () {
    var GeoJSON = {
        "type": "FeatureCollection",
        "features": [],
        "properties": {
            "name": this.metadata.name,
            "desc": this.metadata.desc,
            "time": this.metadata.time,
            "author": this.metadata.author,
            "link": this.metadata.link,
        },
    };

    for (idx in this.tracks) {
        let track = this.tracks[idx];

        var feature = {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": []
            },
            "properties": {
            }
        };

        feature.properties.name = track.name;
        feature.properties.cmt = track.cmt;
        feature.properties.desc = track.desc;
        feature.properties.src = track.src;
        feature.properties.number = track.number;
        feature.properties.link = track.link;
        feature.properties.type = track.type;

        for (idx in track.points) {
            let pt = track.points[idx];

            var geoPt = [];
            geoPt.push(pt.lon);
            geoPt.push(pt.lat);
            geoPt.push(pt.ele);

            feature.geometry.coordinates.push(geoPt);
        }

        GeoJSON.features.push(feature);
    }

    for (idx in this.routes) {
        let track = this.routes[idx];

        var feature = {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": []
            },
            "properties": {
            }
        };

        feature.properties.name = track.name;
        feature.properties.cmt = track.cmt;
        feature.properties.desc = track.desc;
        feature.properties.src = track.src;
        feature.properties.number = track.number;
        feature.properties.link = track.link;
        feature.properties.type = track.type;


        for (idx in track.points) {
            let pt = track.points[idx];

            var geoPt = [];
            geoPt.push(pt.lon);
            geoPt.push(pt.lat);
            geoPt.push(pt.ele);

            feature.geometry.coordinates.push(geoPt);
        }

        GeoJSON.features.push(feature);
    }

    for (idx in this.waypoints) {
        let pt = this.waypoints[idx];

        var feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": []
            },
            "properties": {
            }
        };

        feature.properties.name = pt.name;
        feature.properties.sym = pt.sym;
        feature.properties.cmt = pt.cmt;
        feature.properties.desc = pt.desc;

        feature.geometry.coordinates = [pt.lon, pt.lat, pt.ele];

        GeoJSON.features.push(feature);
    }

    return GeoJSON;
};

if (typeof module !== 'undefined') {
    require('jsdom-global')();
    module.exports = tcxParser;
}