var socket = io();
var player = 0;
var myRoom;
var myBoard = [];

socket.on('room-full', function () {
	$('.room-full').css('display', 'inline');
	console.log("Room is currently full, please try again later!");
});

socket.on('win', function () {
	console.log("You win!");
	$('.victory').css("display", "block");
	$("#room-title").css('display', 'block');
	$("#room-input").css('display', 'inline');
	$("#room-submit").css('display', 'inline');
	$('#player-id').css('display', 'none');
	$('#turn-id').css('display', 'none');
	socket.disconnect();
});

socket.on('lose', function () {
	console.log("You lose!");
	$('.defeat').css("display", "block");
	$("#room-title").css('display', 'block');
	$("#room-input").css('display', 'inline');
	$("#room-submit").css('display', 'inline');
	$('#player-id').css('display', 'none');
	$('#turn-id').css('display', 'none');
	socket.disconnect();
});

socket.on('tie', function () {
	console.log("You tied!");
	$('.tie').css("display", "block");
	$("#room-title").css('display', 'block');
	$("#room-input").css('display', 'inline');
	$("#room-submit").css('display', 'inline');
	$('#player-id').css('display', 'none');
	$('#turn-id').css('display', 'none');
	socket.disconnect();
});

socket.on('patience', function () {
	console.log("Patience hit");
	$('#patience').css("display", "inline");
	setTimeout(function () {
		$('#patience').css("display", "none");
	}, 3000);
});


socket.on('begin-game', function (id, num) {
	$("#begin-title").css('display', 'block');
	$("#room-title").css('display', 'none');
	$("#room-input").css('display', 'none');
	$("#room-submit").css('display', 'none');
	player = num;
	console.log("Player number: " + num);
	$('#player-id').html('You are Player ' + num);
	$('#turn-id').html('Player 1\'s turn!');
});

socket.on('update-turn', function (room) {
	$('#turn-id').html('Player ' + room['turn'] + '\'s turn!');
});

socket.on('color-cell', function (r, c, turn) {
	var audio = new Audio("stuffed-and-dropped.mp3");
	audio.play();
	var $cell = $('.cell');
	$cell.each(function () {
		var row = $(this).attr("row");
		var col = $(this).attr("col");
		if (row == r && col == c) {
			if (turn === 1) {
				$(this).addClass('p1');
			} else {
				$(this).addClass('p2');
			}
		}
	});
});

socket.on('error', function(e) {
	console.log("Hit error: " + e);
})

var Game = function (board) {
	myGame = this;
	this.$board = board.$board;
}

Game.prototype.initiateBoard = function () {
	for (var i = 0; i < 6; i++) {
		var $newRow = $('<div>');
		for (var j = 0; j < 8; j++) {
			var $newCol = $('<div>');
			$newCol.attr({
				row: i,
				col: j
			});
			$newCol.addClass('cell');
			$newRow.append($newCol);
		}
		$newRow.addClass('row');
		$("#board").append($newRow);
	}

	$('.cell').on("click", function () {
		var row = $(this).attr('row');
		var col = $(this).attr('col');
		console.log("Row: " + row + ", Col:" + col);
	});

	$('.cell').on("click", this.clicked);

	$('#room-submit').on("click", function (e) {
	    var room = $('#room-input').val();
	    $('#room-id').html('Room: ' + room);
	    socket.emit('join-room', room);
	    myRoom = room;
	    $('#room-input').val('');
  	});
}

Game.prototype.clicked = function (e) {
	var cell = e.target;
	var row = $(cell).attr('row');
	var col = $(cell).attr('col');

	socket.emit('update-state', myRoom, player, row, col);
}
