// // Adapted from an original python port of keiwando's Library of Babel example (https://github.com/keiwando/libraryofbabel-example)

const ALPHABET = "abcdefghijklmnopqrstuvwxyz,. ";
const ADDRESS_CHAR_SET = "0123456789abcdefghijklmnopqrstuvwxyz";

function randInt(max) {
    return Math.floor(Math.random() * max);
}

function pad_before(text, x, length) {
    const diff = length - text.length;
    for (let i = 0; i < diff; i++) {
        text = x + text;
    }
    return text;
}

function pad_after(text, x, length) {
    const diff = length - text.length;
    for (let i = 0; i < diff; i++) {
        text = text + x;
    }
    return text;
}

function pad_random(text, x_options, length) {
    const x_list = [...x_options];
    const diff = length - text.length;
    const pre = randInt(diff);
    for (let i = 0; i < pre; i++) {
        text = x_list[randInt(x_list.length)] + text;
    }
    for (let j = pre; j < diff; j++) {
        text = text + x_list[randInt(x_list.length)];
    }
    return text
}

function pad_randoms(text_list, x_options, length) {
    const x_list = [...x_options];
    const diff = length - text_list[0].length;
    const pre = randInt(diff);
    for (let i = 0; i < pre; i++) {
        for (let j = 0; j < text_list.length; j++) {
            text_list[j] = x_list[randInt(x_list.length)] + text_list[j];
        }
    }
    for (let k = pre; k < diff; k++) {
        for (let m = 0; m < text_list.length; m++) {
            text_list[m] = text_list[m] + x_list[randInt(x_list.length)];
        }
    }
    return text_list;
}

function pad_lines(text, x_options, length) {
    const x_list = [...x_options];
    const diff = Math.floor((length - text.length) / 80);
    const pre = randInt(diff) * 80;
    for (let i = 0; i < pre; i++) {
        text = x_list[randInt(x_list.length)] + text;
    }
    for (let j = pre; j < diff * 80; j++) {
        text = text + x_list[randInt(x_list.length)];
    }
    return text;
}

function num_to_string(number, character_set) {
    const base = BigInt(character_set.length);
    const digits = [...character_set];
    let output = "";

    let current_number = number

    while (current_number !== 0n) {
        const remainder = current_number % base
        output += digits[remainder]
        current_number = current_number / base
    }

    let result = [...output].reverse().join('');

    if (number < 0n) {
        result = "-" + result;
    }

    return result;
}

function string_to_num(text, character_set) {
    const character_set_array = [...character_set];
    const base = BigInt(character_set_array.length);

    let result = 0n
    let multiplier = 1n

    for (let i = text.length - 1; i >= 0; i--) {
        const c = text[i];

        if (i === 0 && c === '-') {
            result = -result;
            break;
        }

        const digit = BigInt(character_set_array.findIndex((element) => element === c));
        result += digit * multiplier;
        multiplier *= base;
    }

    return result;
}
