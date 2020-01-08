module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/extension.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/connected-domain/index.js":
/*!************************************************!*\
  !*** ./node_modules/connected-domain/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__( /*! ./lib/connected-domain */ "./node_modules/connected-domain/lib/connected-domain.js" );

/***/ }),

/***/ "./node_modules/connected-domain/lib/connected-domain.js":
/*!***************************************************************!*\
  !*** ./node_modules/connected-domain/lib/connected-domain.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * calculate all the connected domains based on the given two-dimensional array
 */

/**
 * @param {Array} tdArray
 * @param {Function} indicator It receive the raw point data as the first parameter and decide what kind of domain the point belongs to, it should return a string as a domain identifier.
 * @param {Boolean} hardlink If use hard link. Default to false.
 * @return {Object} [{ bounding: { w: 12, h: 19, x: 0, y: 1 }, points: [ { x: 1, y: 2, point: {} } ], identifier: 'blue', domainId: 1 } ]
 */
module.exports = function( tdArray, indicator, hardlink ){

    hardlink = hardlink || false;

    if( !tdArray ){
        throw new Error( 'tdArray must be provided' );
    }

    if( !indicator ){
        throw new Error( 'indicator must be provided' );
    }

    // clone 一份数据，因为需要对饮用进行修改，方便执行
    tdArray = JSON.parse( JSON.stringify( tdArray ) );

    // Result
    var domains = {};
    var domainUUID = 0;
    var pointsHash = {};

    // 遍历数组，划分domain

    tdArray.forEach(function( row, y ){

        row.forEach(function( colItem, x ){

            // get the current point identifier.
            var identifier = indicator( colItem, x, y );

            // get neighbours
            // Except for Undefined every data type is valid.
            var neighbours = [];

            // top neighbour
            if( tdArray[ y - 1 ] && tdArray[ y - 1 ][ x ] !== undefined ){
                neighbours.push( pointsHash[ x + '_' + ( y - 1 ) ] );
            }

            // left neighbour
            if( row[ x - 1 ] !== undefined ){
                neighbours.push( pointsHash[ ( x - 1 ) + '_' + y ] );
            }

            // soft link will treat corner link as domain link.
            if( !hardlink ){
                // top left neighbour
                if( tdArray[ y - 1 ] && tdArray[ y - 1 ][ x - 1 ] !== undefined ){
                    neighbours.push( pointsHash[ ( x - 1 ) + '_' + ( y - 1 ) ] );
                }

                // top right neighbour
                if( tdArray[ y - 1 ] && tdArray[ y - 1 ][ x + 1 ] !== undefined ){
                    neighbours.push( pointsHash[ ( x + 1 ) + '_' + ( y - 1 ) ] );
                }
            }

            if( neighbours.length ){
                var matched = false;

                neighbours.forEach(function( neighbour ){

                    if( neighbour.identifier == identifier ){

                        // If the neighbour is the first neighbour has the same identifier
                        if( !matched ){
                            addPointToDomain( colItem, x, y, neighbour.domainId );
                            matched = true;
                        }

                        // If more than one neighbour matched, check if these neighbours belong to the same domain
                        // If not, merge these domains since they connects to each other.
                        else {
                            var colItemPoint = pointsHash[ x + '_' + y ];
                            if( neighbour.domainId != colItemPoint.domainId ){
                                mergeDomains( neighbour.domainId, colItemPoint.domainId );
                            }
                        }
                    }
                });

                if( !matched ){
                    addNewDomain( colItem, x, y, identifier );
                }
            }
            else {
                addNewDomain( colItem, x, y, identifier );
            }
        });
    });

    // some summary
    var result = {
        domains: [],
        totalDomains: 0,
        groupByIdentifier: {},
        totalIdentifiers: 0
    };

    var domainId = null;
    var identifier = null;
    var domain = null;
    for( domainId in domains ){
        domain = domains[ domainId ];
        domain.bounding = calculateBounding( domain.points );
        identifier = domain.identifier;

        result.domains.push( domain );
        result.totalDomains++;

        if( !( identifier in result.groupByIdentifier ) ){
            result.groupByIdentifier[ identifier ] = [];
            result.totalIdentifiers++;
        }

        result.groupByIdentifier[ identifier ].push( domain );
    }


    function calculateBounding( points ){

        var minX = null;
        var minY = null;
        var maxX = null;
        var maxY = null;

        points.forEach(function( point ){

            if( minX === null || point.x < minX ){
                minX = point.x;
            }

            if( minY === null || point.y < minY ){
                minY = point.y;
            }

            if( maxX === null || point.x > maxX ){
                maxX = point.x;
            }

            if( maxY === null || point.y > maxY ){
                maxY = point.y;
            }
        });

        var w = maxX - minX;
        var h = maxY - minY;

        return {
            x: minX,
            y: minY,
            w: w,
            h: h
        };
    }

    /**
     *
     * @param point
     * @param x
     * @param y
     * @param identifier
     */
    function addNewDomain( point, x, y, identifier ){

        var newDomain = {
            identifier: identifier,
            domainId: ++domainUUID,
            bounding: {},
            points: []
        };

        var newPoint = {
            value: point,
            x: x,
            y: y,
            identifier: identifier,
            domainId: newDomain.domainId
        };

        pointsHash[ x + '_' + y ] = {
            value: point,
            identifier: identifier,
            domainId: newDomain.domainId
        };

        newDomain.points.push( newPoint );

        domains[ newDomain.domainId ] = newDomain;
    }

    /**
     * add a point to a existing domain, and attach properties domainId and identifier to point.
     * @param point
     * @param x
     * @param y
     * @param domainId
     */
    function addPointToDomain( point, x, y, domainId ){

        var domain = domains[ domainId ];
        var newPoint = {
            value: point,
            x: x,
            y: y,
            identifier: domain.identifier,
            domainId: domainId
        };

        pointsHash[ x + '_' + y ] = {
            value: point,
            identifier: domain.identifier,
            domainId: domainId
        };

        domain.points.push( newPoint );
    }

    /**
     * 将 domainB 合并到 domainA
     * @param domainAId
     * @param domainBId
     */
    function mergeDomains( domainAId, domainBId ){

        var domainA = domains[ domainAId ];
        var domainB = domains[ domainBId ];

        if( domainA.identifier == domainB.identifier ){
            // 更新 domainB 的domainId

            domainB.domainId = domainA.domainId;

            domainB.points.forEach(function( point ){
                point.domainId = domainA.domainId;
                pointsHash[ point.x + '_' + point.y ].domainId = domainA.domainId;
            });

            domainA.points = domainA.points.concat( domainB.points );

            // 删除domainB
            delete domains[ domainBId ];
        }
    }

    return result;
};

/***/ }),

/***/ "./node_modules/ps-node/index.js":
/*!***************************************!*\
  !*** ./node_modules/ps-node/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib */ "./node_modules/ps-node/lib/index.js");


/***/ }),

/***/ "./node_modules/ps-node/lib/index.js":
/*!*******************************************!*\
  !*** ./node_modules/ps-node/lib/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ChildProcess = __webpack_require__(/*! child_process */ "child_process");
var IS_WIN = process.platform === 'win32';
var TableParser = __webpack_require__(/*! table-parser */ "./node_modules/table-parser/index.js");
/**
 * End of line.
 * Basically, the EOL should be:
 * - windows: \r\n
 * - *nix: \n
 * But i'm trying to get every possibilities covered.
 */
var EOL = /(\r\n)|(\n\r)|\n|\r/;
var SystemEOL = __webpack_require__(/*! os */ "os").EOL;

/**
 * Execute child process
 * @type {Function}
 * @param {String[]} args
 * @param {Function} callback
 * @param {Object=null} callback.err
 * @param {Object[]} callback.stdout
 */

var Exec = module.exports = exports = function (args, callback) {
  var spawn = ChildProcess.spawn;

  // on windows, if use ChildProcess.exec(`wmic process get`), the stdout will gives you nothing
  // that's why I use `cmd` instead
  if (IS_WIN) {

    var CMD = spawn('cmd');
    var stdout = '';
    var stderr = null;

    CMD.stdout.on('data', function (data) {
      stdout += data.toString();
    });

    CMD.stderr.on('data', function (data) {

      if (stderr === null) {
        stderr = data.toString();
      }
      else {
        stderr += data.toString();
      }
    });

    CMD.on('exit', function () {

      var beginRow;
      stdout = stdout.split(EOL);

      // Find the line index for the titles
      stdout.forEach(function (out, index) {
        if (out && typeof beginRow == 'undefined' && out.indexOf('CommandLine') === 0) {
          beginRow = index;
        }
      });

      // get rid of the start (copyright) and the end (current pwd)
      stdout.splice(stdout.length - 1, 1);
      stdout.splice(0, beginRow);

      callback(stderr, stdout.join(SystemEOL) || false);
    });

    CMD.stdin.write('wmic process get ProcessId,ParentProcessId,CommandLine \n');
    CMD.stdin.end();
  }
  else {
    if (typeof args === 'string') {
      args = args.split(/\s+/);
    }
    const child = spawn('ps', args);
    var stdout = '';
    var stderr = null;

    child.stdout.on('data', function (data) {
      stdout += data.toString();
    });

    child.stderr.on('data', function (data) {

      if (stderr === null) {
        stderr = data.toString();
      }
      else {
        stderr += data.toString();
      }
    });

    child.on('exit', function () {
      if (stderr) {
        return callback(stderr.toString());
      }
      else {
        callback(null, stdout || false);
      }
    });
  }
};

/**
 * Query Process: Focus on pid & cmd
 * @param query
 * @param {String|String[]} query.pid
 * @param {String} query.command RegExp String
 * @param {String} query.arguments RegExp String
 * @param {String|array} query.psargs
 * @param {Function} callback
 * @param {Object=null} callback.err
 * @param {Object[]} callback.processList
 * @return {Object}
 */

exports.lookup = function (query, callback) {

  /**
   * add 'lx' as default ps arguments, since the default ps output in linux like "ubuntu", wont include command arguments
   */
  var exeArgs = query.psargs || ['lx'];
  var filter = {};
  var idList;

  // Lookup by PID
  if (query.pid) {

    if (Array.isArray(query.pid)) {
      idList = query.pid;
    }
    else {
      idList = [query.pid];
    }

    // Cast all PIDs as Strings
    idList = idList.map(function (v) {
      return String(v);
    });

  }


  if (query.command) {
    filter['command'] = new RegExp(query.command, 'i');
  }

  if (query.arguments) {
    filter['arguments'] = new RegExp(query.arguments, 'i');
  }

  if (query.ppid) {
    filter['ppid'] = new RegExp(query.ppid);
  }

  return Exec(exeArgs, function (err, output) {
    if (err) {
      return callback(err);
    }
    else {
      var processList = parseGrid(output);
      var resultList = [];

      processList.forEach(function (p) {

        var flt;
        var type;
        var result = true;

        if (idList && idList.indexOf(String(p.pid)) < 0) {
          return;
        }

        for (type in filter) {
          flt = filter[type];
          result = flt.test(p[type]) ? result : false;
        }

        if (result) {
          resultList.push(p);
        }
      });

      callback(null, resultList);
    }
  });
};

/**
 * Kill process
 * @param pid
 * @param {Object|String} signal
 * @param {String} signal.signal
 * @param {number} signal.timeout
 * @param next
 */

exports.kill = function( pid, signal, next ){
  //opts are optional
  if(arguments.length == 2 && typeof signal == 'function'){
    next = signal;
    signal = undefined;
  }

  var checkTimeoutSeconds = (signal && signal.timeout) || 30;

  if (typeof signal === 'object') {
    signal = signal.signal;
  }

  try {
    process.kill(pid, signal);
  } catch(e) {
    return next && next(e);
  }

  var checkConfident = 0;
  var checkTimeoutTimer = null;
  var checkIsTimeout = false;

  function checkKilled(finishCallback) {
    exports.lookup({ pid: pid }, function(err, list) {
      if (checkIsTimeout) return;

      if (err) {
        clearTimeout(checkTimeoutTimer);
        finishCallback && finishCallback(err);
      } else if(list.length > 0) {
        checkConfident = (checkConfident - 1) || 0;
        checkKilled(finishCallback);
      } else {
        checkConfident++;
        if (checkConfident === 5) {
          clearTimeout(checkTimeoutTimer);
          finishCallback && finishCallback();
        } else {
          checkKilled(finishCallback);
        }
      }
    });
  }

  next && checkKilled(next);

  checkTimeoutTimer = next && setTimeout(function() {
    checkIsTimeout = true;
    next(new Error('Kill process timeout'));
  }, checkTimeoutSeconds * 1000);
};

/**
 * Parse the stdout into readable object.
 * @param {String} output
 */

function parseGrid(output) {
  if (!output) {
    return [];
  }
  return formatOutput(TableParser.parse(output));
}

/**
 * format the structure, extract pid, command, arguments, ppid
 * @param data
 * @return {Array}
 */

function formatOutput(data) {
  var formatedData = [];
  data.forEach(function (d) {
    var pid = ( d.PID && d.PID[0] ) || ( d.ProcessId && d.ProcessId[0] ) || undefined;
    var cmd = d.CMD || d.CommandLine || d.COMMAND || undefined;
    var ppid = ( d.PPID && d.PPID[0] ) || ( d.ParentProcessId && d.ParentProcessId[0] ) || undefined;

    if (pid && cmd) {
      var command = cmd[0];
      var args = '';

      if (cmd.length > 1) {
        args = cmd.slice(1);
      }

      formatedData.push({
        pid: pid,
        command: command,
        arguments: args,
        ppid: ppid
      });
    }
  });

  return formatedData;
}


/***/ }),

/***/ "./node_modules/table-parser/index.js":
/*!********************************************!*\
  !*** ./node_modules/table-parser/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__( /*! ./lib/index */ "./node_modules/table-parser/lib/index.js" );

/***/ }),

/***/ "./node_modules/table-parser/lib/index.js":
/*!************************************************!*\
  !*** ./node_modules/table-parser/lib/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 *
 * 1, define the edge ( begin and end ) of every title field
 * 2, parse all the lines except the title line, get all the connected-domains
 * 3, group all the connected-domains vertically overlapped.
 * 4, a domain group belongs to a title field if they vertically overlapped
 * 5, calculate all the edge info through the group domain and title field relations.
 */
var ConnectedDomain = __webpack_require__(/*! connected-domain */ "./node_modules/connected-domain/index.js");
var EMPTY_EX = /\s/;

/**
 * The output sting of cmd to parse
 * @param output
 * @returns {Array}
 */
module.exports.parse = function (output) {

  // Split into lines
  // Basically, the EOL should be:
  // - windows: \r\n
  // - *nix: \n
  // But i'm trying to get every possibilities covered.
  var linesTmp = output.split(/(\r\n)|(\n\r)|\n|\r/);

  // valid lines
  var lines = [];
  // title field info, mapped with filed name.
  var titleInfo = {};
  // the two dimensional array of the lines
  var twoDimArray = [];

  // get rid of all the empty lines.
  linesTmp.forEach(function (line) {
    if (line && line.trim()) {
      lines.push(line);
    }
  });

  // build title fields edge info
  // build two dimensional array for Connected-Domain to parse.
  lines.forEach(function (line, index) {

    // Treat the first line as the title fields line
    if (index == 0) {
      var fields = line.split(/\s+/);

      // record the beginning and ending for each field
      fields.forEach(function (field, idx) {

        if (field) {
          var info = titleInfo[field] = {};
          var indexBegin = line.indexOf(field);
          var indexEnd = indexBegin + field.length;

          if (idx == 0) {
            info.titleBegin = 0;
          }
          else {
            info.titleBegin = indexBegin;
          }

          if (idx == fields.length - 1) {
            info.titleEnd = line.length - 1;
          }
          else {
            info.titleEnd = indexEnd;
          }
        }
      });
    }
    else {
      twoDimArray[index - 1] = line.split('');
    }
  });

  // In the connected-domain aspect of view, all the blanks are connected, and all the non-blanks are connected.
  var connectedDomains = ConnectedDomain(twoDimArray, function (value) {
    if (EMPTY_EX.test(value)) {
      return -1;
    }
    else {
      return 1;
    }
  }, true);

  // all the connected domains grouped if they are vertically overlapped.
  var valuesDomainsVerticalGroups = [];

  // sore the domain list make 'x' in ascending order, it will prevent the situation that:
  // 1, two domains are not overlapped, so two groups are created for them at first
  // 2, another domain is found overlapped with both of the domains at the first step.
  // 3, In this situation the three groups have to be merged, which is complicated to implement.
  //
  // If the list is sorted in this order, this situation can't happen, because:
  // - 1, If two non-overlapped domains A, B ( the "x" value of A less than B ) are found first.
  // - 2, Since the list is in 'x' ascending order, the 'x' values of the following domains must larger or equal to the "x" of B, which means they will never overlapped with domain A.
  // - 3, So this situation can't happen.
  connectedDomains.domains.sort(function (a, b) {
    return a.bounding.x - b.bounding.x;
  });

  // Group domains vertically overlapped.
  connectedDomains.domains.forEach(function (domain) {
    // only handle un-empty domain
    if (domain.identifier === 1) {
      var overlapped = false;

      // If overlapped
      valuesDomainsVerticalGroups.forEach(function (group) {
        var bounding = domain.bounding;
        var left = bounding.x;
        var right = bounding.x + bounding.w;

        if (overlap(left, right, group.begin, group.end)) {

          overlapped = true;
          group.domains.push(domain);
          group.begin = group.begin > left ? left : group.begin;
          group.end = group.end < right ? right : group.end;
        }
      });

      // If not overlapped with any group, then create a new group
      if (!overlapped) {
        valuesDomainsVerticalGroups.push({
          begin: domain.bounding.x,
          end: domain.bounding.x + domain.bounding.w,
          domains: [domain]
        });
      }
    }
  });

  // connect all the groups to the title fields
  valuesDomainsVerticalGroups.forEach(function (group) {
    var title = null;
    var info = null;
    var overlapped = false;

    var minimunLeftDistance = null;
    var nearestLeftTitle = null;
    var distance = null;

    for (title in titleInfo) {
      info = titleInfo[title];

      /**
       * The calculation below is to find the nearest left title field to the group, in case no overlapped title field found.
       */
      if (group.begin > info.titleBegin) {
        distance = group.begin - info.titleBegin;

        if (!nearestLeftTitle || ( distance < minimunLeftDistance )) {
          nearestLeftTitle = title;
          minimunLeftDistance = distance;
        }
      }

      if (overlap(group.begin, group.end, info.titleBegin, info.titleEnd)) {

        overlapped = true;
        info.titleBegin = info.titleBegin > group.begin ? group.begin : info.titleBegin;
        info.titleEnd = info.titleEnd < group.end ? group.end : info.titleEnd;
      }
    }

    // Groups not match any title field belongs to the nearest left title field
    if (!overlapped && nearestLeftTitle) {
      var nearestTitleField = titleInfo[nearestLeftTitle];
      nearestTitleField.titleBegin = nearestTitleField.titleBegin > group.begin ? group.begin : nearestTitleField.titleBegin;
      nearestTitleField.titleEnd = nearestTitleField.titleEnd < group.end ? group.end : nearestTitleField.titleEnd;

    }
  });

  // The final result
  var result = [];

  // Since we have got all the title bounding edges, we can split all the lines into values now
  lines.forEach(function (line, index) {
    // skip the first line
    if (index > 0) {

      var lineItem = {};
      var title = null;
      var info = null;
      var value = null;
      for (title in titleInfo) {
        info = titleInfo[title];
        value = line.substring(info.titleBegin, info.titleEnd + 1);
        lineItem[title] = splitValue(value.trim());
      }

      result.push(lineItem);
    }
  });

  return result;
};

/**
 * Test if two bounding overlapped vertically
 * @param begin1
 * @param end1
 * @param begin2
 * @param end2
 * @returns {boolean}
 */
function overlap(begin1, end1, begin2, end2) {
  return ( begin1 > begin2 && begin1 < end2 ) || // 2--1--2--1 or 2--1--1--2
    ( end1 > begin2 && end1 < end2 ) ||     // 1--2--1--2 or 2--1--1--2
    ( begin1 <= begin2 && end1 >= end2 );// 21--12 or 1--2--2--1
}

/**
 * transform a string value into array. It's not just split(), but also to consider some chunk that wrapped with `"`, like below:
 *      "C:\Program Files\Google\Chrome\Application\chrome.exe" --type=renderer --lang=zh-CN, `C:\Program Files\Google\Chrome\Application\chrome.exe` should be treated as a whole,
 *      also, be careful don't be mislead by format like `--name="neekey"`, even more complicated: `--name="Neekey Ni"`
 * so, `"C:\Program Files\Internet Explorer\iexplore.exe" --name="Jack Neekey"` should split into:
 *  - C:\Program Files\Internet Explorer\iexplore.exe  // without `"`
 *  - --name="Jack Neekey"                             // with `"`
 */
function splitValue(value) {

  var match = value.match(/"/g);

  // If only one " found, then just ignore it
  if (!match || match.length == 1) {
    return value.split(/\s+/);
  }
  else {
    var result = [];
    var chunk = null;
    var ifInWrappedChunk = false;
    var ifInPureWrappedChunk = false;
    var quotaCount = 0;

    // If the match length is a even, than nothing special, if a odd, ignore the last one.
    var maxQuotaCount = match.length % 2 == 0 ? match.length : match.length - 1;

    var previousItem = null;
    var values = value.split('');

    values.forEach(function (item, index) {

      if (item !== ' ') {

        if (item === '"') {
          // quota chunk begin
          if (ifInWrappedChunk === false && quotaCount <= maxQuotaCount) {
            ifInWrappedChunk = true;
            quotaCount++;

            // pure quota chunk begin
            if (previousItem === ' ' || previousItem === null) {
              ifInPureWrappedChunk = true;
              chunk = '';
            }
            // normal continue
            else {
              chunk += item;
            }
          }
          // quota chunk end
          else if (ifInWrappedChunk === true) {
            ifInWrappedChunk = false;
            quotaCount++;

            // pure quota chunk end
            if (ifInPureWrappedChunk === true) {
              ifInPureWrappedChunk = false;
              result.push(chunk);
              chunk = null;
            }
            // normal continue
            else {
              chunk += item;
            }
          }
        }
        // normal begin
        else if (ifInWrappedChunk === false && ( previousItem === ' ' || previousItem === null )) {
          chunk = item;
        }
        // normal or quota chunk continue.
        else {
          chunk += item;
        }
      }
      // quota chunk continue, in quota chunk, blank is valid.
      else if (ifInWrappedChunk) {
        chunk += item;
      }
      // if not in quota chunk, them a blank means an end. But make sure chunk is exist, cause that could be blanks at the beginning.
      else if (chunk !== null) {
        result.push(chunk);
        chunk = null;
      }

      previousItem = item;

      // If this is the last one, but chunk is not end
      if (index == ( values.length - 1 ) && chunk !== null) {
        result.push(chunk);
        chunk = null;
      }
    });

    return result;
  }
}


/***/ }),

/***/ "./src/extension.ts":
/*!**************************!*\
  !*** ./src/extension.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(/*! vscode */ "vscode");
const url_1 = __webpack_require__(/*! url */ "url");
const path = __webpack_require__(/*! path */ "path");
const fs = __webpack_require__(/*! fs */ "fs");
const ps = __webpack_require__(/*! ps-node */ "./node_modules/ps-node/index.js");
const child_process = __webpack_require__(/*! child_process */ "child_process");
// import { Channel, ChannelHandler } from '@storybook/channels';
// import createChannel from "@storybook/channel-websocket"
// import * as WebSocket from 'ws';
// import { TreeViewProvider, StoryObject, Story } from "./treeviewProvider"
// import { QuickPickProvider, StorySelection } from "./quickpickProvider"
// const g = global as any;
// g.WebSocket = WebSocket;
// let storybooksChannel: any;
// let establishedConnection : boolean = false;
/* EXPRESS SERVER & DEPENDENCY

import * as express from 'express';
import { resolveCliPathFromVSCodeExecutablePath } from 'vscode-test';
const server = express();

*/
/*
    class AesopPanel implements vscode.WebviewPanel {
        viewType
        title: string = 'Aesop'
        webview: vscode.Webview = new AesopWebview
        options: {retainContextWhenHidden: true}
        viewColumn: vscode.ViewColumn.Beside
        active: boolean = true
        visible: boolean = true
        onDidChangeViewState
        onDidDispose
        reveal
    }

    class AesopWebview implements vscode.Webview{
        asWebviewUri: any
        onDidReceiveMessage: any
        postMessage: any
        cspSource: any
        html: string =
        `<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Aesop</title>
            </head>
            <body>
                <iframe src="http://${host}:${PORT}/?path=/story/welcome--to-storybook></iframe>
            </body>
        </html>`
        options: vscode.WebviewOptions = new AesopWVOptions
    }

    class AesopWVOptions implements vscode.WebviewOptions{
        enableCommandUris: boolean = true
        enableScripts: boolean = true
        portMapping: [{
            webviewPort: number,
            extensionHostPort: number
        }]
    }

vscode.tasks.registerTaskProvider('runStorybook', {
    provideTasks(token?: vscode.CancellationToken) {
            return [
                    new vscode.Task({type: 'runStorybook'}, vscode.TaskScope.Workspace,
                            "Aesop Chronicle", "aesop", new vscode.ShellExecution(`npm run storybook --ci`))
            ];
    },
    resolveTask(task: vscode.Task, token?: vscode.CancellationToken) {
            return task;
    }
});

//define the script text to execute to the virtual terminal instance
const bootScript = `storybook --ci`;
const bootStorybook = new vscode.ProcessExecution(bootScript, {cwd: rootDir});

//now create a virtual terminal and execute our special npm script for it
//this first requires creating an eventEmitter that will fire that script
const scriptEmitter = new vscode.EventEmitter<string>();

//we also define a slave process Pseudoterminal (allowing Aesop to control the terminal)
const pty: vscode.Pseudoterminal = {
    onDidWrite: scriptEmitter.event,
    open: () =>	scriptEmitter.fire(bootScript),
    close: () => {},
    handleInput: data => new vscode.ShellExecution(data)
};

//should this just be an active terminal/shellExecution?
const virtualTerminal = vscode.window.createTerminal({name: 'sb-runner', pty});

//THIS WORKS, but we have no access to the DOM inside our webview//
//now let's read SB's outputted index.html file, and parse out what we need
    fs.readFile(path.join(rootDir, '/node_modules/@storybook/core/dist/public/index.html'), (err, data) => {
        if (err) console.error(err);
        else {
            let pulledHTML = data.toString();
            let targetPoint = pulledHTML.indexOf('</body>');
            let firstHalf = pulledHTML.slice(0, targetPoint);
            let secondHalf = pulledHTML.slice(targetPoint);
            pulledHTML = firstHalf.concat(payloadScript).concat(secondHalf);
            fs.writeFile(path.join(rootDir, '/node_modules/@storybook/core/dist/public/index.html'), pulledHTML, (err) => {
                if (err) console.error(err);
                else {
                    vscode.window.showInformationMessage('Successfully injected script');
                };
            });
        }
    });

//declare an empty array (of strings) to push our scripts to during the next part
    const scriptArray : Array<string> = [];
    //define a path to the root working directory of the user
    const rootDir = fileURLToPath(vscode.workspace.workspaceFolders[0].uri.toString(true));
    //now let's read SB's outputted index.html file, and parse out what we need
    fs.readFile(path.join(rootDir, '/node_modules/@storybook/core/dist/public/index.html'), (err, data) => {
        if (err) console.error(err);
        else {
            //if we've read the HTML file, take its contents and stringify it
            let outputFile = data.toString();
            // this log shows what our eventual permutations would look like as we carve out the scripts
            // vscode.window.showWarningMessage(`what's in it: ${outputFile.slice(outputFile.indexOf('<body>')+6, outputFile.indexOf('</body>'))} \n`)
            //split out the body section of the retrieved html file
            outputFile = outputFile.slice(outputFile.indexOf('<body>')+6, outputFile.indexOf('</body>'));
            vscode.window.showWarningMessage(`${outputFile} \n`)

            //this loop will peel out all the scripts so long as there are any to rip out
            while (outputFile.includes(`"<script src=`)){
                //we push just what we need (the src attributes), leaving the <script>...</script> tags behind
                let temp = outputFile.slice(outputFile.indexOf(`<script src="`)+12, outputFile.indexOf(`"></script>`));
                scriptArray.push(temp);
                outputFile = outputFile.slice(outputFile.indexOf(`"></script>`)+10);
            }
        };
    });

<div id="root"></div>
<div id="docs-root"></div>
<div id="scriptExecute">
<script>window.acquireVsCodeApi = acquireVsCodeApi();</script>
<script>window['DOCS_MODE'] = false;</script>
<script>
    ${
        scriptArray.map( (el) => {
            if (el.includes("./sb_dll")){
                let uiScript = document.createElement("script");
                uiScript.async = true;
                uiScript.defer = true;
                uiScript.referrerPolicy = "origin";
                uiScript.src = path.join(rootDir, `/node_modules/@storybook/core/dll/${el}`);
                document.getElementById("scriptExecute").appendChild(uiScript);
            }	else {
                let capturedScript = document.createElement("script");
                capturedScript.async = true;
                capturedScript.defer = true;
                capturedScript.referrerPolicy = "origin";
                capturedScript.src = path.join(rootDir, `/node_modules/@storybook/core/dist/public/${el}`);
                document.getElementById("scriptExecute").appendChild(capturedScript);
            }
        })
    }
</script>
</div>

disposable = vscode.commands.registerCommand('extension.getStories', () => {
    build a command that retrieves Storybook files on startup
    can be executed later if Storybook server is spun up after the extension opens
    
    also register this command at startup to crawl the file path
    ${vscode.commands.executeCommand('extension.getStories')}
    vscode.window.showInformationMessage('Aesop is reading from your Storybook.');

    define a path to SB webpack bundle outputs (in user workspace /node_modules/ folder)
    if (vscode.workspace.workspaceFolders[0] !== undefined){
        const distGlob = new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], "**(remove)/node_modules/@storybook/core/dist/public");
        //instantiate a watcher to listen for fs path changes (e.g. file creation/update)
        //bools = options for ignoreCreateEvents?, ignoreChangeEvents?, ignoreDeleteEvents?
        const observer = vscode.workspace.createFileSystemWatcher(distGlob, false, false, false);
        // observer.onDidChange = //resolve//;		// observer.onDidCreate = //resolve//;
        //extract index.html file that outputs into SB's preview pane
        const htmlGlob = new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], "*(remove)/node_modules/@storybook/core/dist/public/*.html");
        //extract necessary bundle scripts to leverage in-app dependencies
        const scriptGlob = new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], "*(remove)/node_modules/@storybook/core/dist/public/*.js");

        console.log(vscode.Uri.file(fileURLToPath(`/node_modules/@storybook/core/dist/public`)));

        //do we need to resolve the Storybook UI script from the /dll/ folder?
        //if extract methods above fail, determine logic to parse out HTML/.js scripts (index 0?);
        //retrieve files with findFiles/relativeFilePath
        const arrayOfScripts = vscode.workspace.findFiles(distGlob, null, 100);
        //dev check: have we successfully pulled down script files?
        //if so, should we then store them locally, or is there no point?
        if (arrayOfScripts !== undefined){
            vscode.window.showInformationMessage("Hey, dog: " + `${arrayOfScripts}`);
        }

        vscode.window.showInformationMessage(`
        rootPath: ${vscode.workspace.workspaceFolders[0]},
        vscode.Uri: ${vscode.Uri},
        workspace: ${vscode.workspace},
        distGlob: ${distGlob.toString()},
        htmlGlob: ${htmlGlob.toString()},
        scriptGlob: ${scriptGlob.toString()}
        `);
    };

    vscode.window.showInformationMessage(`
        rootPath: ${vscode.workspace.workspaceFolders[0].uri.toString()},\n
        vscode URI parseTest: ${vscode.Uri.parse('file://'+ '/node_modules/@storybook/core/dist/public/index.html')},\n
        vscode URI parsed w escape: ${vscode.Uri.parse('file://'+ '/node_modules/\@storybook/core/dist/public/index.html')},\n
        vscode URI  file Test: ${vscode.Uri.file('node_modules/@storybook/core/dist/public/index.html')}
        `);
        
    console.log(`
    rootPath: ${vscode.workspace.workspaceFolders[0]},
    vscode.Uri: ${vscode.Uri},
    workspace: ${vscode.workspace},
    fileSys: ${vscode.Uri.file(path.join('/'))}`);
});

vscode.tasks.registerTaskProvider('runStorybook', {
    provideTasks(token?: vscode.CancellationToken) {
            return [
                    new vscode.Task({type: 'runStorybook'}, vscode.TaskScope.Workspace,
                            "Aesop Chronicle", "aesop", new vscode.ShellExecution(`npm run storybook --ci`))
            ];
    },
    resolveTask(task: vscode.Task, token?: vscode.CancellationToken) {
            return task;
    }
});

//define the script text to execute to the virtual terminal instance
const bootScript = `storybook --ci`;
const bootStorybook = new vscode.ProcessExecution(bootScript, {cwd: rootDir});

//now create a virtual terminal and execute our special npm script for it
//this first requires creating an eventEmitter that will fire that script
const scriptEmitter = new vscode.EventEmitter<string>();

//we also define a slave process Pseudoterminal (allowing Aesop to control the terminal)
const pty: vscode.Pseudoterminal = {
    onDidWrite: scriptEmitter.event,
    open: () =>	scriptEmitter.fire(bootScript),
    close: () => {},
    handleInput: data => new vscode.ShellExecution(data)
};

//should this just be an active terminal/shellExecution?
const virtualTerminal = vscode.window.createTerminal({name: 'sb-runner', pty});
*/
/* ALTERNATE APPROACH W/O PS-NODE LIBRARY

    export async function isProcessRunning(processName: string): Promise<boolean> {
    const cmd = (() => {
        switch (process.platform) {
            case 'win32': return `tasklist`
            case 'darwin': return `ps -ax | grep ${processName}`
            case 'linux': return `ps -A`
            default: return false
        }
    })()

    return new Promise((resolve, reject) => {
        require('child_process').exec(cmd, (err: Error, stdout: string, stderr: string) => {
            if (err) reject(err)

            resolve(stdout.toLowerCase().indexOf(processName.toLowerCase()) > -1)
        })
    })
}
const running: boolean = await isProcessRunning('myProcess')

*/
/* EXPRESS SERVER

    server.get('/', (req, res) => {
        vscode.window.showInformationMessage('Aesop server online');
        res.end();
    });
    server.listen(PORT);

*/
/*
//we need this to interface with/emit events to the storybook-channels websocket library
let previewUri = vscode.Uri.parse("storybook://authority/preview")

class WebviewHTMLProvider implements vscode.TextDocumentContentProvider {
    public provideTextDocumentContent(uri: vscode.Uri): string {
        //do we need to pass these arguments to the webviewprovider from our processes?
        //https://code.visualstudio.com/api/references/vscode-api#WorkspaceConfiguration
        //UPDATE configuration when found

        //'PORT' and 'host' have defaults configured manually in the package.json
        const port = vscode.workspace.getConfiguration("aesop").get("port")
        const host = vscode.workspace.getConfiguration("aesop").get("host")

        //this return value is what would normally get popped into the preview --> /?path=/story/${storyUri}
        return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Aesop</title>
                <style>
                iframe {
                    position: fixed;
                    border: none;
                    padding: 0;
                    margins: 0;
                    width: 100%;
                    height: 100%;
                }
            </style>
            </head>
            <body>
                <iframe src="http://${host}:${port}></iframe>
            </body>
        </html>`
    }
}

let provider = new WebviewHTMLProvider();
let webviewHTMLRegistration = vscode.workspace.registerTextDocumentContentProvider("storybook", provider);

//"storybook" is the scheme here; where is that defined? contributes?
const storyTreeViewProvider = new TreeViewProvider();
vscode.window.registerTreeDataProvider("storybook", storyTreeViewProvider);
const pickerProvider = new QuickPickProvider(storyTreeViewProvider);

let previewDisposable = vscode.commands.registerCommand("extension.showStorybookPreview", () => {
    //maybe we can use a blank webview and REASSIGN its html each time with a boilerplate HTML file and an iframe spot for the html fired at previewHtml here

    return vscode.commands.executeCommand("vscode.previewHtml", previewUri, vscode.ViewColumn.Two, "Storybooks").then(
  success => {},
  //should really (by convention) use a .catch() method for the error (call it "error", not "reason")
  reason => {
    vscode.window.showErrorMessage(reason)
  }
)
})

context.subscriptions.push(previewDisposable, webviewHTMLRegistration);

storybooksChannel = createChannel({ url: `ws://${host}:${port}`, async: true, onError: () => {} })

//declares variables with no initial value, reassigns at each request
var currentKind: string = null
var currentStory: string = null
var currentStoryId: string = null

// Create a statusbar item to reconnect, when we lose connection
const reconnectStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
reconnectStatusBarItem.command = "extension.restartConnectionToStorybooks"
if (establishedConnection) {
reconnectStatusBarItem.text = "Reconnect Storybooks"
reconnectStatusBarItem.color = "#FF8989"
} else {
reconnectStatusBarItem.text = "Connect to Storybooks"
}

reconnectStatusBarItem.hide()

// when we (re-)connect to Storybook's server, pass the WS connection to this func, so callbacks can occur on new socket connection

const registerCallbacks = channel => {

// Called when we first get stories from the Storybook server
// may have to add logic that executes a getStories command after the webview has been served up by the primary Aesop Awaken function
//setStories is a method defined on the websocket connection

channel.on("setStories", data => {
  //this configuration exists in package.json, and defines a filter that is initialised to a "."
  //this is probably configurable in the extension settings, something we still have to tackle
  //we should also think about the store presentation, logo, Readme...

  //TO FOLLOW UP: why use this filter? what is it reading? the DOM on the server?

  const filter = vscode.workspace.getConfiguration("react-native-storybooks").get("storybookFilterRegex") as string
  const regex = new RegExp(filter)

  //use Story interface to init this variable (id: string, name: string)
  let stories: Story[] = []

  //gets the data returned from the socket when calling setStories, we see if the data has a property "stories" which contains an Array of usable elements

  if (Array.isArray(data.stories)) {
    //if the data contains a stories property that is an Array
    //declare a variable kinds that:
    //inits to an empty Object but takes a type assertion of:
    //Object -> [key]: value = array of Story Objects
    
    let kinds: { [key: string]: StoryObject[] } = {}
    //this is basically asking if the stories returned from the data have a "kind" property, and if the kind contains a period
    const storydata = data.stories.filter(s => s.kind.match(regex))

    storydata.map(story => {
      story.stories.map(singleStory => {
        if (kinds[story.kind] == undefined) {
          // kinds[story.kind] = [story.name]
          kinds[story.kind] = [{ name: singleStory, id: singleStory }]
        } else {
          kinds[story.kind].push({ name: singleStory, id: singleStory })
        }
      })
    })
    Object.keys(kinds).forEach(function(key) {
      stories.push({
        kind: key,
        stories: kinds[key]
      })
    })
  } else {
    let kinds: { [key: string]: StoryObject[] } = {}
    Object.keys(data.stories).forEach(function(key) {
      const story = data.stories[key]
      if (story.kind.match(regex)) {
        if (kinds[story.kind] == undefined) {
          // kinds[story.kind] = [story.name]
          kinds[story.kind] = [{ name: story.name, id: story.id }]
        } else {
          kinds[story.kind].push({ name: story.name, id: story.id })
        }
      }
    })
    Object.keys(kinds).forEach(function(key) {
      stories.push({
        kind: key,
        stories: kinds[key]
      })
    })
  }
  storyTreeViewProvider.stories = stories
  storyTreeViewProvider.refresh()
  reconnectStatusBarItem.hide()
})

// When the server in RN starts up, it asks what should be default
channel.on("getCurrentStory", () => {
  storybooksChannel.emit("setCurrentStory", {
    storyId: currentStoryId
  })
})

// The React Native server has closed
channel.transport.socket.onclose = () => {
  storyTreeViewProvider.stories = []
  storyTreeViewProvider.refresh()
  reconnectStatusBarItem.show()
}

channel.emit("getStories")
}

registerCallbacks(storybooksChannel)

vscode.commands.registerCommand("extension.searchStories", () => {
vscode.window.showQuickPick(pickerProvider.toList()).then((picked: string) => {
  const setParams = pickerProvider.getParts(picked)
  setCurrentStory(setParams)
})
})

// Allow clicking, and keep state on what is selected
vscode.commands.registerCommand("extension.openStory", (section, story) => {
// Handle a Double click
if (currentStoryId === story.id && currentKind === section.kind && currentStory === story.name) {
  findFileForStory(section.kind, story.name).then(results => {
    if (results) {
      vscode.workspace.openTextDocument(results.uri).then(doc => {
        vscode.window.showTextDocument(doc).then(shownDoc => {
          let range = doc.lineAt(results.line - 1).range
          vscode.window.activeTextEditor.selection = new vscode.Selection(range.start, range.end)
          vscode.window.activeTextEditor.revealRange(range, vscode.TextEditorRevealType.InCenter)
        })
      })
    }
  })
  return
}

setCurrentStory({ storyId: story.id, kind: section.kind, story: story.name })
})

function setCurrentStory(params: StorySelection) {
const currentChannel = () => storybooksChannel
currentKind = params.kind
currentStory = params.story
currentStoryId = params.storyId
currentChannel().emit("setCurrentStory", params)
}

//when connecting to storybook, create a websocket connection
//then pass it as an argument to the registerCallbacks function
vscode.commands.registerCommand("extension.connectToStorybooks", () => {
storybooksChannel = createChannel({ url: `ws://${host}:${port}`, async: true, onError: () => {} })
registerCallbacks(storybooksChannel)
})

vscode.commands.registerCommand("extension.restartConnectionToStorybooks", () => {
storybooksChannel = createChannel({ url: `ws://${host}:${port}`, async: true, onError: () => {} })
registerCallbacks(storybooksChannel)
})

vscode.commands.registerCommand("extension.goToNextStorybook", () => {
const stories = storyTreeViewProvider.stories
const currentSection = stories.find(s => s.kind === currentKind)
const currentStories = currentSection.stories
const currentIndex = currentStories.map(e => e.id).indexOf(currentStoryId)
if (currentIndex === currentStories.length) {
  // if you have reached the last story of an array of stories, enables the ability to wrap around
  vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[0])
} else {

  vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[currentIndex + 1])
}
})

vscode.commands.registerCommand("extension.goToPreviousStorybook", () => {
const stories = storyTreeViewProvider.stories
const currentSection = stories.find(s => s.kind === currentKind)
const currentStories = currentSection.stories
const currentIndex = currentStories.map(e => e.id).indexOf(currentStoryId)
if (currentIndex === 0) {
  // if you have reached the last story of an array of stories, enables the ability to wrap around
  vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[currentStories.length - 1])
} else {
  vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[currentIndex - 1])
}
})

vscode.commands.registerCommand("extension.expandAllStories", () => {
storyTreeViewProvider.expandAll()
})

vscode.commands.registerCommand("extension.collapseAllStories", () => {
storyTreeViewProvider.collapseAll()
})
}
*/
// Loop through all globbed stories,
// reading the files for the kind and the story name
// const findFileForStory = async (kind: string, story: string): Promise<{ uri: vscode.Uri; line: number } | null> => {
//   return new Promise<{ uri: vscode.Uri; line: number }>((resolve, reject) => {
//     //this regex is set as a glob expression in package.json that finds **.story.* files
//     const regex = vscode.workspace.getConfiguration("react-native-storybooks").get("storyRegex") as string
//     const root = vscode.workspace.workspaceFolders
//     vscode.workspace.findFiles(regex, "**/node_modules").then(files => {
//       let found = false
//       for (const file of files) {
//         const content = fs.readFileSync(file.fsPath, "utf8")
//         if (content.includes(kind) && content.includes(story)) {
//           const line = content.split(story)[0].split("\n").length
//           resolve({ uri: file, line })
//           found = true
//         }
//       }
//       if (!found) {
//         resolve(null)
//       }
//     })
//   })
// }
function activate(context) {
    let port = vscode.workspace.getConfiguration("aesop").get("port");
    let host = vscode.workspace.getConfiguration("aesop").get("host");
    vscode.window.showInformationMessage(`Port default to ${port}`);
    //set context "aesop-awake" to true; enabling views
    vscode.commands.executeCommand("setContext", "aesop-awake", true);
    //create disposable to register Aesop Awaken command to subscriptions
    let disposable = vscode.commands.registerCommand('extension.aesopAwaken', () => {
        //declare variable to toggle whether running Node processes have been checked
        let checkedProcesses = false;
        //declare variable to toggle whether a running SB process was found
        let foundSb = false;
        //define a path to the user's root working directory
        const rootDir = url_1.fileURLToPath(vscode.workspace.workspaceFolders[0].uri.toString(true));
        //first test whether Storybook has been depended into your application
        fs.access(path.join(rootDir, '/node_modules/@storybook'), (err) => {
            const statusText = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
            statusText.text = "Aesop - Looking for Storybook dependency...";
            statusText.color = "#FF8989";
            //if the filepath isn't found, show the user what Aesop is reading as the root path
            if (err) {
                vscode.window.showErrorMessage(`Aesop could not find Storybook as a dependency in the active folder, ${rootDir}`);
                statusText.dispose();
            }
            else {
                //check to see if a storybook node process is already running
                if (checkedProcesses === false) {
                    ps.lookup({ command: 'node', psargs: 'ux' }, (err, resultList) => {
                        if (err) {
                            vscode.window.showErrorMessage(`Failed looking for running Node processes. Error: ${err}`);
                            statusText.dispose();
                        }
                        else {
                            //notify the user that Aesop is checking for a running Storybook instance
                            statusText.text = `[Aesop] Reviewing running processes...`;
                            //if the process lookup was able to find running processes, iterate through to review them
                            resultList.forEach((process) => {
                                /* OUTPUT LOGGER */
                                fs.writeFile(path.join(rootDir, 'YOLO.txt'), `Attempted launch log:\n`, (err) => { console.log(`Couldn't output process information to YOLO.txt: ${err}`); });
                                //check if any running processes are Storybook processes
                                if (process.arguments[0].includes('storybook')) {
                                    //stretch goal: check for multiple instances of storybook and reconcile
                                    //if so, extract port number and use that value to populate the webview with that contents
                                    const pFlagIndex = process.arguments.indexOf('-p');
                                    if (pFlagIndex !== -1) {
                                        port = parseInt(process.arguments[pFlagIndex + 1]);
                                    }
                                    /* OUTPUT LOGGER */
                                    fs.appendFile(path.join(rootDir, 'YOLO.txt'), `This process matches for 'storybook':\n
									PID: ${process.pid}, COMMAND:${process.command}, ARGUMENTS: ${process.arguments}\n
									PORT has been assigned to: ${port}`, (err) => { console.log(err); });
                                    //set foundSb to true to prevent our function from running another process
                                    foundSb = true;
                                    statusText.text = `[Aesop] Retrieving your running Storybook...`;
                                } //---> close if process.arguments[0] contains storybook
                            }); //---> close resultList.forEach()
                            //having checked running Node processes, set that variable to true
                            checkedProcesses = true;
                            //if no processes matched 'storybook', we will have to spin up the storybook server
                            if (checkedProcesses === true && foundSb === false) {
                                //starts by checking for/extracting any port flages from the SB script in the package.json
                                fs.readFile(path.join(rootDir, 'package.json'), (err, data) => {
                                    if (err) {
                                        vscode.window.showErrorMessage(`Aesop is attempting to read ${rootDir}. Is there a package.json file here?`);
                                    }
                                    else {
                                        statusText.text = `[Aesop] Checking your Storybook scripts in package.json...`;
                                        //enter the package.JSON file and retrieve its contents as an object
                                        let packageJSON = JSON.parse(data.toString());
                                        let storybookScript = packageJSON.scripts.storybook;
                                        /* OUTPUT LOGGER */
                                        fs.appendFile(path.join(rootDir, 'YOLO.txt'), `Here is the script for "storybook":\n
										${storybookScript}`, (err) => { console.log(err); });
                                        //iterate through the text string (stored on "storybook" key) and parse out port flag
                                        //it is more helpful to split it into an array separated by whitespace to grab this
                                        let retrievedScriptArray = storybookScript.split(' ');
                                        for (let i = 0; i < retrievedScriptArray.length; i++) {
                                            //stretch goal: add logic for other flags as we implement further functionality
                                            if (retrievedScriptArray[i] === '-p') {
                                                port = parseInt(retrievedScriptArray[i + 1]);
                                                /* OUTPUT LOGGER */
                                                fs.appendFile(path.join(rootDir, 'YOLO.txt'), `Port from script":\n${parseInt(retrievedScriptArray[i + 1])}\n
												Port at this moment:\n${port}\n`, (err) => { console.log(err); });
                                                break;
                                            }
                                            else if (i === retrievedScriptArray.length - 1) {
                                                //termination case: when you have reached the end of the script in the 'for' loop
                                                //ADD LOGIC TO HANDLE WHEN NO SCRIPT FLAG IS GIVEN
                                                /* OUTPUT LOGGER */
                                                fs.appendFile(path.join(rootDir, 'YOLO.txt'), `Script found, but no port flag detected.\n
												Port when no port flag found:\n${port}\n`, (err) => { console.log(err); });
                                            }
                                        }
                                        //possible: add --ci tag to existing package.json with an fs function?
                                        //e.g. process.scripts.storybook = `${storybookScript} --ci`, then write
                                        //now launch the child process on the port you've derived
                                        const runSb = child_process.spawn('npm', ['run', 'storybook']);
                                        vscode.window.showInformationMessage("Done looking. Aesop will now run Storybook for you.");
                                        runSb.stdout.setEncoding('utf8');
                                        let counter = 0;
                                        runSb.stdout.on('data', (data) => {
                                            let str = data.toString();
                                            let lines = str.split(" ");
                                            counter += 1;
                                            if (counter === 3) {
                                                const path = lines[171];
                                                const regExp = (/[^0-9]/g);
                                                port = parseInt(path.replace(regExp, ""));
                                            }
                                            let sbPortFlag = '-p';
                                            if (lines.includes(sbPortFlag)) {
                                                const indexOfP = lines.indexOf(sbPortFlag);
                                                vscode.window.showInformationMessage(`This is indexOfP: `, indexOfP);
                                                if (indexOfP !== -1) {
                                                    port = parseInt(lines[indexOfP + 1]);
                                                    vscode.window.showInformationMessage(`storybook is now running on port: ${port}`);
                                                }
                                            }
                                        });
                                        runSb.on('error', (err) => {
                                            console.log(err);
                                            process.exit(1);
                                        });
                                        //This will make sure the child process is terminated on process exit
                                        runSb.on('close', (code) => {
                                            console.log(`child process exited with code ${code}`);
                                        });
                                    }
                                });
                            } //close spin up server
                        }
                        ; //CLOSE else psLookup
                    }); //close ps LOOKUP
                } //close depend found, not checked processes
            } //close else statement in fs.access
        }); //close fs access
    }); //close disposable
    context.subscriptions.push(disposable);
    let openDisposable = vscode.commands.registerCommand('extension.aesopChronicle', () => {
        const panel = vscode.window.createWebviewPanel('aesop-sb', 'Aesop', vscode.ViewColumn.Beside, {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.file(context.extensionPath)]
        });
        //here's where I need logic to fill html
        panel.webview.html = `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Aesop</title>
			</head>
			<body>
				<iframe src="http://${host}:${port}/?path=/story/welcome--to-storybook></iframe>
			</body>
		</html>`;
    });
    context.subscriptions.push(openDisposable);
}
exports.activate = activate;
function deactivate() {
    // storybooksChannel.transport.socket.close()
}
exports.deactivate = deactivate;


/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ "vscode":
/*!*************************!*\
  !*** external "vscode" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("vscode");

/***/ })

/******/ });
//# sourceMappingURL=extension.js.map