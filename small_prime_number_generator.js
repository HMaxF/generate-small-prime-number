/**
 * Written by Hariyanto Lim (hariyanto.lim@gmail.com)
 * Update
 * 20190605 : faster execution
 * a. update logic to optimize the loop
 * b. remove unnecessary IF()
 * 
 * 
 */
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