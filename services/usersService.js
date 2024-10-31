import { reader, writer } from "../helpers/fileManager.js";
import { systemConstants } from '../constants.js';

const usersService = {
    get: (name) => (reader.readFromFile(systemConstants.USERS_PATH + name)),
    getAll: (path) => (reader.readDirectory(path)),
    removeFile: async (path, callback) => await (writer.removeFile(path, callback))
}

export default usersService;