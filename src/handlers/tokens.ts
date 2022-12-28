import { APIGatewayProxyEvent, APIGatewayProxyEventHeaders, APIGatewayProxyResult } from 'aws-lambda';
import { HTTPRequestTokenDTO } from '../domain/dto';
import { checkLuhnUseCase } from '../domain/usecase';
import { generateRandomToken } from '../domain/usecase/alphanumericRandom.usecase';
import { validatorTool, JSONSchemaType } from '../libs';
import { saveDataCardUseCase } from '../domain/usecase/saveDataCard.usecase';
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
const schema: JSONSchemaType<HTTPRequestTokenDTO> = {
    type: 'object',
    properties: {
        email: { type: 'string', minLength: 1, maxLength: 100, format: 'emailCustomer' },
        card_number: { type: 'string', minLength: 13, maxLength: 16, format: 'stringOnlyDigits' },
        cvv: { type: 'string', minLength: 3, maxLength: 4, format: 'stringOnlyDigits' },
        expiration_year: { type: 'string', maxLength: 4, minLength: 4, format: 'stringOnlyDigits' },
        expiration_month: { type: 'string', minLength: 1, maxLength: 2, format: 'stringOnlyDigits' },
    },
    required: ['email', 'card_number', 'cvv', 'expiration_year', 'expiration_month'],
    additionalProperties: false,
};

const validateRequest = (body: HTTPRequestTokenDTO): boolean => {
    const validate = validatorTool.compile(schema);
    const valid = validate(body);
    const validCardNo = checkLuhnUseCase().run(body.card_number);
    return valid && validCardNo;
};
const validateHeader = (headers: APIGatewayProxyEventHeaders): boolean => {
    const token = headers['Authorization']?.replace('Bearer ','');
    if (token !== undefined) {
        const arrayToken: string[] = token.split('_');
        const prefix: string = arrayToken[0] || '';
        const name: string = arrayToken[1] || '';
        const key: string = arrayToken[2] || '';
        return prefix === 'pk' && name === 'test' && key !== '';
    } else {
        return false;
    }
};
const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;
    const body: HTTPRequestTokenDTO = JSON.parse(event.body || '');
    const headers: APIGatewayProxyEventHeaders = event.headers;
    try {
        if (!validateHeader(headers)) {
            const error = new Error('No cuenta con la credenciales para el consumo del servicio');
            return {
                statusCode: 403,
                body: JSON.stringify({
                    message: error.message,
                }),
            };
        }
        if (!validateRequest(body)) {
            const error = new Error('La solicitud no está correctamente formateada');
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: error.message,
                }),
            };
        }
        const token: string = generateRandomToken().run(16);
        const responseSave: string = await saveDataCardUseCase().run(token, body);
        if (responseSave) {
            response = {
                statusCode: 200,
                body: JSON.stringify({
                    token: token,
                }),
            };
        } else {
            response = {
                statusCode: 409,
                body: JSON.stringify({
                    message: 'Ha ocurrido un error al almacenar los datos intente nuevamente',
                }),
            };
        }
    } catch (err: unknown) {
        console.error(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err instanceof Error ? err.message : 'some error happened',
            }),
        };
    }

    return response;
};

export { lambdaHandler };
