const myMusic = require('../../utils/json');

Page({
    data: {
        showSongList: false,
        showBackground: false,
        musicDetail: {},
        musicList: [],
        isPlay: false,
        currentSongNumber: 0,
        songCurrent: '',
        timeNumber: 0,
        pointerDeg: '',
        already: '00:00',
        future: '00:00',
        playSrc: '../../image/play.png',
        clickTime: 0,
        animationData: {},
        animationBackground: {}
    },
    onHide: function () {
        if (this.data.isPlay) {
            this.bindMusicTrigger();
        }
    },
    // 初始化
    onLoad: function () {
        let musicList = myMusic.musicData.result;
        this.audio = wx.createAudioContext('myAudio');
        this.setData({
            musicDetail: musicList[0],
            currentSongNumber: 0,
            musicList: musicList
        })
        this.audio.onEnded = function (event) {
            this.setData({
                musicStop: 'music-cd music-cd-stop',
                isPlay: false
            })
        }
    },
    onShareAppMessage: function (res) {
        return {
            title: this.data.musicDetail.title,
            desc: '来自温暖天堂的歌曲！',
            path: '/pages/music/music',
            imageUrl: this.data.musicDetail.pic,
            success: (res) => {
                console.log("转发成功", res);
            },
            fail: (res) => {
                console.log("转发失败", res);
            }
        }
    },
    //音乐暂停与播放
    bindMusicTrigger: function () {
        this.data.musicList.map(item => item.isSong = '');
        this.data.musicList[this.data.currentSongNumber].isSong = 'song-current';
        this.setData({
            musicList: this.data.musicList
        })
        // 根据播放进度获取指针角度
        const pointerPosition = this.data.timeNumber / 100 * 15;
        if (!this.data.isPlay) {
            this.audio.play();
            this.setData({
                musicStop: 'music-cd ',
                isPlay: true,
                playSrc: '../../image/pause.png',
                pointerDeg: 'transform: rotate(' + (pointerPosition - 10) + 'deg)'
            })
        } else {
            this.audio.pause();
            this.setData({
                musicStop: 'music-cd music-cd-stop',
                isPlay: false,
                playSrc: '../../image/play.png'
            })
        }
    },
    // 音频进度
    timeUpdate: function (event) {
        let time = Math.floor(event.detail.currentTime) / Math.floor(event.detail.duration);
        time = Math.floor(time * 100);
        const pointerPosition = time * 15;
        //  开始  -10deg  结束   5deg 
        this.setData({
            timeNumber: time,
            musicTimePosition: time + '%',
            pointerDeg: 'transform: rotate(' + (pointerPosition / 100 + -10) + 'deg)'
        })
        this.showSecond(event);
    },
    // 上一首
    preSong: function () {
        let date = new Date();
        let m = date.getTime();
        if (!wx.getStorageSync('m')) {
            this.preSongFun(m);
        } else if (m - wx.getStorageSync('m') < 3000) {
            wx.showToast({
                title: '好好听歌,点慢一点',
                icon: 'none'
            })
        } else {
            this.preSongFun(m);
        }
    },
    // 上一首
    preSongFun: function (m) {
        wx.setStorageSync('m', m) //把分钟数放到缓存
        if (!this.data.currentSongNumber) {
            this.setData({
                currentSongNumber: this.data.musicList.length - 1,
                musicDetail: this.data.musicList[this.data.musicList.length - 1],
                isPlay: false
            })
        } else {
            this.setData({
                currentSongNumber: this.data.currentSongNumber - 1,
                musicDetail: this.data.musicList[this.data.currentSongNumber - 1],
                isPlay: false
            })
        }
        this.playSong();
    },
    // 下一首
    nextSong: function () {
        let date = new Date();
        let m = date.getTime();
        if (!wx.getStorageSync('m')) {
            this.nextSongFun(m);
        } else if (m - wx.getStorageSync('m') < 3000) {
            wx.showToast({
                title: '好好听歌,点慢一点',
                icon: 'none'
            })
        } else {
            this.nextSongFun(m);
        }
    },
    nextSongFun: function (m) {
        wx.setStorageSync('m', m) //把分钟数放到缓存
        if (this.data.currentSongNumber == this.data.musicList.length - 1) {
            this.setData({
                currentSongNumber: 0,
                musicDetail: this.data.musicList[0],
                isPlay: false
            })
        } else {
            this.setData({
                currentSongNumber: this.data.currentSongNumber + 1,
                musicDetail: this.data.musicList[this.data.currentSongNumber + 1],
                isPlay: false
            })
        }
        this.playSong();
    },
    // 上一首下一首开始播放
    playSong() {
        this.setData({
            timeNumber: 0,
            pointerPosition: 'transform: rotate(-20deg)',
            already: '00:00',
            future: '00:00',
            clickTime: new Date().getTime()
        });
        setTimeout(() => {
            this.bindMusicTrigger();
        }, 500)
    },
    // 暂停的时候
    onPause: function () {
        this.setData({
            pointerDeg: 'transform: rotate(-20deg)'
        })
    },
    // 显示播放秒数和未播放秒数
    showSecond: function (event) {
        if (event.detail) {
            this.setData({
                already: this.setSecond(event.detail.currentTime),
                future: this.setSecond(event.detail.duration - event.detail.currentTime)
            })
        }
    },
    // 设置秒数
    setSecond: function (num) {
        if (num) {
            if (num < 60) {
                if (num < 10) {
                    return '00:' + '0' + Math.round(num)
                }
                return '00:' + Math.round(num);
            } else {
                let lastMinute = Math.round(num / 60);
                let lastSecond = Math.round(num % 60) < 10 ? '0' + Math.round(num % 60) : Math.round(num % 60);
                return '0' + lastMinute + ':' + lastSecond;
            }
        } else {
            return '00:00';
        }
    },
    // 显示歌曲列表
    onShowList: function () {
        this.setData({
            musicList: this.data.musicList
        });
        var that = this;
        if (that.data.showSongList) {
            var animation = wx.createAnimation({
                duration: 400,
                timingFunction: 'ease-in-out'
            });
            this.animation = animation;
            animation.translateY('0px').step();
            that.setData({
                animationData: animation.export(),
            });
            setTimeout(function () {
                animation.translateY('500px').step()
                that.setData({
                    animationData: animation.export(),
                });
                setTimeout(function () {
                    that.setData({
                        showSongList: false,
                        showBackground: false
                    });
                }, 400)
            }, 100)
        } else {
            var animation = wx.createAnimation({
                duration: 400,
                timingFunction: 'ease-in-out',
            });
            this.animation = animation;
            animation.translateY('500px').step();
            that.setData({
                animationData: animation.export(),
                showSongList: true,
                showBackground: true
            });
            setTimeout(function () {
                animation.translateY('0px').step()
                that.setData({
                    animationData: animation.export()
                })
            }, 100)
        }
    },
    // 选择一首歌
    selectSong: function (e) {
        let index = e.currentTarget.dataset.index;
        if (index !== this.data.currentSongNumber) {
            this.setData({
                musicDetail: this.data.musicList[index],
                isPlay: false,
                currentSongNumber: index
            })
        }
        this.bindMusicTrigger();
    }
});