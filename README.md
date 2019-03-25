# generate-small-prime-number
Simple logic to generate small prime number array up to N

Below simple Javascript code:

## USAGE: copy and paste the following Javascript function into browser console

```
function generatePrimeNumberArrayUpTo(n) {
  "use strict";

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
  let primeLength = primeArray.length;

  // local private function
  let findPrimeFactorFromList = function(val) {
    const limit = Math.floor(Math.sqrt(val));
    for(let i = 0; i < primeLength; i++) {

      if(primeArray[i] > limit) {
        // prime value is larger than limit, so exit loop
        break; // val is a prime
      }

      if(val % primeArray[i] == 0) {
        return primeArray[i];
      }
    }

    // at this point, it means no prime from the list can divide 'val' evenly
    // so 'val' is a prime, so add 'val' to prime list
    primeArray.push(val);

    // increase length for next loop
    primeLength++;
  }

  // declare next value to check
  let x = 11;
  while(x <= n) {

    // ONE loop to ONLY check values end with '1', '3', '7' and '9'
    // because they are probable prime number, so ONLY need to check them !
    // eg: 11,13,17,19,21,23,27,29,31,33,37,39, ...

    // other values ends with either '0','2','4','5','6' or '8' are NOT prime

    // at this point 'x' MUST BE ends with '1'
    findPrimeFactorFromList(x);

    // hardcode small 'increment' values [2,4,2,2] to optimize speed a little

    x += 2; // ends with '3' ==========================
    if(x > n) break;
    findPrimeFactorFromList(x);

    x += 4; // ends with '7' ==========================
    if(x > n) break;
    findPrimeFactorFromList(x);

    x += 2; // ends with '9' ==========================
    if(x > n) break;
    findPrimeFactorFromList(x);

    // set next value, ends with '1' =================
    x += 2;
  }

  return primeArray;
}
```
Call the function with a number as parameter, such as:
```
generatePrimeNumberArrayUpTo(100)
```
Output (JSON array): 
```
[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
```

In my Macbook Pro (macOS Mojave 10.14.3, Intel i7 2.8Ghz with 16GB RAM), below is the 'average' result:
1. Total prime numbers under 1.000.000 (one million) is 78,498 prime numbers, requires around 80 millisecond (less than 1 second)
2. Total prime numbers under 2.000.000 (two millions) is 148,933 prime numbers, requires around 170 millisecond
3. Total prime numbers under 10.000.000 (ten millions) is 664,579 prime numbers, requires around 1,2 second
4. Total prime numbers under 100.000.000 (one hundred millions) is 5,761,455 prime numbers, 
* In Firefox (v65.0.1), average time is 27 seconds 
* In Chrome (v73.0.3683.75), average time is 25 seconds 
* In Brave (v0.61.52, Chromium build: 73.0.3683.86), average time is 25 seconds

### WARNING: do not use very large number, it will take a very long time and may crash your browser.

Theoretically this Javascript logic can generate prime number list up to 9.007.199.254.740.991 (Number.MAX_SAFE_INTEGER, Javascript maximum value for a safe number), but I never try it because I do not want to waste time to see how long it will be completed also I think we could not store/display them all inside browser because there maybe not be enough memory for browser to allocate/store and to display all prime numbers below 9.007.199.254.740.991, anyone is welcome to try it and share the required time to generate them.


### Thanks in advance for anyone who contribute to optimize the code.
