import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { NEVER, EMPTY, from, throwError, Observable, of } from 'rxjs';


describe('Cold observable', () => {
  it('should test EMPTY, that emits no items but terminates normally', () => {
    const provided = EMPTY;
    const expected = cold('|');

    expect(provided).toBeObservable(expected);
  });

  it('should test NEVER, that emits no items and does not terminate', () => {
    const provided = NEVER;
    const expected = cold('-');

    expect(provided).toBeObservable(expected);
  });

  it('should test observable that emits two items and completes in same frame', () => {
    const provided = from(['a', 'b']);
    const expected = cold('(ab|)');

    expect(provided).toBeObservable(expected);
  });
});

describe('Hot observable', () => {
  it('should test subscription on hot observable', () => {
    const provided = hot(('-a-^b---c-|'));
    const subscription = '^------!';

    expect(provided).toBeObservable(cold('-b---c-|'));
    expect(provided).toHaveSubscriptions(subscription);
  });

  it('should test subscription on hot observable that never completes', () => {
    const provided = hot(('-a-^(bc)--'));
    const subscription = '^--';

    expect(provided).toBeObservable(cold('-(bc)--'));
    expect(provided).toHaveSubscriptions(subscription);
  });
});

describe('Error', () => {
  it('should test observable that ends with error', () => {
    const source$ = throwError(new Error('This is an error'));
    const expected$ = cold('#', {}, new Error('This is an error'));

    expect(source$).toBeObservable(expected$);
  });

  it('should give 2 values then throw error', () => {
    const source$ = new Observable(observer => {
      observer.next('orange');
      observer.next('blue');
      observer.error(new Error('server error'));
    });
    const expected$ = cold('(xy#)', { x: 'orange', y: 'blue' }, new Error('server error'));

    expect(source$).toBeObservable(expected$);
  });
});

describe('ExampleComponent methods test', () => {
  it('should test getUsers method for race condition', () => {
    const component = new ExampleComponent();

    // mock response delays for getUsers method calls
    component.exampleService.fetchUsers = jest.fn(() => cold('--------a|', { a: [{ name: 'Głuś' }] }));
    component.getUsers();

    component.exampleService.fetchUsers = jest.fn(() => cold('--b|', { a: [{ name: 'Jachaś' }] }));
    component.getUsers();

    getTestScheduler().flush();

    expect(component.users).toEqual([{ name: 'Głuś' }]);
  });
});

class ExampleComponent {
  public users: any[];
  public exampleService = new ExampleService();

  public getUsers() {
    this.exampleService.fetchUsers().subscribe(users => {
      this.users = users;
    });
  }
}

class ExampleService {
  public fetchUsers() {
    return of([{ name: 'Tongo' }, { name: 'Gleyfy' }]);
  }
}
