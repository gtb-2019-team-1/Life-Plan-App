import React from 'react';
import logo from './logo.svg';
import './App.css';
import {LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip} from 'recharts';
import moment from 'moment'


class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    const data = [{name: 'Page A', uv: 400}, {name: 'Page B', uv: 300}, {name: 'Page C', uv: 100}, {name: 'Page D', uv: 400}];
    return (
      <div>
        <h1>It is {this.state.date.toLocaleTimeString()}.</h1>
        <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </div>
    );
  }
}

export default Clock;
