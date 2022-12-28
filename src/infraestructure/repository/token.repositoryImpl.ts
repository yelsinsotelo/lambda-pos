import { HTTPResponseGetDataCard } from '../../domain/dto';
import { TokenRepository } from '../../domain/repository';
import { clientDatabase } from '../adapters/documentDB/config/documentDB';
import { TokenEntity } from '../adapters/documentDB/entity/token.entity';
export function tokenRepositoryImpl(): TokenRepository {
    return {
        save: async (input: TokenEntity) => {
            try {
                const result = await clientDatabase.collection<TokenEntity>('token').insertOne(input);
                return result.insertedId.toString();
            } catch (error) {
                throw error;
            }
        },
        find: async (input: string) => {
            try {
                const result: HTTPResponseGetDataCard | null = await clientDatabase
                    .collection<TokenEntity>('token')
                    .findOne<HTTPResponseGetDataCard>({ token: input }, { projection: { _id: 0, cvv: 0, token: 0 } });
                return result;
            } catch (error) {
                throw error;
            }
        },
    };
}
