/**
 * Written by Hariyanto Lim (hariyanto.lim@gmail.com)
 * Purpose: Search for the fastest algorithm in JS to generate small prime numbers 
 * -----
 * Update history
 * -----
 * 
 * 20190612 : 
 * a. Share info about each different tried methods 
 * b. FACT: JavaScript is interpreted language, generally it is a good idea to reduce code size, the less code to interprete the better is the speed!
 * 
 * 20190610 :
 * a. OVER ENGINEER version, use MORE IF() but reduce call to checkIfPrimeFromPrimeList()
 * 
 * b. Add inner do {} while() to reduce check IF()
 * 
 * 20190607 :
 * Add protection to avoid accidental use N > 1e8
 * 
 * 20190605 : faster execution
 * a. update logic to optimize the loop
 * b. remove unnecessary IF()
 * 
 */
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