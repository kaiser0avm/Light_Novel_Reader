var app = angular.module('light-novel-reader', ['ui.bootstrap']);
app.service("messageService",function(){
	this.message = function(type,message){
		var alertMessage = 'sa';
		switch(type){
		case 0:
			alertMessage = '<div id="alertMessage" style="position:absolute;left:40%;top:0;" class="alert alert-info alert-dismissable fade in">'+
			message+
   			'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;'+
     	'</div>';
			break;
		case 1:
			alertMessage = '<div id="alertMessage" style="position:absolute;left:40%;top:0;" class="alert alert-danger alert-dismissable fade in">'+
			message+
   			'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;'+
     	'</div>';
			break;
		}
		$('body').append(alertMessage);
		setTimeout(function(){$('#alertMessage').alert('close');},2000);
	};
});
app.directive('dynamic', function ($compile) {
	  return {
	    restrict: 'A',
	    replace: true,
	    link: function (scope, ele, attrs) {
	      scope.$watch(attrs.dynamic, function(html) {
	        ele.html(html);
	        $compile(ele.contents())(scope);
	      });
	    }
	  };
});
app.controller('lightNovelCrtl',function($scope,$http,messageService){
	$scope.loadingDisplay = "block";
	$scope.content = "";
	$http.get('novel.json').success(function(data){
		$scope.hideOriginalUrl = true;
		$scope.originalUrl = "";
		$scope.chapterContent = "";
		$scope.loadingDisplay = "none";
		$scope.novel = data.novel;
		$scope.contributors = data.novel.contributors;
		$scope.stories = data.novel.stories;
		$scope.selectedStory = "None";
		$scope.chapters = [];
		$scope.selectedChapter = "None";
		$scope.content = '<div class="row">'+
		'<center>' +
		'<h2 style="margin-top:10%;">Welcome to {{novel.name}} reader</h2>'+
		'<br/><br/><br/>'+
		'<input class="btn btn-primary" type="button" ng-click="enterReaderClick()" value="ENTER"/>'+
		'<br/><br/>'+
		'<p>This translation is all possible because of</p>' +	
		'<table>'+
		'<tr ng-repeat="contributor in contributors"><td style="text-align:center;"><a href="{{contributor.url}}">{{contributor.name}}</a></td></tr>' +
		'</table>'+
		'</center>' +
		'</div>';
		$scope.enterReaderClick = function(){
			$scope.content = '<div class="row">' +
			'<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">' +
			 '<div class="navbar-header">' +
		      '<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">' +
		        '<span class="sr-only">Toggle navigation</span>' +
		        '<span class="icon-bar"></span>' +
		        '<span class="icon-bar"></span>' +
		        '<span class="icon-bar"></span>' +
		      '</button>' +
		    '</div>' +
		    '<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">' +
		      '<ul class="nav navbar-nav" style="text-align:center;">' +
		      	'<li><a style="color:white;font-weight:bold;" href="#">{{novel.name}}</a></li>' +
		        '<li><a style="color:white;font-weight:bold;" href="#">Stories:</a></li>' +
		        '<li><select style="margin-top:8px;" class="form-control" ng-model="selectedStory" ng-change="selectedStoryChange()"><option selected="selected" value="None">None</option><option ng-repeat="story in stories" value="{{story.name}}">{{story.name}}</option></select></li>' +
		        '<li><a style="color:white;font-weight:bold;" href="#">Chapters:</a></li>' +
		        '<li><select style="margin-top:8px;" class="form-control" ng-model="selectedChapter" ng-change="selectedChapterChange()"><option selected="selected" value="None">None</option><option ng-repeat="chapter in chapters" value="{{chapter.id}}">{{chapter.id}}</option></select></li>' +
		        '<li><a style="color:white;font-weight:bold;" target="_blank" ng-hide="hideOriginalUrl" href="{{originalUrl}}">View Original</a></li>' +
		        '<li><input type="button" style="margin-top:8px;margin-left:5px;" class="btn btn-primary" value="Special Thanks" data-toggle="modal" data-target="#specialThanksModal"/></li>' +
		      '</ul>' +
		     '</div>' +
		    '</nav>' +
			'</div>' + 
			'<div style="margin-top:60px;" class="row">' +
			'<div dynamic="chapterContent" style="list-style-type:none;"></div>'+
			'</div>' +
			'<div class="modal fade" id="specialThanksModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
			  '<div class="modal-dialog">' +
			    '<div class="modal-content">' +
			      '<div class="modal-header">' +
			        '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
			        '<h4 class="modal-title" id="loginModalLabel">Special Thanks To!!!</h4>' +
			      '</div>' +
			      '<div class="ng-scope">' +
			      '<div id="login-body" class="modal-body">' +
			      '<div>' +			      	
			        '<center>' +
			        '<div ng-repeat="contributor in contributors"><a href="{{contributor.url}}">{{contributor.name}}</a></div>' +
			        '</center>' +			        
			      '</div>' +
			      '</div>' +
			      '</div>' +
			      '<div class="modal-footer">' +
			        'Support this Translators' +
			      '</div>' +
			    '</div>' +
			  '</div>' +
			'</div>';
		};
		$scope.selectedStoryChange = function(){
			if($scope.selectedStory == "None"){
				$scope.chapters = [];
				$scope.selectedChapter = "None";
				$scope.hideOriginalUrl = true;
				$scope.originalUrl = "";
				$scope.chapterContent = "";
			}
			for(var n = 0;n < $scope.stories.length;n++){
				if($scope.stories[n].name == $scope.selectedStory){
					$scope.chapters = $scope.stories[n].chapters;
					$scope.selectedChapter = "None";
				}
			}
			//console.log("Selected Story is " + $scope.selectedStory);
		};
		$scope.selectedChapterChange = function(){
			if($scope.selectedChapter != "None"){
				$scope.chapterContent = "";
				for(var n = 0;n < $scope.chapters.length;n++){
					if($scope.chapters[n].id == $scope.selectedChapter){
						$scope.loadingDisplay = "block";
						var type = $scope.chapters[n].type;
						var url = $scope.chapters[n].url;
						$http.get("getUrl.php?translator=" + $scope.chapters[n].type + "&url=" + $scope.chapters[n].url).success(function(data){
							$scope.loadingDisplay = "none";
							$scope.hideOriginalUrl = false;
							$scope.originalUrl = url;
							$scope.chapterContent = data;
							if(type == "baka-tsuki"){
								setTimeout(function(){$(".mw-editsection").remove();$(".thumbimage").remove();$("#mw-navigation").remove();$("#footer").remove();$(".printfooter").remove();$(".references").remove();$(".ng-scope table").remove();},200);								
							}
						});
					}
				}
			}
			else{
				$scope.hideOriginalUrl = true;
				$scope.originalUrl = "";
				$scope.chapterContent = "";
			}
			//console.log("Selected Chapter is " + $scope.selectedChapter);
		};
		
	});
});