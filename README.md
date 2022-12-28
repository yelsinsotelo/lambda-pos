# backendGatewayPos
Demo de almacenamiento de tokens, para una pasarela de pagos
## Deploy local host

Es necesario instalar.

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Node.js - [Install Node.js 16](https://nodejs.org/en/), including the NPM package management tool.
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

se deben configurar las variables de entorno de la base datos.

```bash
sam build 
sam local start-api
curl http://localhost:3000/
```
## Deploy AWS CLOUD

Requiere previemante configurar la base de datos, VPC, grupos de seguridad.

```bash
sam build 
sam deploy --guided  
```
