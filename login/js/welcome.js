Parse.initialize("Jbz8IatuSOpr7xmnNXBpnCcN1cj2ox9sPzsqggak", "anMcouVSWbzeHoJmFJBcJYrmg8XtzUatOt7hrgJX");

$(document).ready(function(){
    var currentUserId = showNickname();
    queryStat(currentUserId);
    $("#logout").click(function(){
        Parse.User.logOut();
        //sendToContentLogout();
        removeStorage();
        chrome.browserAction.setIcon({path:'../../img/T-400_white.png'}, function()
        {
          window.close();
        });
    });
});

function queryStat(currentUserId) {
  var btnup = '<span class="pop-btn" id=thumbup><i class="fa fa-thumbs-up"></i></span>';
  var btndown = '<span class="pop-btn" id=thumbdown><i class="fa fa-thumbs-down"></i></span>';
  var Annotation = Parse.Object.extend("Annotation");
  var query = new Parse.Query(Annotation);
  //FIXME may need better query method, now cost 
  query.descending("numberOfAgree");
  query.first({
    success: function(object) {
      queryCurrentUserPop(object.id, currentUserId, function(result){
          //console.log(result[0]);
          var opinion;
          if (result.length === 0){opinion = 0;}
          else {opinion = result[0].get('opinion');}
          var selectedText = object.get('selectedText');
          var author = object.get('userName');
          var agree = object.get('numberOfAgree');
          var disagree = object.get('numberOfDisagree');
          var inHtml_title = '<p class=stat-mostAgree>Most Popular <br></p>'; 
          var inHtml_text = '<p class=stat-text>'+'"' + selectedText + '"</p>';
          var inHtml_author = '<p class=stat-author>' +'--by '+ author + '</p>';
          var inHtml_agree = '<span class=stat-agree id=pop_agree>' + agree + '</span>';
          var inHtml_disagree = '<span class=stat-agree id=pop_disagree>' + disagree + '</span>';
          var inHtml_pop = inHtml_title + inHtml_text + inHtml_author + btnup +inHtml_agree +  btndown + inHtml_disagree;
          query.descending("numberOfDisagree");
          query.first({
            success: function(object) {
              queryCurrentUserPop(object.id, currentUserId, function(result){
                //console.log(object);
                var selectedText = object.get('selectedText');
                var author = object.get('userName');
                var agree = object.get('numberOfAgree');
                var disagree = object.get('numberOfDisagree');
                var inHtml_title = '<p class=stat-mostDisagree>Most Controversial <br></p>'; 
                var inHtml_text = '<p class=stat-text>'+'"' + selectedText + '"</p>';
                var inHtml_author = '<p class=stat-author>' +'--by '+ author + '</p>';
                var inHtml_agree = '<span class=stat-agree id=con_agree>' + agree + '</span>';
                var inHtml_disagree = '<span class=stat-agree id=con_disagree>' + disagree + '</span>';
                var inHtml_con = inHtml_title + inHtml_text + inHtml_author + btnup +inHtml_agree +  btndown + inHtml_disagree;
                inHtml= inHtml_pop + inHtml_con;
                $("#tweet-stat").html(inHtml);
                bindEvent();
              });
            },
            error: function(error) {
              alert("Error: " + error.code + " " + error.message);
            }
          });
      });
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });

}

function queryCurrentUserPop(annotationId, userId, _callback){
  var UserAnnotation = Parse.Object.extend("UserAnnotation");
  var query = new Parse.Query(UserAnnotation);
  query.equalTo('annotationId', annotationId);
  query.equalTo('userId', userId);
  query.find({
      success: function(results) {
        _callback(results);
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
  });
}

function queryCurrentUserCon(annotationId, userId, _callback){
  var UserAnnotation = Parse.Object.extend("UserAnnotation");
  var query = new Parse.Query(UserAnnotation);
  query.equalTo('annotationId', annotationId);
  query.equalTo('userId', userId);
  query.find({
      success: function(results) {
        _callback(results);
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
  });
}
  

function bindEvent(){
  $("#thumbup").click(function(){
    console.log('clicked up');
  });
  
  $("#thumbdown").click(function(){
    console.log('clicked down');
  });
}

function removeStorage(){
  chrome.storage.sync.set({objectId: "", username: "", nickname:""}, function(){
  console.log('local nickname removed');
  });
}

function showNickname(){
  var currentUser = Parse.User.current();
  if(!currentUser){
      window.location.href = "login.html";
  }

  var inHtml1 = '<h1>Hello, '; 
  var inHtml2 = currentUser.get("nickname") + ' !' + '</h1>';
  var inHtml = inHtml1 + inHtml2;
  $("#welcome-toggle").html(inHtml);
  return currentUser.id;
}


    /*
    function sendToContentLogout(){
        console.log("sending to content");
        chrome.tabs.query({url:'*://twitter.com/'}, function(tabs) {
          for (var i = 0; i < tabs.length; i++){
            chrome.tabs.sendMessage(tabs[i].id, {objectId: "", username: "", nickname:""}, function(response) {
              console.log("change sent to content script");
            });
          }
        }); 
    }
    */
