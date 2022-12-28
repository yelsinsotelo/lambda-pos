import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
//import { lambdaHandler } from '../../src/handlers/tokens';

describe('tokens API', function () {
    beforeAll(() => {
        jest.mock('../../src/domain/usecase/findDataCreditCardByToken.usecase',
            () => {
                const findDataCreditCardByTokenUseCase = () => {
                    return {
                        run: async () => {
                            return {
                                "email": "corzo_11_223@gmail.com",
                                "card_number": "4557880610341996",
                                "expiration_year": "2020",
                                "expiration_month": "09",
                                "created_at": new Date()
                            };
                        }
                    }
                }
                return {findDataCreditCardByTokenUseCase}
            }
        )
    })
    it('verifies successful response', async () => {
        const  { lambdaHandler } = await import('../../src/handlers/get-data-card');

        const event: APIGatewayProxyEvent = {
            httpMethod: 'POST',
            body: '{"token":"5GjiHiWa5GCMMRZO"}',
            headers: { Authorization: 'pk_test_LsRbKejsCOEEWOsw' },
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            path: '/get-data-card',
            pathParameters: {},
            queryStringParameters: {},
            requestContext: {
                accountId: '123456789012',
                apiId: '1234',
                authorizer: {},
                httpMethod: 'get',
                identity: {
                    accessKey: '',
                    accountId: '',
                    apiKey: '',
                    apiKeyId: '',
                    caller: '',
                    clientCert: {
                        clientCertPem: '',
                        issuerDN: '',
                        serialNumber: '',
                        subjectDN: '',
                        validity: { notAfter: '', notBefore: '' },
                    },
                    cognitoAuthenticationProvider: '',
                    cognitoAuthenticationType: '',
                    cognitoIdentityId: '',
                    cognitoIdentityPoolId: '',
                    principalOrgId: '',
                    sourceIp: '',
                    user: '',
                    userAgent: '',
                    userArn: '',
                },
                path: '/get-data-card',
                protocol: 'HTTP/1.1',
                requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                requestTimeEpoch: 1428582896000,
                resourceId: '123456',
                resourcePath: '/get-data-card',
                stage: 'dev',
            },
            resource: '',
            stageVariables: {},
        };
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(200);
        //    const bodyResponse = JSON.parse(result.body)
        //  expect(bodyResponse.token.length).toEqual(16);
    });

    it('verifies error authorization', async () => {
        const  { lambdaHandler } = await import('../../src/handlers/get-data-card');

        const event: APIGatewayProxyEvent = {
            httpMethod: 'POST',
            body: '{"token":"5GjiHiWa5GCMMRZO"}',
            headers: { Authorization: '' },
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            path: '/get-data-card',
            pathParameters: {},
            queryStringParameters: {},
            requestContext: {
                accountId: '123456789012',
                apiId: '1234',
                authorizer: {},
                httpMethod: 'get',
                identity: {
                    accessKey: '',
                    accountId: '',
                    apiKey: '',
                    apiKeyId: '',
                    caller: '',
                    clientCert: {
                        clientCertPem: '',
                        issuerDN: '',
                        serialNumber: '',
                        subjectDN: '',
                        validity: { notAfter: '', notBefore: '' },
                    },
                    cognitoAuthenticationProvider: '',
                    cognitoAuthenticationType: '',
                    cognitoIdentityId: '',
                    cognitoIdentityPoolId: '',
                    principalOrgId: '',
                    sourceIp: '',
                    user: '',
                    userAgent: '',
                    userArn: '',
                },
                path: '/get-data-card',
                protocol: 'HTTP/1.1',
                requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                requestTimeEpoch: 1428582896000,
                resourceId: '123456',
                resourcePath: '/get-data-card',
                stage: 'dev',
            },
            resource: '',
            stageVariables: {},
        };
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(403);
        expect(result.body).toEqual(
            JSON.stringify({
                message: 'No cuenta con la credenciales para el consumo del servicio'
            }),
        );
    });

    it('verifies error bad request', async () => {
        const  { lambdaHandler } = await import('../../src/handlers/get-data-card');

        const event: APIGatewayProxyEvent = {
            httpMethod: 'POST',
            body: '{"token":"5GjiHQQQQ*/*83$#$iWa5GCMMRZO"}',
            headers: { Authorization: 'pk_test_LsRbKejsCOEEWOsw' },
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            path: '/get-data-card',
            pathParameters: {},
            queryStringParameters: {},
            requestContext: {
                accountId: '123456789012',
                apiId: '1234',
                authorizer: {},
                httpMethod: 'get',
                identity: {
                    accessKey: '',
                    accountId: '',
                    apiKey: '',
                    apiKeyId: '',
                    caller: '',
                    clientCert: {
                        clientCertPem: '',
                        issuerDN: '',
                        serialNumber: '',
                        subjectDN: '',
                        validity: { notAfter: '', notBefore: '' },
                    },
                    cognitoAuthenticationProvider: '',
                    cognitoAuthenticationType: '',
                    cognitoIdentityId: '',
                    cognitoIdentityPoolId: '',
                    principalOrgId: '',
                    sourceIp: '',
                    user: '',
                    userAgent: '',
                    userArn: '',
                },
                path: '/get-data-card',
                protocol: 'HTTP/1.1',
                requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                requestTimeEpoch: 1428582896000,
                resourceId: '123456',
                resourcePath: '/get-data-card',
                stage: 'dev',
            },
            resource: '',
            stageVariables: {},
        };
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(400);
        expect(result.body).toEqual(
            JSON.stringify({
                message: 'La solicitud no está correctamente formateada'
            }),
        );
    });
});
