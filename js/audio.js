const audio = document.getElementById("audio");
const playIconContainer = document.getElementById('audio-play-icon');
const audioPlayerContainer = document.getElementById('audio-player-container');
let playState = 'play';


audio.volume = 0.4

const playAnimation = lottie.loadAnimation({
    container: playIconContainer,
    path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/mute/mute.json',
    renderer: 'svg',
    loop: false,
    autoplay: false,
    name: "Play Animation",
});

playAnimation.goToAndStop(14, true);

playIconContainer.addEventListener('click', () => {
    if(playState === 'play') {
        audio.play();
        playAnimation.playSegments([15, 25], true);
        playState = 'pause';
    } else {
        audio.pause();
        playAnimation.playSegments([0, 15], true);
        playState = 'play';
    }
});

