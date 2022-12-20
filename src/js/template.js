import Icons from './icons';
import tplPlayer from '../template/player.art';

class Template {
    constructor(options) {
        this.container = options.container;
        this.options = options.options;
        this.randomOrder = options.randomOrder;
        this.init();
    }

    init() {
        let cover = '';
        if (this.options.audio.length) {
            if (this.options.order === 'random') {
                cover = this.options.audio[this.randomOrder[0]].cover;
            } else {
                cover = this.options.audio[0].cover;
            }
        }

        this.container.innerHTML = tplPlayer({
            options: this.options,
            icons: Icons,
            cover: cover,
            getObject: (obj) => obj,
        });

        this.lrc = this.container.querySelector('.chipplayer-lrc-contents');
        this.lrcWrap = this.container.querySelector('.chipplayer-lrc');
        this.ptime = this.container.querySelector('.chipplayer-ptime');
        this.info = this.container.querySelector('.chipplayer-info');
        this.time = this.container.querySelector('.chipplayer-time');
        this.barWrap = this.container.querySelector('.chipplayer-bar-wrap');
        this.button = this.container.querySelector('.chipplayer-button');
        this.body = this.container.querySelector('.chipplayer-body');
        this.list = this.container.querySelector('.chipplayer-list');
        this.listCurs = this.container.querySelectorAll('.chipplayer-list-cur');
        this.played = this.container.querySelector('.chipplayer-played');
        this.loaded = this.container.querySelector('.chipplayer-loaded');
        this.thumb = this.container.querySelector('.chipplayer-thumb');
        this.volume = this.container.querySelector('.chipplayer-volume');
        this.volumeBar = this.container.querySelector('.chipplayer-volume-bar');
        this.volumeButton = this.container.querySelector('.chipplayer-time button');
        this.volumeBarWrap = this.container.querySelector('.chipplayer-volume-bar-wrap');
        this.loop = this.container.querySelector('.chipplayer-icon-loop');
        this.order = this.container.querySelector('.chipplayer-icon-order');
        this.menu = this.container.querySelector('.chipplayer-icon-menu');
        this.pic = this.container.querySelector('.chipplayer-pic');
        this.title = this.container.querySelector('.chipplayer-title');
        this.author = this.container.querySelector('.chipplayer-author');
        this.dtime = this.container.querySelector('.chipplayer-dtime');
        this.notice = this.container.querySelector('.chipplayer-notice');
        this.miniSwitcher = this.container.querySelector('.chipplayer-miniswitcher');
        this.skipBackButton = this.container.querySelector('.chipplayer-icon-back');
        this.skipForwardButton = this.container.querySelector('.chipplayer-icon-forward');
        this.skipPlayButton = this.container.querySelector('.chipplayer-icon-play');
        this.lrcButton = this.container.querySelector('.chipplayer-icon-lrc');
        this.includeModIcon = this.container.querySelector('.chipplayer-includeIcon');
    }
}

export default Template;
