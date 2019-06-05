# Fast Javascript Small Prime Numbers Generator

This javascript code is to generate small prime numbers array up to N

## USAGE
1. Clone/download 2 files: 'small_prime_number_generator_and_factoring.html' & 'small_prime_number_generator.js'
2. Open 'small_prime_number_generator_and_factoring.html' in your favorite browser and run test.

```
function generateSmallPrimeNumberArrayUpTo(n) {
  if(n < 10) {
    // error value should be >= 10
    return []; // empty array
  }

  // WARNING: generate all prime numbers more than 10 millions is slow 
  if(n > Number.MAX_SAFE_INTEGER) {
    // error value should be less than Number.MAX_SAFE_INTEGER
    return []; // empty array
  }

  // create local variable and store first 4 primes
  // these primes are the only single digit primes.
  let primeArray = [2,3,5,7];

  // init value
  let primeArrayIndexLimit = 2;
  let maxValueWithLimit = primeArray[primeArrayIndexLimit] * primeArray[primeArrayIndexLimit];

  // optimize speed, dont allow function to access variable outside function
  function checkIfPrimeFromPrimeList(val, primeArray, primeArrayIndexLimit) {
    
    // optimize: avoid divide by 2 and 5 because 'val' is always ends with either 1,3,7,9
    // first test only divide by '3'
    if(val % 3 == 0) {
      return;// 3; // not prime
    }

    // primeArray = [2,3,5,7,..]
    // because we already skipped 2, 3 and 5, so next check is 7 == primeArray[3]
    let i;
    for(i = 3; primeArrayIndexLimit > i; i++) {
      if(val % primeArray[i] == 0) {
        return;// prime;
      }
    }

    // at this point, it means no prime from the list can divide 'val' evenly
    // so 'val' is a prime, so add 'val' to prime list
    primeArray[primeArray.length] = val; // optimize to use index instead of array.push()
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
    checkIfPrimeFromPrimeList(x, primeArray, primeArrayIndexLimit);

    // hardcode small 'increment' values [2,4,2,2] to optimize speed a little

    // NOTE: remove check ==: if(x > n) break;
    // we will 'overshoot' the list without check then reduce it later !!

    x += 2; // ends with '3' ==========================
    //if(x > n) break;
    checkIfPrimeFromPrimeList(x, primeArray, primeArrayIndexLimit);

    x += 4; // ends with '7' ==========================
    //if(x > n) break;
    checkIfPrimeFromPrimeList(x, primeArray, primeArrayIndexLimit);

    x += 2; // ends with '9' ==========================
    //if(x > n) break;
    checkIfPrimeFromPrimeList(x, primeArray, primeArrayIndexLimit);

    // set next value, ends with '1' =================
    x += 2;

    // need to update primeArrayIndexLimit ?
    if(x + 10 > maxValueWithLimit) {
      primeArrayIndexLimit++;
      maxValueWithLimit = primeArray[primeArrayIndexLimit] * primeArray[primeArrayIndexLimit];
    }
  }

  // we may overshoot the prime number list, 
  // so we going to reduce it
  var validIndex = primeArray.length - 1;
  while(primeArray[validIndex] > n) {
    validIndex--;
  }
  // set length is cutting the array and remove the ends
  primeArray.length = validIndex + 1;    

  return primeArray;
}

function benchmark(number) {
    console.log('benchmark(' + number + ')');

    let startTime = Date.now();
    let primeArray = generateSmallPrimeNumberArrayUpTo(number);
    let elapsedTime = Date.now() - startTime;

    // display stat
    let totalPrime = primeArray.length;
    console.log('benchmark elapsed time: ' + elapsedTime + ' ms, total primes: ' + totalPrime);

    // display the 3 last created prime numbers
    console.log('3 last created prime numbers: ' + primeArray[totalPrime - 3] + ', ' + primeArray[totalPrime - 2] + ', ' + primeArray[totalPrime - 1])
}
```
To get the prime number array output, call the function with a number as parameter, such as:
```
generateSmallPrimeNumberArrayUpTo(100)
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
MacBook Pro (15 inch, 2017) with macOS Mojave 10.14.5, Intel i7 (2.8Ghz) with RAM 16 GB, below is the 'average' result:
1. Benchmark(1000000), total prime under 1 million are 78,498 prime numbers, requires around 60 ms (less than 1 second)
2. Benchmark(10000000), total prime under 10 millions are 664,579 prime numbers, requires around 950 ms (less than 1 second)
3. Benchmark(100000000), total prime under 100 millions are 5,761,455 prime numbers,
* In Firefox (v67.0.1), average time is 23 seconds.
* In Chrome (v75.0.3770.80), average time is 21 seconds.
* In Brave (v0.64.77, Chromium build: 74.0.3729.169), average time is 20 seconds.
* In Safari (v12.1.1), average time is 17 seconds (fastest when using WebWorker, seem Safari using multicore efficiently in Macbook)

### The result should be different with each computer / smartphone specification.

### WARNING:
Do not use very large number, it will take a very long time and may crash your browser.

Theoretically this Javascript logic can generate prime number list up to 9.007.199.254.740.991 (Number.MAX_SAFE_INTEGER, Javascript maximum value for a safe number), anyone who use computer with very large memory (more than 32 GB) is welcome to try it and share the required time to generate them.


### Thanks in advance for anyone who share this code to others and especially contribute to optimize the code even faster.
