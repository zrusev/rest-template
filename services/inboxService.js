import { reader, writer } from "../helpers/fileManager.js";
import { systemConstants } from '../constants.js';

const inboxService = {
    get: (name) => (reader.readFromFile(systemConstants.INBOXES_PATH + name)),
    excel: (config) => (reader.readFromExcelFile(config)),
    store: (name, data) => (writer.writeToFile(systemConstants.INBOXES_PATH + name, data)),
    storeBlob: async (name, data) => await (writer.writeToExcel(systemConstants.INBOXES_PATH + name, data)),
}

export default inboxService;