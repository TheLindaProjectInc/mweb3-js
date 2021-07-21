require('dotenv').config();

module.exports = {
  /**
   * Returns the default Metrix address.
   * @return {String} Default Metrix address.
   */
  getDefaultMetrixAddress: () => {
    if (!process.env.SENDER_ADDRESS) {
      throw Error('Must have SENDER_ADDRESS in .env');
    }
    return String(Buffer.from(process.env.SENDER_ADDRESS));
  },

  /**
   * Returns the Metrix network RPC url.
   * @return {String} The Metrix network RPC url.
   */
  getMetrixRPCAddress: () => {
    if (!process.env.METRIX_RPC_ADDRESS) {
      throw Error('Must have METRIX_RPC_ADDRESS in .env');
    }
    return String(Buffer.from(process.env.METRIX_RPC_ADDRESS));
  },

  /**
   * Returns the wallet passphrase to unlock the encrypted wallet.
   * @return {String} The wallet passphrase.
   */
  getWalletPassphrase: () => (process.env.WALLET_PASSPHRASE ? String(Buffer.from(process.env.WALLET_PASSPHRASE)) : ''),

  isWalletEncrypted: async (mweb3) => {
    const res = await mweb3.getWalletInfo();
    return Object.prototype.hasOwnProperty.call(res, 'unlocked_until');
  },
};
