export default function getCorrectExperienceValue(exp) {
    if (exp === 0) {
        return ("Стаж: Меньше года");
    }
    if (exp % 10 === 1 && exp !== 11) {
        return (`Стаж: ${exp} год`);
    }
    if (exp % 10 > 1 && exp % 10 < 5 && exp !== 12 && exp !== 13 && exp !== 14) {
            return (`Стаж: ${exp} года`);
    }
    return (`Стаж: ${exp} лет`);
}