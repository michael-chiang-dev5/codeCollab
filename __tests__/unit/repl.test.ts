import { runCode } from '../../src/client/repl/eval';

describe('runCode', () => {
  it('correctly captures console logs', async () => {
    const str = "console.log('hello world')";
    const res = runCode(str);
    return expect(res.stdout).toEqual('hello world');
  });
  it('correctly captures errors', async () => {
    const str = 'asdf';
    const res = runCode(str);
    expect(res.stdout).toEqual('');
    return expect(res.stderr).toEqual('ReferenceError: asdf is not defined');
  });
  it('correctly returns last return', async () => {
    const str = 'const f = () => 1; const g = () => 2; f(); g();';
    const res = runCode(str);
    console.log(res);
    expect(res.stdout).toEqual('');
    return expect(res.rn).toEqual('2');
  });
});
