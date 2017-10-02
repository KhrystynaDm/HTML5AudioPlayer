$(document).ready(function() {

    var audio;
    var playlist;
    var tracks;
    var current;
    var media = document.querySelector('audio');
    var controls = document.querySelector('.controls');

    var play = document.querySelector('.play');
    var stop = document.querySelector('.stop');
    var rwd = document.querySelector('.rwd');
    var fwd = document.querySelector('.fwd');


    var volume = document.querySelector('.volume');

    var timerWrapper = document.querySelector('.timer');
    var timer = document.querySelector('.timer span');
    var timerBar = document.querySelector('.timer div');
    init();


    /*  media.removeAttribute('controls');*/
    controls.style.visibility = 'visible';


    play.addEventListener('click', playPauseMedia);

    function playPauseMedia() {
        if (media.paused) {
            play.setAttribute('data-icon', 'u');
            media.play();
        }
        else {
            play.setAttribute('data-icon', 'P');
            media.pause();
        }
    }

    stop.addEventListener('click', stopMedia);
    media.addEventListener('ended', stopMedia);

    function stopMedia() {
        media.pause();
        media.currentTime = 0;
        play.setAttribute('data-icon', 'P');
    }
    rwd.addEventListener('click', mediaBackward);
    fwd.addEventListener('click', mediaForward);

    var intervalFwd;
    var intervalRwd;

    function mediaBackward() {
        clearInterval(intervalFwd);
        fwd.classList.remove('active');

        if (rwd.classList.contains('active')) {
            rwd.classList.remove('active');
            clearInterval(intervalRwd);
            media.play();
        }
        else {
            rwd.classList.add('active');
            media.pause();
            intervalRwd = setInterval(windBackward, 200);
        }
    }

    function mediaForward() {
        clearInterval(intervalRwd);
        rwd.classList.remove('active');

        if (fwd.classList.contains('active')) {
            fwd.classList.remove('active');
            clearInterval(intervalFwd);
            media.play();
        }
        else {
            fwd.classList.add('active');
            media.pause();
            intervalFwd = setInterval(windForward, 200);
        }
    }

    function windBackward() {
        if (media.currentTime <= 3) {
            rwd.classList.remove('active');
            clearInterval(intervalRwd);
            stopMedia();
        }
        else {
            media.currentTime -= 3;
        }
    }

    function windForward() {
        if (media.currentTime >= media.duration - 3) {
            fwd.classList.remove('active');
            clearInterval(intervalFwd);
            stopMedia();
        }
        else {
            media.currentTime += 3;
        }
    }





    media.addEventListener('timeupdate', setTime);

    function setTime() {
        var minutes = Math.floor(media.currentTime / 60);
        var seconds = Math.floor(media.currentTime - minutes * 60);
        var minuteValue;
        var secondValue;

        if (minutes < 10) {
            minuteValue = '0' + minutes;
        }
        else {
            minuteValue = minutes;
        }

        if (seconds < 10) {
            secondValue = '0' + seconds;
        }
        else {
            secondValue = seconds;
        }

        var mediaTime = minuteValue + ':' + secondValue;
        timer.textContent = mediaTime;

        var barLength = timerWrapper.clientWidth * (media.currentTime / media.duration);
        timerBar.style.width = barLength + 'px';
    }

    var volumeBar = document.getElementById("volume-bar");
    // Event listener for the volume bar
    volumeBar.addEventListener("change", function() {
        // Update the video volume
        media.volume = volumeBar.value;
    });

    function init() {
        current = 0;
        audio = $('audio');
        playlist = $('#playlist');
        tracks = playlist.find('li a');
        len = tracks.length - 1;
        audio[0].volume = .10;
        audio[0].play();
        playlist.find('a').click(function(e) {
            e.preventDefault();
            link = $(this);
            current = link.parent().index();
            run(link, audio[0]);
        });
        audio[0].addEventListener('ended', function(e) {
            current++;
            if (current == len) {
                current = 0;
                link = playlist.find('a')[0];
            }
            else {
                link = playlist.find('a')[current];
            }
            run($(link), audio[0]);
        });
    }

    function run(link, player) {
        player.src = link.attr('href');
        par = link.parent();
        par.addClass('active').siblings().removeClass('active');
        audio[0].load();
        audio[0].play();
    }

});