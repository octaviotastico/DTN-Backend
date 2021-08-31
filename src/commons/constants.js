// AAP message type codes.
const AAPMessageTypes = {
  ACK: 0x0,
  NACK: 0x1,
  REGISTER: 0x2,
  SENDBUNDLE: 0x3,
  RECVBUNDLE: 0x4,
  SENDCONFIRM: 0x5,
  CANCELBUNDLE: 0x6,
  WELCOME: 0x7,
  PING: 0x8,
};

module.exports = {
  AAPMessageTypes,
};