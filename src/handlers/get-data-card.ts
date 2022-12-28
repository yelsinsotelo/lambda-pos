import { APIGatewayProxyEvent, APIGatewayProxyEventHeaders, APIGatewayProxyResult } from 'aws-lambda';
import { HTTPResponseGetDataCard } from '../domain/dto';
import { findDataCreditCardByTokenUseCase } from '../domain/usecase/findDataCreditCardByToken.usecase';
import { validatorTool, JSONSchemaType } from '../libs';
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
interface RequestGetDataCard {
    token: string;
}
const schema: JSONSchemaType<RequestGetDataCard> = {
    type: 'object',
    properties: {
        token: { type: 'string', minLength: 16, maxLength: 16, format: 'stringAlphanumeric' },
    },
    required: ['token'],
    additionalProperties: false,
};

const validateRequest = (body: RequestGetDataCard): boolean => {
    const validate = validatorTool.compile(schema);
    const valid = validate(body);
    return valid;
};
const validateHeader = (headers: APIGatewayProxyEventHeaders): boolean => {
    const token = headers['Authorization']?.replace('Bearer ', '');
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
    const body: RequestGetDataCard = JSON.parse(event.body || '');
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
        const responseData: HTTPResponseGetDataCard | null = await findDataCreditCardByTokenUseCase().run(body.token)
        if (responseData) {
            const currentDate: Date = new Date();
            const responseDate: Date = responseData.created_at instanceof Date ? responseData.created_at :new Date(responseData.created_at);
            const timeExpire: number = parseInt(process.env.TOKEN_EXPIRATION_TIME || "900") || 0;
            if ((currentDate.getTime() - responseDate.getTime()) / 1000 < timeExpire) {
                response = {
                    statusCode: 200,
                    body: JSON.stringify(responseData),
                };
            } else {
                response = {
                    statusCode: 409,
                    body: JSON.stringify({
                        message: "El token no es válido, solicite uno nuevamente"
                    }),
                };
            }

        } else {
            response = {
                statusCode: 409,
                body: JSON.stringify({
                    message: "El token no es válido, solicite uno nuevamente"
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
