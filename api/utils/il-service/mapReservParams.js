const { boardModel, hotelModel, transferTypeModel } = require('../../models');
const MissingIdError = require('../error');
const mapping = (params) => {
  const { pansion, hotelName, transfer, partner } = params;
  console.log(pansion, hotelName, transfer, partner);
  const mapPansion = boardModel.findOne({ [`partnersCode.${partner}`]: pansion }).catch(console.log);
  const mapHotel = hotelModel.findOne({ [`partnersCode.${partner}`]: hotelName }).catch(console.log);
  let mapTransfer = undefined;
  if (transfer) {
    mapTransfer = transferTypeModel.findOne({ [`partnersCode.${partner}`]: transfer }).catch(console.log);
  }

  return Promise.all([mapPansion, mapHotel, mapTransfer])
    .then(([mapPansion, mapHotel, mapTransfer]) => {
      // console.log({ mapTransfer, mapPansion, mapHotel });
      if (!mapPansion || !mapHotel || (transfer && !mapTransfer)) {
        throw new MissingIdError(
          `${!mapHotel ? `${hotelName}, ` : ''} ${!mapPansion ? `${pansion}, ` : ''} ${
            !mapTransfer ? `${transfer}` : ''
          } - not synched`
        );
      }
      // console.log(hotelName, mapPansion, mapHotel);
      const pansionId = mapPansion?._id;
      const hotelId = mapHotel?._id;
      const transferTypeId = mapTransfer?._id || undefined;
      return { pansionId, hotelId, transferTypeId };
    })
    .catch((err) => {
      console.log(`Error Mapping ${err}`);
      if (err instanceof MissingIdError) {
        throw err;
      }
    });
};
module.exports = mapping;
