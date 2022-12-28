import Ajv, { JSONSchemaType } from 'ajv';
const validatorTool = new Ajv({ allErrors: true });
validatorTool.addFormat('emailCustomer', /:?(@gmail.com)|(@hotmail.com)|(@yahoo.es)$/);
validatorTool.addFormat('stringOnlyDigits', /(\d)*$/);
validatorTool.addFormat('stringAlphanumeric', /^[a-zA-Z\d]*$/);
export { validatorTool, JSONSchemaType };
