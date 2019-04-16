# Javascript :: Generate Small Prime Numbers

This javascript code is to generate small prime numbers array up to N

## USAGE
Choose either:
1. Download the file small_prime_number_generator_and_factoring.html
2. Copy and paste the following Javascript function into browser console

```
let generatePrimeNumberArrayUpTo = function(n) {
    'use strict';

    if(n < 10) {
        // error value should be >= 10
        return []; // empty array
    }

    if(n > Number.MAX_SAFE_INTEGER) {
        // error value should be less than Number.MAX_SAFE_INTEGER
        return []; // empty array
    }

    // create local variable and store first 4 primes
    // these primes are the only single digit primes.
    let primeArray = [2,3,5,7];

    // init value
    let checkLimit = 5; // because next number to check is 11, so set to 5 => 5^2 = 25
    let maxNumberForCheck = checkLimit * checkLimit;

    // optimize speed, dont allow function to access variable outside function
    let findPrimeFactorFromList = function(primeArray, val, checkLimit) {
        
        // optimize: avoid divide by 2 and 5 because 'val' is always ends with either 1,3,7,9
        // first test only divide by '3'
        if(val % 3 == 0) {
            return;// 3; // not prime
        }

        // optimise speed by using local variable
        let primeLength = primeArray.length;
        let i; // optimize loop, to avoid declare 'i' in for(let i = ..)
        let prime; // keep as variable to avoid get value by index -> primeArray[i]

        // primeArray = [2,3,5,7,..]
        // so loop start from index 3, primeArray[3] = '7'      
        for(i = 3; i < primeLength; i++) {
            prime = primeArray[i];

            if(prime > checkLimit) {
                // prime value is larger than limit, so exit loop
                break; // val is a prime
            }

            if(val % prime == 0) {
                return;// prime;
            }
        }

        // at this point, it means no prime from the list can divide 'val' evenly
        // so 'val' is a prime, so add 'val' to prime list
        primeArray[primeLength] = val; // optimize to use index instead of array.push()
    }

    // declare next value to check
    let x = 11;

    // each loop will start at a number ends with '1' => 11,21,31,41,51,61,etc.
    while(x <= n) {

        // ONE loop to ONLY check values end with '1', '3', '7' and '9'
        // because they are probable prime number, so ONLY need to check them !
        // eg: 11,13,17,19,21,23,27,29,31,33,37,39, ...

        // other values ends with either '0','2','4','5','6' or '8' are NOT prime

        // at this point 'x' MUST BE ends with '1'
        findPrimeFactorFromList(primeArray, x, checkLimit);

        // hardcode small 'increment' values [2,4,2,2] to optimize speed a little

        x += 2; // ends with '3' ==========================
        if(x > n) break;
        findPrimeFactorFromList(primeArray, x, checkLimit);

        x += 4; // ends with '7' ==========================
        if(x > n) break;
        findPrimeFactorFromList(primeArray, x, checkLimit);

        x += 2; // ends with '9' ==========================
        if(x > n) break;
        findPrimeFactorFromList(primeArray, x, checkLimit);

        // set next value, ends with '1' =================
        x += 2;

        // need to update checkLimit ?        
        if(maxNumberForCheck < x + 10) { // 10 = MAX increment in 1 loop
            // do it here instead of inside findPrimeFactorFromList() -> a little optimization
            checkLimit = Math.floor(Math.sqrt(x + 10)); // NOTE: ROUND DOWN -> remove fraction
            maxNumberForCheck = checkLimit * checkLimit;
        }
    }

    return primeArray;
}

function benchmark(number) {
    console.log('benchmark(' + number + ')');

    let startTime = new Date();
    let primeArray = generatePrimeNumberArrayUpTo(number);
    let elapsedTime = new Date() - startTime;

    // display stat
    let totalPrime = primeArray.length;
    console.log('benchmark elapsed time: ' + elapsedTime + ' ms, total primes: ' + totalPrime);

    // display the 3 last created prime numbers
    console.log('3 last created prime numbers: ' + primeArray[totalPrime - 3] + ', ' + primeArray[totalPrime - 2] + ', ' + primeArray[totalPrime - 1])
}
```
To get the prime number array output, call the function with a number as parameter, such as:
```
generatePrimeNumberArrayUpTo(100)
```
Output (JSON array):
```
[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
```
WARNING: direct output to browser console (for display) may take longer than the time to generate them.

### Benchmarking
To get the elapsed time and display the last 3 created prime numbers, please create an optimal condition for each browser by:
1. Close browser to flush all cache (and possibly other background processes) and re-open browser with empty page (no other window).
2. Open browser's console (developer mode).
3. Copy and paste the code above into browser's console.
4. Start the benchmark by calling:
```
benchmark(1000000);
```
Console output should be similar to
```
benchmark(1000000)
benchmark elapsed time: 139 ms, total primes: 78498
3 last created prime numbers: 999961, 999979, 999983
```
NOTE: As usual, during benchmarking please do not use your computer to avoid CPU doing many other things.

### Reference
MacBook Pro (15 inch, 2017) with macOS Mojave 10.14.3, Intel i7 (2.8Ghz) with RAM 16 GB, below is the 'average' result:
1. Benchmark(1000000), total prime under one million are 78,498 prime numbers, requires around 60 ms (less than 1 second)
2. Benchmark(10000000), total prime under ten millions are 664,579 prime numbers, requires around 1250 ms (a little over 1 second)
3. Benchmark(100000000), total prime under one hundred millions are 5,761,455 prime numbers,
* In Firefox (v65.0.1), average time is 33 seconds
* In Chrome (v73.0.3683.75), average time is 24 seconds
* In Brave (v0.61.52, Chromium build: 73.0.3683.86), average time is 24 seconds
* In Safari (v12.0.3), average time is 18 seconds (fastest when using WebWorker, seem using multicore)

### The result should be different with each computer / smartphone specification.

### WARNING:
Do not use very large number, it will take a very long time and may crash your browser.

Theoretically this Javascript logic can generate prime number list up to 9.007.199.254.740.991 (Number.MAX_SAFE_INTEGER, Javascript maximum value for a safe number), anyone who use computer with very large memory (more than 32 GB) is welcome to try it and share the required time to generate them.


### Thanks in advance for anyone who share this code to others and especially contribute to optimize the code even faster.
