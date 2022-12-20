const ap1 = new ChipPlayer({
    element: document.getElementById('player1'),
    mini: false,
    autoplay: true,
    lrcType: 3,
    mutex: true,
    theme: '#66CCFF',
    preload: 'metadata',
    audio: [{
        name: 'test',
        artist: 'test',
        url: './test.nsf',
        cover: '',
        lrc:''
    }]
});