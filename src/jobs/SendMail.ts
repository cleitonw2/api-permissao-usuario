import SendMailService from "../services/SendMailService";

export default {
    key: 'SendMail',
    options: {
        limiter: {
            max: 600,
            duration: 5000
        }
    },
    async handle({ data }) {
        const { email, variables, htmlPath } = data;

        await SendMailService.execute(email, variables.title, variables, htmlPath);
    },
}