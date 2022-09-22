import { createReadStream } from 'fs';
import axios from 'axios';
import FormData from 'form-data';


async function graphqlUploadFile() {
    try {
        const formData = new FormData();
        formData.append('query', `#graphql
            mutation ($file:File!){
             add_file_to_column(item_id:3159491062,column_id:"files9",file:$file){
                 id
             }
            }`);
        formData.append('variables[file]', createReadStream('c:/temp/1.pdf'));
        console.log(formData.getHeaders());
        const r = await axios({
            method: 'post',
            data: formData,
            url: 'https://api.monday.com/v2',
            headers: {
                'authorization': process.env["MONDAY_API_TOKEN"]!,
                ...formData.getHeaders()
            }
        });
        console.log(r.data);
    } catch (error: any) {
        console.error(error.message);
    }
}
