import { FieldType, Field, BackendMethod, Controller, ControllerBase, Fields } from "remult";
import { gql } from "./getGraphQL";

export type Item = {
    id: number;
    name: string;
    quantity: number;
    actualQuantity: number;
    notes: string;
};

@FieldType<MondayDate>({
    valueConverter: {
        fromDb: x => {
            if (x?.date) return x;
            return null;
        },
        toDb: x => x
    }

})
class MondayDate {
    date = '';
    time = '';
};

@Controller("deliveryForm")
export class DeliveryFormController extends ControllerBase {
    @Fields.integer()
    id = 0;
    @Fields.string({ caption: 'שם הגוף' })
    name = '';
    @Fields.string({ monday: 'dup__of_____' })
    city = '';
    @Fields.string({ monday: 'text' })
    street = '';
    @Fields.string({ monday: 'text9' })
    notes = '';
    @Fields.string({ monday: 'text3' })
    contact = '';
    @Fields.string({
        monday: 'phone', valueConverter: {
            fromDb: x => x.phone
        }
    })
    contactPhone = '';
    @Fields.string({ monday: 'text8' })
    driverName = '';
    @Field(() => MondayDate, {
        monday: 'date3'
    })
    driverSign: MondayDate | null = null;
    @Field(() => MondayDate, {
        monday: 'date7'
    })
    contactSign: MondayDate | null = null;
    @Fields.object()
    items: Item[] = [];

    @Fields.integer({ monday: 'numbers8' })
    signatureCounter = 0;

    @BackendMethod({ allowed: true })
    async load(deliveryId: number) {
        const data = await gql({ id: deliveryId }, `#graphql
query ($id: Int!) {
  boards(ids: [2673923561]) {
    id
    name
    board_folder_id
    board_kind
    items(ids: [$id]) {
      id
      name
      column_values{
        id
        title
        value
      }
      subitems {
        name
        id
        column_values {
          id
          title
          value
        }
      }
    }
  }
}
`);
        const item: {
            id: number,
            name: string,
            column_values: any[],
            subitems: any[]
        } = data.boards[0].items[0];
        this.id = deliveryId;
        this.name = item.name;
        //console.table(item.column_values);
        for (const f of this.$.toArray()) {
            if (f.metadata.options.monday) {
                let c: any = item.column_values.find((x: any) => x.id == f.metadata.options.monday);
                f.value = JSON.parse(c.value);
                if (f.metadata.options.valueConverter?.fromDb)
                    f.value = f.metadata.options.valueConverter?.fromDb(f.value);


            }
        }
        for (const subItem of item.subitems) {
            let notes = '';
            let quantity = 0;
            let actualQuantity = null;
            for (const col of subItem.column_values) {
                switch (col.id) {
                    case "numbers":
                        quantity = JSON.parse(col.value);
                        break;
                    case "text":
                        notes = JSON.parse(col.value);
                        break;
                    case "dup__of_____":
                        actualQuantity = JSON.parse(col.value);
                        break;

                }
            }
            if (actualQuantity == null)
                actualQuantity = quantity;
            this.items.push({
                id: subItem.id,
                name: subItem.name,
                quantity,
                notes,
                actualQuantity
            })
        }




        //console.table(this.$.toArray().map((f) => ({ key: f.metadata.key, value: f.value })))
    }
    @BackendMethod({ allowed: true })
    async signByContact(date: string, time: string) {

        var orig = new DeliveryFormController(this.remult);
        await orig.load(this.id);
        if (orig.contactSign || !orig.driverSign)
            throw "הטופס אינו מוכן לחצימה";

        await this.update(2673923561, this.id, this.$.contactSign.metadata.options.monday!, JSON.stringify({ date, time }));
        this.contactSign = { date, time };
    }
    @BackendMethod({ allowed: true })
    async updateDone(date: string, time: string) {
        var orig = new DeliveryFormController(this.remult);
        await orig.load(this.id);
        if (orig.driverSign)
            throw "הטופס כבר חתום";

        let value = JSON.stringify({
            date, time
        });

        for (const item of this.items) {
            await this.update(2673928289, item.id, "dup__of_____", item.actualQuantity);
        }
        await this.update(2673923561, this.id, this.$.driverSign.metadata.options.monday!, value);
        let counter = +this.signatureCounter;
        if (!counter)
            counter = 1
        else
            counter++;
        await this.update(2673923561, this.id, this.$.signatureCounter.metadata.options.monday!, counter.toString());

        this.driverSign = { date, time };
    }
    @BackendMethod({ allowed: true })
    async cancelSign() {
        var orig = new DeliveryFormController(this.remult);
        await orig.load(this.id);
        if (!orig.driverSign)
            throw "הטופס אינו חתום";
        await this.update(2673923561, this.id, this.$.driverSign.metadata.options.monday!, "{}");
        await this.update(2673923561, this.id, this.$.contactSign.metadata.options.monday!, "{}");
        this.driverSign = null;
    }
    async update(board: number, id: number, column_id: string, value: any) {
        const values = { id: +id, value, board, column_id };
        try {
            const result = await gql(values, `#graphql
        mutation ($id: Int!,$value:JSON!,$board:Int!,$column_id:String!) {
   change_column_value(
     item_id:$id
     column_id:$column_id,
     board_id:$board,
     value:$value
   ) {
     id
   }
 }
         `);
            if (false) {
                console.log(values, result);
            }
        } catch (err) {
            console.error(err);
        }
    }

}



declare module 'remult' {
    export interface FieldOptions<entityType, valueType> {
        monday?: string
    }
}