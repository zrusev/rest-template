import fs from 'fs';
import util from 'util';
import stream from 'stream';
import excelToJson from 'convert-excel-to-json';

const streamPipeline = util.promisify(stream.pipeline);

const reader = {
    readFromFile: (path) => (fs.readFileSync(path, 'utf8')),
    readFromExcelFile: (config) => (excelToJson(config)),
    readDirectory: (path) => (fs.readdirSync(path))
}

const writer = {
    writeToFile: (path, payload) => (fs.writeFileSync(path, payload)),
    writeToExcel: async (path, payload) => await streamPipeline(payload, fs.createWriteStream(path)),
    removeFile: async (path, callback) => await (fs.unlink(path, callback))
}

export {
    reader,
    writer,
};