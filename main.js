import shell from 'shelljs';

import uploadBatchTemplate from './templates/uploadBatchTemplate.js';
import getTemplate from './templates/getTemplate.js';

if(shell.env['COMMAND'] === "upload") {
    uploadBatchTemplate();
}

if(shell.env['COMMAND'] === "download") {
    getTemplate();
}