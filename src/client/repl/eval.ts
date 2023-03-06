// evals a given codeString and stores standard output, standard error,
//   and return value arrays
// output is an objects with fields:
//   stdout : array of messages logged to console. Messages are not necessarily strings. array has length within [0,infinity)
//            Note that each message itself is an array. This is because you can console.log(a,b,c,...)
//   stderr : array of error message logged to console. This array should have length within [0,1]
//   rn     : array of return values. This array should have length 1

interface ReplOutputType {
  stdout: string;
  stderr: string;
  rn: string;
}

interface InternalStorageType {
  stdout: any[];
  stderr: string[];
  rn: any[];
}

export function runCode(codeStr: string): ReplOutputType {
  const stdout: any[] = [];
  const stderr = [];
  const rn = [];
  const logOld = console.log;
  console.log = function (...args) {
    stdout.push(args);
  };
  try {
    rn.push(eval(codeStr));
  } catch (err) {
    stderr.push(err);
  }
  console.log = logOld;

  const res: InternalStorageType = {
    stdout,
    stderr,
    rn,
  };

  return parseRunCodeOutput(res);
}

function parseRunCodeOutput(obj: InternalStorageType): ReplOutputType {
  const convertToString = function (item: any, removeStringQuote = true) {
    const randomString = 'kvfiowklcjwnjknwsdkcbnxm';
    return JSON.stringify(item, (k, v) => {
      if (v === undefined) return randomString + 'undefined' + randomString;
      if (removeStringQuote && typeof v === 'string')
        return randomString + v + randomString;
      else return v;
    })
      .replace(new RegExp('"' + randomString, 'g'), '')
      .replace(new RegExp(randomString + '"', 'g'), '');
  };

  // TODO:  We handle undefined and strings by search replace with uuid. This is could be more elegantly handled with a custom stringfy method
  const stdout = obj['stdout']
    .map((e) => e.map((e) => convertToString(e, true)))
    .map((e) => e.join(' '))
    .join('\n');

  const rn = obj['rn'].map((e) => convertToString(e, false)).join('\n');
  const stderr = obj['stderr'].join('\n');

  return { stdout, stderr, rn };
}

// // Unit test
// const str =
//   'console.log("hi");function twoSum(arr, target) { return target+1 } console.log(twoSum([],5),"asdf")';
// const out = runCode(str);
// console.log(out);
