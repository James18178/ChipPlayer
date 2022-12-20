import axios from 'axios'
var PlayerCore = {
  VolumeNum:1,
  last_audio_url:null,
  currentTime:0,
  duration:150,
  PlayerOptions:null,
  PlayerTemplate:null,
  PlayerEvents:null,
  initCore:null,
  isFirstInit:true,
  includeState:false,
  player_state_playing:false,
  player_state_seek:true,
  player_state_error:false,
  include:function(options,template,Events){
    PlayerCore.PlayerOptions = options;
    PlayerCore.PlayerTemplate = template;
    PlayerCore.PlayerEvents = Events;
    this._loadJS("player_core.js",this.PlayerCoreInitCallback)
  },
  seekTo:function(time){
    PlayerCore.player_state_seek = false;
    PlayerCore.currentTime = time;
    setTimeout(function(){PlayerCore.Player_core.cwrap('player_seek_to',null,['string'])(Number.parseInt(time));PlayerCore.player_state_seek = true;},500);
  },
  play:function(){
    if(PlayerCore.isFirstInit){
      PlayerCore.initCore();
      PlayerCore.isFirstInit = false;
    }
    if(PlayerCore.last_audio_url!=PlayerCore.src){
      PlayerCore.down_file();
    }
    PlayerCore.last_audio_url = PlayerCore.src
    PlayerCore.player_state_playing = true;
  },
  pause:function(){
    PlayerCore.player_state_playing = false;
  },
  setVolume:function(){
    PlayerCore.VolumeNum = PlayerCore.volume
  },
  PlayerCoreInitCallback:function(){
    if(!Module && !FS) throw "Player Core include error";
    PlayerCore.Player_core = Module;
    PlayerCore.Player_core_FS = FS;
    PlayerCore.includeState = true;
    var audioPlayer = {
        MAX_VOLUME: 0.0001,
        paused: true,
        init: function(bufferSize) {
            bufferSize = 8192
            var t = window.AudioContext || window.webkitAudioContext;
            audioPlayer.context = new t
            audioPlayer.context.resume()
            if (audioPlayer.context === null) {
                console.log('Web Audio API support not found, audio will not play.');
                return false;
            }
            audioPlayer.scriptProcessor = audioPlayer.createScriptProcessor(bufferSize,1,2);
            audioPlayer.scriptProcessor.onaudioprocess = function(e) {
                var left = e.outputBuffer.getChannelData(0);
                var right = e.outputBuffer.getChannelData(1);
                var is_play_ok = PlayerCore.Player_core.cwrap('player_track_ended', 'number')();
                if (!PlayerCore.player_state_playing || PlayerCore.player_state_error) {
                    for (var k = 0; k < bufferSize; k++) {
                        left[k] = 0;
                        right[k] = 0;
                    }
                } else {
                  if(PlayerCore.player_state_seek){
                    PlayerCore.currentTime += 0.2;
                    PlayerCore.PlayerEvents.trigger('timeupdate');
                    var ptr = PlayerCore.Player_core.cwrap('player_generate_sound_data', 'number')();
                    for (var i = 0; i < bufferSize; i++) {
                        left[i] = PlayerCore.Player_core.getValue(ptr + (i * 4), 'i16') * PlayerCore.VolumeNum;
                        right[i] = PlayerCore.Player_core.getValue(ptr + (i * 4) + 2, 'i16') * PlayerCore.VolumeNum;
                    }
                  }
                }
                if(is_play_ok==1 || PlayerCore.currentTime>PlayerCore.duration){
                  PlayerCore.currentTime = 0;
                  PlayerCore.player_state_playing = false;
                  PlayerCore.PlayerEvents.trigger('ended');
                }
            };
  
            audioPlayer.gain = audioPlayer.createGain();
            audioPlayer.setVolume(0.5);
  
            audioPlayer.scriptProcessor.connect(audioPlayer.gain);
            audioPlayer.gain.connect(audioPlayer.context.destination);
        },
  
        setVolume: function(volume) {
            audioPlayer.gain.gain.value = volume * audioPlayer.MAX_VOLUME;
        },
  
        createScriptProcessor: function(bufferSize) {
            var func = (audioPlayer.context.createScriptProcessor ||
                        audioPlayer.context.createJavaScriptNode ||
                        noop);
            return func.call(audioPlayer.context, bufferSize, 1, 2);
        },
  
        createGain: function() {
            var func = (audioPlayer.context.createGain ||
                        audioPlayer.context.createGainNode ||
                        noop);
            return func.call(audioPlayer.context);
        }
    };
    PlayerCore.initCore = audioPlayer.init;
  },
  down_file:function(){
    if(!Module && !FS) throw "Player Core include error";
    var Player_core = PlayerCore.Player_core;
    var Player_core_FS = PlayerCore.Player_core_FS;
    axios.get(PlayerCore.src,{params: {}, responseType: 'arraybuffer'}).then((res)=>{
      var from_File_num = new Uint8Array(res.data)[123];
          var all_cassettes = ["VRC6","VRC7","FDS","MMC5","N163","S5B"];
          var now_cassettes = ["2A03"];
          var output_data = "";
          var temp_1 = 0;
          while (0 != from_File_num){
              0 != (1 & from_File_num) && now_cassettes.push(all_cassettes[temp_1]);
              from_File_num >>= 1,
              temp_1++;
          }
          for(var one_cassettes in now_cassettes){
            output_data+=`<img style="padding: 0 0 0 5px;" src="http://nsf.nesbbs.com/res/cassettes/${now_cassettes[one_cassettes]}.png"></img>`
          }
          if(PlayerCore.PlayerOptions.showInclude){
            PlayerCore.PlayerTemplate.includeModIcon.innerHTML = output_data
          }
          Player_core_FS.writeFile("a.nsf", new Int8Array(res.data), {flags: 'w', encoding: 'binary'});
          Player_core.cwrap('player_open_file', null, ['string', 'number'])("a.nsf", 0);
          PlayerCore.PlayerEvents.trigger('loadedmetadata');
          PlayerCore.player_state_error = false
        }).catch(function(e){
          PlayerCore.PlayerEvents.trigger('error');
          PlayerCore.player_state_error = true;
        })
          
    
  },
  _loadJS:function(url,success){
    var domScript=document.createElement('script');
    domScript.src=url;
    success=success || function(){};
    domScript.onload=domScript.onreadystatechange=function(){
      if(!this.readyState || 'loaded' == this.readyState || 'complete'===this.readyState){
      success();
      this.onload=this.onreadystatechange=null;
      this.parentNode.removeChild(this);
      }
    }
    document.getElementsByTagName('head')[0].appendChild(domScript)
  }
};
export default PlayerCore;