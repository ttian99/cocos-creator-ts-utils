/**
 * 音频设置类
 */
export default class AudioSetting {
    em: boolean = true;
    ee: boolean = true;
    mv: number = 0.5;
    ev: number = 0.5;
    audioKey: string = 'audioSetting';

    constructor(audioKey: string = 'audioSetting') {
        this.em = true; // 允许播放音乐 enableMuisc
        this.ee = true; // 允许播放音效 enableEffect
        this.mv = 0.5; // 初始音乐音量
        this.ev = 0.5; // 初始音效音量
        this.audioKey = audioKey; // audioKey, 存储到localStorage中的Key值
        this.load();
    }

    /** 保存音频设置到localstorage */
    save() {
        const rst = {
            disableMusic: !this.em,
            disableEffect: !this.ee,
            musicVolume: this.mv,
            effectVolume: this.ev,
        };
        cc.sys.localStorage.setItem(this.audioKey, JSON.stringify(rst));
    }
    /** 加载音频设置从localstorage */
    load() {
        if (this.audioKey) {
            const rst = cc.sys.localStorage.getItem(this.audioKey);
            if (!rst) {
                console.error('load audio setting in localstorage error: audio setting is NULL!(audioKey = ' + this.audioKey + ')');
                this.save();
                return;
            }

            try {
                const json = JSON.parse(rst);
                this.em = !json.disableMusic;
                this.ee = !json.disableEffect;
                this.mv = json.musicVolume;
                this.ev = json.effectVolume;
            } catch (err) {
                console.error('load audio setting in localstorage error: parse audio setting error!(audioKey = ' + this.audioKey + ')');
            }
        }
    }
    // 获取是否允许播放音频
    get isEnableEffect() { return this.ee; }
    // 设置是否允许播放音频
    set isEnableEffect(bvar: boolean) { this.ee = bvar; this.save();}
    // 获取是否允许播放音乐
    get isEnableMusic() { return this.em; }
    // 设置是否允许播放音乐
    set isEnableMusic(bvar: boolean) { this.em = bvar; this.save();}
}
