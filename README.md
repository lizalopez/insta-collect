# insta-collect
Instagram Collection App

To SetUp:
1. npm install
2. bower install
3. npm start
4. run 'gulp' command


To Do:
1 | Create button enabling users to paginate to older set of URL.
2 | Unit and Integration tests.
3 | If item is video, enable playing mode. If type is image, add a 'play' glyphicon on hover over item section.
4 | Paginate fully (current setup can reach end date that user specifies, but because it's done via recursion, is not sending response to client properly).
5 | Deploy.
6 | Add MaterialUI component to render miniCalendar dropdown for date ranges.
7 | Responsive CSS to display media details on hover (when images are fetched from InstagramAPI).
8 | Implement OAuth- Google or Instagram.

For Pagination:
var asynProc = function(cb) {
  //does stuff to get data
  cb(data);
};

var procedure = function(err, data) {
  //take my data
  //stream it to my file
  //get link to next page
  process.nextTick(function() {
    asyncProc(procedure);
  });
};

asyncProc(procedure);

