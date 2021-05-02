import pdf from "html-pdf";

export default {
    key: 'GeneratePdf',
    options: {},
    async handle({ data }) {
        const { html, downloadPath } = data;
        pdf.create(html, {}).toFile(downloadPath, (err, res) => {
            if (err)
                console.log(err)
            else
                console.log(res)
        });
    },
};