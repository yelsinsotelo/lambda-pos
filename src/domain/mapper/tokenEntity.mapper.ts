import { TokenEntity } from '../../infraestructure/adapters/documentDB/entity/token.entity';
import { HTTPRequestTokenDTO } from '../dto';

export function tokenEntityMapper() {
    return {
        toEntity: (token: string, data: HTTPRequestTokenDTO): TokenEntity => {
            return {
                ...data,
                token,
                created_at: new Date(),
            };
        },
    };
}
