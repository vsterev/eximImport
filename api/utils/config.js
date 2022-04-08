const { bulkSmsProfile } = require('../utils/bulk-sms/');
const LinkMobility = require('../utils/linkMobility').sender;
const sendEmail = require('../utils/sendMail');
const { contactModel } = require('../models');
const { crypter } = require('../utils/numberCrypter');
const provider = 'bulkSms'; // choose which provider to use - linkMobility or bulkSms
const shortenUrl = require('../utils/shortenUrl') || undefined;
// const iLurl = {
//   test: 'http://evaluation.solvex.bg/iservice/integrationservice.asmx',
//   production: 'http://iservice.solvex.bg/IntegrationService.asmx',
// };
const feedback = { test: 'http://localhost:3000', production: 'http://feedback.solvex.bg:80' };
// const env = {
//   test: { iLurl: 'http://evaluation.solvex.bg/iservice/integrationservice.asmx', vote: 'http://localhost:3000' },
//   production: { iLurl: 'http://iservice.solvex.bg/IntegrationService.asmx', vote: 'http://feedback.solvex.bg:80' },
// };
const vote = feedback['test'];
// const envorinment = env.test;

const sender = {
  linkMobility: {
    send: (data) => {
      return LinkMobility(data).then((r) => r.json());
    },
    response: (linkMobilitySender, date, type) => {
      console.log(linkMobilitySender);
      if (linkMobilitySender.data.sms_id) {
        const phones = Object.keys(linkMobilitySender.data.sms_id);
        let dateSearch = 'checkIn';
        let messageType = 'firstSendMessage';
        if (type === 'goodByeMessage') {
          dateSearch = 'checkOut';
          messageType = 'lastSendMessage';
        }
        if (phones.length > 0) {
          phones.map(async (phone) => {
            await contactModel
              .findOneAndUpdate(
                { phone, [dateSearch]: date },
                { [messageType]: 'l-' + linkMobilitySender.data.sms_id[phone] },
                { new: true }
              )
              .catch(console.log);
          });
        }
      }
    },
  },
  bulkSms: {
    send: (data) => bulkSmsProfile('POST', 'messages', data).then((r) => r.json()),
    response: (senderResponse, date, type) => {
      if (Array.isArray(senderResponse)) {
        let dateSearch = 'checkIn';
        let messageType = 'firstSendMessage';
        if (type === 'goodByeMessage') {
          dateSearch = 'checkOut';
          messageType = 'lastSendMessage';
        }
        senderResponse.map(async (rs) => {
          contactModel
            .findOneAndUpdate({ phone: rs.to, [dateSearch]: date }, { [messageType]: 'b-' + rs.id }, { new: true })
            .catch(console.log);
        });
      }
    },
  },
};
const mailError = (noPhone, noReps) => {
  const subject = 'TGS - Error sending SMS via Bulk';
  const addresses = ['vasil@solvex.bg'];
  const body = ` Dear admin, <br>
      You receive this message, because there are any reservations that have not receive SMS checkout noifications.<br>
      ${noReps.length > 0 ? `Hotel/s: ${noReps.join(', ')} do not have any rep attached. \<br>` : ''}
      ${noPhone.length > 0 ? `Reservation/s: ${noPhone.join(', ')} do not have any phone attached. \<br> ` : ''}
      Tourists will not receive checkout SMS messages from Travel Guide System! \<br>
      Please correct the missing information and resend the welcome message again.\<br>
      `;
  sendEmail(subject, body, addresses);
};
const consoleLogger = (noRepsArr, noPhonesArr, cn) => {
  if (cn.reps.length === 0) {
    console.log(
      `Warning -> Hotel  ${cn?.hotelId?.name} / ${
        cn?.hotelId?._id
      } - has no rep attached - no info send via messaging system for reservation - ${cn?._id?.toString()}!`
    );
    noRepsArr.push(cn?.hotelId?._id + ' - ' + cn?.hotelId?.name);
  }
  if (!cn.phone) {
    console.log(
      `Warning -> Reservation id - ${cn?._id?.toString()} has no phone attached - no info send via messaging sytem !`
    );
    noPhonesArr.push(cn?._id?.toString());
  }
};
const welcomeMessage = (contact, url) => {
  const message = `Dear ${contact.name} - Welcome to Bulgaria! You are accommodated in ${contact.hotelId.name} from ${
    contact.checkIn
  } to ${contact.checkOut}. Reps that will support you: ${contact.reps.map(
    (rep) =>
      rep.firstName +
      ' ' +
      rep.familyName +
      ' on phone ' +
      rep.phone +
      ' with ' +
      rep.languages.join(', ') +
      ' languages'
  )}.
  Our excursions visit: ${
    !!url
      ? url
      : `https://b2b.solvex.bg/en/excursions?city_id=${contact.hotelId.resortId}&start_date=${contact.checkIn}&end_date=${contact.checkOut}`
  }
  DMC Solvex wish you sunny and smiley holiday :-) `;
  return message;
};
// const welcomeMessage = (contact) => {
//   const message = `Dear ${contact.name} - Welcome to Bulgaria! You are accommodated in ${contact.hotelId.name} from ${
//     contact.checkIn
//   } to ${contact.checkOut}. Reps that will support you: ${contact.reps.map(
//     (rep) =>
//       rep.firstName +
//       ' ' +
//       rep.familyName +
//       ' on phone ' +
//       rep.phone +
//       ' with ' +
//       rep.languages.join(', ') +
//       ' languages'
//   )}.
//   Our excursions visit: https://b2b.solvex.bg/en/excursions?city_id=${contact.hotelId.resortId}&start_date=${
//     contact.checkIn
//   }&end_date=${contact.checkOut}
//   DMC Solvex wish you sunny and smiley holiday :-) `;
//   return message;
// };
const goodByeMessage = (contact) => {
  const message = `Dear ${contact.name}, your departure date is ${contact.checkOut} the transfer time is at ${
    contact.time
  } h - ${
    contact.comment
  }. Your DMC Solvex wishes you a safe trip! Please vote your holiday ${vote}/user-vote/${crypter(contact._id)}`;
  return message;
};
module.exports = {
  shortenUrl,
  sender: sender[provider],
  mailError,
  consoleLogger,
  welcomeMessage,
  goodByeMessage,
  provider,
};
