import AudioSetting from "./AudioSetting";
/**
 * 音频播放控制类
 */
class AudioMgr extends AudioSetting {
    protected _list = {};
    musicAudioId = -1; // 当前播放音乐的id

    constructor(key?) {
        super(key);
        this.reset();
    }

    /** 添加后台监听 */
    addHideListen() {
        cc.game.on(cc.game.EVENT_GAME_INITED, () => {
            cc.game.on(cc.game.EVENT_HIDE, () => {
                cc.audioEngine.pauseAll();
            });
            cc.game.on(cc.game.EVENT_SHOW, () => {
                cc.audioEngine.resumeAll();
            });
        });
    }

    /**
      * 加载音效资源
      * @param {string} url
      */
    async loadAudio(url): Promise<cc.AudioClip> {
        return new Promise((resolve, reject) => {
            let clip = this._list[url];
            if (clip) {
                // console.log('clip is loaded url : ' + url);
                resolve(clip);
                return;
            }
            cc.loader.loadRes(url, cc.AudioClip, (err, clip) => {
                if (err) {
                    console.error(`loadAudio error: ${err.stack}`);
                    reject(null);
                    return;
                } else {
                    console.log(`loadAudio success: ${url}!!!`);
                    this._list[url] = clip;
                    resolve(clip);
                }
            })
        });
    }

    reset() {
        this.musicAudioId = -1;
        this._list = {};
    }

    /** 播放 */
    async playEffect(audioUrl: string | cc.AudioClip, loop = false): Promise<number> {
        let clip: cc.AudioClip = null;
        if (audioUrl instanceof cc.AudioClip) {
            clip = audioUrl;
        } else {
            try {
                clip = await this.loadAudio(audioUrl);
            } catch (error) {
                clip = null;
            }
        }
        if (!clip) return -1;
        const audioId = cc.audioEngine.playEffect(clip, loop);
        return Promise.resolve(audioId);
    }

    /**
     * 播放背景音乐
     * @param audioUrl 
     * @param loop 
     * @param volume 
     */
    async playMusic(audioUrl: string | cc.AudioClip, loop = true, volume = 1) {
        if (this.em) {
            this.stopMusic();
            let clip = null;
            try {
                clip = await this.loadAudio(audioUrl);
            } catch (error) {
                console.error(`play Music [${audioUrl}] error: ` + error.message);
            }
            if (!clip) return;
            console.warn('play url = ' + audioUrl);
            this.musicAudioId = cc.audioEngine.playMusic(clip, loop);
            cc.audioEngine.setMusicVolume(volume);
        }
    }

    stopMusic() {
        if (this.musicAudioId === -1)   return;
        cc.audioEngine.stopMusic();
    }

    /**
     * 播放音效
     * @param audioUrl 
     * @param loop 
     * @param volume 
     */
    play(audioUrl: string | cc.AudioClip, loop = false) {
        if (this.ee) {
            this.playEffect(audioUrl, loop);
        }
    }

    setFinishCallback(audioID, cb) {
        cc.audioEngine.setFinishCallback(audioID, cb);
    }
    pause(audioID) {
        cc.audioEngine.pause(audioID);
    }
    resume(audioID) {
        cc.audioEngine.pause(audioID);
    }
    stop(audioID) {
        cc.audioEngine.stop(audioID);
    }
    pauseAll() {
        cc.audioEngine.pauseAll();
    }
    resumeAll() {
        cc.audioEngine.resumeAll();
    }

    release(AudioClip) {
        cc.audioEngine.uncache(AudioClip);
    }
    clear() {
        cc.audioEngine.uncacheAll();
    }
    stopAll(isClear?) {
        cc.audioEngine.stopAll();
        isClear && this.clear();
        this.reset();
    }
}

let audioMgr = new AudioMgr();
export default audioMgr;