'use strict';
angular.module('CubeRootApp')
  
  .service('commonService', ['$http', '$q', '$rootScope', '$state', '$location', '$uibModal',
    function ($http, $q, $rootScope, $state, $location, $uibModal) {
      
      var
        urlPrefix = $rootScope.urlPrefix = '',
        campaignIdsUrl               = urlPrefix + '/b1/report/16/',
        publisherChannelUrl          = urlPrefix + '/publisher/report/16/',
        userDetailsUrl               = urlPrefix + '/usermod/getuserdetails',
        streamGraphDimensions        = {width: '100%', height: '22%', minWidth: 400, minHeight: '50%'},
        barChartHorizontalDimensions = {width: '100%', height: '70%', minWidth: 400, minHeight: '70%'},
        barChartDimensions           = {width: '100%', height: '70%', minWidth: 400, minHeight: '50%'},
        AWSUrl                       = 'https://creativedata.s3.amazonaws.com/',
        performanceMetrics           = [
          {"key": "ctr", "value": "Optimum CTR"},
          {"key": "cpc", "value": "Optimum CPC"},
          {"key": "conversionRate", "value": "Optimum Conversion Rate"}
        ],
        commonErrorCallback          = function (response) {
          var appViewMsg = {};
          if (!!response && !!response.type && !!response.description) {
            appViewMsg = {
              type   : response.type,
              message: response.description
            }
          } else {
            appViewMsg = {
              type   : "error",
              message: "Some Server error occurred, Please try after sometime."
            }
          }
          var commonService = $rootScope.commonService;
          $rootScope.$emit('appViewMessage', appViewMsg);
          commonService.hideLoading();
        },
        delinkObj                    = function (obj) {
          var newObj = {};
          for (var i in obj) {
            newObj[i] = obj[i];
          }
          return newObj;
        };

      return {
        commonErrorCallback            : commonErrorCallback,
        getId                          : function (o) {
          var obj;
          if (o.indexOf("#") !== -1) {
            o   = o.split("#")[1];
            obj = document.getElementById(o);
          }
          else if (o.indexOf(".") !== -1) {
            o   = o.split(".")[1];
            obj = document.getElementsByClassName(o);
          }
          else {
            obj = document.getElementsByTagName(o);
          }
          return angular.element(obj);
        },
        getStreamGraphDimensions       : function () {
          return delinkObj(streamGraphDimensions);
        },
        getBarChartDimensions          : function () {
          return delinkObj(barChartDimensions);
        },
        getBarChartHorizontalDimensions: function () {
          return delinkObj(barChartHorizontalDimensions);
        },
        getPerformanceMetric           : function () {
          return delinkObj(performanceMetrics);
        },
        checkAuthentication            : function () {
          return (document.cookie.indexOf('AUTHTOKEN') != -1);
        },
        getUserType                    : function () {
          return this.getCookie('UserType');
        },
        getCookie                      : function (cookieName) {
          if (document.cookie.indexOf(cookieName) != -1) {
            var val = document.cookie.split(cookieName + '=')[1];
            val     = val.split(';')[0];
            return val;
          } else {
            return undefined;
          }
        },
        
        getMatchedKey     : function (list, key, val) {
          var foundObj = {};
          list.forEach(function (o) {
            if (o[key] === val) {
              foundObj = o;
            }
          });
          return foundObj;
        },
        getSTSToken       : function () {
          
          return $http({
            url    : '/creative/getSTSToken',
            method : 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
        },
        getAWSUrl         : function () {
          return AWSUrl;
        },
        setCookie         : function (cookieName, val) {
          var
            now        = new Date(),
            cookieDate = new Date()
            ;
          cookieDate.setYear(now.getYear() + 4);
          document.cookie = cookieName + '=' + val + ';expires=' + cookieDate.toUTCString() + '; path=/"';
        },
        getFormData       : function () {
          return $http({
            url    : '/campaign/getformdata',
            method : 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          })
        },
        getCreativeDetails: function (urlPrefix) {
          return $http({
            method : 'GET',
            url    : urlPrefix + '/creative/getcreativedetails',
            headers: {
              'Content-Type': 'application/json'
            }
          })
        },
        getCampaignDetails: function () {
          return $http({
            method : 'GET',
            url    : urlPrefix + '/campaign/getcampaigndetails',
            headers: {
              'Content-Type': 'application/json'
            }
          })
        },
        checkLogin        : function () {
          var commonService = $rootScope.commonService;

          if (!commonService.checkAuthentication()) {
            $state.transitionTo('login', '', {
              reload: true, inherit: true, notify: true
            }).then(function () {
              commonService.hideLoading();
            });
          } else {
            commonService.goToLandingPage();
          }
        }
        ,
        isHandHeldDevice  : function () {
          var check = false;
          (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))check = true
          })(navigator.userAgent || navigator.vendor || window.opera);
          return check;
        },

        loadITP: function (url) {
          console.log(url);
          return $http({
            method: 'GET',
            url   : url
          });
        },

        getUserDetails   : function () {
          var commonService = $rootScope.commonService;
          if (commonService.checkAuthentication()) {

            return $http({
              method: 'GET',
              url   : userDetailsUrl
            });
          }
        }
        ,
        logout           : function () {
          var commonService = $rootScope.commonService;
          $http({
            method: 'GET',
            url   : '/usermod/logout'
          }).then(function (response) {
            $state.go('login');
            $rootScope.userDetails = null;
            $rootScope.loggedIn    = false;
            $rootScope.userType    = undefined;
            commonService.hideLoading();

          }, commonErrorCallback);

        }
        ,
        singleObject     : function (data) {
          var singleObj = {};
          for (var i = 0, len = data.length; i < len; i++) {
            var obj = data[i];
            for (var k in obj) {

              if (obj[k] !== null) {
                singleObj[k] = singleObj[k] || "";
                if (singleObj[k].indexOf(obj[k]) === -1) {
                  singleObj[k] += (!singleObj[k]) ? obj[k] : ", " + obj[k];
                }
              }
            }
          }

          var commonService = $rootScope.commonService;
          singleObj             = commonService.prioritize(singleObj);
          return singleObj;
        }
        ,
        getIdealTargetImg: function (age, gender) {
          var ages     = age.toLowerCase().split(",");
          var ageGroup = ages[0].split("-");
          var gender   = gender.toLowerCase();
          if (ageGroup.length > 1) {
            switch (gender) {
              case 'male':
                if (ageGroup[1] < 25) {
                  return 'boy';
                } else if (ageGroup[1] < 35) {
                  return 'man';
                } else if (ageGroup[1] >= 35) {
                  return 'businessMan';
                }
                break;

              case 'female':
                return 'lady';
                break;

              default :
                return 'unknown';
                break;
            }
          } else if (!ageGroup[0] || ageGroup[0] == 'unknown') {
            return 'unknown';
          }
        }
        ,


        prioritize: function (obj) {
          for (var k in obj) {
            if (obj[k].indexOf("P1:") !== -1 || obj[k].indexOf("P2:") !== -1) {
              var
                p1 = obj[k].split("P1:")[1].split("P2:"),
                p2 = p1[1]
                ;
              p1   = p1[0];

              p1 = (!!p1) ? p1.replace(/,/g, ", ") : p1;
              p2 = (!!p2) ? p2.replace(/,/g, ", ") : p2;

              if (!!p1) {
                p1 = p1.trim();
                p1 = (p1.lastIndexOf(',') == p1.length - 1) ? p1 = p1.substr(0, p1.length - 1) : p1;
              }

              if (!!p2) {
                p2 = p2.trim();
                p2 = (p2.lastIndexOf(',') == p2.length - 1) ? p2 = p2.substr(0, p2.length - 1) : p2;
              }

              obj[k]    = {};
              obj[k].p1 = p1;
              obj[k].p2 = p2;
            }
          }
          return obj;
        },

        sendData       : function (url, $data, successCallback, errorCallback) {
          try {
            $http({
              method : 'POST',
              data   : $data,
              headers: {
                'Content-Type': 'application/json'
              },
              url    : url
            }).then(successCallback, errorCallback);

          } catch (e) {
            console.log("Error sending data : " + e)
          }
        }
        ,
        tooltip        : function () {
          var toolTipObj = d3.selectAll('.chartTooltip')[0];

          if (toolTipObj.length > 1) {
            for (var i = toolTipObj.length; i > 1; i--) {
              toolTipObj[i - 1].remove();
            }
          }
          else if (toolTipObj.length === 0) {
            d3.select("body")
              .insert("div", ":first-child")
              .attr({'class': 'chartTooltip'})
            ;
          }
          return d3.select('.chartTooltip');

        }
        ,
        positionTooltip: function () {
          var
            mousex  = d3.event.pageX + 10,
            mousey  = d3.event.pageY + 10,
            tooltip = this.tooltip(),
            body    = d3.select('body')[0][0],
            tooltipWidth
            ;

          tooltip.style({display: 'block', visibility: 'hidden'});
          tooltipWidth = tooltip[0][0].offsetWidth;
          if (mousex + tooltipWidth > body.offsetWidth) {
            mousex = body.offsetWidth - tooltipWidth;
          }

          tooltip.style({display: 'block', left: mousex + "px", top: mousey + "px", visibility: 'visible'});
        },
        showAppMsg     : function (opts) {
          var opts                 = opts || {},
              template             = opts.template || 'viewCreative';
          $rootScope.appViewMsg    = opts.msg || "Some Error Occurred";
          var
              size                 = opts.size || 500,
              modalInstance        = $uibModal.open({
                templateUrl: template,
                controller : 'applicationMessageCtrl',
                size       : size
              });
          $rootScope.modalInstance = modalInstance;
        },
        showCreative   : function (opts) {
          var opts          = opts || {},
              size          = opts.size || 500,
              commonService = $rootScope.commonService
            ;
          commonService.showLoading();
          $http({
            method: 'GET',
            url   : urlPrefix + opts.url
          }).then(function (response) {

            opts.url = response.data.url;

            var modalInstance        = $uibModal.open({
              templateUrl: 'viewCreative',
              size       : 'sm',
              resolve    : {
                opts: function () {
                  return opts;
                }
              },
              controller : function ($scope, $rootScope, $uibModalStack, opts) {
                $scope.opts = opts;
                $scope.ok   = function () {
                  $rootScope.modalInstance.dismiss('ok');
                };

                var
                  imageType  = "jpg,jpeg,png,gif,Image,image",
                  videoTypes = "mpg,mpeg,ogg,webm,mp4,swf";

                $scope.type = (imageType.indexOf($scope.opts.type) != -1) ? 'image' : '';

                if ($scope.type == '')
                  $scope.type = (videoTypes.indexOf($scope.opts.type) != -1) ? 'video' : '';
              }
            });
            $rootScope.modalInstance = modalInstance;
            commonService.hideLoading();
          });
        },

        showLoading: function (count) {
          //(!!count) ? $rootScope.loadingCount++ : '';
          $rootScope.loadingCount++
          //console.log('showLoading : ' + $rootScope.loadingCount)
          
          var
            disabledScr = d3.select('body #disabledScr')
            ;

          if (!disabledScr[0][0]) {
            d3.select('body')
              .append('div')
              .attr({'class': 'disabledScr', 'id': 'disabledScr'})
              .append('img')
              .attr({'class': 'loadingRing', 'src': 'static/images/ring.gif'});
          } else {
            disabledScr.style({'display': 'table'});
          }
        },

        hideLoading: function (count) {
          //console.log('hideLoading : ' + $rootScope.loadingCount);

          (!!count) ? $rootScope.loadingCount = -count : $rootScope.loadingCount--;

          //console.log('-' + $rootScope.loadingCount);

          if ($rootScope.loadingCount <= 0) {
            $rootScope.loadingCount = 0;
            var
              disabledScr           = d3.select('body #disabledScr')
              ;
            if (!!disabledScr[0][0]) {
              disabledScr.style({'display': 'none'});
            }
          }

        },

        getUrlPrefix    : function () {
          return urlPrefix;
        }
        ,
        getLandingPage  : function () {
          var
            landingPage = '',
            userType    = $rootScope.userType
            ;

          if (userType === 'publisher') {
            landingPage = 'appView.publisher';
          } else if (userType === 'advertiser') {
            landingPage = (!!$rootScope.userSeekState) ? $rootScope.userSeekState : 'appView.performance';
          } else {
            landingPage = 'login'
          }
          return landingPage;
        }
        ,
        goToLandingPage : function () {
          var
            commonService = $rootScope.commonService
            ;
          commonService.showLoading();
          var landingPage = commonService.getLandingPage();
          $state.go(landingPage);

          if ($rootScope.userDetails !== 'loading') {
            commonService
              .getUserDetails()
              .then(function (response) {
                $rootScope.userDetails = response.data;
                //commonService.hideLoading();
              }, commonService.commonErrorCallback);
          }
        }
        ,
        addInteractivity: function (obj) {
          var
            chartBlock      = d3.select("#" + obj.id + ""),
            currentChartTab = d3.select('#chartTypes .' + obj.currentChart),
            svgBlock        = d3.selectAll("#charts svg"),
            showGrid        = obj.showGrid
            ;

          d3.select('body #disabledScr').style({'display': 'none'});
          d3.selectAll('#chartTypes a').classed("active", false);

          currentChartTab.classed("active", true);

          if (showGrid != false) {
            if (!d3.select("#charts .vertical")[0][0]) {
              var
              /*                    guides = chartBlock
               .append("div").attr('class','guides'),*/
              vertical   = chartBlock
                .append("div")
                .attr("class", "vertical")
                .style({"opacity": "0","padding-bottom":"400px", "height": chartBlock[0][0].offsetHeight + 'px'})
                ,
 
              horizontal = chartBlock.append("div")
                .attr("class", "horizontal")
                .style({"opacity": "0", "width": chartBlock[0][0].offsetWidth + "px"})
                ;
            } else {

              var
                vertical   = d3.select('.vertical'),
                horizontal = d3.select('.horizontal')
                ;
            }


            chartBlock
              .on("mousemove", function () {
                var mousex = d3.mouse(this);
                vertical.style("left", mousex[0] + "px");
                horizontal.style("top", mousex[1] + "px");
              });

            svgBlock.on("mouseover", function () {

              d3.select("#charts .vertical").transition()
                .duration(250)
                .style('opacity', 1);

              d3.select("#charts .horizontal").transition()
                .duration(250)
                .style('opacity', 1);

            });

            svgBlock.on("mouseout", function () {

              d3.select("#charts .vertical").transition()
                .duration(250)
                .style('opacity', 0);

              d3.select("#charts .horizontal").transition()
                .duration(250)
                .style('opacity', 0);

            });
          }
        }
        ,

        getDiv_n_Scale: function (numb) {
          var
            num         = parseInt(numb).toString().split('.')[0],
            division    = '1',
            len         = num.length,
            numberScale = ['', 'Ten', 'Hundred', 'Thousand', 'Thousands', 'Lakh', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion', 'Sextillion', 'Septillion']
            ;
          if (len > 3) {
            for (var i = 3; i < len; i++) {
              division += '0';
            }
          }

          	return {division:1, numberScale:''};

            //return {division:parseInt(division),numberScale:numberScale[len-3]};

        }
        ,
        formatDate    : function (date) {
          var
            m_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            d1      = new Date(date)
            ;
          return d1.getDate() + ' ' + m_names[d1.getMonth()] + ' ' + d1.getFullYear();
        }
        ,

        formatDateRange: function (dates) {
          var
            m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"),
            d1      = dates[0],
            d2      = dates[1],

            d1_str  = d1.getDate() + ' ' + m_names[d1.getMonth()],
            d2_str  = d2.getDate() + ' ' + m_names[d2.getMonth()]
            ;


          return d1_str + ' - ' + d2_str;
        }
        ,

        load_n_ProcessData: function (obj) {

          var
            jsonPath       = obj.jsonPath,
            sortKey        = obj.sortKey,
            commonService  = obj.commonService,
            sortOrder      = obj.sortOrder,
            limit          = obj.limit,
            viewScope      = obj.viewScope,
            skipProcessing = obj.skipProcessing
            ;

          commonService.showLoading();

          d3.json(jsonPath, function (error, data) {
            if (error) {
              commonService.hideLoading();
              var appViewMsg = {
                type   : "error",
                message: "Some Server error occurred, Please try after sometime."
              };
              viewScope.$emit('appViewMessage', appViewMsg);
              return console.error(error);
            }

            /*                if (!!data && data.length == 0) {
             commonService.hideLoading();
             var appViewMsg = {
             type: "error",
             message: "No Data found for this report."
             };
             viewScope.$emit('appViewMessage', appViewMsg);
             return {data: data};
             }*/

            if (!!data.length && !skipProcessing) {
              var columnsWhichHaveData = "";
              data.forEach(function (d) {
                for (var i in d) {
                  if (d[i] == null && columnsWhichHaveData.indexOf(i) == -1) {
                    delete d[i];
                  } else if (!!d[i] && !isNaN(d[i]) && !Array.isArray(d[i])) {
                    var str = d[i].toString();
                    if (str.indexOf('.') !== -1) {
                      d[i] = parseFloat(d[i]).toFixed(4);
                    }
                    d[i] = +d[i];

                    columnsWhichHaveData = i + ","
                  } else {
                    columnsWhichHaveData = i + ","
                  }
                }
              });

              if (!!data.length && !isNaN(+data[0][sortKey])) {
                data.forEach(function (d) {
                  d[sortKey] = +d[sortKey];
                });

              }

              var
                sortedData
                ;

              if (!!sortKey) {
                sortedData = commonService.sortData(data, sortKey);

                if (sortOrder === 'reverse') {
                  sortedData = sortedData.reverse();
                }
              } else {
                sortedData = data
              }

              if (!!limit)
                sortedData = sortedData.slice(0, limit);


            } else {
              sortedData = data;
            }
            var dataObj = {data: sortedData};

            obj.callback(dataObj);

            //return dataObj;
          });
        }
        ,
        sortData          : function (data, sortKey) {
          var sortedData = data.sort(function (a, b) {

            if (a[sortKey] > b[sortKey]) {
              return 1;
            }
            if (a[sortKey] < b[sortKey]) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });
          return sortedData;
        }
        ,
        setDivision       : function (obj) {
          var
            data     = obj.data,
            divKey   = obj.divKey,
            dateKey  = obj.dateKey,
            division = obj.division,
            sum      = d3.sum(data, function (d) {
              return parseFloat(d[divKey]);
            })
            ;

          data.forEach(function (d) {
            d.percent = (d[divKey] / sum * 100).toFixed(2) + '%';

            if (!!dateKey) {
              d[dateKey] = new Date(d[dateKey]);
            }

            if (!!division && division.toString().length > 1)
              d[divKey] = parseInt(d[divKey]) / division;
          });
          return data;
        }
        ,
        toTitleCase       : function (str) {
          return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          });
        }
        ,
        improveData       : function (obj) {

          var
            processedData = obj.data,
            axisXkey      = obj.axisXkey,
            axisYkey      = obj.axisYkey,
            nestKey       = obj.nestKey,
            division      = obj.division,
            commonService = $rootScope.commonService
            ;

          processedData = commonService.setDivision({
            data    : processedData,
            divKey  : axisYkey,
            dateKey : axisXkey,
            division: division
          });

          //All axis  initialization />
          var stack = d3.layout.stack()
            .offset("zero")
            .values(function (d) {
              return d.values;
            })
            .x(function (d) {
              return d[axisXkey];
            })
            .y(function (d) {
              return d[axisYkey];
            })
            ;

          var nest = d3.nest()
            .key(function (d) {
              return d[nestKey];
            })
            .sortKeys(d3.descending)
            ;

          var layers = stack(nest.entries(processedData));

          var totalaxisYkey = 0, dateRange = [], channel = "";

          /*        layers.forEach(function(d){

           /!*            d.values.forEach(function(key){
           totalaxisYkey += key[axisYkey];
           dateRange = d3.extent(d.values, function(e) { return e[axisXkey]; });

           if(
           key[axisYkey] > 0 &&
           !!key.channel &&
           key.channel!=="undefined" &&
           channel.indexOf(key.channel) === -1 &&
           key.channel!==""
           ){
           if(channel.length>0){
           channel+=",";
           }
           channel += key.channel;
           }

           });*!/

           d.totalaxisYkey = Math.round(totalaxisYkey * division);
           d.channel = channel;
           d.dateRange = dateRange;

           processedData.push(d);
           });*/

          processedData = [];
          processedData = layers.sort(function (a, b) {
            if (a.totalaxisYkey > b.totalaxisYkey) {
              return 1;
            }
            if (a.totalaxisYkey < b.totalaxisYkey) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });

          return processedData;
        }
        ,
        updateChart       : function (scop) {
          return function (chartType) {
            if (!chartType)
              chartType = scop.currentChart;
            //console.log('commonService update chart called');
            scop.loadChart(chartType);
          }
        }
        ,

        getTabularColumns : function () {
          return this.tabularColumns;
        }
        ,
        setTabularColumns : function (obj) {
          this.tabularColumns = obj;
        }
        ,
        addToolTip        : function (chartPlaceHolder) {
          var tooltip = d3.select('#chartToolTip');
          if (!tooltip) {
            tooltip = chartPlaceHolder
              .append("div")
              .attr({'id': 'chartTooltip'})
            ;
            return tooltip;
          }

          return tooltip;

        }
        ,
        requestCampaignIds: function () {
          var
            dates      = this.dates,
            startDate  = dates.startDate,
            endDate    = dates.endDate,
            dateString = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate() + "," +
              endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate(),
            url        = campaignIdsUrl + dateString,
            userType   = $rootScope.userType
            ;

          url = (userType == 'publisher') ? publisherChannelUrl + dateString + '/channelList' : url;
          //url = "static/dummyData/campaignIds.json";

          return $http({
            method: 'GET',
            url   : url
          });
        }
        ,
        setDates          : function (dates) {
          this.dates = dates;
        }
        ,
        getDates          : function (dates) {
          return dates;
        }


      };
    }])
;
