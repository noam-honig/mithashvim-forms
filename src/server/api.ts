import { remultExpress } from 'remult/remult-express';
import { createPostgresConnection } from 'remult/postgres';
import { User } from '../app/users/user';
import { SignInController } from '../app/users/SignInController';
import { UpdatePasswordController } from '../app/users/UpdatePasswordController';
import { DeliveryFormController } from '../app/home/delivery-form.controller';
import { GraphQLClient, gql } from 'graphql-request'
import { createPdfDocument } from './createPdfDocument';


export const api = remultExpress({
    entities: [User],
    controllers: [SignInController, UpdatePasswordController,
        DeliveryFormController],
    dataProvider: async () => {
        if (process.env['NODE_ENV'] === "production")
            return createPostgresConnection({ configuration: "heroku" })
        return undefined;
    },
    initApi: async () => {
        // See: https://pdfkit.org/
        createPdfDocument();
    }
});



