var request = require('request');
var Promise = require('bluebird');
var keys = require('../env/keys');

var formatDate = function(d) {
  d = Number(d* 1000);
  date = new Date(d);
  var dd = date.getDate(); 
  var mm = date.getMonth()+1;
  var yyyy = date.getFullYear(); 
  if(dd<10){dd='0'+dd;} 
  if(mm<10){mm='0'+mm;}
  d =  mm + '/'+ dd+'/'+ yyyy+'';
  return d;
};


var filterImageData = function(responseObj) {
  return responseObj.reduce(function(imageDataCollection, item) {
    var formattedDate = formatDate(item.created_time);
    var video;
    video = (item.type === 'video' ? item.videos.standard_resolution.url : null);
    var image = {
      tags : item.tags,
      username : item.user.username,
      timeStamp : formattedDate,
      timeData: item.created_time,
      likes : item.likes.count,
      comments : item.comments.data,
      image : item.images.standard_resolution.url,
      sourceURL: item.link,
      type: item.type,
      video: video
    };
    imageDataCollection.push(image);
    return imageDataCollection;
  }, []);
};

module.exports = {
  paginateAPI: function(currentDate, startDate, endDate, olderDataUrl) {
    var paginateResults;
    request(olderDataUrl, function(err, response, paginateBody) {
      var body= JSON.parse(paginateBody);
      if (currentDate > endDate) {
      console.log('have not reached endDate, need to keep paginating to olderURL');
      //have not reached endDate, need to keep paginating to olderURL
        if (!err && body.meta.code === 200) {
          newCurrentDate = body.data[0].created_time;
          newOlderDataUrl = body.pagination.next_url;
          module.exports.paginateAPI(newCurrentDate, startDate, endDate, newOlderDataUrl);
        } else {
          return ("Error in paginating", err);
        }
      } else {
        console.log('paginating reached startDate');
        var paginatePromise = new Promise (function(resolve, reject) { 
          var filteredResults = filterImageData(body.data);
          resolve(filteredResults);
        });

        paginatePromise.then(function(filteredResults) {
          paginateResults = filteredResults;
          return paginateResults;
        });
      } 
    });
  },
  fetchOlderImageBatch: function(req, res) {
    var url = req.query.url;
    return request(url, function(err, response, body) {
        var metaResults = JSON.parse(body);
        var imageResults = metaResults.data;
        var filteredResults = filterImageData(imageResults);
        Promise.all(filteredResults).then(function () {
          filteredResults.push(metaResults.pagination.next_url);
          console.log('NOW I HAE URS', filteredResults[filteredResults.length-1]);
          res.send(JSON.stringify(filteredResults));               
          // });
        }).catch(function(err) {
            console.log("Error in fetching next api images");
        });
      }); 
  },
  fetchImages: function(req, res) {
    var tag = req.query.hashtag;
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;
    var itemsInDateRange = [];

  //with process.env, swap key.token for process.env.APITOK
      return request('https://api.instagram.com/v1/tags/'+tag+'/media/recent?access_token='+keys.token, function(err, response, body) {
          var metaResults = JSON.parse(body);
          var imageResults = metaResults.data;
          var filteredResults = filterImageData(imageResults);
          Promise.all(filteredResults).then(function () {
            filteredResults.push(metaResults.pagination.next_url);
            res.send(JSON.stringify(filteredResults));               
            // });
          }).catch(function(err) {
              console.log("Error in fetching api images");
          });
        }); 
      
    // module.exports.paginateAPI(apiInitialData.timeStamp, startDate, apiInitialData.next_url);
  }
};

