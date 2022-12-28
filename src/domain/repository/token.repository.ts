import { HTTPResponseGetDataCard } from '../dto';
import { TokenEntity } from '../../infraestructure/adapters/documentDB/entity/token.entity';
export interface TokenRepository {
    save: (input: TokenEntity) => Promise<string>;
    find: (token: string) => Promise<HTTPResponseGetDataCard | null>;
}
