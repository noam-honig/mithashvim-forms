import { remultExpress } from 'remult/remult-express';
import { createPostgresConnection } from 'remult/postgres';
import { User } from '../app/users/user';
import { SignInController } from '../app/users/SignInController';
import { UpdatePasswordController } from '../app/users/UpdatePasswordController';
import { DeliveryFormController } from '../app/home/delivery-form.controller';
import { createPdfDocument } from './createPdfDocument';
import { graphqlUploadFile } from './graphqlUploadFile';


export const api = remultExpress({
    entities: [User],
    controllers: [SignInController, UpdatePasswordController,
        DeliveryFormController],
    dataProvider: async () => {
        if (process.env['NODE_ENV'] === "production")
            return createPostgresConnection({ configuration: "heroku" })
        return undefined;
    },

    initApi: async (remult) => {

        // See: https://pdfkit.org/
       // const c = new DeliveryFormController(remult);
       // await c.load(3251763644)
       // createPdfDocument(c);
    //    await graphqlUploadFile(c.id)
    }
});

DeliveryFormController.createPdfAndUpload = async (c)=>{
  await createPdfDocument(c);
  await graphqlUploadFile(c.id);
}
