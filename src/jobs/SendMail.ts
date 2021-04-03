import SendMailService from "../services/SendMailService";

export default {
    key: 'RegistrationMail',
    options: {},
    async handle({ data }) {
        const { email, variables, npsPath } = data;

        await SendMailService.execute(email, variables.title, variables, npsPath);
    },
}