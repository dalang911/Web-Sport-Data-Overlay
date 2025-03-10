/**
 * GPX file parser
 *
 * @constructor
 */
let gpxParser = function () {
    this.xmlSource = "";
    this.metadata = {};
    this.waypoints = [];
    this.tracks = [];
    this.routes = [];
};

/**
 * Parse a gpx formatted string to a GPXParser Object
 * 将GPX格式的字符串解析为GPXParser对象
 * @param {string} gpxstring - A GPX formatted String GPX格式的字符串
 *
 * @return {gpxParser} A GPXParser object 一个GPXParser对象
 *
 */
gpxParser.prototype.parse = function (gpxstring) {
    let keepThis = this;

    let domParser = new window.DOMParser();
    this.xmlSource = domParser.parseFromString(gpxstring, 'text/xml');
    //无用
    let metadata = this.xmlSource.querySelector('metadata');
    if (metadata != null) {
        this.metadata.name = this.getElementValue(metadata, "name");
        this.metadata.desc = this.getElementValue(metadata, "desc");
        this.metadata.time = this.getElementValue(metadata, "time");

        //无用
        let author = {};
        let authorElem = metadata.querySelector('author');
        if (authorElem != null) {
            author.name = this.getElementValue(authorElem, "name");
            author.email = {};
            let emailElem = authorElem.querySelector('email');
            if (emailElem != null) {
                author.email.id = emailElem.getAttribute("id");
                author.email.domain = emailElem.getAttribute("domain");
            }

            let link = {};
            let linkElem = authorElem.querySelector('link');
            if (linkElem != null) {
                link.href = linkElem.getAttribute('href');
                link.text = this.getElementValue(linkElem, "text");
                link.type = this.getElementValue(linkElem, "type");
            }
            author.link = link;
        }
        this.metadata.author = author;
        //无用
        let link = {};
        let linkElem = this.queryDirectSelector(metadata, 'link');
        if (linkElem != null) {
            link.href = linkElem.getAttribute('href');
            link.text = this.getElementValue(linkElem, "text");
            link.type = this.getElementValue(linkElem, "type");
            this.metadata.link = link;
        }
    }
    //无用
    var wpts = [].slice.call(this.xmlSource.querySelectorAll('wpt'));
    for (let idx in wpts) {
        var wpt = wpts[idx];
        let pt = {};
        pt.name = keepThis.getElementValue(wpt, "name");
        pt.sym = keepThis.getElementValue(wpt, "sym");
        pt.lat = parseFloat(wpt.getAttribute("lat"));
        pt.lon = parseFloat(wpt.getAttribute("lon"));

        let floatValue = parseFloat(keepThis.getElementValue(wpt, "ele"));
        pt.ele = isNaN(floatValue) ? null : floatValue;

        pt.cmt = keepThis.getElementValue(wpt, "cmt");
        pt.desc = keepThis.getElementValue(wpt, "desc");

        let time = keepThis.getElementValue(wpt, "time");
        pt.time = time == null ? null : new Date(time);

        keepThis.waypoints.push(pt);
    }
    //无用
    var rtes = [].slice.call(this.xmlSource.querySelectorAll('rte'));
    for (let idx in rtes) {
        let rte = rtes[idx];
        let route = {};
        route.name = keepThis.getElementValue(rte, "name");
        route.cmt = keepThis.getElementValue(rte, "cmt");
        route.desc = keepThis.getElementValue(rte, "desc");
        route.src = keepThis.getElementValue(rte, "src");
        route.number = keepThis.getElementValue(rte, "number");

        let type = keepThis.queryDirectSelector(rte, "type");
        route.type = type != null ? type.innerHTML : null;

        let link = {};
        let linkElem = rte.querySelector('link');
        if (linkElem != null) {
            link.href = linkElem.getAttribute('href');
            link.text = keepThis.getElementValue(linkElem, "text");
            link.type = keepThis.getElementValue(linkElem, "type");
        }
        route.link = link;

        let routepoints = [];
        var rtepts = [].slice.call(rte.querySelectorAll('rtept'));

        for (let idxIn in rtepts) {
            let rtept = rtepts[idxIn];
            let pt = {};
            pt.lat = parseFloat(rtept.getAttribute("lat"));
            pt.lon = parseFloat(rtept.getAttribute("lon"));

            let floatValue = parseFloat(keepThis.getElementValue(rtept, "ele"));
            pt.ele = isNaN(floatValue) ? null : floatValue;

            let time = keepThis.getElementValue(rtept, "time");
            pt.time = time == null ? null : new Date(time);

            routepoints.push(pt);
        }

        route.distance = keepThis.calculDistance(routepoints);
        route.elevation = keepThis.calcElevation(routepoints);
        route.slopes = keepThis.calculSlope(routepoints, route.distance.cumul);
        route.points = routepoints;

        keepThis.routes.push(route);
    }

    var trks = [].slice.call(this.xmlSource.querySelectorAll('trk'));
    for (let idx in trks) {
        let trk = trks[idx];
        let track = {};

        track.name = keepThis.getElementValue(trk, "name");//运动名称
        track.cmt = keepThis.getElementValue(trk, "cmt");
        track.desc = keepThis.getElementValue(trk, "desc");
        track.src = keepThis.getElementValue(trk, "src");
        track.number = keepThis.getElementValue(trk, "number");

        let type = keepThis.queryDirectSelector(trk, "type");//运动类型，可能有
        track.type = type != null ? type.innerHTML : null;
        //无用
        let link = {};
        let linkElem = trk.querySelector('link');
        if (linkElem != null) {
            link.href = linkElem.getAttribute('href');
            link.text = keepThis.getElementValue(linkElem, "text");
            link.type = keepThis.getElementValue(linkElem, "type");
        }
        track.link = link;

        //分段数据
        trackpoints = [];
        let trkpts = [].slice.call(trk.querySelectorAll('trkpt'));//

        // 在循环外部声明prevTime变量，用于记录上一个时间
        let prevTimeStr = null;
        //循环
        for (let idxIn in trkpts) {
            var trkpt = trkpts[idxIn];
            //经纬度
            let pt = {};
            pt.lat = parseFloat(trkpt.getAttribute("lat"));//将这个值转换为浮点数parseFloat
            pt.lon = parseFloat(trkpt.getAttribute("lon"));
            //高程
            let floatValue = parseFloat(keepThis.getElementValue(trkpt, "ele"));
            if (isNaN(floatValue)) {
                pt.ele = null;
            } else {
                pt.ele = floatValue;
            }
            //当前时间
            let time = keepThis.getElementValue(trkpt, "time");
            // 处理时间的代码修改如下：
            let timeStr = keepThis.getElementValue(trkpt, "time").trim(); // 添加 .trim() 去除空格/换行符
            //pt.originalTime = timeStr;

            if (timeStr == null || timeStr === "") {
                pt.time = null;
                pt.timestamp = null;
            } else {
                pt.time = new Date(timeStr);
                pt.timestamp = pt.time.getTime();
            }

            // 修改判断条件为直接比较原始时间字符串
            if (prevTimeStr != null && timeStr === prevTimeStr) {
                console.log(`跳过重复时间点:`, timeStr);
                continue;
            }

            // 获取 hr 和 cad 的值
            let extensions = trkpt.querySelector('extensions');
            if (extensions) {
                // 尝试不同的命名空间前缀
                let trackPointExtension = extensions.querySelector('ns3\\:TrackPointExtension, gpxtpx\\:TrackPointExtension, TrackPointExtension');
                if (trackPointExtension) {
                    // 尝试获取心率值
                    let hrElement = trackPointExtension.querySelector('ns3\\:hr, gpxtpx\\:hr, hr');
                    pt.hr = hrElement && hrElement.textContent ? parseFloat(hrElement.textContent) : 0;

                    // 尝试获取踏频值
                    let cadElement = trackPointExtension.querySelector('ns3\\:cad, gpxtpx\\:cad, cad');
                    pt.cad = cadElement && cadElement.textContent ? parseFloat(cadElement.textContent) : 0;
                }

                // 尝试获取心率值
                let ghrElement = extensions.querySelector('gpxdata\\:hr,hr');
                if (ghrElement) {
                    pt.hr = ghrElement && ghrElement.textContent ? parseFloat(ghrElement.textContent) : 0;
                }

                // 尝试获取踏频值
                let gcadElement = extensions.querySelector('gpxdata\\:cadence,cadence');

                if (gcadElement) {
                    pt.cad = gcadElement && gcadElement.textContent ? parseFloat(gcadElement.textContent) : 0;
                }

                // 尝试获取距离值
                let gdistanceElement = extensions.querySelector('gpxdata\\:distance,distance');
                if (gdistanceElement) {
                    pt.distance = gdistanceElement && gdistanceElement.textContent ? parseFloat(gdistanceElement.textContent) : 0;
                }

                //尝试获取速度
                let gspeedElement = extensions.querySelector('gpxdata\\:speed,speed');
                //console.log(gspeedElement);
                if (gspeedElement) {
                    pt.speed = gspeedElement && gspeedElement.textContent ? parseFloat(gspeedElement.textContent) : 0;
                }
            }

            trackpoints.push(pt);
            prevTimeStr = timeStr; // 更新为当前时间字符串
        }
        //测试
        //console.log(trackpoints);

        track.distance = keepThis.calculDistance(trackpoints);//总距离，分段距离组

        track.elevation = keepThis.calcElevation(trackpoints);//高程数据，avg平均、max最大、min最小、neg下降、pos爬升
        track.slopes = keepThis.calculSlope(trackpoints, track.distance.cumul);//坡度，比数值少一个
        track.points = trackpoints;//经纬度组

        keepThis.tracks.push(track);
    }
};

/**
 * Get value from a XML DOM element 从XML DOM元素中获取值
 *
 * @param  {Element} parent - Parent DOM Element 父DOM元素
 * @param  {string} needle - Name of the searched element 要查找的元素名称
 *
 * @return {} The element value 元素的值
 */
gpxParser.prototype.getElementValue = function (parent, needle) {
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
gpxParser.prototype.queryDirectSelector = function (parent, needle) {

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
gpxParser.prototype.calculDistance = function (points) {
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
                totalDistance = trackpoints[i - 1].distance;
                cumulDistance[i] = trackpoints[i - 1].distance;
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
gpxParser.prototype.calcDistanceBetween = function (wpt1, wpt2) {
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
gpxParser.prototype.calcElevation = function (points) {
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
gpxParser.prototype.calculSlope = function (points, cumul) {
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
 * Export the GPX object to a GeoJSON formatted Object
 * 将GPX对象导出为GeoJSON格式的对象
 * @returns {} a GeoJSON formatted Object 一个GeoJSON格式的对象
 */
gpxParser.prototype.toGeoJSON = function () {
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
    module.exports = gpxParser;
}