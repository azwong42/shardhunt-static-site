// // Adapted from an original python port of https://github.com/keiwando/libraryofbabel3D/blob/master/Assets/Scripts/Util/Math.cs

class BitFlipper {

    constructor(w, safe_high_bits, low_bits) {
        this.low_bits = low_bits;
        this.high_bits = w - low_bits - safe_high_bits;
        this.low_mask = (1n << low_bits) - 1n;
        this.inv_low_mask = (1n << this.high_bits) - 1n;
        this.flip_mask = (1n << (low_bits + this.high_bits)) - 1n;
        this.safe_mask = ~this.flip_mask;
    }

    flip_bits(x) {
        const flip_segment = x & this.flip_mask;
        const safe_bits = x & this.safe_mask;
        const high_bits = flip_segment >> this.low_bits;
        const low_bits = this.low_mask & flip_segment;
        return (low_bits << this.high_bits) + high_bits + safe_bits;
    }

    inv_flip_bits(x) {
        const flip_segment = x & this.flip_mask;
        const safe_bits = x & this.safe_mask;
        const high_bits = flip_segment >> this.high_bits;
        const low_bits = this.inv_low_mask & flip_segment;
        return (low_bits << this.low_bits) + high_bits + safe_bits;
    }
}


class LcgCalculator {

    constructor(m, a, c, a_inv) {
        this.m = m;
        this.a = a;
        this.c = c;
        this.a_inv = a_inv;
    }

    static mod(n, m) {
        return ((n % m) + m) % m;
    }

    calc(x) {
        return LcgCalculator.mod((this.a * x + this.c), this.m);
    }

    inv(x) {
        return LcgCalculator.mod((this.a_inv * (x - this.c)), this.m);
    }
}


class EuclidExtendedSolution {

    constructor(x, y, d) {
        this.x = x;
        this.y = y;
        this.d = d;
    }

    static extended_gcd(a, b) {
        let x0 = 1n;
        let xn = 1n;
        let y0 = 0n;
        let yn = 0n;
        let x1 = 0n;
        let y1 = 1n;
        let r = a % b;

        while (r > 0n) {
            const q = a / b;
            xn = x0 - q * x1;
            yn = y0 - q * y1;

            x0 = x1;
            y0 = y1;
            x1 = xn;
            y1 = yn;
            a = b;
            b = r;
            r = a % b;
        }

        return new EuclidExtendedSolution(xn, yn, b);
    }

}
