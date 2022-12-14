$(document).ready(function(){
	var Banner = document.getElementsByClassName("Banner");
	var myVideo = document.getElementById("myVideo");
	var playIcon = document.getElementById("play_icon");
	var pauseIcon = document.getElementById("pause_icon");
	
	//当点击video窗口时
	$("#myVideo").click(function(){
		console.log(pauseIcon.style.display);
		if(pauseIcon.style.display == "none" || pauseIcon.style.display == ""){
			playIcon.style.display = "none";
			pauseIcon.style.display = "block";
			pauseIcon.style.opacity = 1;
		}else{
			pauseIcon.style.display = "none";
			playIcon.style.display = "block";
		}
	});
	
	//当播放图标被点击
	playIcon.addEventListener("click",function(){
		myVideo.play();
		pauseIcon.style.display = "block";
		playIcon.style.display = "none";
		
	});
	
	//当点击暂停图标时
	$("#pause_icon").click(function(){
		myVideo.pause();
		pauseIcon.style.display = "none";
		playIcon.style.display = "block";
		
	});
	
	//当鼠标悬浮于视频的窗口时
	$("#myVideo").mouseover(function(){
		if(pauseIcon.style.display == "block"){
			pauseIcon.style.opacity = 1;
		}
		if(playIcon.style.display == "block"){
			playIcon.style.opacity = 1;
		}
		myVideo.controls = "controls";
		
	});
	
	
	//当鼠标悬浮于暂停图标时
	$("#pause_icon").mouseover(function(){
		if(pauseIcon.style.display == "block"){
			pauseIcon.style.opacity = 1;
		}
		myVideo.controls = "controls";
	});
	
	//当鼠标移出视频的窗口时
	$("#myVideo").mouseout(function(){
		if(pauseIcon.style.display == "block"){
			pauseIcon.style.opacity = 0;
		}
		if(playIcon.style.display == "block"){
			playIcon.style.opacity = 0;
		}
		myVideo.controls = false;
	});
	
	//当鼠标悬浮于播放图标时
	$("#play_icon").mouseover(function(){
		if(playIcon.style.display == "block"){
			playIcon.style.opacity = 1;
		}
		myVideo.controls = "controls";
	});
	
});