import { TokenRepository } from '../repository';
import { tokenRepositoryImpl } from '../../infraestructure/repository/token.repositoryImpl';
import { HTTPResponseGetDataCard } from '../dto';
export function findDataCreditCardByTokenUseCase() {
    const repository: TokenRepository = tokenRepositoryImpl();
    return {
        run: async (token: string) => {
            const response: HTTPResponseGetDataCard | null = await repository.find(token);
            return response;
        },
    };
}
