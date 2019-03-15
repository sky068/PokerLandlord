/**
 * Created by xujw on 2017/10/16.
 * 斗地主
 * 单副扑克
 * 没有癞子玩法
 * 牌对象为{grade:3,face:1}
 * grade 牌面点数(3-13:3-K, 14:A, 15:2, 16:小王 17:大王)
 * face  牌面花色(1:黑桃、2:红桃、3:梅花、4:方块)
 */

var CARD_TYPE_INVALID = -1;                 // 无效手牌
var CARD_TYPE_SINGLE = 1;                   // 单张
var CARD_TYPE_DOUBLE = 2;                   // 对子
var CARD_TYPE_THREE = 3;                    // 三张
var CARD_TYPE_THREE_ONE = 4;                // 三带一（三带一张或者一对）
var CARD_TYPE_BOMB = 5;                     // 炸弹
var CARD_TYPE_FORE_TWO = 6;                 // 四带二
var CARD_TYPE_CONTINUOUS_SIGNGLE = 7;       // 单顺（5张起）
var CARD_TYPE_CONTINUOUS_DOUBLE = 8;        // 双顺（3对起）
var CARD_TYPE_AIRPLANE = 9;                 // 飞机 （两个三张起）
var CARD_TYPE_AIRPLANE_WING = 10;           // 飞机带翅膀 (三顺+同数量单牌或者对牌）
var CARD_TYPE_KING = 11;                    // 火箭

/**
 * 洗牌
 * @param arr
 * @return {*}
 */
function shuffle(arr) {
    var i,
        j,
        temp;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

/***
 * 从大到小排序手牌
 * @param cardsArr 手牌数组
 */
function sortBig2Samll(cardsArr) {
    cardsArr.sort(function (c1, c2) {
        return c2.grade - c1.grade;
    });
}


/**
 * 判定手牌类型
 * @param cardsArr 要判定的手牌信息数组(已经按照从大到小排好序)
 * @return {Number}
 */
function judgeCardType(cardsArr) {
    if (!cardsArr || cardsArr.length < 1) return CARD_TYPE_INVALID;
    sortBig2Samll(cardsArr);
    var cardType = CARD_TYPE_INVALID;
    var len = cardsArr.length;
    if (len === 1) {
        cardType = CARD_TYPE_SINGLE;
        cc.log('牌型:单张');
    } else if (len === 2) {
        if (checkDouble(cardsArr)) {
            cardType = CARD_TYPE_DOUBLE;
            cc.log('牌型:对子');
        } else if (checkKingBomb(cardsArr)) {
            cardType = CARD_TYPE_KING;
            cc.log('牌型:王炸');
        }
    } else if (len === 3) {
        if (checkAllCardSame(cardsArr)) {
            cardType = CARD_TYPE_THREE;
            cc.log('牌型:三张');
        }
    } else if (len === 4) {
        if (checkAllCardSame(cardsArr)) {
            cardType = CARD_TYPE_BOMB;
            cc.log('牌型:炸弹');
        } else if (checkThreeOne(cardsArr)) {
            cardType = CARD_TYPE_THREE_ONE;
            cc.log('牌型:三带一张');
        }
    } else if (len === 5) {
        if (checkContinuousSingle(cardsArr)) {
            cardType = CARD_TYPE_CONTINUOUS_SIGNGLE;
            cc.log('牌型:顺子' + len + '张.');
        } else if (checkThreeOne(cardsArr)) {
            cardType = CARD_TYPE_THREE_ONE;
            cc.log('牌型:三带一对');
        }
    } else if (len === 6) {
        if (checkContinuousSingle(cardsArr)) {
            cardType = CARD_TYPE_SINGLE;
            cc.log('牌型:顺子' + len + '张.');
        } else if (checkContinuousDouble(cardsArr)) {
            cardType = CARD_TYPE_DOUBLE;
            cc.log('牌型:连对(3对)');
        } else if (checkAirplane(cardsArr)) {
            cardType = CARD_TYPE_AIRPLANE;
            cc.log('牌型:飞机');
        } else if (checkFourWithTwo(cardsArr)) {
            cardType = CARD_TYPE_FORE_TWO;
            cc.log('牌型:4带2');
        }
    } else {
        // 6 张以上需要判断单顺、双顺、飞机、飞机带翅膀、4带2
        if (checkContinuousSingle(cardsArr)) {
            cardType = CARD_TYPE_CONTINUOUS_SIGNGLE;
            cc.log('牌型:单顺' + len + '张.');
        } else if (checkContinuousDouble(cardsArr)) {
            cardType = CARD_TYPE_CONTINUOUS_DOUBLE;
            cc.log('牌型:连对' + len / 2 + '对');
        } else if (checkAirplane(cardsArr)) {
            cardType = CARD_TYPE_AIRPLANE;
            cc.log('牌型:飞机');
        } else if (checkAirplaneWithWing(cardsArr)) {
            cardType = CARD_TYPE_AIRPLANE_WING;
            cc.log('牌型:飞机带翅膀');
        } else if (checkFourWithTwo(cardsArr)) {
            cardType = CARD_TYPE_FORE_TWO;
            cc.log('牌型:4带2');
        }
    }

    /****************start**************/
    // 检测所有牌都相同
    function checkAllCardSame(arr) {
        var len = arr.length;
        var isSame = true;
        for (var i = 0; i < len - 1; i++) {
            if (arr[i].grade !== arr[i + 1].grade) {
                isSame = false;
                break;
            }
        }
        return isSame
    }

    // 检测是不是递增(3/4/5, 6/7/8/9...)
    function checkIncrease(arr) {
        var len = arr.length;
        if (len < 2) {
            return false;
        }
        var ret = true;
        for (var i = 0; i < len - 1; i++) {
            if (arr[i].grade !== (arr[i + 1].grade + 1)) {
                ret = false;
                break;
            }
        }
        return ret;
    }

    // 检测单张
    function checkSignle(arr) {
        return arr.length === 1;
    }

    // 检测对子
    function checkDouble(arr) {
        if (arr.length !== 2) return false;
        return checkAllCardSame(arr);
    }

    // 检测王炸
    function checkKingBomb(arr) {
        if (arr.length !== 2) return false;
        var kingCount = 0;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].grade === 16 || arr[i].grade === 17) {
                kingCount++;
            }
        }
        return kingCount === 2;
    }

    // 三张不带
    function checkThree(arr) {
        if (arr.length !== 3) return false;
        return checkAllCardSame(arr);
    }

    // 检测三带一（带一张或者一对）
    function checkThreeOne(arr) {
        var len = arr.length;
        if (len !== 4 && len !== 5) return false;
        // 炸弹不算三带一
        if (checkBomb(arr)) return false;
        var ret = false;
        if (len === 4) {
            if (checkAllCardSame(arr.slice(0, arr.length - 1)) || checkAllCardSame(arr.slice(arr.length - 3, arr.length))) {
                ret = true;
            }
        } else if (len === 5) {
            if (checkAllCardSame(arr.slice(0, arr.length - 2)) && checkAllCardSame(arr.slice(arr.length - 2, arr.length))) {
                ret = true;
            } else if (checkAllCardSame(arr.slice(0, arr.length - 3)) && checkAllCardSame(arr.slice(arr.length - 3, arr.length))) {
                ret = true;
            }
        }
        return ret;
    }

    // 检测炸弹(5555)
    function checkBomb(arr) {
        if (arr.length !== 4)  return false;
        return checkAllCardSame(arr);
    }

    // 检测单顺(34567)
    function checkContinuousSingle(arr) {
        var len = arr.length;
        if (len < 5 || len > 12) {
            return false;
        }
        // 大小王、2不能算在顺子里
        var ret = true;
        for (var i = 0; i < len - 1; i++) {
            var pre = arr[i].grade;
            var next = arr[i + 1].grade;
            if (pre === 15 || pre === 16 || pre == 17 || next === 15 || next === 16 || next === 17) {
                ret = false;
                break;
            }
            else if (pre !== (next + 1)) {
                ret = false;
                break;
            }
        }
        return ret;
    }

    // 检测双顺(连对334455)
    function checkContinuousDouble(arr) {
        var len = arr.length;
        if (len < 6 || len % 2 !== 0) {
            return false;
        }

        var ret = true;
        for (var i = 0; i < len; i = i + 2) {
            // 2不能参与连对
            if (arr[i].grade === 15) {
                ret = false;
                break;
            }
            if (!checkAllCardSame(arr.slice(i, i + 2))) {
                ret = false;
                break;
            }
            if (i < len - 2) {
                if (arr[i].grade !== (arr[i + 2].grade + 1)) {
                    ret = false;
                    break;
                }
            }
        }

        return ret;
    }

    // 检测飞机(333444)
    function checkAirplane(arr) {
        var len = arr.length;
        if (len < 6 || len % 3 !== 0) {
            return false;
        }
        var ret = true;
        for (var i = 0; i < len; i += 3) {
            // 2不参与飞机
            if (arr[i].grade === 15) {
                ret = false;
                break;
            }
            if (!checkThree(arr.slice(i, i + 3))) {
                ret = false;
                break;
            }
            if (i < len - 3) {
                if (arr[i].grade !== (arr[i + 3].grade + 1)) {
                    ret = false;
                    break;
                }
            }
        }

        return ret;
    }

    // 检测飞机带翅膀(33344456、3334445566)
    function checkAirplaneWithWing(arr) {
        var len = arr.length;
        if (len < 8) {
            return false;
        }

        var threeArr = [];
        var othersArr = [];
        // 先找出所有的三张
        for (var i = 0; i < len;) {
            // 剩余手牌已经不够三张了
            if (i >= (len - 2)) {
                for (var k = i; k < len; k++) {
                    othersArr.push(arr[k]);
                }
                break;
            }
            // 剩余手牌大于二张
            var key = arr[i].grade;
            var count = 1;
            for (var j = i + 1; j < len; j++) {
                if (key === arr[j].grade) {
                    count++;
                } else {
                    break;
                }
            }
            // 如果count === 4 说明有炸弹，不符合规则
            if (count === 4) {
                return false;
            } else if (count === 3) {
                threeArr.push(arr[i], arr[i + 1], arr[i + 2]);
                i = j;
            } else {
                for (var h = i; h < j; h++) {
                    othersArr.push(arr[h]);
                }
                i = j;
            }
        }

        cc.log('-------飞机带翅膀判定------');
        cc.log('threes:' + JSON.stringify(threeArr));
        cc.log('others:' + JSON.stringify(othersArr));
        cc.log('-------------------------');

        // 判定三张是不是飞机
        if (!checkAirplane(threeArr)) {
            // 有可能三张相同牌作为单牌带出, 此时剔除一组三张作为带牌
            // 如：333444555+888
            // 如：333444555666 + 8889
            var threeLen = threeArr.length;
            if (checkAirplane(threeArr.slice(0, threeLen - 3))) {
                othersArr.push(threeArr[threeLen - 3], threeArr[threeLen - 2], threeArr[threeLen - 1]);
                threeArr = threeArr.slice(0, threeLen - 3);
            } else if (checkAirplane(threeArr.slice(3, arr.length))) {
                othersArr.push(threeArr[0], threeArr[1], threeArr[2]);
                threeArr = threeArr.slice(3, threeLen);
            } else {
                return false;
            }
        }

        // 需要翅膀数（单牌或者对子个数)
        var threeCounts = threeArr.length / 3;
        // 翅膀是单牌
        if (threeCounts === othersArr.length) {
            // 翅膀不能同时包含大小王
            var kingCount = 0;
            for (var v = 0; v < othersArr.length; v++) {
                if (othersArr[v].grade === 16 || othersArr[v].grade === 17) {
                    kingCount++;
                }
            }
            return kingCount < 2;
        } else if (threeCounts === othersArr.length / 2) {
            // 翅膀是对子
            // 判断otherArr是不是全是对子
            for (var u = 0; u < othersArr.length; u = u + 2) {
                if (!checkAllCardSame(othersArr.slice(u, u + 2))) {
                    return false;
                }
            }
            return true;
        } else {
            // 翅膀数目不对
            return false;
        }
    }

    // 检测4带二
    function checkFourWithTwo(arr) {
        var ret = false;
        if (checkAllCardSame(arr.slice(0, arr.length - 2))) {
            ret = true;
        } else if (checkAllCardSame(arr.slice(1), arr.length - 1)) {
            ret = true;
        } else if (checkAllCardSame(arr.slice(2), arr.length)) {
            ret = true;
        }

        return ret;
    }

    /****************end**************/

    return cardType;
}

/**
 * 比较两组手牌大小
 * @param cards1
 * @param cards2
 * @return {Boolean} true 表示 cards1 大于 cards2
 */
function compareCards(cards1, cards2) {
    var cardType1 = judgeCardType(cards1);
    var cardType2 = judgeCardType(cards2);
    if (cardType1 === cardType2){

    }else {

    }

}