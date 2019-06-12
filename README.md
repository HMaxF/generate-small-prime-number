# Fast Javascript Small Prime Numbers Generator

This javascript code is to generate small prime numbers array up to N

## USAGE
1. Clone/download 2 files: 'small_prime_number_generator_and_factoring.html' & 'small_prime_number_generator.js'
2. Open 'small_prime_number_generator_and_factoring.html' in your favorite browser.

## Main JS code
NOTE: the code has some comments to help understand the logic easier.

```
function generateSmallPrimeNumberArrayUpTo(n, method = 1) {
  if(n < 10) {
    // error value should be >= 10
    return []; // empty array
  }

  // PROTECTION against accidentally generate all prime numbers more than 100 millions
  // because it may take a long time and overheat the device.
  if(n > 1e8) {
    throw new Error('max value is 100.000.000 (100 millions), to avoid device overheat and broken.');
  }

  console.log('generateSmallPrimeNumberArrayUpTo(' + n + ', method: ' + method + ')');

  /**
   * For keeping histories,
   * tried methods will be here to stay
   * each method's logic is different, please try one by one to suit machine/cpu
   */

  // create local variable and store first 4 primes
  // these primes are the only single digit primes.
  let primeArray = [2,3,5,7];

  let i; // incremental looper

  // next candidate to check
  let x = 11; 

  if(method == 1) {
    // method 1: brute force
    
    let sqrt;

    // skip EVEN numbers !
    for(; n >= x; x += 2) {
      
      //sqrt = Math.floor(Math.sqrt(x));
      // ~~ = double bitwise NOT ==> faster round down than using Math.floor()!
      sqrt = ~~Math.sqrt(x);

      i = 1;
      while(x % primeArray[i] && sqrt >= primeArray[i]) {
        i++;
      }
  
      if(primeArray[i] > sqrt) {
        // it is prime 
        primeArray[primeArray.length] = x;
      }
    }
  } else if(method == 2) {
    // method 2: 
    // a. optimize loop 
    // b. avoid using Math.sqrt() by using maxValueWithLimit and primeArrayIndexLimit

    // FACT: in my machine, method 2 is faster than method 1

    // init value
    let primeArrayIndexLimit = 3;
    let maxValueWithLimit = primeArray[primeArrayIndexLimit] * primeArray[primeArrayIndexLimit];

    while(n >= x) {

      // inner loop to brute force !
      for(; maxValueWithLimit >= x; x += 2) {

        // little optimization by early quick-check to avoid do heavy lifting
        if(x % 3 && x % 5 && x % 7) {
                    
          // i = 4 to skip 2,3,5,7
          for(i = 4; primeArrayIndexLimit >= i; i++) {
            if(! (x % primeArray[i])) {
              break; // not prime
            }
          }

          // FOUND FACT: this single IF() slowing the performance but save overhead to call function
          if(i > primeArrayIndexLimit) {
            primeArray[primeArray.length] = x;
          }
        }
      }
      
      primeArrayIndexLimit++;
      maxValueWithLimit = primeArray[primeArrayIndexLimit] * primeArray[primeArrayIndexLimit];
      
      // avoid overshoot!
      if(maxValueWithLimit > n) {
        maxValueWithLimit = n;
      }
    }
  } else if(method == 3) {
    // method 3: use more IF() to reduce function call
    // a. skip number ends with '5'
    // b. if current number is dividable by 3 then skip NEXT-NEXT number (because also dividable by 3)

    // This method logic is OVER-ENGINEER !!
    // depends on compiler/CPU, this may not suitable (slower)

    // FACT: in my machine, method 3 is slower than method 2

    function checkIfPrimeFromPrimeList(x, primeArray, endIndex) {
      let startIndex = 3;
      for(; endIndex > startIndex; startIndex++) {
        if(! (x % primeArray[startIndex])) {
          return; // not prime
        }
      }
  
      primeArray[primeArray.length] = x;
    }

    // init value
    let primeArrayIndexLimit = 3;

    // - 10
    let maxValueWithLimit = (primeArray[primeArrayIndexLimit] * primeArray[primeArrayIndexLimit]) - 10;

    while(n >= x) {

      do {
        // REDUCE the number to check 
        // by REMOVING the obvious numbers: all number ends with either '0','2','4','5','6' or '8'
        // because they are definitely NOT prime.
        
        // Therefore in ONE loop to ONLY check values end with '1', '3', '7' and '9'
        // because they are probable prime number, so ONLY need to check them !
        // eg: 11,13,17,19,21,23,27,29,31,33,37,39, ...

        // at this point 'x' MUST BE ends with '1'
        if(x % 3) {
          checkIfPrimeFromPrimeList(x, primeArray, primeArrayIndexLimit);

          x += 2; // ends with '3'
          if(x % 3) {
            checkIfPrimeFromPrimeList(x, primeArray, primeArrayIndexLimit);

            x += 4; // ends with '7'
            if(x % 3) {
              checkIfPrimeFromPrimeList(x, primeArray, primeArrayIndexLimit);
            }

            x += 2; // ends with '9'
            if(x % 3) {
              checkIfPrimeFromPrimeList(x, primeArray, primeArrayIndexLimit);
            }

            // prepare next ends with '1'
            x += 2;
          } else {
            // ends with '3' is dividable by 3, so next ends with '9' also dividable by 3

            x += 4; // ends with '7'
            checkIfPrimeFromPrimeList(x, primeArray, primeArrayIndexLimit);

            // skip ends with '9'

            // prepare next ends with '1'
            x += 4; 
          }
        } else {
          // ends with '1' is dividable for 3, so next ends with '7' should be skipped
        
          x += 2; // ends with '3'
          checkIfPrimeFromPrimeList(x, primeArray, primeArrayIndexLimit);

          // skip ends with '7'

          x += 6; // ends with '9'
          checkIfPrimeFromPrimeList(x, primeArray, primeArrayIndexLimit);

          // prepare next ends with '1'
          x += 2;
        }
      } while(maxValueWithLimit > x);
      
      primeArrayIndexLimit++;
      
      // recalculate with limit - 10 to avoid false positive (composite inside prime list)!
      maxValueWithLimit = (primeArray[primeArrayIndexLimit] * primeArray[primeArrayIndexLimit]) - 10;
      
      // avoid overshoot too many!
      if(maxValueWithLimit > n) {
        maxValueWithLimit = n;
      }
    }

    // overshoot protection because we may overshoot the prime number list, 
    // so we need to check and reduce it
    var validIndex = primeArray.length - 1;
    while(primeArray[validIndex] > n) {
      validIndex--;
    }
    // set length is cutting the array and remove the ends
    primeArray.length = validIndex + 1;
  }

  return primeArray;
}
```

## Try in browser console
To get small prime numbers array output, call the function with parameter N as a value, such as:
```
generatePrimeNumberList(100)
```
Output (JSON array):
```
[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
```


## Machine & Benchmark Reference
MacBook Pro (15 inch, 2017) with macOS Mojave 10.14.5, Intel i7 (2.8Ghz) with RAM 16 GB, below is the 'average' result:
1. Benchmark(1000000), total prime under 1 million are 78,498 prime numbers, requires around 60 ms (less than 1 second)
2. Benchmark(10000000), total prime under 10 millions are 664,579 prime numbers, requires around 950 ms (less than 1 second)
3. Benchmark(100000000), total prime under 100 millions are 5,761,455 prime numbers,
* In Firefox (v67.0.1), average time is 23 seconds.
* In Chrome (v75.0.3770.80), average time is 21 seconds.
* In Brave (v0.64.77, Chromium build: 74.0.3729.169), average time is 20 seconds.
* In Safari (v12.1.1), average time is 17 seconds (fastest when using WebWorker, seem Safari using multicore efficiently in Macbook)

### NOTES BEFORE START BENCHMARKING
* Each machine is different, so result will be different.
* In small_prime_number_generator_and_factoring.html file, the elapsed time to generate small prime numbers is much faster than displaying the value on screen which using html textarea, so the waiting time is due to rendering the large array into textarea.
* The generated small prime numbers will be stored in memory, so larger memory is required and recommended.
* To get the fastest possible benchmark in browser, please create an optimal condition for each browser by:
  * Close browser to flush all cache (and possibly other background processes) and re-open browser with empty page (no other tab/window).
  * Click the 'generate' button from the UI to start the process.
  * During benchmarking please do not use your computer or smartphone to avoid CPU doing many other things and give bad result.
* Not recommended to use browser's console for benchmarking because browser's console can not use WebWorker and will be slower (especially in Safari browser), but if you want to try then please call:
```
benchmark(1e6)
```
Console output should be similar to
```
benchmark(1000000)
benchmark elapsed time: 77 ms, total primes: 78498
3 last created prime numbers: 999961, 999979, 999983
```

# DISCLAIMER
The provided JavaScript code is to see how fast JavaScript can generate small prime numbers, 
the code is optimized only for JavaScript.
It is not to claim faster when compare the speed with other implementation using different programming language (such as Assembly, C/C++, Python, etc.)

# WARNING
Theoretically this Javascript logic can generate small prime numbers list up to 9.007.199.254.740.991 (Javascript maximum value for a safe number: Number.MAX_SAFE_INTEGER), but I personally don't recommend anyone to try it because it may takes days or weeks and could cause device overheat and broken.

I would not be liable for any device damage or any kind of loss caused by this script, please CONSIDER YOURSELF WARNED.





***Thanks in advance for anyone who share this code to others and especially contribute to optimize this JS code even faster.***