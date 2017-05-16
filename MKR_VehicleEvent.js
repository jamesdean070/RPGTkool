//=============================================================================
// MKR_VehicleEvent.js
//=============================================================================
// Copyright (c) 2016-2017 マンカインド
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/05/16 初版公開。
// ----------------------------------------------------------------------------
// [Twitter] https://twitter.com/mankind_games/
//  [GitHub] https://github.com/mankindGames/
//    [Blog] http://mankind-games.blogspot.jp/
//=============================================================================

/*:
 *
 * @plugindesc (v1.0.0) 乗り物イベントプラグイン
 * @author マンカインド
 *
 * @help =乗り物イベントプラグイン=
 *
 * メモ欄を設定したイベントの通行設定を小型船または大型船として扱い、
 * 深海、海の上を自由に移動させることができるようになります。
 * (イベントへの接触や決定キーでそのイベントを起動することが可能です)
 *
 * なお、大型船は深海、海タイルの上を、
 * 小型船は海タイル(深海は不可)の上を移動できます。
 *
 *
 * イベントのメモ欄設定:
 *   <boat>
 *     ・イベントを小型船として扱います。
 *   <ship>
 *     ・イベントを大型船として扱います。
 *
 *
 * プラグインパラメーター:
 *   ありません。
 *
 *
 * プラグインコマンド:
 *   ありません。
 *
 *
 * スクリプトコマンド:
 *   ありません。
 *
 *
 * 補足：
 *   ・このプラグインに関するメモ欄の設定、プラグインコマンド/パラメーター、
 *     制御文字は大文字/小文字を区別していません。
 *
 *
 * 利用規約:
 *   ・作者に無断で本プラグインの改変、再配布が可能です。
 *     (ただしヘッダーの著作権表示部分は残してください。)
 *
 *   ・利用形態(フリーゲーム、商用ゲーム、R-18作品等)に制限はありません。
 *     ご自由にお使いください。
 *
 *   ・本プラグインを使用したことにより発生した問題について作者は一切の責任を
 *     負いません。
 *
 *   ・要望などがある場合、本プラグインのバージョンアップを行う
 *     可能性がありますが、
 *     バージョンアップにより本プラグインの仕様が変更される可能性があります。
 *     ご了承ください。
 *
*/

var Imported = Imported || {};
Imported.MKR_VehicleEvent = true;

(function () {
    'use strict';

    var PN = "MKR_VehicleEvent";

    //=========================================================================
    // Game_CharacterBase
    //  ・イベントの通行設定を再定義します。
    //
    //=========================================================================
    var _Game_CharacterBase_canPass = Game_CharacterBase.prototype.canPass;
    Game_CharacterBase.prototype.canPass = function(x, y, d) {
        var ret, type, x2, y2;
        type = this.vehicleType();

        if(type) {
            ret = true;
            x2 = $gameMap.roundXWithDirection(x, d);
            y2 = $gameMap.roundYWithDirection(y, d);

            if(type == "boat") {
                ret = $gameMap.isBoatPassable(x2, y2);
            } else if(type == "ship") {
                ret = $gameMap.isShipPassable(x2, y2);
            } else {
                if (!this.isMapPassable(x, y, d)) {
                    ret = false;
                }
            }

            if (!$gameMap.isValid(x2, y2)) {
                ret = false;
            }

            if (this.isThrough() || this.isDebugThrough()) {
                ret = true;
            }

            if (this.isCollidedWithCharacters(x2, y2)) {
                ret = false;
            }
        } else {
            ret = _Game_CharacterBase_canPass.apply(this, arguments);
        }
        return ret;
    };

    Game_CharacterBase.prototype.vehicleType = function() {
        var ret, ev;
        ret = "";
        if(this instanceof Game_Vehicle) {
            return this._type;
        }
        if(this instanceof Game_Player || this instanceof Game_Follower) {
            return "";
        }
        ev = this.event();
        if(ev.meta.boat) {
            ret = "boat";
        }
        if(ev.meta.ship) {
            ret = "ship";
        }

        return ret;
    }

})();