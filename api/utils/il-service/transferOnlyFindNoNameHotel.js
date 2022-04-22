const { hotelModel } = require('../../models');
const transferOnlyFindNoNameHotel = (hotelName, partner) => {
    // console.log ('tuk e, samo transfer - TransferOnly '+hotelKey)
    return hotelModel.findOne({ [`partnersCode.${partner}`]: hotelName })
        .then(htl => {
            // console.log(htl)
            return Promise.all([hotelModel
                .findOne({ resortId: htl.resortId, name: { $regex: /no accommo/, $options: 'i' } }),htl])
        })
        .then(([noNameHotel, htl])=> {
            return { noNameHotelId: noNameHotel._id, resortId: htl.resortId, transferHotelName: hotelName }
        })
    // hotelModel.findById(3867)
    //     .then(res => console.log(`TransferOnly component ${res}`))
    //     .catch(err => console.log(err))
}
module.exports = transferOnlyFindNoNameHotel;