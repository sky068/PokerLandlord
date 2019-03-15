/**
 * Created by xujw on 2017/10/13.
 */

/**
 *
 * @param grade 牌面点数(3-13:3-K, 14:A, 15:2, 16:小王 17:大王)
 * @param face  牌面花色(1:黑桃、2:红桃、3:梅花、4:方块)
 */
var PokerCard = function (count, face) {
    this.grade = count;
    this.face = face;
};

module.exports = PokerCard;