import express, { Router } from 'express';
import request from 'supertest';
import { RecadoEntity, UserEntity } from '../../../../../src/core/infra';
import App from '../../../../../src/core/presentation/app';
import { Recado } from '../../../../../src/features/recados/domain/models/recado.model';
import { RecadoRepository } from '../../../../../src/features/recados/infra';
import Database from '../../../../../src/core/infra/data/connections/database';
import RecadoRoutes from '../../../../../src/features/recados/presentation/routes/routes';

jest.mock(
    '../../../../../src/features/recados/infra/repositories/recado.repository.ts',
);

const makeUser = async (): Promise<UserEntity> => {
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

describe('Recado routes', () => {
    const server = new App().server;

    beforeEach(async () => {
        await RecadoEntity.clear();
        await UserEntity.clear();

        jest.resetAllMocks();
    });

    beforeAll(async () => {
        await new Database().openConnection();

        const router = Router();
        server.use(express.json());

        server.use(router);

        new RecadoRoutes().init(router);
    });

    afterAll(async () => {
        await new Database().disconnectDatabase();
    });

    describe('/Post recados', () => {
        test('should return code 400 when save scrap with invalid title', async () => {
            const user = await makeUser();

            await request(server).post('/recados').send({
                    descricao: 'any_descricao',
                    usersUID: user.uid,
                })
                .expect(400, { error: 'Invalid data!' });
        });

        test('should return code 404 when usersUID is invalid', async () => {
            await request(server)
                .post('/recados').send({
                    descricao: 'any_descricao',
                    detalhamento: 'any_detalhamento'
                })
                .expect(404)
        });
    });

    describe('/Get recados', () => {
        test('should return code 200 when has any scrap', async () => {
            const recado = await makeRecado();

            jest.spyOn(RecadoRepository.prototype, 'getAll').mockResolvedValue([
                recado
            ]);

            await request(server).get(`/recados/${recado.usersUID}`).send(recado).expect(200).expect((request) => {
                expect(request.body.usersUID).toEqual(recado.usersUID);
            });
        });
    });
});
