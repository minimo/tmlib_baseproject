/*
 *  CdvDeviceEvents.js
 *  2014/07/15
 *  @auther minimo  
 *  This Program is MIT license.
 */

//実行ＯＳ種別
DEVICE_IOS = false;
DEVICE_ANDROID = false;

//定数
//PhoneGap使用可能フラグ
ENABLE_PHONEGAP = false;
DEBUG_PHONEGAP = false;

//PhoneGap Device Events
var onDeviceReady = function () {

    //使用ＯＳの判別
    DEVICE_IOS = ( /(android)/i.test(navigator.userAgent) )? false: true;
    if (!DEVICE_IOS) DEVICE_ANDROID = true;

    if (DEBUG_PHONEGAP) {
        AdvanceAlert('devicereadyイベントが発火しました');
        AdvanceAlert('Device:'+device.name+" "+device.platform);
    }

    ENABLE_PHONEGAP = true;

    //AdMob plugin
    if (AdMob) {
        var defaultOptions = {
            bannerId: admobid.banner,
            interstitialId: admobid.interstitial,
            position: AdMob.AD_POSITION.BOTTOM_CENTER,
            bgColor: 'black',
            isTesting: TEST_ADMOB,
            autoShow: true
        };
        AdMob.setOptions(defaultOptions);
        ENABLE_ADMOB = true;
    }

    //Game Center Plugin
    if (DEVICE_IOS) {
        gamecenter.auth(onGamecenterSuccess, onGamecenterFailure);
    }
    if (DEVICE_ANDROID) {
        googleplaygame.auth(onGamecenterSuccess, onGamecenterFailure);
    }

    //Social Message
    ENABLE_SOCIAL = true;
}

var onPause = function() {
    if (DEBUG_PHONEGAP) AdvanceAlert('pauseイベントが発火しました');

    //ゲーム中の場合ポーズシーンに移行
    var scene = appMain.currentScene;
    if (scene instanceof tmapp.MainScene && !scene.gameend) {
        appMain.pushScene(tmapp.PauseScene(scene));
    }
}

var onResume = function() {
    if (DEBUG_PHONEGAP) AdvanceAlert('resumeイベントが発火しました');

    //GAME CENTERに再度接続を行う
    if (DEVICE_IOS) {
        if (!ENABLE_GAMECENTER) {
            gamecenter.auth(onGamecenterSuccess, onGamecenterFailure);
        }
        return;
    }
    if (DEVICE_ANDROID) {
        if (!ENABLE_GAMECENTER) {
            googleplaygame.auth(onGamecenterSuccess, onGamecenterFailure);
        }
    }
}

var onOnline = function() {
    if (DEBUG_PHONEGAP) AdvanceAlert('onlineイベントが発火しました');
}

var onOffline = function() {
    if (DEBUG_PHONEGAP) AdvanceAlert('offlineイベントが発火しました');
}

//Phonegap Event listener
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener('pause', onPause, false);
document.addEventListener('resume', onResume, false);
document.addEventListener('online', onOnline, false);
document.addEventListener('offline', onOffline, false);
