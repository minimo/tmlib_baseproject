/*
 *  CdvGameCenter.js
 *  2015/05/13
 *  @auther minimo  
 *  This Program is MIT license.
 */

//GAMECENTER(GooglePlay)使用可能フラグ
ENABLE_GAMECENTER = false;
DEBUG_GAMECENTER = false;

// GAMECENTER CallBack
var onGamecenterSuccess = function() {
    if (DEBUG_GAMECENTER) AdvanceAlert('GameCenter connect success');
    ENABLE_GAMECENTER = true;
}

var onGamecenterFailure = function(result) {
    if (DEBUG_GAMECENTER) AdvanceAlert('GameCenterに接続できませんでした\n'+result);
    ENABLE_GAMECENTER = false;
}

//リーダーズボード参照
var showLeadersBoard = function(id) {
    id = id || "";

    if (DEVICE_IOS) {
        if (!ENABLE_PHONEGAP) {
            appMain.pushScene(tmapp.AlertDialog({
                height: SC_H*0.2,
                text1: "GameCenterに接続できませんでした",
                fontSize: 32,
                button: "OK"
            }));
            return false;
        }
        //GAMECENTERに接続してない場合は再接続
        if (!ENABLE_GAMECENTER) {
            gamecenter.auth(onGamecenterSuccess, onGamecenterFailure);

            //再接続失敗
            if (!ENABLE_GAMECENTER) {
                appMain.pushScene(tmapp.AlertDialog({
                    height: SC_H*0.2,
                    text1: "GameCenterに接続できませんでした",
                    fontSize: 32,
                    button: "OK"
                }));
                return false;
            }
        }

        gamecenter.showLeaderboard(function(){}, function(){}, {
            leaderboardId: id,
        });
        return true;
    }
    if (DEVICE_ANDROID) {
        if (id == "") {
            googleplaygame.showAllLeaderboards();
        } else {
            //IDをGooglePlay向けに変換
            if (id == "Normal_")    id = "CgkI-I-vk7YTEAIQAA";
            if (id == "Normal_RJ")  id = "CgkI-I-vk7YTEAIQAQ";
            if (id == "Hard_")      id = "CgkI-I-vk7YTEAIQAg";
            if (id == "Hard_RJ")    id = "CgkI-I-vk7YTEAIQAw";
            googleplaygame.showLeaderboard({
                leaderboardId: id,
            });
        }
        return true;
    }
}

//GameCenterにスコアを登録
var submitScore = function(mode, returnJoker, score) {
    if (!ENABLE_GAMECENTER) return false;
    if (DEVICE_IOS) {
        var id = "Normal_";
        if (mode == GAMEMODE_HARD) id = "Hard_";
        if (returnJoker) id += "RJ";
        gamecenter.submitScore(
            function() {
                if (DEBUG_GAMECENTER) AdvanceAlert('スコア登録に成功しました');
            },
            function() {
                if (DEBUG_GAMECENTER) AdvanceAlert('スコア登録に失敗しました');
            }, {
                score: score,
                leaderboardId: id,
            });
    }
    if (DEVICE_ANDROID) {
        var id = "";
        if (mode == GAMEMODE_NORMAL && !returnJoker) id = "CgkI-I-vk7YTEAIQAA";
        if (mode == GAMEMODE_NORMAL && returnJoker)  id = "CgkI-I-vk7YTEAIQAQ";
        if (mode == GAMEMODE_HARD   && !returnJoker) id = "CgkI-I-vk7YTEAIQAg";
        if (mode == GAMEMODE_HARD   && returnJoker)  id = "CgkI-I-vk7YTEAIQAw";
        googleplaygame.submitScore({
                score: score,
                leaderboardId: id,
            },
            function() {
                if (DEBUG_GAMECENTER) AdvanceAlert('スコア登録に成功しました');
            },
            function() {
                if (DEBUG_GAMECENTER) AdvanceAlert('スコア登録に失敗しました');
            });
    }
}

//GameCenterに実績登録
var reportAchievements = function(name, percent) {
    if (!ENABLE_GAMECENTER) return false;
    if (DEVICE_IOS) {
        gamecenter.reportAchievement(
            function(){
                if (DEBUG_GAMECENTER) AdvanceAlert('実績登録に成功しました');
            },
            function(){
                if (DEBUG_GAMECENTER) AdvanceAlert('実績登録に失敗しました');
            }, {
                achievementId: name,    //GameCenterは実績名とidが同一
                percent: "100"
            });
    }
    if (DEVICE_ANDROID) {
        if (tmapp.achievementList[name].id === undefined) return false;
        if (tmapp.achievementList[name].id == "") return false;
        googleplaygame.unlockAchievement({
                achievementId: tmapp.achievementList[name].id
            },
            function(){
                if (DEBUG_GAMECENTER) AdvanceAlert('実績登録に成功しました');
            },
            function(){
                if (DEBUG_GAMECENTER) AdvanceAlert('実績登録に失敗しました');
            });
    }
    return true;
}

//GameCenterの実績をリセット
var resetAchievements = function() {
    if (!ENABLE_GAMECENTER) return false;
    if (DEVICE_IOS) {
        gamecenter.resetAchievements(
            function(){
                if (DEBUG_GAMECENTER) AdvanceAlert('実績リセットに成功しました');
            },
            function(){
            if (DEBUG_GAMECENTER) AdvanceAlert('実績リセットに失敗しました');
            });
    }
    if (DEVICE_ANDROID) {
    }
}

