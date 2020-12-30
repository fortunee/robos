import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import fetchMock from 'fetch-mock';

import {
  CHANGE_SEARCH_FIELD,
  REQUEST_ROBOTS_PENDING,
  REQUEST_ROBOTS_SUCCESS,
  REQUEST_ROBOTS_FAILED,
} from './contants';

import * as actions from './actions';

const URL = 'https://jsonplaceholder.typicode.com/users';

describe('setSearchField Action', () => {
  const payload = 'testing';
  const expectedAction = {
    type: CHANGE_SEARCH_FIELD,
    payload,
  };
  it('Should create an action to search robots', () => {
    expect(actions.setSearchField(payload)).toEqual(expectedAction);
  });
});

describe('requestRobots Action', () => {
  const mockStore = configureMockStore([thunkMiddleware])();
  const payload = [
    {
      id: 1,
      name: 'jane robo',
      username: 'jarob',
      email: 'jane@robots.com',
    },
  ];

  beforeEach(() => {
    mockStore.clearActions();
    fetchMock.reset();
    fetchMock.restore();
  });

  it('should handle robots pending request', () => {
    mockStore.dispatch(actions.requestRobots());
    const [pendingReqAction] = mockStore.getActions();
    const expectedAction = {
      type: REQUEST_ROBOTS_PENDING,
    };
    expect(pendingReqAction).toEqual(expectedAction);
  });

  it('should handle robots requests success', (done) => {
    fetchMock.getOnce(URL, { body: payload });
    const expectedAction = {
      type: REQUEST_ROBOTS_SUCCESS,
      payload,
    };

    expect.assertions(1);
    mockStore.dispatch(actions.requestRobots()).then(() => {
      const [, successReqAction] = mockStore.getActions();
      expect(successReqAction).toEqual(expectedAction);
      done();
    });
  });

  it('should handle failed robot requests', (done) => {
    fetchMock.mock(URL, Promise.reject('Bad robot!'));
    expect.assertions(2);
    mockStore.dispatch(actions.requestRobots()).then((a) => {
      const [, failedReqAction] = mockStore.getActions();
      expect(failedReqAction.type).toEqual(REQUEST_ROBOTS_FAILED);
      expect(failedReqAction.payload).toEqual('Bad robot!');
      done();
    });
  });
});