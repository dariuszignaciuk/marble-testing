import { cold } from 'jasmine-marbles';
import { concat, expand, pairwise, switchMapTo, take, zip } from 'rxjs/operators';
import { of } from 'rxjs';

describe('operators', () => {
  it('should test concat', () => {
    const obs1 = cold('---a---b|');
    const sub1 = '^-------!';
    const obs2 = cold('---c---d|');
    const sub2 = '--------^-------!';

    const result = obs1.pipe(concat(obs2));
    const expected = cold('---a---b---c---d|');

    expect(result).toBeObservable(expected);
    expect(obs1).toHaveSubscriptions(sub1);
    expect(obs2).toHaveSubscriptions(sub2);
  });

  it('should test zip', () => {
    const obs1 = cold('---a---b---|', { a: 1, b: 3 });
    const obs2 = cold('-----c---d---|', { c: 5, d: 7 });

    const result = obs1.pipe(zip(obs2, (x, y) => x + y));
    const expected = cold('-----x---y-|', { x: 6, y: 10 });

    expect(result).toBeObservable(expected);
  });

  it('should test switchMapTo', () => {
    const obs1 = cold('---a---b---|');
    const obs2 = cold('-----c---d---|');

    const result = obs1.pipe(switchMapTo(obs2));
    const expected = cold('------------c---d---|');

    expect(result).toBeObservable(expected);
  });

  it('should test pairwise', () => {
    const obs1 = cold('-z--a---b---|');

    const result = obs1.pipe(pairwise());
    const expected = cold('----j---d---|', { j: ['z', 'a'], d: ['a', 'b'] });

    expect(result).toBeObservable(expected);
  });

  it('should test expand', () => {
    const obs1 = cold('-z----------', { z: 3 });

    const result = obs1.pipe(expand(x => of(2 * x)), take(3));
    const expected = cold('-(qwe|)', { q: 3, w: 6, e: 12 });

    expect(result).toBeObservable(expected);
  });
});

