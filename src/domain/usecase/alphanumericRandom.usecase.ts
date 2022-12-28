const ALPHANUMERIC = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
export function generateRandomToken() {
    return {
        run: (size: number) => {
            let token = '';
            for (let i = 0; i < size; i++) {
                token += ALPHANUMERIC[parseInt((Math.random() * 100).toString()) % 61].toString();
            }
            return token;
        },
    };
}
