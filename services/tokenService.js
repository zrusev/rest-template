import { reader } from "../helpers/fileManager.js";
import { systemConstants } from '../constants.js';

const tokenService = {
    get: (name) => (reader.readFromFile(systemConstants.ACCESS_TOKEN_PATH + 'accessToken.txt'))
}

export default tokenService;