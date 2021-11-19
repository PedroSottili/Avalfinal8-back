import { CacheRepository } from '../../../../../src/core/infra/repositories';
import { RecadoRepository } from '../../../../../src/features/recados/infra/repositories';
import { Recado } from '../../../../../src/features/recados/domain/models/recado.model';
import { notFound, RecadoController } from '../../../../../src/features/recados/presentation';
import { HttpRequest, ok, serverError} from '../../../../../src/features/recados/presentation';

jest.mock( '../../../../../src/features/recados/infra/repositories/recado.repository.ts');
jest.mock('../../../../../src/core/infra/repositories/cache.repository.ts');

const makeRequestStore = (): HttpRequest => ({
    body: {
        descricao: 'any_descricao',
        detalhamento: 'any_detalhamento',
        usersUID: 'any_usersUID',
    },
    params: {},
});

const makeRequestShow = (): HttpRequest => ({
    body: {},
    params: { uid: 'any_uid' },
});

const makeRequest = () => {
    return {
        params: { uid: 'any_uid' },
        body: {
            descricao: 'any_descricao',
            detalhamento: 'any_detalhamento',
            usersUID: 'any_users_uid',
        },
    };
};

const makeResult = (): Recado | any => ({
    uid: 'any_uid',
    descricao: 'any_descricao',
    detalhamento: 'any_detalhamento',
    usersUID: 'any_usersUID'
});

const makeSut = (): RecadoController => {
    return new RecadoController(new RecadoRepository(), new CacheRepository());
};

describe('Recado Controller', () => {
    beforeEach(() => { jest.resetAllMocks() });
    describe('Index', () => {
        test("should return code 500 when throw any exception", async () => {
            jest.spyOn(CacheRepository.prototype, "get").mockRejectedValue(
                new Error()
            );

            const sut = makeSut();
            const result = await sut.index(makeRequestShow());

            expect(result).toEqual(serverError());
        });

        test("should return code 200 when cache has any project", async () => {
            jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue([makeResult()]);

            const sut = makeSut();
            const result = await sut.index(makeRequestStore());

            expect(result).toEqual(ok([makeResult()]));
        });

        test("should return code 200 when repository has any project", async () => {
            jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);

            jest.spyOn(RecadoRepository.prototype, "getAll").mockResolvedValue([makeResult()]);

            const sut = makeSut();
            const result = await sut.index(makeRequestStore());

            expect(result).toEqual(ok([makeResult()]));
        });
    });
    
    describe('Store', () => {
        
        test('should return code 500 when throw any exception', async () => {
            jest.spyOn(RecadoRepository.prototype, 'create').mockRejectedValue(
                new Error(),
            );
            const sut = makeSut();
            const result = await sut.store(makeRequestStore());
            expect(result).toEqual(serverError());
        });

        test('should call ScrapRepository when pass correct values', async () => {
            const createSpy = jest.spyOn(RecadoRepository.prototype, 'create');
            const sut = makeSut();
            await sut.store(makeRequestStore());
            expect(createSpy).toHaveBeenCalledWith(makeRequestStore().body);
        });

        test('should return code 200 when valid data is provided', async () => {
            jest.spyOn(RecadoRepository.prototype, 'create').mockResolvedValue(makeResult());
            const sut = makeSut();
            const result = await sut.store(makeRequestStore());
            expect(result).toEqual(ok(makeResult()));
        });

        test('should call CacheRepository when pass correct values', async () => {
            jest.spyOn(RecadoRepository.prototype, 'create').mockResolvedValue(makeResult());
            const setSpy = jest.spyOn(CacheRepository.prototype, 'set');
            const delSpy = jest.spyOn(CacheRepository.prototype, 'del');
            const sut = makeSut();
            await sut.store(makeRequestStore());
            expect(setSpy).toHaveBeenCalledWith('recado:any_uid', makeResult());
            expect(delSpy).toHaveBeenCalledWith('recado:all');
        });
    });

    describe('Show', () => {
        test('should return code 500 when has any error', async () => {
            jest.spyOn(CacheRepository.prototype, 'get').mockRejectedValue(new Error());

            const sut = makeSut();
            const result = await sut.show(makeRequestShow());

            expect(result).toEqual(serverError());
        });

        test('Should return serverError when throw any exception', async () => {
            jest.spyOn(CacheRepository.prototype, 'get').mockRejectedValue(
                new Error(),
            );
            const sut = makeSut();
            const result = await sut.show(makeRequest());

            expect(result).toEqual(serverError());
        });
    });

    describe('Update', () => {
        test('should return code 500 when throw any exception', async () => {
            jest.spyOn(RecadoRepository.prototype, 'update').mockRejectedValue(
                new Error(),
            );
            const sut = makeSut();
            const result = await sut.update(makeRequest());
            expect(result).toEqual(serverError());
        });

        test("Should return notFound if doesn't find any scrap that match the params", async () => {
            jest.spyOn(RecadoRepository.prototype, 'update').mockResolvedValue(null);
            const sut = makeSut();
            const result = await sut.update(makeRequest());

            expect(result).toEqual(notFound());
        });

        test('Should return ok and the updated scrap if the repository update the scrap', async () => {
            const request = makeRequest();
            request.body = {
                ...request.body,
                descricao: 'new_descricao',
                detalhamento: 'new_detalhamento',
            };
            jest.spyOn(RecadoRepository.prototype, 'update').mockResolvedValue(
                request as any,
            );
            const sut = makeSut();
            const result = await sut.update(request);

            expect(result).toEqual(ok({ recado: request }));
        });
    });

    describe('Delete', () => {
        test('Should return serverError if throw any error', async () => {
            jest.spyOn(RecadoRepository.prototype, 'delete').mockRejectedValue(
                new Error(),
            );
            const sut = makeSut();
            const result = await sut.delete(makeRequest());

            expect(result).toEqual(serverError());
        });

        test('Should delete the scrap if pass valid data', async () => {
            const sut = makeSut();
            const recado = await sut.store(makeRequest());
            await sut.delete({
                params: {
                    uid: recado.body.uid,
                },
                body: { usersUID: recado.body.usersUID },
            });
            const result = await sut.show({
                params: {
                    uid: recado.body.uid,
                },
                body: { usersUID: recado.body.usersUID },
            });

            expect(result).toEqual(notFound());
        });

        test('Should return ok without body if the repository delete the scrap', async () => {
            jest.spyOn(RecadoRepository.prototype, 'delete').mockResolvedValue(
                'any_recado' as any,
            );
            const sut = makeSut();
            const result = await sut.delete(makeRequest());

            expect(result).toEqual(ok({}));
        });
    });
});