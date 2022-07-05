import { BackendMethod, Controller, ControllerBase, Fields } from "remult";
import { getControllerRef } from "remult/src/remult3";
import { gql } from "./getGraphQL";

export type Item = {
    id: number;
    name: string;
    quantity: number;
    actualQuantity: number;
    notes: string;
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
    @Fields.boolean()
    driverSign = false;
    @Fields.object()
    items: Item[] = [];
    @BackendMethod({ allowed: true })
    async load(deliveryId: number) {
        console.log(deliveryId)
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

        let d = item.column_values.find(({ id }) => id == "date3");
        //console.log(d)
        this.driverSign = d && d.date;

        //console.table(this.$.toArray().map((f) => ({ key: f.metadata.key, value: f.value })))
    }

    @BackendMethod({ allowed: true })
    async updateDone(date: string, time: string) {
        let value = "{}";
        if (!this.driverSign) {
            value = JSON.stringify({
                date, time
            })
        }
        for (const item of this.items) {
            await this.update(2673928289, item.id, "dup__of_____", item.actualQuantity);
        }
        this.update(2673923561, this.id, "date3", value);

        this.driverSign = !this.driverSign;
    }
    async update(board: number, id: number, column_id: string, value: any) {
        const values = { id: +id, value, board, column_id };
        console.log("Update",values,"=", await gql(values, `#graphql
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
         `));
    }

}



declare module 'remult' {
    export interface FieldOptions<entityType, valueType> {
        monday?: string
    }
}