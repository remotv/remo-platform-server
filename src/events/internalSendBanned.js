module.exports = async (ws, data) => {
    const wss = require("../services/wss");

    if (ws.internalListener) {
        const banned = {
            username: wss.internalBannedUsernames,
            ip: wss.internalBannedIps
        }
        wss.emitEvent("INTERNAL_SEND_BANNED", banned);
    }
}