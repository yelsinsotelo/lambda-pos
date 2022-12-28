import { TokenRepository } from '../repository';
import { tokenRepositoryImpl } from '../../infraestructure/repository/token.repositoryImpl';
import { HTTPRequestTokenDTO } from '../dto';
import { tokenEntityMapper } from '../mapper/tokenEntity.mapper';
export function saveDataCardUseCase() {
    const repository: TokenRepository = tokenRepositoryImpl();
    return {
        run: async (token: string, data: HTTPRequestTokenDTO) => {
            const response: string = await repository.save(tokenEntityMapper().toEntity(token, data));
            return response;
        },
    };
}
