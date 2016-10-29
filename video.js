var dropbox_token = 'Etur5ZuhSLAAAAAAAAAAIfO6MYYB-fTegbapzAptHaq_gI2GhxIgCACPU3dwviLz';
var dropbox_key = 't9j4eonz6dava8g';

var normalpause = 1000;

var timeafterClick = 1000;

var video = document.getElementById('video');
// 	play = document.getElementById('play_button'),
// 	time;

// video.addEventListener('webkitbeginfullscreen', function() {
// 	play.innerText = 'play fullscreen video';
// 	window.clearInterval(time);
// });

// video.addEventListener('webkitendfullscreen', function() {
// 	video.pause();
// });

// play.addEventListener('touchstart', function() {
// 	time = window.setInterval(function() {
// 		try {
// 			video.webkitEnterFullscreen();
// 		}
// 		catch(e) {}
// 	}, 250);
// 	play.innerText = 'loading ...';
// 	video.play();	
// });
// This will play the video in fullscreen when started.


var image_assets = ["images/dots/dot_1.png",
	"images/dots/dot_2.png",
	"images/dots/dot_3.png",
	"images/dots/dot_4.png",
	"images/dots/dot_5.png",
	"images/dots/dot_6.png",
	"images/dots/dot_7.png",
	"images/dots/dot_8.png",
	"images/dots/dot_9.png",
	"images/dots/dot_10.png",
	"images/dots/x.png",
	];
// used later to preload the dots and stuff.

image_uris = new Array();

for (var i of trials) {
	image_uris.push(i['target_pic']);
	image_uris.push(i['foil_pic'])
}


for (var i of training_trials) {
	image_uris.push(i['target_pic']);
	image_uris.push(i['foil_pic'])
}

for (asset of image_assets) {
	image_uris.push(asset);
}

image_uris = $.uniqueSort(image_uris);

preload_images = new Array();

for (uri in image_uris) {
	preload_images.push(new Image());
}

for (i = 0; i<image_uris.length; i++) {
	preload_images[i].src = image_uris[i];
}
// Preload all the images.

var results = ["subject_id",
	"trial_number",
	"trial_id",
	"target_side",
	"foil_side",
	"trial_type",
	"date_stamp",
	"time_stamp",
	"side_chosen",
	"accuracy",
	'rt',
	"country",
	"testing_loc",
	"gender",
	"date_of_birth",
	"ethnicity",
	"native_lang",
	"other_langs",
	"parental_occ",
	"dev_info",
	"birth_order",
	"num_siblings\n"].join(seperator = [","]);

var data = {
	rt: 0,
		//
	subject_id: "",
		//given at beginning of experiment
	trial_number: 0,
		// Number of trial in terms of presentation
	trial_id: 0,
		// ID of trial in the JSON file
	target_side: "",
		// L or R
	foil_side: "",
		// L or R
	trial_type: "",
		// Training, critical, or something else
	date_stamp: getCurrentDate(),
		//the date of the experiment
	time_stamp: getCurrentTime(),
		//the time that the trial was completed at 
	accuracy: 0,
		// 0 = choice did not match target
		// 1 = choice matched target
	ethnicity: "",
	native_lang: "",
	other_langs: "",
	parental_occ: "",
	dev_info: "",
	birth_order: "",
	num_siblings: "",
	date_of_birth: "",
	gender: "",
};

function randomString() {
	length = 25;
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
// Function to create a random string. Used to make unique IDs for participants.

function fill_field() { 
    var txt=document.getElementById("subject_id").value; 
    document.getElementById("subject_id").value = randomString();; 
    }

// Function called when clicking on "Generate" button on data input screen at start. Auto-fills the subject ID field with random ID.

function getCurrentDate() {
	var currentDate = new Date();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	return (month + "/" + day + "/" + year);
}

function getCurrentTime() {
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();

	if (minutes < 10) minutes = "0" + minutes;
	return (hours + ":" + minutes);
}

function showSlide(id) {
  $(".slide").hide(); //jquery - all elements with class of slide - hide
  $("#"+id).show(); //jquery - element with given id - show
}
// Used to show a particular HTML slide. First it hides ALL slides (i.e. all HTML elements with the slide
// class) and then it shows the particular slide which has the given ID.

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
// Used to shuffle trial order

function processOneRow() {
	var dataforRound = data.subject_id + ","
	+ data.trial_number + ","
	+ data.trial_id + ","
	+ data.target_side + ","
	+ data.foil_side + ","
	+ data.trial_type + ","
	+ data.date_stamp + ","
	+ data.time_stamp + ","
	+ data.side_chosen + ","
	+ data.accuracy + ","
	+ data.rt + ","
	+ data.country + ","
	+ data.testing_loc + ","
	+ data.gender + ","	
	+ data.date_of_birth + ","
	+ data.ethnicity + ","
 	+ data.native_lang + ","
 	+ data.other_langs + ","
 	+ data.parental_occ + ","
 	+ data.dev_info + ","
 	+ data.birth_order + ","
 	+ data.num_siblings + "\n";

	results += dataforRound;	
}

function createDot(dotx, doty, i) {

	var dot = document.createElement("img");

	dot.setAttribute("class", "dot");

	dot.id = "dot_" + i;

	dot.src = "images/dots/dot_" + i + ".png";
	

	var x = Math.floor(Math.random()*750);
	var y = Math.floor(Math.random()*540);

	var invalid = "true";

	//make sure dots do not overlap
	while (true) {
		invalid = "true";
		for (j = 0; j < dotx.length ; j++) {
			if (Math.abs(dotx[j] - x) + Math.abs(doty[j] - y) < 250) {
				var invalid = "false";
				break; 
			}
		}
		if (invalid === "true") {
			dotx.push(x);
			doty.push(y);
			break;	
		}
		x = Math.floor(Math.random()*400);
		y = Math.floor(Math.random()*400);
	}

	dot.setAttribute("style","position:absolute;left:"+x+"px;top:"+y+"px;");
	training.appendChild(dot);
}
// This adds a dot to the screen. Called during training.

function do_training(dotgame) {
	var allDots = ["dot_1", "dot_2", "dot_3", "dot_4", "dot_5", 
					"dot_6", "dot_7", "dot_8", 
					"dot_9", "dot_10"];
	
	xcounter = 0;
	var dotCount = 5;

	var dotx = [];
	var doty = [];

	if (dotgame === 0) {
		for (i = 0; i < 5; i++) {
			createDot(dotx, doty, i+1);
		}
	} else {
		for (i = 5; i < 10; i++) {
			createDot(dotx, doty, i+1);
		}
	}
	showSlide("training");

	$('.dot').bind('click touchstart', function(event) {
		var dotID = $(event.currentTarget).attr('id');

		//only count towards completion clicks on dots that have not yet been clicked
		if (allDots.indexOf(dotID) === -1) {
			return;
		}
		allDots.splice(allDots.indexOf(dotID), 1);
		document.getElementById(dotID).src = "images/dots/x.png";
		
		xcounter++
		
		if (xcounter === dotCount) {
			setTimeout(function () {
				$("#training").hide();
				if (dotgame === 0) {		
					//hide old x marks before game begins again
					var dotID;
					for (i = 1; i <= dotCount; i++) {
						dotID = "dot_" + i;
						training.removeChild(document.getElementById(dotID));
					}
					do_training();
					dotgame++; 
				} else {
					//document.body.style.background = "black";
					setTimeout(function() {
						showSlide("confirm");
						//data.next();
					}, normalpause*2);
				}
			}, normalpause*2);
		}
	});	   
}
// Does several things:
// Update data variable with subject data from welcome screen.
// Display the dots and plays the dot game.
// When done, shows the "confirm" slide that has a "Begin!" button
// to start running the trials.

function confirm() {

	data.birth_order = document.getElementById("birth_order").value;
	data.num_siblings = document.getElementById("num_siblings").value;

	data.ethnicity = document.getElementById("ethnicity").value.replace(/,/g, " ");
	data.native_lang = document.getElementById("native_lang").value.replace(/,/g, " ");
	data.other_langs = document.getElementById("other_langs").value.replace(/,/g, " ");
	data.parental_occ = document.getElementById("parental_occ").value.replace(/,/g, " ");
	data.dev_info = document.getElementById("dev_info").value.replace(/,/g, " ");

	data.subject_id = document.getElementById("subject_id").value;
	data.date_of_birth = document.getElementById("date_of_birth").value;
	data.testing_loc = document.getElementById("testing_loc").value;
	
	if (document.getElementById("gender").checked === true) {
		data.gender = 'male';
	}
	if (document.getElementById("gender").checked === false) {
		data.gender = 'female';
	}
	if (document.getElementById("country").checked === true) {
		data.country = 'edinburgh';
	}
	if (document.getElementById("country").checked === false) {
		data.country = 'berkeley';
	}

	document.body.style.background = "white";
	$("#confirm").hide();
	setTimeout(function () {
		run_all_trials();
	}, normalpause);
}
// Called when clicking on "Begin!" after the dot game

function end() {
	setTimeout(function () {
		$("#stage").fadeOut();
	}, normalpause);
	showSlide("finished");
	document.body.style.background = "black";
	// upload_to_dropbox();
}
// Called when all trials are done.

function upload_to_dropbox() {
	var client = new Dropbox.Client({ key: dropbox_key, token: dropbox_token});

	client.authenticate();

	client.writeFile(data.subject_id + '_data.csv', results, function(error) {
		if (error) {
			console.log('dropbox error:', error);
		} else {
			console.log('File written to dropbox')
		}
	});
}
// Uploads CSV to Dropbox

function set_up_pseudo_counterbalance() {
	var num_training = training_trials.length;
	var num_trials = trials.length;

	var side_to_use = new Array();

	// Hope that number of real trials is even...

	for (i = 0; i<num_trials/2; i++) {
		side_to_use.push("left");
		side_to_use.push("right");
	}
	// Adds 50% R, 50% L.

	shuffle(side_to_use);

	for (i=0; i<num_training/2; i++) {
		side_to_use.splice(0,0,"left");
		side_to_use.splice(0,0,"right");
	}
	// Insert L/R for training at the beginning.

	return side_to_use;
}

function set_up_trial_list() {

	shuffle(trials);

	// Shuffles the array of critical trials
	
	// Add filler trials at point 
	trials.splice(2,0,filler_trials[0]);
	trials.splice(4,0,filler_trials[1]);
	// Add the training trials to main list of trials 

	for (var item of training_trials) {
		trials.splice(0,0,item);
	}
	console.log(trials);
	// Makes sure that the training trials always happen first. They won't be shuffled in with the
	// others but they will be in backwards order to what they are in the .json file,
	// though that should not matter.

	// We later iterate through the trials array and apply a function to using forEach()
	// This function will deal with the trial.
}

function show_choices(current_trial, target_side) {
	if (target_side === 'left') {
			t = $('#left');
			f = $('#right');
		} else {
			t = $('#right');
			f = $('#left');
		}

	t.attr('src', current_trial['target_pic']);
	f.attr('src', current_trial['foil_pic']);

	t.fadeIn();
	f.fadeIn();
}


// $("#video").on('ended', function(){
// 	this.webkitExitFullscreen();
// });
// This will close the video from fullscreen automatically when it is done playing

function close_fullscreen() {
	$('#video')[0].webkitExitFullscreen();
}


function run_all_trials() {
	$('#left').fadeOut(0);//.css("z-index", "99");
	$('#right').fadeOut(0);//.css("z-index", "99");	
	counterbalance_list = set_up_pseudo_counterbalance();
	set_up_trial_list();
	// If you run these the other way round, then trial list is edited in place and gives the wrong length
	// for making the counterbalance list.	

	counter = 1;
	number_of_trials = trials.length;

	current_trial = trials[0];
	target_side = counterbalance_list[0];

	console.log(current_trial);

	$("#video").attr("src", current_trial["video"]);
	// Show first video

	$("#stage").fadeIn();

	clickDisabled = false;

	// video.addEventListener('ended', function() {show_choices(current_trial, target_side);});

	$('#video').on('click touchstart', function(event){
		//video.webkitEnterFullscreen();
		start_time = (new Date()).getTime();
		video.play();
		
		if (target_side === 'left') {
			t = $('#left');
			f = $('#right');
		} else {
			t = $('#right');
			f = $('#left');			
		}
		t.attr('src', current_trial['target_pic']);
		f.attr('src', current_trial['foil_pic']);
			
        console.log(video.duration);
        console.log(video.currentTime);
        //while (parseFloat(video.currentTime) < 500){//(current_trial['question_length'])){
        
        //}
    	video.addEventListener("timeupdate", function() {
      	 if (this.currentTime >= current_trial['question_length']) {
		setTimeout(function(){
			$('#video').fadeOut(600);//css("z-index", "-1");
			$("#stage").fadeIn(600); // maybe need to take this out
		    $('#left').fadeIn(600);//.css("z-index", "99");
		    $('#right').fadeIn(600);//.css("z-index", "99");

			t.fadeIn();
			f.fadeIn();
		}, 50);//current_trial['question_length']);//video.duration*1000  + 500);
		}
  		  }, false);
		console.log(video.currentTime > 0);
		//setTimeout(close_fullscreen, video.duration*1000 - current_trial['question_length']);
	})
	// This will drop the video out of fullscreen in time for the question at the end.
	// This means that the question is given at the same time as being able to see the options.
	// 'question_length' === the number of seconds the question takes.
	// Assumes question is right at the end of the video.

	//When a choice is clicked, then record data and move on.
	$('.choice').on('click touchstart', function(event){
		if (response === target_side) {
				data.accuracy = 1;
			} else {
				data.accuracy = 0;
			}	
		if (current_trial['trial_id']=='book_WE_feedback'){
				if (data.accuracy == 0){
		$(this).attr('src', 'images/dots/qu_mark.png');				
				}
			} else {
		$(this).attr('src', 'images/dots/x_trans.png');
			}
		if (clickDisabled === false) {
			clickDisabled = true;
			video.pause();
			var response = $(this).attr('id');
			
	

			//$('.choice').not(this).hide();
			
			//$(this).effect('bounce', {'times':6, 'distance':200}, 1000);
			
		
			// Add a brief pause for feedback at the end of each trial
			if (current_trial['trial_id']=='book_WE_feedback'){
				if (data.accuracy == 0){
					var feedbacktime = 6000;
					} else {
					var feedbacktime = 4000;
					}
			} else {
				var feedbacktime = 2000;
				}
			
			setTimeout(function(){		
				$('#left').fadeOut();
				$('#right').fadeOut();
			    


				data.rt = (new Date()).getTime() - start_time - (video.duration*1000);

				if (start_time === -1) {
					data.rt = -1;
				}

				data.trial_number = counter;
				data.trial_id = current_trial['trial_id'];
				data.target_side = target_side;
				data.trial_type = current_trial['trial_type'];
			
				if (target_side === 'left') {
					data.foil_side = 'right'
				} else {
					data.foil_side = 'left'
				}

				data.side_chosen = response;

				processOneRow();
				upload_to_dropbox();
				// Uploads to dropbox incrementally, row by row, after each trial.

				data.rt = -1;
				start_time = -1;

				//put all the data saving stuff here...


				trials.splice(0, 1);
				counterbalance_list.splice(0, 1);
				counter++;
				// Pop off the trial/counterbalance we just used and update trial counter.

				setTimeout(function() {
					$("#stage").fadeOut();
					//$('#video').css("z-index", "99");
					if (counter === number_of_trials + 1) {
						end();
						return;
					}
				
					setTimeout(function(){

							current_trial = trials[0];
							console.log(current_trial);
							// Get new trial
							target_side = counterbalance_list[0];
							// Get next side to use

							$("#video").attr("src", current_trial["video"]);

							//show_choices(current_trial, target_side);

							$('#left').hide();
							$('#right').hide();
						//	$('#video').css("z-index", "-1");
						//    $('#left').css("z-index", "99");
				    	//	$('#right').css("z-index", "99");
							


							start_time = (new Date()).getTime();
							$('#video').fadeIn();//css("z-index", "-1");
							$("#stage").fadeIn();
							clickDisabled = false
					},
						normalpause);
				},
					timeafterClick);
			},feedbacktime);
		} else {
			console.log('clicking disabled on choice images as choice already made');
		}
	});	
}

showSlide("new_subject");