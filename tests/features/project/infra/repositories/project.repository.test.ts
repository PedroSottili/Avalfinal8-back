import { UserEntity, RecadoEntity } from '../../../../../src/core/infra';
import { Recado } from "../../../../../src/features/recados/domain";
import { RecadoRepository } from '../../../../../src/features/recados/infra';
import Database from '../../../../../src/core/infra/data/connections/database';

const makeUser = async (): Promise<UserEntity | any> => {
    return UserEntity.create({
        username: 'any_username',
        password: 'any_password',
    }).save();
};

const makeRecado = async (): Promise<Recado | any> => {
    const user = await makeUser();

    return RecadoEntity.create({
        descricao: 'any_descricao',
        detalhamento: 'any_detalhamento',
        usersUID: user.uid,
    }).save();
};

const makeParams = async (): Promise <any> => {
    const user = await makeUser();

    return {
        descricao: 'any_descricao',
        detalhamento: 'any_detalhamento',
        usersUID: user.uid,
    };
};

describe('Recado Repository', () => {
    beforeAll(async () => {
        await new Database().openConnection();
    });

    beforeEach(async () => {
        await RecadoEntity.clear();
        await UserEntity.clear();
    });

    afterAll(async () => {
        await new Database().disconnectDatabase();
    });

    describe('GetAll', () => {
        test('should return a list of scraps when has any scrap', async () => {
            const recado = await makeRecado();
            
            jest.spyOn(RecadoRepository.prototype, 'getAll').mockResolvedValue([recado]);
            
            const sut = new RecadoRepository();
            const result = await sut.getAll();
            
            expect(result.length > 0).toBeTruthy();
        });
    });
    
    describe('GetOne', () => {
        test('should return a scrap when has a scrap with uid defined', async () => {
            const recado = await makeRecado();
            
            jest.spyOn(RecadoRepository.prototype, 'getOne').mockResolvedValue(recado);
            
            const sut = new RecadoRepository();
            const result = await sut.getOne(recado.uid);
            
            expect(result.uid).toEqual(recado.uid);
        });
    });
    
    describe('Create', () => {
        test('should create a new scrap when has valid params', async () => {
            const params = await makeParams();
            const recado = new RecadoRepository();
            const result = await recado.create(params);

            expect(result).toBeTruthy();
            expect(result.uid).toBeTruthy();
            expect(result.descricao).toEqual(params.descricao);
            expect(result.detalhamento).toEqual(params.detalhamento);
            expect(result.usersUID).toEqual(params.usersUID);
        });
    });

    describe('Update', () => {
        test('Should return a scrap when database has scrap that match params', async () => {
            const sut = new RecadoRepository();
            const recado = await makeRecado();

            const result = (await sut.update(recado.uid, {
                descricao: recado.descricao,
                detalhamento: recado.detalhamento,
                usersUID: recado.usersUID,
            } as any)) as any;

            expect(result).toBeTruthy();
            expect(result.uid).toEqual(recado.uid);
            expect(result.descricao).toEqual(recado.descricao);
            expect(result.detalhamento).toEqual(recado.detalhamento);
            expect(result.usersUID).toEqual(recado.usersUID);
        });
    });

    describe('Delete', () => {
        test('Should pass a recadoUid as parameters in the function call', async () => {
            const sut = new RecadoRepository();
            jest.spyOn(sut, 'delete').mockResolvedValue(null);
            const spy = jest.spyOn(sut, 'delete');
            await sut.delete('any_uid');

            expect(spy).toHaveBeenCalledWith('any_uid, any_user_uid');
            expect(spy).toHaveBeenCalledTimes(1);
        });

        test('Should delete an scrap if all params are valid', async () => {
            const sut = new RecadoRepository();
            const recado = await makeRecado();
            const result = (await sut.delete(recado.uid)) as any;

            expect(result).toBeTruthy();
            expect(result.uid).toBeFalsy();
        });
    });
});