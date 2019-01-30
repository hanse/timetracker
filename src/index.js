// @flow

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import toDate from 'date-fns/toDate';
import format from 'date-fns/format';
import createHistory from 'history/createBrowserHistory';
import { css } from 'glamor';
import App from './components/App';
import * as db from './db';

css.insert(`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
  }
`);

css.insert(`
  body {
    font-size: 20px;
    line-height: 2;
    font-family: system-ui, sans-serif;
    color: #333;
  }
`);

css.insert(`
  input {
    font-size: inherit;
    padding: 10px 15px;
    border-radius: 3px;
    border: 1px solid #ccc;
  }
`);

css.insert(`
  input[type=text] {
    min-width: 320px;
  }
`);

css.insert(`
  input[type='checkbox'] {
    margin-right: 10px;
  }`);

css.insert(`
  label {
    cursor: pointer;
  }
`);

const rootElement: Element = (document.getElementById('root'): any);

function rehydrateState(parsedJson) {
  if (!parsedJson) {
    return undefined;
  }

  return {
    ...parsedJson,
    tasks: Object.keys(parsedJson.tasks).reduce((tasks, taskId) => {
      tasks[taskId] = {
        ...parsedJson.tasks[taskId],
        timestamps: parsedJson.tasks[taskId].timestamps.map(toDate)
      };
      return tasks;
    }, {})
  };
}

function Loader({ date, history }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(
    () => {
      (() => async () => {
        setLoading(true);
        const result = await db.retrieve(date, null);
        setData((result || {}).tasks);
        setLoading(false);
      })();
    },
    [date]
  );

  if (loading) {
    return null;
  }

  return (
    <App
      date={date}
      initialState={rehydrateState(data)}
      saveState={state => db.save(date, state)}
      clearState={() => {}}
      history={history}
    />
  );
}

const getDate = location => {
  if (location.pathname !== '/') {
    return location.pathname.replace(/^\/|\/$/g, '');
  }

  return format(new Date(), 'YYYY-MM-dd');
};

const render = history => {
  const date = getDate(history.location);
  ReactDOM.render(<Loader date={date} history={history} />, rootElement);
};

const history = createHistory();

history.listen(() => {
  render(history);
});

render(history);
