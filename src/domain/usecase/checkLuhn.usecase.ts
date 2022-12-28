export function checkLuhnUseCase() {
    return {
        run: (cardNo: string) => {
            let sumDigits = 0;
            let isOddPosition = false;
            cardNo
                .split('')
                .reverse()
                .forEach((value) => {
                    let digit: number = parseInt(value);
                    if (isOddPosition) {
                        digit = digit * 2;
                    }
                    sumDigits += parseInt((digit / 10).toString(), 10);
                    sumDigits += digit % 10;
                    isOddPosition = !isOddPosition;
                });

            return sumDigits % 10 == 0;
        },
    };
}
